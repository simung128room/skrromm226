import { AnimCard, CountUp } from "../components/Shared";
import { BookOpen, AlertTriangle, ArrowUpRight, Trophy, Sparkles, Star } from "lucide-react";
import { useNavigate, useOutletContext } from "react-router-dom";

export default function Overview() {
  const navigate = useNavigate();
  const { livePulse } = useOutletContext<any>();

  const stats = [
    { label:"Loyalty Points", raw:"120", prefix:"", link:"View Rank", target:"/dashboard/leaderboard", lColor:"#fafafa", Icon:Star },
    { label:"My Rank", raw:"#5", prefix:"", link:"Leaderboard", target:"/dashboard/leaderboard", lColor:"#fafafa", Icon:Trophy },
    { label:"Duty Scope",  raw:"Waiting", prefix:"",  link:"Submit Evidence",  target:"/dashboard/duty", lColor:"#f59e0b", dot:true, Icon:Sparkles },
    { label:"Homework",  raw:"2",   prefix:"",  link:"View All", target:"/dashboard/schedule",  lColor:"#fafafa", Icon:BookOpen },
  ];

  return (
    <div style={{ padding: "0 16px 16px" }}>
      <AnimCard delay={0}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <div style={{ width: 12, height: 2, background: "#fafafa", borderRadius: 2 }}/>
          <span style={{ color: "#a1a1aa", fontSize: 11, letterSpacing: "1px", fontWeight: 600, textTransform: "uppercase" }}>Quick Stats</span>
        </div>
      </AnimCard>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {stats.map((s,i)=>(
          <AnimCard key={i} delay={i*0.1}>
            <div className="stat-card" onClick={() => navigate(s.target)} style={{ background: "#18181b", borderRadius: 12, padding: 16, border: "1px solid #27272a", position: "relative", overflow: "hidden", cursor: "pointer", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div style={{ color: "#a1a1aa", fontSize: 13, fontWeight: 500 }}>{s.label}</div>
                <div style={{ width: 28, height: 28, borderRadius: 6, background: "#09090b", border: "1px solid #27272a", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <s.Icon size={14} color={s.lColor} strokeWidth={2}/>
                </div>
              </div>
              <div style={{ fontSize: 24, fontWeight: 600, color: "#fafafa", lineHeight: 1, marginBottom: 16, letterSpacing: "-0.5px" }}>
                {s.raw.includes("/") || s.raw.includes("#") || isNaN(parseInt(s.raw))
                  ? s.raw
                  : <CountUp target={s.raw} prefix={s.prefix}/>}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: "auto" }}>
                {s.dot && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", animation: "liveRing 2s infinite" }} />}
                <span style={{ color: "#52525b", fontSize: 12, display: "flex", alignItems: "center", gap: 4, fontWeight: 500, transition: "color 0.2s" }}>
                  {s.link} <ArrowUpRight size={12}/>
                </span>
              </div>
            </div>
          </AnimCard>
        ))}
      </div>
    </div>
  )
}
