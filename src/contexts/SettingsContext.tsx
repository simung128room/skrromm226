import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import localforage from "localforage";
import { toast } from "sonner";
import { z } from "zod";
import { checkNetworkStatus, sleep } from "../utils/network";
import {
  TelemetryContext,
  captureTelemetry,
  startTrace,
} from "../utils/telemetry";

// 1. Zod Schema
export const SettingsSchema = z.object({
  version: z.number().default(2),
  revision: z.number().default(1),
  updatedAt: z.number().default(() => Date.now()),
  actorId: z.string().default(TelemetryContext.sessionId),
  theme: z.enum(["dark", "light"]).default("light"),
  language: z.enum(["th", "en"]).default("th"),
  notifications: z.boolean().default(true),
  cloudSync: z.boolean().default(false),
  lastSyncedAt: z.number().nullable().default(null),
});

export type AppSettings = z.infer<typeof SettingsSchema>;
export type SettingsPatch = Partial<
  Omit<AppSettings, "version" | "revision" | "updatedAt" | "actorId">
>;

export interface MutationRecord {
  mutationId: string;
  traceId?: string;
  timestamp: number;
  patch: SettingsPatch;
  type?: "FULL_SYNC" | "PATCH";
}

const DEFAULT_SETTINGS = SettingsSchema.parse({});

interface SettingsContextType {
  settings: AppSettings;
  updateSetting: <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K],
  ) => Promise<void>;
  isLoading: boolean;
  isOfflineMode: boolean;
  pendingMutations: number;
  performSync: () => Promise<void>;
  clearCache: () => Promise<void>;
  getStorageUsage: () => Promise<string>;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

// Durable Sync Queue Store
const syncQueueStore = localforage.createInstance({
  name: "AppSettings",
  storeName: "SyncQueue",
});

// Circuit Breaker for API calls
class CircuitBreaker {
  state: "CLOSED" | "OPEN" | "HALF_OPEN" = "CLOSED";
  failureCount = 0;
  failureThreshold = 3;
  resetTimeout = 10000;
  nextAttemptTimer: ReturnType<typeof setTimeout> | null = null;
  lastFailureTime: number = 0;

  recordFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    if (this.failureCount >= this.failureThreshold && this.state === "CLOSED") {
      this.state = "OPEN";
      captureTelemetry("CIRCUIT_BREAKER_OPENED", {
        failures: this.failureCount,
      });
      this.scheduleHalfOpen();
    }
  }

  recordSuccess() {
    this.failureCount = 0;
    if (this.state !== "CLOSED") {
      this.state = "CLOSED";
      captureTelemetry("CIRCUIT_BREAKER_CLOSED", {});
    }
  }

  scheduleHalfOpen() {
    if (this.nextAttemptTimer) clearTimeout(this.nextAttemptTimer);
    this.nextAttemptTimer = setTimeout(() => {
      this.state = "HALF_OPEN";
    }, this.resetTimeout);
  }

  canFire() {
    return this.state === "CLOSED" || this.state === "HALF_OPEN";
  }
}

