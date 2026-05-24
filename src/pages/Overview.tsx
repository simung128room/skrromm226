import { AnimCard, CountUp } from "../components/Shared";
import { BookOpen, AlertTriangle, ArrowUpRight, Trophy, Sparkles, Star } from "lucide-react";
import { useNavigate, useOutletContext } from "react-router-dom";

export default function Overview() {
  const navigate = useNavigate();
  const { livePulse } = useOutletContext<any>();

  const stats = [
    { label:"แต้มความดี", jp:"ポイント", raw:"120", prefix:"", link:"ดูแรงค์", target:"/dashboard/leaderboard", vColor:"#1a2f5e", lColor:"#2563eb", Icon:Star },
    { label:"อันดับของฉัน", jp:"ランキング", raw:"#5", prefix:"", link:"กระดานผู้นำ", target:"/dashboard/leaderboard", vColor:"#1a2f5e", lColor:"#2563eb", Icon:Trophy },
    { label:"สถานะเวร",  jp:"当番", raw:"รอส่ง", prefix:"",  link:"ส่งหลักฐาน",  target:"/dashboard/duty", vColor:"#d97706", lColor:"#d97706", dot:true, Icon:Sparkles },
    { label:"การบ้าน",  jp:"宿題",   raw:"2",   prefix:"",  link:"ดูทั้งหมด", target:"/dashboard/schedule",  vColor:"#1a2f5e", lColor:"#2563eb", Icon:BookOpen },
  ];

  return (
    <div style={{padding:"6px 14px 14px"}}>
      <AnimCard delay={0}>
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:12}}>
          <div style={{width:16,height:2,background:"#3b82f6",borderRadius:2}}/>
          <span style={{color:"#64748b",fontSize:10,letterSpacing:2}}>ภาพรวม · 概要</span>
        </div>
      </AnimCard>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        {stats.map((s,i)=>(
          <AnimCard key={i} delay={i*0.07} style={{borderRadius:14}}>
            <div className="stat-card" onClick={()=>navigate(s.target)} style={{background:"#fff",borderRadius:14,padding:"14px 13px",boxShadow:"0 2px 14px rgba(26,47,94,0.07)",border:"1px solid rgba(219,234,254,0.9)",position:"relative",overflow:"hidden",cursor:"pointer"}}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${s.lColor},${s.lColor}88)`,borderRadius:"14px 14px 0 0"}}/>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:5}}>
                <div>
                  <div style={{color:"#94a3b8",fontSize:9,letterSpacing:1,fontFamily:"'Noto Serif JP',serif"}}>{s.jp}</div>
                  <div style={{color:"#64748b",fontSize:10}}>{s.label}</div>
                </div>
                <div style={{width:28,height:28,borderRadius:8,background:`${s.lColor}15`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <s.Icon size={14} color={s.lColor} strokeWidth={1.5}/>
                </div>
              </div>
              <div style={{fontSize:26,fontWeight:800,color:s.vColor,lineHeight:1,marginBottom:8}}>
                {s.raw.includes("/") || s.raw.includes("#") || isNaN(parseInt(s.raw))
                  ? s.raw
                  : <CountUp target={s.raw} prefix={s.prefix}/>}
              </div>
              <div style={{display:"flex",alignItems:"center",gap:4}}>
                {s.dot && <div style={{position:"relative",width:8,height:8}}>
                  <div style={{position:"absolute",inset:0,borderRadius:"50%",background:"#22c55e"}}/>
                  {livePulse && <div className="live-dot-ring" style={{position:"absolute",inset:-3,borderRadius:"50%",border:"2px solid #22c55e"}}/>}
                </div>}
                <span style={{color:s.lColor,fontSize:11,cursor:"pointer",display:"flex",alignItems:"center",gap:2,fontWeight:500}}>
                  {s.link} <ArrowUpRight size={11}/>
                </span>
              </div>
            </div>
          </AnimCard>
        ))}
      </div>
    </div>
  )
}
