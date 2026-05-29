import React, { useState } from "react";
import { Bell, ShieldAlert } from "lucide-react";
import { useSettings } from "../../contexts/SettingsContext";
import { toast } from "sonner";

export default function NotificationSettings() {
  const { settings, updateSetting } = useSettings();
  const [permissionState, setPermissionState] =
    useState<NotificationPermission>(
      "Notification" in window ? Notification.permission : "default",
    );

  const requestPermission = async () => {
    if (!("Notification" in window)) {
      toast.error("เบราว์เซอร์ไม่รองรับระบบการแจ้งเตือน");
      return;
    }

    try {
      const permission = await window.Notification.requestPermission();
      setPermissionState(permission);

      if (permission === "granted") {
        updateSetting("notifications", true);
        toast.success("อนุญาตการแจ้งเตือนสำเร็จ");
      } else {
        updateSetting("notifications", false);
        toast.error("ถูกระงับการแจ้งเตือน กรุณาปลดล็อคในเบราว์เซอร์");
      }
    } catch (err) {
      toast.error("เกิดข้อผิดพลาดในการขอสิทธิ์");
    }
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
              background: "rgba(59, 130, 246, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Bell size={16} color="#3b82f6" />
          </div>
          <h2
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: "#fafafa",
              margin: 0,
            }}
          >
            การแจ้งเตือนระบบ
          </h2>
        </div>
        <div style={{ padding: 20 }}>
          {permissionState === "denied" && (
            <div
              style={{
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.2)",
                borderRadius: 8,
                padding: 16,
                marginBottom: 20,
                display: "flex",
                gap: 12,
              }}
            >
              <ShieldAlert
                color="#ef4444"
                size={20}
                style={{ flexShrink: 0 }}
              />
              <div>
                <div
                  style={{ color: "#ef4444", fontWeight: 600, fontSize: 14 }}
                >
                  ถูกระงับสิทธิ์ในเบราว์เซอร์
                </div>
                <div style={{ color: "#fca5a5", fontSize: 13, marginTop: 4 }}>
                  กรุณากดที่แม่กุญแจบน URL bar
                  เพื่ออนุญาตการแจ้งเตือนให้กับเว็บไซต์นี้
                </div>
              </div>
            </div>
          )}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ color: "#fafafa", fontSize: 14, fontWeight: 500 }}>
                รับการแจ้งเตือนพุช (Push Notifications)
              </div>
              <div style={{ color: "#a1a1aa", fontSize: 13, marginTop: 4 }}>
                แจ้งเตือนเมื่อมีประกาศใหม่ งานเข้า หรือตารางสอนเปลี่ยน
              </div>
            </div>
            <div
              onClick={() => {
                if (permissionState === "granted") {
                  updateSetting("notifications", !settings.notifications);
                } else {
                  requestPermission();
                }
              }}
              style={{
                width: 44,
                height: 24,
                background:
                  settings.notifications && permissionState === "granted"
                    ? "#3b82f6"
                    : "#3f3f46",
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
                  left:
                    settings.notifications && permissionState === "granted"
                      ? 22
                      : 2,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  transition: "left 0.3s",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
