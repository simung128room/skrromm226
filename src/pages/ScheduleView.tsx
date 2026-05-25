import { useState } from "react";
import { AnimCard } from "../components/Shared";
import { Users, MapPin, Coffee } from "lucide-react";
import { SCHEDULE, DAYS, PERIODS } from "../data";

function getTodayIdx() {
  const d = new Date().getDay();
  return (d === 0 || d === 6) ? 0 : d - 1;
}

function getCurrentPeriod() {
  const now = new Date();
  const t = now.getHours()*60 + now.getMinutes();
  const r = [[8*60+30,9*60+25],[9*60+25,10*60+20],[10*60+20,11*60+15],[11*60+15,12*60+10],[12*60+10,13*60+5],[13*60+5,14*60],[14*60,14*60+55],[14*60+55,15*60+50],[15*60+50,16*60+30]];
  for (let i=0;i<r.length;i++) if (t>=r[i][0]&&t<r[i][1]) return i;
  return -1;
}

export default function ScheduleView() {
  const [selectedDay, setSelectedDay] = useState(getTodayIdx());

  return (
      <div style={{padding:"0 14px 28px"}}>
         <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 15, marginBottom: 10, msOverflowStyle: "none", scrollbarWidth: "none" }}>
            {DAYS.map((day, idx) => (
               <button
                 key={day}
                 onClick={() => setSelectedDay(idx)}
                 style={{
                   padding: "8px 18px",
                   borderRadius: 20,
                   border: idx === selectedDay ? "1px solid rgba(59,130,246,0.4)" : "1px solid rgba(219,234,254,0.9)",
                   background: idx === selectedDay ? "rgba(59, 130, 246, 0.1)" : "#fff",
                   color: idx === selectedDay ? "#2563eb" : "#64748b",
                   cursor: "pointer",
                   whiteSpace: "nowrap",
                   fontFamily: "'Sarabun', sans-serif",
                   fontSize: 13,
                   fontWeight: idx === selectedDay ? 600 : 400,
                   transition: "all 0.2s"
                 }}
               >
                 {day}
              </button>
            ))}
         </div>

         {SCHEDULE[DAYS[selectedDay]].map((item: any, i: number) => {
             const p = PERIODS[i];
             if (p.isLunch) return (
                 <AnimCard key={i} delay={i*0.05} style={{marginBottom:8}}>
                     <div style={{display:"flex",gap:12}}>
                         <div style={{width:45,textAlign:"right",color:"#94a3b8",fontSize:10,display:"flex",flexDirection:"column",justifyContent:"center"}}>
                             <div style={{fontWeight:600}}>คาบ {p.p}</div><div>{p.time}</div>
                         </div>
                         <div className="node-row" style={{flex:1,background:"rgba(255,255,255,0.6)",borderRadius:13,padding:"10px 14px",border:"1px solid #e2e8f0",display:"flex",alignItems:"center",gap:8}}>
                             <Coffee size={14} color="#94a3b8" />
                             <span style={{color:"#64748b",fontSize:12,fontWeight:500}}>พักรับประทานอาหารกลางวัน</span>
                         </div>
                     </div>
                 </AnimCard>
             );
             if (!item) return null;
             
             const todayIdx = getTodayIdx();
             const currentP = getCurrentPeriod();
             const isActive = (todayIdx === selectedDay && i === currentP);
             
             return (
                 <AnimCard key={i} delay={i*0.05} style={{marginBottom:8}}>
                     <div style={{display:"flex",gap:12}}>
                         <div style={{width:45,textAlign:"right",color:isActive?"#2563eb":"#64748b",fontSize:10,display:"flex",flexDirection:"column",justifyContent:"center"}}>
                             <div style={{fontWeight:isActive?700:600}}>คาบ {p.p}</div><div>{p.time}</div>
                         </div>
                         <div className="node-row" style={{flex:1,background:isActive?`linear-gradient(135deg, ${item.color}15, #ffffff)`:"#fff",borderRadius:13,padding:"12px 14px",borderLeft:`4px solid ${item.color}`,borderTop:"1px solid rgba(219,234,254,0.9)",borderRight:"1px solid rgba(219,234,254,0.9)",borderBottom:"1px solid rgba(219,234,254,0.9)",boxShadow:isActive?"0 4px 14px rgba(59,130,246,0.1)":"0 1px 8px rgba(26,47,94,0.05)",position:"relative",overflow:"hidden"}}>
                             {isActive && <div style={{position:"absolute",top:12,right:12}}><span style={{display:"block",width:6,height:6,borderRadius:"50%",background:item.color,boxShadow:`0 0 6px ${item.color}`}}/></div>}
                             <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",paddingRight:isActive?16:0}}>
                                 <span style={{color:"#1a2f5e",fontSize:14,fontWeight:700}}>{item.name}</span>
                                 <span style={{color:item.color,fontSize:10,background:`${item.color}15`,padding:"2px 6px",borderRadius:6,fontWeight:600}}>{item.code}</span>
                             </div>
                             <div style={{display:"flex",flexWrap:"wrap",gap:12,color:"#64748b",fontSize:10,marginTop:4,fontWeight:500}}>
                                 <span style={{display:"flex",alignItems:"center",gap:4}}><Users size={11} color="#94a3b8" /> {item.teacher}</span>
                                 {item.room && <span style={{display:"flex",alignItems:"center",gap:4}}><MapPin size={11} color="#94a3b8" /> ห้อง {item.room}</span>}
                             </div>
                         </div>
                     </div>
                 </AnimCard>
             )
         })}
      </div>
  )
}