const circuitBreaker = new CircuitBreaker();

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [pendingMutations, setPendingMutations] = useState(0);
  const broadcastChannel = useRef<BroadcastChannel | null>(null);
  const isSyncingRef = useRef(false);

  const updateQueueCount = async () => {
    try {
      const keys = await syncQueueStore.keys();
      setPendingMutations(keys.length);
    } catch {}
  };

  const processDurableQueue = useCallback(async () => {
    if (isSyncingRef.current || !circuitBreaker.canFire()) return;

    try {
      isSyncingRef.current = true;
      const keys = await syncQueueStore.keys();
      await updateQueueCount();
      if (keys.length === 0) return;

      const pending: MutationRecord[] = [];
      for (const key of keys) {
        const item = await syncQueueStore.getItem<MutationRecord>(key);
        if (item) pending.push(item);
      }

      pending.sort((a, b) => a.timestamp - b.timestamp);

      for (const mutation of pending) {
        if (!circuitBreaker.canFire()) break;
        const success = await performSyncWithRetries(mutation, 1, false);
        if (success) {
          await syncQueueStore.removeItem(mutation.mutationId);
          circuitBreaker.recordSuccess();
        } else {
          circuitBreaker.recordFailure();
          break; // Halt queue processing on failure
        }
      }
      await updateQueueCount();
    } catch (err) {
      console.error("[Queue] Error processing durable queue", err);
    } finally {
      isSyncingRef.current = false;
    }
  }, []);

  const loadSettingsAndMigrate = useCallback(async () => {
    try {
      performance.mark("settings-load-start");
      const stored = await localforage.getItem<any>("app_settings_secure");
      if (stored) {
        try {
          const validated = SettingsSchema.parse(stored);
          setSettings(validated);
        } catch (validationErr) {
          captureTelemetry("SETTINGS_CORRUPTED", {
            error: String(validationErr),
          });
          toast.error("ไฟล์ตั้งค่ามีปัญหา ระบบพยายามกู้คืนสู่ค่าเริ่มต้น");
          setSettings(DEFAULT_SETTINGS);
        }
      } else {
        await localforage.setItem("app_settings_secure", DEFAULT_SETTINGS);
      }
      performance.mark("settings-load-end");
      performance.measure(
        "SettingsHydration",
        "settings-load-start",
        "settings-load-end",
      );
    } catch (err) {
      captureTelemetry("STORAGE_FAILURE", { error: String(err) });
      setIsOfflineMode(true);
    } finally {
      setIsLoading(false);
      processDurableQueue();
    }
  }, [processDurableQueue]);

  useEffect(() => {
    broadcastChannel.current = new BroadcastChannel("app_settings_channel");

    broadcastChannel.current.onmessage = async (event) => {
      // Hierarchy: UI synced from RAM, RAM synced from DB. Broadcast notifies DB changes.
      if (event.data && event.data.type === "SETTINGS_INVALIDATION") {
        try {
          const stored = await localforage.getItem<any>("app_settings_secure");
          if (stored) {
            const validated = SettingsSchema.safeParse(stored);
            if (validated.success) {
              setSettings((prev) => {
                if (validated.data.revision > prev.revision)
                  return validated.data;
                return prev;
              });
            }
          }
        } catch (e) {
          console.error("Failed to read DB on invalidation signal");
        }
      }
    };

    loadSettingsAndMigrate();
    // Start background sync interval
    const interval = setInterval(processDurableQueue, 15000);
    return () => {
      clearInterval(interval);
      broadcastChannel.current?.close();
    };
  }, [loadSettingsAndMigrate, processDurableQueue]);

  const saveLocallyAndBroadcast = async (newSettings: AppSettings) => {
    setSettings(newSettings);
    await localforage.setItem("app_settings_secure", newSettings);
    broadcastChannel.current?.postMessage({
      type: "SETTINGS_INVALIDATION",
      actorId: TelemetryContext.sessionId,
    });
  };

  const updateSetting = async <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K],
  ) => {
    try {
      const patch = { [key]: value };
      const draft = {
        ...settings,
        ...patch,
        revision: settings.revision + 1,
        updatedAt: Date.now(),
        actorId: TelemetryContext.sessionId,
      };

      const validated = SettingsSchema.parse(draft);
      await saveLocallyAndBroadcast(validated);

      if (
        validated.cloudSync &&
        key !== "lastSyncedAt" &&
        key !== "cloudSync"
      ) {
        enqueueMutation(patch);
      }
    } catch (err) {
      captureTelemetry("UPDATE_SETTING_FAILED", { key, error: String(err) });
      toast.error("ตรวจสอบข้อมูลไม่ผ่าน กู้คืนค่าเดิม");
    }
  };

  const performSyncWithRetries = async (
    mutation: MutationRecord,
    maxRetries = 2,
    showToast = true,
  ): Promise<boolean> => {
    let delay = 1000;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      if (!circuitBreaker.canFire()) return false;

      const { internetReachable, backendReachable } =
        await checkNetworkStatus();
      if (!internetReachable || !backendReachable) {
        await sleep(delay);
        delay *= 2;
        continue;
      }

      try {
        // Simulating idempotent server call with mutationId
        await new Promise((resolve, reject) => {
          setTimeout(
            () =>
              Math.random() < 0.1 ? reject(new Error("503")) : resolve(true),
            800,
          );
        });

        // Server ACK
        const ts = Date.now();
        setSettings((prev) => {
          const updated = { ...prev, lastSyncedAt: ts };
          localforage.setItem("app_settings_secure", updated).catch(() => {});
          return updated;
        });

        if (showToast) toast.success("อัปเดตข้อมูลบนเซิร์ฟเวอร์แล้ว");
        return true;
      } catch (err) {
        if (attempt === maxRetries) {
          captureTelemetry("SYNC_FAILED", { mutationId: mutation.mutationId });
          return false;
        }
        await sleep(delay);
        delay *= 2;
      }
    }
    return false;
  };

  const enqueueMutation = async (patch: SettingsPatch) => {
    const trace = startTrace("enqueueMutation");
    const mutation: MutationRecord = {
      mutationId: crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).substring(2),
      timestamp: Date.now(),
      traceId: trace.traceId,
      patch,
    };
    try {
      const keys = await syncQueueStore.keys();
      // Backpressure strategy: Limit queue to 50 pending mutations
      if (keys.length > 50) {
        captureTelemetry("QUEUE_OVERFLOW_DROP", {
          droppedId: mutation.mutationId,
        });
        console.warn(
          "Queue overflow, dropping older telemetry or low-priority patch",
        );
        trace.end("ERROR", { reason: "QUEUE_OVERFLOW" });
        return; // Drop early or evict oldest (simulated drop policy)
      }

      await syncQueueStore.setItem(mutation.mutationId, mutation);
      await updateQueueCount();

      trace.end("SUCCESS");
      // Fire-and-forget process
      processDurableQueue();
    } catch (err) {
      trace.end("ERROR", { error: String(err) });
      console.warn("[Mutation Queue] Enqueue failure", err);
    }
  };

  const performSync = async () => {
    const { internetReachable, backendReachable } = await checkNetworkStatus();
    if (!internetReachable) {
      toast.error("ออฟไลน์! การดำเนินการจะถูกจัดคิวไว้");
      throw new Error("Offline");
    }
    if (!backendReachable) {
      toast.error("เซิร์ฟเวอร์ไม่ตอบสนอง กำลังทำงานผ่าน Local state");
      throw new Error("Backend Offline");
    }

    try {
      const keys = await syncQueueStore.keys();
      if (keys.length > 0) {
        await processDurableQueue();
        toast.success("ซิงค์และยืนยันข้อมูลกับคลาวด์สำเร็จ");
      } else {
        // Push full state as a mutation if nothing in queue
        const fullMutation: MutationRecord = {
          mutationId: crypto.randomUUID
            ? crypto.randomUUID()
            : Math.random().toString(36).substring(2),
          timestamp: Date.now(),
          patch: settings,
          type: "FULL_SYNC",
        };
        const success = await performSyncWithRetries(fullMutation, 1, false);
        if (success) {
          toast.success("ซิงค์ข้อมูลกับคลาวด์สำเร็จ");
          circuitBreaker.recordSuccess();
        } else {
          circuitBreaker.recordFailure();
          throw new Error("Sync Failed");
        }
      }
    } catch (err) {
      toast.error("การซิงค์มีปัญหา ข้อมูลถูกพักไว้ในระบบ (Queue)");
      throw err;
    }
  };

  const clearCache = async () => {
    try {
      if ("caches" in window) {
        const cacheKeys = await caches.keys();
        await Promise.all(cacheKeys.map((key) => caches.delete(key)));
      }
      toast.success("ล้างหน่วยความจำชั่วคราวทั้งหมดสำเร็จ");
    } catch (err) {
      captureTelemetry("CLEAR_CACHE_FAILED", { error: String(err) });
      toast.error("ระบบไม่สามารถล้างแคชได้สมบูรณ์ระมัดระวังการใช้งาน");
      throw err;
    }
  };

  const getStorageUsage = async (): Promise<string> => {
    try {
      if ("storage" in navigator && "estimate" in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        const usageMb = ((estimate.usage || 0) / (1024 * 1024)).toFixed(2);
        return `${usageMb} MB`;
      }
      return "ไม่ทราบจํานวน";
    } catch {
      return "? MB";
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSetting,
        isLoading,
        isOfflineMode,
        pendingMutations,
        performSync,
        clearCache,
        getStorageUsage,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context)
    throw new Error("useSettings must be used within SettingsProvider");
  return context;
};
