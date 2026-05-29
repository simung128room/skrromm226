import { useState } from "react";
import { AnimCard } from "../components/Shared";
import { Users, MapPin, Coffee } from "lucide-react";
import { SCHEDULE, DAYS, PERIODS } from "../data";

function getTodayIdx() {
  const d = new Date().getDay();
  return d === 0 || d === 6 ? 0 : d - 1;
}

function getCurrentPeriod() {
  const now = new Date();
  const t = now.getHours() * 60 + now.getMinutes();
  const r = [
    [8 * 60 + 30, 9 * 60 + 25],
    [9 * 60 + 25, 10 * 60 + 20],
    [10 * 60 + 20, 11 * 60 + 15],
    [11 * 60 + 15, 12 * 60 + 10],
    [12 * 60 + 10, 13 * 60 + 5],
    [13 * 60 + 5, 14 * 60],
    [14 * 60, 14 * 60 + 55],
    [14 * 60 + 55, 15 * 60 + 50],
    [15 * 60 + 50, 16 * 60 + 30],
  ];
  for (let i = 0; i < r.length; i++) if (t >= r[i][0] && t < r[i][1]) return i;
  return -1;
}

export default function ScheduleView() {
  const [selectedDay, setSelectedDay] = useState(getTodayIdx());

  return (
    <div style={{ padding: "0 14px 48px" }}>
      <div
        style={{
          display: "flex",
          gap: 8,
          overflowX: "auto",
          paddingBottom: 15,
          marginBottom: 10,
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        {DAYS.map((day, idx) => (
          <button
            key={day}
            onClick={() => setSelectedDay(idx)}
            style={{
              padding: "8px 18px",
              borderRadius: 20,
              border:
                idx === selectedDay ? "1px solid #2563eb" : "1px solid var(--border)",
              background: idx === selectedDay ? "#2563eb" : "var(--card)",
              color: idx === selectedDay ? "var(--foreground)" : "var(--muted-foreground)",
              cursor: "pointer",
              whiteSpace: "nowrap",
              fontFamily: "'Prompt', sans-serif",
              fontSize: 13,
              fontWeight: idx === selectedDay ? 600 : 400,
              transition: "all 0.2s",
            }}
          >
            {day}
          </button>
        ))}
      </div>

      {SCHEDULE[DAYS[selectedDay]].map((item: any, i: number) => {
        const p = PERIODS[i];
        if (p.isLunch)
          return (
            <AnimCard key={i} delay={i * 0.05} style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", gap: 12 }}>
                <div
                  style={{
                    width: 60,
                    textAlign: "right",
                    color: "var(--muted-foreground)",
                    fontSize: 11,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <div style={{ fontWeight: 600 }}>คาบ {p.p}</div>
                  <div>{p.time}</div>
                </div>
                <div
                  className="node-row"
                  style={{
                    flex: 1,
                    background: "var(--card)",
                    borderRadius: 13,
                    padding: "14px",
                    border: "1px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <Coffee size={14} color="var(--muted-foreground)" />
                  <span
                    style={{ color: "var(--muted-foreground)", fontSize: 13, fontWeight: 500 }}
                  >
                    พักรับประทานอาหารกลางวัน
                  </span>
                </div>
              </div>
            </AnimCard>
          );
        if (!item) return null;

        const todayIdx = getTodayIdx();
        const currentP = getCurrentPeriod();
        const isActive = todayIdx === selectedDay && i === currentP;

        return (
          <AnimCard key={i} delay={i * 0.05} style={{ marginBottom: 8 }}>
            <div style={{ display: "flex", gap: 12 }}>
              <div
                style={{
                  width: 60,
                  textAlign: "right",
                  color: isActive ? "#60a5fa" : "var(--muted-foreground)",
                  fontSize: 11,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <div style={{ fontWeight: isActive ? 700 : 500 }}>
                  คาบ {p.p}
                </div>
                <div>{p.time}</div>
              </div>
              <div
                className="node-row"
                style={{
                  flex: 1,
                  background: "var(--card)",
                  borderRadius: 13,
                  padding: "14px",
                  borderLeft: `4px solid ${item.color}`,
                  borderTop: "1px solid var(--border)",
                  borderRight: "1px solid var(--border)",
                  borderBottom: "1px solid var(--border)",
                  boxShadow: isActive
                    ? "0 4px 14px rgba(59,130,246,0.1)"
                    : "none",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {isActive && (
                  <div style={{ position: "absolute", top: 14, right: 14 }}>
                    <span
                      style={{
                        display: "block",
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: item.color,
                        boxShadow: `0 0 6px ${item.color}`,
                      }}
                    />
                  </div>
                )}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    paddingRight: isActive ? 16 : 0,
                  }}
                >
                  <span
                    style={{ color: "var(--foreground)", fontSize: 14, fontWeight: 600 }}
                  >
                    {item.name}
                  </span>
                  <span
                    style={{
                      color: item.color,
                      fontSize: 10,
                      background: `${item.color}20`,
                      padding: "2px 6px",
                      borderRadius: 6,
                      fontWeight: 600,
                    }}
                  >
                    {item.code}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 12,
                    color: "var(--muted-foreground)",
                    fontSize: 11,
                    marginTop: 6,
                    fontWeight: 500,
                  }}
                >
                  <span
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <Users size={12} color="var(--muted-foreground)" /> {item.teacher}
                  </span>
                  {item.room && (
                    <span
                      style={{ display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <MapPin size={12} color="var(--muted-foreground)" /> ห้อง {item.room}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </AnimCard>
        );
      })}
    </div>
  );
}
