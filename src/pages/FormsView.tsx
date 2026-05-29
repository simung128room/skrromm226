import { useState } from "react";
import { AnimCard } from "../components/Shared";
import { AlertTriangle, MessageSquare } from "lucide-react";
import { CustomPopup } from "../components/Popup";

export default function FormsView() {
  const [formType, setFormType] = useState("report");

  return (
    <div style={{ padding: "0 14px 28px" }}>
      <AnimCard delay={0}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 12,
          }}
        >
          <div
            style={{
              width: 16,
              height: 2,
              background: "#3b82f6",
              borderRadius: 2,
            }}
          />
          <span
            style={{
              color: "var(--muted-foreground)",
              fontSize: 13,
              letterSpacing: 1.5,
              fontWeight: 600,
            }}
          >
            ศูนย์รับเรื่อง
          </span>
        </div>
      </AnimCard>

      <AnimCard delay={0.05}>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <button
            onClick={() => setFormType("report")}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: 10,
              border:
                formType === "report"
                  ? "1px solid #2563eb"
                  : "1px solid var(--border)",
              background: formType === "report" ? "#2563eb" : "var(--card)",
              color: formType === "report" ? "var(--foreground)" : "var(--muted-foreground)",
              fontWeight: 600,
              fontSize: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              transition: "all 0.2s",
            }}
          >
            <AlertTriangle size={14} /> แจ้งปัญหา
          </button>
          <button
            onClick={() => setFormType("suggest")}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: 10,
              border:
                formType === "suggest"
                  ? "1px solid #2563eb"
                  : "1px solid var(--border)",
              background: formType === "suggest" ? "#2563eb" : "var(--card)",
              color: formType === "suggest" ? "var(--foreground)" : "var(--muted-foreground)",
              fontWeight: 600,
              fontSize: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              transition: "all 0.2s",
            }}
          >
            <MessageSquare size={14} /> เสนอแนะ
          </button>
        </div>
      </AnimCard>

      <AnimCard delay={0.1}>
        <div
          className="stat-card"
          style={{
            background: "var(--card)",
            borderRadius: 14,
            padding: "18px 15px",
            border: "1px solid var(--border)",
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "var(--foreground)",
              marginBottom: 12,
            }}
          >
            {formType === "report"
              ? "ฟอร์มแจ้งพฤติกรรม"
              : "ฟอร์มเสนอแนะฟีเจอร์"}
          </div>

          <input
            className="dark-placeholder"
            type="text"
            placeholder={
              formType === "report"
                ? "ชื่อผู้ถูกร้องเรียน..."
                : "หัวข้อข้อเสนอแนะ..."
            }
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: 10,
              border: "1px solid var(--border)",
              background: "var(--border)",
              marginBottom: 12,
              fontSize: 13,
              fontFamily: "'Prompt', sans-serif",
              outline: "none",
              color: "var(--foreground)",
            }}
          />

          <textarea
            className="dark-placeholder"
            rows={4}
            placeholder="รายละเอียดเพิ่มเติม..."
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: 10,
              border: "1px solid var(--border)",
              background: "var(--border)",
              marginBottom: 16,
              fontSize: 13,
              fontFamily: "'Prompt', sans-serif",
              outline: "none",
              color: "var(--foreground)",
              resize: "none",
            }}
          />

          <button
            onClick={() => {
              CustomPopup.fire({
                title:
                  formType === "report"
                    ? "ส่งรายงานสำเร็จ"
                    : "ขอบคุณสำหรับข้อเสนอแนะ!",
                text:
                  formType === "report"
                    ? "ข้อมูลถูกส่งไปยังแอดมินแล้ว ขอบคุณที่ช่วยดูแลห้องเรียน"
                    : "เราจะนำไอเดียของคุณไปพิจารณาพัฒนาเว็บต่อไป",
                icon: "success",
                confirmButtonColor: "#2563eb",
              });
            }}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: 10,
              background: "#2563eb",
              color: "#fff",
              border: "none",
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
              fontFamily: "'Prompt', sans-serif",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
            }}
          >
            ส่งข้อความ
          </button>
        </div>
      </AnimCard>
    </div>
  );
}
