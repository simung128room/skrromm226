import { useState } from "react";
import { AnimCard } from "../components/Shared";
import { Camera, CheckSquare } from "lucide-react";
import { CustomPopup } from "../components/Popup";

export default function DutyView() {
  const [uploaded, setUploaded] = useState(false);

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
            ตารางเวร
          </span>
        </div>
      </AnimCard>

      <AnimCard delay={0.08} style={{ marginBottom: 16 }}>
        <div
          className="stat-card"
          style={{
            background: "var(--card)",
            borderRadius: 14,
            padding: "24px",
            textAlign: "center",
            border: "1px solid var(--border)",
            cursor: "pointer",
          }}
          onClick={() => {
            if (uploaded) return;
            CustomPopup.fire({
              title: "อัปโหลดรูปภาพ",
              text: "ยืนยันการส่งรูปภาพหลักฐานการทำเวร?",
              icon: "question",
              showCancelButton: true,
              confirmButtonColor: "#10b981",
              cancelButtonColor: "var(--border)",
              confirmButtonText: "ยืนยัน",
              cancelButtonText: "ยกเลิก",
            }).then((result) => {
              if (result.isConfirmed) {
                setUploaded(true);
                CustomPopup.fire({
                  title: "ส่งหลักฐานสำเร็จ!",
                  text: "รอหัวหน้าห้องตรวจสอบเพื่อรับแต้ม",
                  icon: "success",
                  timer: 2000,
                  showConfirmButton: false,
                });
              }
            });
          }}
        >
          {!uploaded ? (
            <>
              <Camera
                size={32}
                color="#3b82f6"
                style={{ margin: "0 auto 12px" }}
              />
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--foreground)" }}>
                คลิกเพื่ออัปโหลดรูปภาพ
              </div>
              <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 4 }}>
                รองรับไฟล์ JPG, PNG
              </div>
            </>
          ) : (
            <>
              <CheckSquare
                size={32}
                color="#10b981"
                style={{ margin: "0 auto 12px" }}
              />
              <div style={{ fontSize: 14, fontWeight: 700, color: "#10b981" }}>
                ส่งหลักฐานสำเร็จแล้ว!
              </div>
              <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 4 }}>
                รอแอดมินตรวจสอบเพื่อรับแต้ม
              </div>
            </>
          )}
        </div>
      </AnimCard>

      <AnimCard delay={0.16}>
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
            ระดับความขยัน
          </span>
        </div>
      </AnimCard>

      {[
        {
          v: "V1 (มือใหม่)",
          desc: "ทำเวรครบ 1-5 ครั้ง",
          limit: "ไม่จำกัดคน",
          bg: "var(--card)",
          color: "var(--muted-foreground)",
          border: "var(--border)",
        },
        {
          v: "V2 (แรกเริ่ม)",
          desc: "ทำเวรครบ 6-15 ครั้ง",
          limit: "ไม่จำกัดคน",
          bg: "rgba(37,99,235,0.1)",
          color: "#60a5fa",
          border: "#2563eb",
        },
        {
          v: "V3 (เด็กขยัน)",
          desc: "ทำเวรครบ 15+ ครั้ง",
          limit: "จำกัด 30 คน",
          bg: "rgba(147,51,234,0.1)",
          color: "#c084fc",
          border: "#9333ea",
        },
      ].map((lvl, i) => (
        <AnimCard key={i} delay={0.24 + i * 0.08} style={{ marginBottom: 8 }}>
          <div
            className="node-row"
            style={{
              background: "var(--card)",
              borderRadius: 13,
              padding: "13px 15px",
              border: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
              <div
                style={{
                  padding: "4px 8px",
                  background: lvl.bg,
                  color: lvl.color,
                  border: `1px solid ${lvl.border}`,
                  borderRadius: 6,
                  fontSize: 10,
                  fontWeight: 700,
                }}
              >
                {lvl.v}
              </div>
              <div>
                <div
                  style={{ fontSize: 12, fontWeight: 600, color: "var(--foreground)" }}
                >
                  {lvl.desc}
                </div>
              </div>
            </div>
            <div
              style={{
                fontSize: 11,
                color: "var(--muted-foreground)",
                fontFamily: "'Prompt',sans-serif",
                display: "flex",
                alignItems: "center",
              }}
            >
              {lvl.limit}
            </div>
          </div>
        </AnimCard>
      ))}
    </div>
  );
}
