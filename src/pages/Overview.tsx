import { useState, useEffect } from "react";
import { AnimCard, CountUp } from "../components/Shared";
import {
  BookOpen,
  AlertTriangle,
  ArrowRight,
  Trophy,
  Sparkles,
  Star,
  CalendarDays,
  Clock,
  MapPin,
  Bell,
  UploadCloud,
  Bot,
  Tent,
  Gamepad2,
  Share2,
  Library,
} from "lucide-react";
import { CustomPopup } from "../components/Popup";
import { useNavigate, useOutletContext } from "react-router-dom";
import { SCHEDULE, DAYS, C } from "../data";

export default function Overview() {
  const navigate = useNavigate();
  const { livePulse } = useOutletContext<any>();

  const [currentDay, setCurrentDay] = useState(0);

  useEffect(() => {
    const d = new Date().getDay();
    setCurrentDay(d === 0 || d === 6 ? 0 : d - 1);
  }, []);

  const stats = [
    {
      label: "เงินห้องทั้งหมดตอนนี้",
      raw: "2885",
      prefix: "฿",
      suffix: "",
      link: "ดูรายการการใช้จ่ายเงินห้อง",
      target: "/dashboard",
      lColor: "#22c55e",
      Icon: Sparkles,
    },
    {
      label: "งานค้างที่เหลือของคุณ",
      raw: "2",
      prefix: "",
      suffix: " รายการ",
      link: "ดูรายการเพิ่มงานค้าง/แก้ไข",
      target: "/dashboard/schedule",
      lColor: "#f59e0b",
      Icon: BookOpen,
    },
    {
      label: "อันดับของฉัน",
      raw: "#5",
      prefix: "",
      suffix: "",
      link: "ดูอันดับทั้งหมดในห้องเรียน",
      target: "/dashboard/leaderboard",
      lColor: "var(--foreground)",
      Icon: Trophy,
    },
  ];

  const todaySchedule = SCHEDULE[DAYS[currentDay]] || [];
  const nextClasses = todaySchedule.filter((c: any) => c !== null).slice(0, 3); // mock next classes

  const announcements = [
    {
      id: 1,
      title: "แจ้งเตือนการส่งหลักฐานเวร",
      date: "Today",
      tag: "Important",
      color: "#ef4444",
    },
    {
      id: 2,
      title: "สรุปคะแนนประจำสัปดาห์นี้ออกแล้ว",
      date: "Yesterday",
      tag: "System",
      color: "#3b82f6",
    },
  ];

  return (
    <div style={{ padding: "0 16px 24px" }}>
      <AnimCard delay={0}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
            marginBottom: 20,
          }}
        >
          <button
            onClick={() => navigate("/dashboard/assignments")}
            style={{
              background: "var(--primary)",
              color: "var(--primary-foreground)",
              border: "none",
              borderRadius: 14,
              padding: "16px 12px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.2)",
                padding: 8,
                borderRadius: "50%",
              }}
            >
              <UploadCloud size={20} />
            </div>
            <span style={{ fontWeight: 600, fontSize: 14 }}>ส่งงาน</span>
          </button>

          <button
            onClick={() => navigate("/dashboard/schedule")}
            style={{
              background: "var(--card)",
              color: "var(--foreground)",
              border: "1px solid var(--border)",
              borderRadius: 14,
              padding: "16px 12px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
              cursor: "pointer",
            }}
          >
            <div
              style={{
                background: "var(--muted)",
                padding: 8,
                borderRadius: "50%",
              }}
            >
              <CalendarDays size={20} className="text-muted-foreground" />
            </div>
            <span style={{ fontWeight: 600, fontSize: 14 }}>ตารางเรียน</span>
          </button>
        </div>
      </AnimCard>

      <AnimCard delay={0.05}>
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 12,
            }}
          >
            <div
              style={{
                width: 12,
                height: 2,
                background: "var(--foreground)",
                borderRadius: 2,
              }}
            />
            <span
              style={{
                color: "var(--muted-foreground)",
                fontSize: 11,
                letterSpacing: "1px",
                fontWeight: 600,
                textTransform: "uppercase",
              }}
            >
              บริการต่างๆ (เร็วๆนี้)
            </span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 12,
            }}
          >
            {[
              { id: "ai", label: "AI", Icon: Bot },
              { id: "camps", label: "ค่าย", Icon: Tent },
              { id: "games", label: "กิจกรรม", Icon: Gamepad2 },
              { id: "shared", label: "เฉลยงาน", Icon: Share2 },
              { id: "courses", label: "เรียน", Icon: Library },
            ].map((app, i) => (
              <button
                key={i}
                onClick={() =>
                  CustomPopup.fire({
                    icon: "info",
                    title: "อยู่ระหว่างการพัฒนา",
                    text: `ระบบ ${app.label} จะเปิดให้บริการเร็วๆนี้`,
                  })
                }
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  padding: "12px 4px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                  cursor: "pointer",
                }}
                className="hover:bg-muted/50 transition-colors"
              >
                <div
                  style={{
                    background: "var(--background)",
                    padding: 8,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <app.Icon size={20} className="text-primary" />
                </div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    color: "var(--foreground)",
                    textAlign: "center",
                  }}
                >
                  {app.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </AnimCard>

      <AnimCard delay={0.1}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              width: 12,
              height: 2,
              background: "var(--foreground)",
              borderRadius: 2,
            }}
          />
          <span
            style={{
              color: "var(--muted-foreground)",
              fontSize: 11,
              letterSpacing: "1px",
              fontWeight: 600,
              textTransform: "uppercase",
            }}
          >
            ภาพรวม
          </span>
        </div>
      </AnimCard>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          marginBottom: 24,
        }}
      >
        {stats.map((s, i) => (
          <AnimCard key={i} delay={i * 0.05}>
            <div
              className="stat-card"
              onClick={() => navigate(s.target)}
              style={{
                background: "var(--card)",
                borderRadius: 12,
                padding: "12px 14px",
                border: "1px solid var(--border)",
                position: "relative",
                overflow: "hidden",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    color: "var(--muted-foreground)",
                    fontSize: 13,
                    fontWeight: 500,
                  }}
                >
                  {s.label}
                </div>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    background: "var(--background)",
                    border: "1px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <s.Icon size={14} color={s.lColor} strokeWidth={2} />
                </div>
              </div>
              <div
                style={{
                  fontSize:
                    isNaN(parseInt(s.raw)) &&
                    s.raw.length > 5 &&
                    s.raw.indexOf("/") === -1
                      ? 20
                      : 24,
                  fontWeight: 600,
                  color: "var(--foreground)",
                  lineHeight: 1,
                  marginBottom: 16,
                  letterSpacing: "-0.5px",
                }}
              >
                {s.raw.includes("/") ||
                s.raw.includes("#") ||
                isNaN(parseInt(s.raw)) ? (
                  s.raw
                ) : (
                  <CountUp
                    target={s.raw}
                    prefix={s.prefix}
                    suffix={s.suffix || ""}
                  />
                )}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginTop: "auto",
                }}
              >
                <span
                  style={{
                    color: "var(--muted-foreground)",
                    fontSize: 13,
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    fontWeight: 500,
                    transition: "color 0.2s",
                  }}
                >
                  {s.link} <ArrowRight size={14} />
                </span>
              </div>
            </div>
          </AnimCard>
        ))}
      </div>

      {/* Today's Classes */}
      <AnimCard delay={0.2}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 12,
                height: 2,
                background: "var(--foreground)",
                borderRadius: 2,
              }}
            />
            <span
              style={{
                color: "var(--muted-foreground)",
                fontSize: 11,
                letterSpacing: "1px",
                fontWeight: 600,
                textTransform: "uppercase",
              }}
            >
              ตารางเรียนวันนี้
            </span>
          </div>
          <button
            onClick={() => navigate("/dashboard/schedule")}
            style={{
              background: "none",
              border: "none",
              color: "#3b82f6",
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            Full Schedule <ArrowRight size={12} />
          </button>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            marginBottom: 24,
          }}
        >
          {nextClasses.length > 0 ? (
            nextClasses.map((cls: any, i: number) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  background: "var(--card)",
                  padding: 12,
                  borderRadius: 12,
                  border: "1px solid var(--border)",
                }}
              >
                <div
                  style={{
                    width: 4,
                    height: 36,
                    background: cls.color || "#555555",
                    borderRadius: 4,
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--foreground)",
                      marginBottom: 2,
                    }}
                  >
                    {cls.name}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      fontSize: 11,
                      color: "var(--muted-foreground)",
                    }}
                  >
                    <span
                      style={{ display: "flex", alignItems: "center", gap: 4 }}
                    >
                      <Clock size={12} /> Pd {i + 1}
                    </span>
                    {cls.room && (
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <MapPin size={12} /> Room {cls.room}
                      </span>
                    )}
                  </div>
                </div>
                <div
                  style={{
                    background: "var(--background)",
                    border: "1px solid var(--border)",
                    padding: "6px 10px",
                    borderRadius: 8,
                    fontSize: 11,
                    color: "var(--foreground)",
                    fontWeight: 500,
                  }}
                >
                  {cls.code}
                </div>
              </div>
            ))
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "24px 0",
                color: "var(--muted-foreground)",
                fontSize: 13,
                background: "var(--card)",
                borderRadius: 12,
                border: "1px solid var(--border)",
              }}
            >
              No classes scheduled for today.
            </div>
          )}
        </div>
      </AnimCard>

      {/* Announcements */}
      <AnimCard delay={0.3}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              width: 12,
              height: 2,
              background: "var(--foreground)",
              borderRadius: 2,
            }}
          />
          <span
            style={{
              color: "var(--muted-foreground)",
              fontSize: 11,
              letterSpacing: "1px",
              fontWeight: 600,
              textTransform: "uppercase",
            }}
          >
            ประกาศ
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {announcements.map((ann) => (
            <div
              key={ann.id}
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: 16,
                display: "flex",
                gap: 12,
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: "var(--background)",
                  border: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Bell size={16} color={ann.color} />
              </div>
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 4,
                  }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      color: ann.color,
                      background: `${ann.color}20`,
                      padding: "2px 6px",
                      borderRadius: 4,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {ann.tag}
                  </span>
                  <span
                    style={{ fontSize: 11, color: "var(--muted-foreground)" }}
                  >
                    {ann.date}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: "var(--foreground)",
                    lineHeight: 1.4,
                  }}
                >
                  {ann.title}
                </div>
              </div>
            </div>
          ))}
        </div>
      </AnimCard>
    </div>
  );
}
