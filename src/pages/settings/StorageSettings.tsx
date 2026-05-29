import React, { useEffect, useState } from "react";
import { Database, Cloud, Trash2, RefreshCw, Loader2 } from "lucide-react";
import { useSettings } from "../../contexts/SettingsContext";

export default function StorageSettings() {
  const {
    settings,
    updateSetting,
    performSync,
    clearCache,
    getStorageUsage,
    pendingMutations,
  } = useSettings();
  const [isSyncing, setIsSyncing] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [storageAmount, setStorageAmount] = useState<string>("กำลังคำนวณ...");

  useEffect(() => {
    getStorageUsage().then(setStorageAmount);
  }, [getStorageUsage]);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await performSync();
    } finally {
      setIsSyncing(false);
    }
  };

  const handleClearCache = async () => {
    if (
      !window.confirm(
        "คุณต้องการล้างแคชและข้อมูลชั่วคราวใช่หรือไม่? ข้อมูลล็อกอินและการตั้งค่าจะไม่หายไป",
      )
    )
      return;

    setIsClearing(true);
    try {
      await clearCache();
      setStorageAmount(await getStorageUsage());
    } finally {
      setIsClearing(false);
    }
  };

  const formatTime = (ts: number | null) => {
    if (!ts) return "ไม่เคยซิงค์";
    return new Date(ts).toLocaleString("th-TH");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div
        style={{
          background: "#18181b",
          borderRadius: 16,
          border: "1px solid #27272a",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid #27272a",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "rgba(16, 185, 129, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Cloud size={16} color="#10b981" />
          </div>
          <h2
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: "#fafafa",
              margin: 0,
            }}
          >
            ซิงค์ข้อมูลคลาวด์
          </h2>
        </div>
        <div style={{ padding: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <div>
              <div style={{ color: "#fafafa", fontSize: 14, fontWeight: 500 }}>
                ซิงค์ข้อมูลอัตโนมัติ
              </div>
              <div style={{ color: "#a1a1aa", fontSize: 13, marginTop: 4 }}>
                {settings.cloudSync
                  ? `ซิงค์ล่าสุดเมื่อ: ${formatTime(settings.lastSyncedAt)}`
                  : "การซิงค์ข้อมูลปิดใช้งานอยู่"}
              </div>
              {pendingMutations > 0 && (
                <div
                  style={{
                    color: "#f59e0b",
                    fontSize: 13,
                    marginTop: 8,
                    display: "flex",
                    gap: 6,
                    alignItems: "center",
                  }}
                >
                  <Cloud size={14} /> มีข้อมูลรอซิงค์: {pendingMutations} รายการ
                </div>
              )}
            </div>
            <div
              onClick={() => updateSetting("cloudSync", !settings.cloudSync)}
              style={{
                width: 44,
                height: 24,
                background: settings.cloudSync ? "#3b82f6" : "#3f3f46",
                borderRadius: 12,
                position: "relative",
                cursor: "pointer",
                transition: "background 0.3s",
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  background: "#fff",
                  borderRadius: "50%",
                  position: "absolute",
                  top: 2,
                  left: settings.cloudSync ? 22 : 2,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  transition: "left 0.3s",
                }}
              />
            </div>
          </div>

          <button
            onClick={handleSync}
            disabled={isSyncing || !settings.cloudSync}
            style={{
              background: "transparent",
              color: settings.cloudSync ? "#fafafa" : "#52525b",
              border: `1px solid ${settings.cloudSync ? "#3f3f46" : "#27272a"}`,
              padding: "10px 16px",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              cursor:
                isSyncing || !settings.cloudSync ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            {isSyncing ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <RefreshCw size={16} />
            )}
            {isSyncing ? "กำลังซิงค์ข้อมูล..." : "ซิงค์ข้อมูลเดี๋ยวนี้"}
          </button>
        </div>
      </div>

      <div
        style={{
          background: "#18181b",
          borderRadius: 16,
          border: "1px solid #27272a",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid #27272a",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "rgba(14, 165, 233, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Database size={16} color="#0ea5e9" />
          </div>
          <h2
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: "#fafafa",
              margin: 0,
            }}
          >
            การจัดการพื้นที่ (Cache)
          </h2>
        </div>
        <div style={{ padding: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <div>
              <div style={{ color: "#fafafa", fontSize: 14, fontWeight: 500 }}>
                พื้นที่ชั่วคราวบนเบราว์เซอร์
              </div>
              <div style={{ color: "#a1a1aa", fontSize: 13, marginTop: 4 }}>
                ใช้งานไปแล้วประมาณ {storageAmount}
              </div>
            </div>
          </div>
          <button
            onClick={handleClearCache}
            disabled={isClearing}
            style={{
              background: "rgba(239, 68, 68, 0.1)",
              color: "#ef4444",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              padding: "10px 16px",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              cursor: isClearing ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            {isClearing ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Trash2 size={16} />
            )}
            {isClearing ? "กำลังล้างแคช..." : "ล้างแคชและข้อมูลขยะ"}
          </button>
        </div>
      </div>
    </div>
  );
}
