import React, { useState } from "react";
import { User, Lock, Mail, Phone, Loader2 } from "lucide-react";
import { useSettings } from "../../contexts/SettingsContext";
import { toast } from "sonner";

export default function AccountSettings() {
  const [isResetting, setIsResetting] = useState(false);
  const student = JSON.parse(localStorage.getItem("student") || "null");

  const handlePasswordReset = async () => {
    setIsResetting(true);
    try {
      // Simulate API call for sending reset email
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("ส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลของคุณแล้ว");
    } catch {
      toast.error("ไม่สามารถส่งลิงก์รีเซ็ตรหัสผ่านได้ กรุณาลองใหม่");
    } finally {
      setIsResetting(false);
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
              background: "rgba(99, 102, 241, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <User size={16} color="#6366f1" />
          </div>
          <h2
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: "#fafafa",
              margin: 0,
            }}
          >
            ข้อมูลส่วนตัว
          </h2>
        </div>
        <div style={{ padding: 20 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <div
                style={{
                  color: "#52525b",
                  fontSize: 12,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  marginBottom: 4,
                }}
              >
                รหัสนักเรียน
              </div>
              <div style={{ color: "#fafafa", fontSize: 14 }}>
                {student?.id || "-"}
              </div>
            </div>
            <div>
              <div
                style={{
                  color: "#52525b",
                  fontSize: 12,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  marginBottom: 4,
                }}
              >
                ชื่อ-นามสกุล
              </div>
              <div style={{ color: "#fafafa", fontSize: 14 }}>
                {student?.name || "-"}
              </div>
            </div>
            <div>
              <div
                style={{
                  color: "#52525b",
                  fontSize: 12,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  marginBottom: 4,
                }}
              >
                เลขที่
              </div>
              <div style={{ color: "#fafafa", fontSize: 14 }}>
                {student?.no || "-"}
              </div>
            </div>
          </div>
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
              background: "rgba(239, 68, 68, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Lock size={16} color="#ef4444" />
          </div>
          <h2
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: "#fafafa",
              margin: 0,
            }}
          >
            ความปลอดภัย
          </h2>
        </div>
        <div style={{ padding: 20 }}>
          <p style={{ color: "#a1a1aa", fontSize: 13, margin: "0 0 16px" }}>
            ส่งลิงก์รีเซ็ตรหัสผ่านไปยังระบบอีเมลของโรงเรียนเพื่อความปลอดภัย
          </p>
          <button
            onClick={handlePasswordReset}
            disabled={isResetting}
            style={{
              background: "#fafafa",
              color: "#09090b",
              border: "none",
              padding: "10px 16px",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              cursor: isResetting ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              opacity: isResetting ? 0.7 : 1,
            }}
          >
            {isResetting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Mail size={16} />
            )}
            {isResetting ? "กำลังดำเนินการ..." : "รีเซ็ตรหัสผ่านผ่านอีเมล"}
          </button>
        </div>
      </div>
    </div>
  );
}
