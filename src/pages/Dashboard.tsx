import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard, Plus, Users,
  Globe, Bell, MessageSquare, Sparkles,
  ArrowLeftRight, BookOpen, MapPin, RefreshCw, ArrowUpRight,
  ChevronRight, X, Menu, Shield, Star,
  CalendarDays, Trophy, AlertTriangle, CheckCircle2,
  Camera, CheckSquare, Coffee
} from "lucide-react";
import { Link, useNavigate, Outlet, useLocation } from "react-router-dom";
import { AnimCard, CountUp, getRankColor, RankIcon } from "../components/Shared";
import { CustomPopup } from "../components/Popup";
import { PERIODS, C, SCHEDULE, DAYS, LEADERBOARD } from "../data";

const EASE = "cubic-bezier(0.4,0,0.2,1)";
const SPRING = "cubic-bezier(0.34,1.56,0.64,1)";

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

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [livePulse, setLivePulse] = useState(false);
  
  // derive active menu from location
  const path = location.pathname.split("/").pop() || "overview";
  
  const fallbackStudent = JSON.parse(localStorage.getItem('student') || 'null');
  const tstudent = location.state?.student || fallbackStudent;
  
  let tName = "ผู้เยี่ยมชม";
  let tSeed = "s5";
  let tRank = "Legend";
  
  const EnNames: Record<string, string> = {
    "กรวิชญ์": "Kornvich", "กรวิทย์": "Kornvit", "จิรายุ": "Jirayu", "เฉลิมชัย": "Chalermchai",
    "ฐีระวัฒน์": "Teerawat", "ณฐูนนท์": "Nathunon", "ณัฐภิมินทร์": "Nattapimin", "ธนโชติ": "Thanachot",
    "ปกรณ์": "Pakorn", "กนกพล": "Kanokpon", "อภิลักษณ์": "Aphilak", "ณตรชัย": "Natarachai",
    "ปรินทร์": "Parin", "ศุภณัฐ": "Suphanut", "กรนนก": "Kornnok", "ก้านยกร": "Kanyakorn",
    "ขวัญข้าว": "Kwankhao", "ทิตะยา": "Titaya", "นัชนิกาณจน์": "Natchanikan", "ณัฐณิชา": "Nattanicha",
    "ณัฐอิตา": "Nattaita", "นภัสร": "Napasorn", "น้ำฝน": "Namfon", "บุษรินทร์": "Bussarin",
    "ศุภิสรา": "Supisara", "สดาวรรณ": "Sadawan", "อมิตา": "Amita", "ธิรากรณ์": "Thirakorn",
    "วรัญญา": "Waranya", "ธัญญาภรณ์": "Thanyaporn", "มนัสภรณ์": "Manatsaporn", "สิริญากรณ์": "Sirinyakorn",
    "ลภัสรดา": "Lapasrada", "ชฎาภา": "Chadapa", "เดชินี": "Dechini", "วรนทรา": "Waranatara",
    "สุณิสา": "Sunisa", "ฐิติบัณท์": "Thitiban", "พลอยใส": "Ploysai", "ผู้เยี่ยมชม": "Visitor"
  };
  
  if (tstudent) {
    const nameWithoutTitle = tstudent.name.replace(/เด็กชาย|เด็กหญิง/, "").trim();
    tName = nameWithoutTitle.split(" ")[0];
    const lbEntry = LEADERBOARD.find(x => x.name.includes(tName));
    if (lbEntry) {
       tRank = lbEntry.rank;
       tSeed = lbEntry.id;
    } else {
       tRank = "Bronze";
       tSeed = tstudent.id;
    }
  }
  
  tName = EnNames[tName] || tName;

  useEffect(() => {
    const id = setInterval(() => {
      setLivePulse(true);
      setTimeout(() => setLivePulse(false), 700);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const menuOverview = [
    { id:"",            label:"แดชบอร์ด",    jp:"ダッシュボード", Icon:LayoutDashboard },
    { id:"schedule",    label:"ตารางเรียน",  jp:"時間割",       Icon:CalendarDays },
  ];
  const menuActivity = [
    { id:"duty",        label:"ตารางเวร",    jp:"当番",         Icon:Sparkles },
    { id:"forms",       label:"แจ้งปัญหา",    jp:"報告",         Icon:AlertTriangle },
  ];

  return (
    <div style={{
      fontFamily:"'Sarabun','Noto Serif JP',serif",
      minHeight:"100vh", color:"#1a2f5e",
      maxWidth:430, margin:"0 auto",
      position:"relative", overflow:"hidden",
      background:"#eef2f9"
    }}>
      <style>{`
        @keyframes liveRing{0%{transform:scale(1);opacity:.8}100%{transform:scale(2.2);opacity:0}}
        @keyframes slideIn{from{opacity:0;transform:translateX(-16px)}to{opacity:1;transform:translateX(0)}}
        @keyframes navFade{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}

        .nav-fade{animation:navFade .4s ${EASE} both}

        .stat-card{
          transition:transform .22s ${SPRING},box-shadow .22s ${EASE};
          cursor:pointer;
        }
        .stat-card:hover{
          transform:translateY(-4px) scale(1.02);
          box-shadow:0 8px 28px rgba(26,47,94,0.14)!important;
        }
        .stat-card:active{transform:scale(0.97)}

        .menu-item{transition:all .18s ${EASE};cursor:pointer}
        .menu-item:hover{background:rgba(59,130,246,0.1)!important}

        .node-row{transition:transform .2s ${SPRING},box-shadow .2s ${EASE}}
        .node-row:hover{transform:translateX(4px);box-shadow:0 4px 18px rgba(26,47,94,0.1)!important}

        .live-dot-ring{animation:liveRing 1.8s ease-out infinite}

        .sidebar-item{transition:background .15s ${EASE},border-left .15s ${EASE}}
        .sidebar-item:hover{background:rgba(59,130,246,0.08)!important}

        .icon-btn{transition:transform .15s ${SPRING},background .15s ${EASE}}
        .icon-btn:hover{transform:scale(1.12);background:rgba(255,255,255,0.1)!important}
        .icon-btn:active{transform:scale(0.9)}

        .back-btn{transition:all .18s ${EASE}}
        .back-btn:hover{background:rgba(59,130,246,0.08)!important;color:#60a5fa!important}
      `}</style>

      {/* BG dot grid */}
      <div style={{position:"fixed",inset:0,backgroundImage:"radial-gradient(circle,rgba(26,47,94,0.035) 1px,transparent 1px)",backgroundSize:"24px 24px",zIndex:0,pointerEvents:"none"}}/>

      {/* Sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            onClick={()=>setSidebarOpen(false)} 
            style={{position:"fixed",inset:0,background:"rgba(4,13,31,0.5)",zIndex:40,backdropFilter:"blur(4px)"}}
          />
        )}
      </AnimatePresence>

      {/* ── SIDEBAR ── */}
      <motion.div 
        initial={{ x: "-100%" }} 
        animate={{ x: sidebarOpen ? 0 : "-100%" }} 
        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
        style={{position:"fixed",top:0,left:0,width:272,height:"100%",background:"#06102b",zIndex:50,display:"flex",flexDirection:"column",boxShadow:sidebarOpen?"8px 0 48px rgba(4,13,31,0.45)":"none"}}
      >
        <div style={{background:"#0c1a40",padding:"18px 16px 14px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:36,height:36,background:"linear-gradient(135deg,#3b82f6,#1d4ed8)",borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 14px rgba(59,130,246,0.35)"}}>
              <BookOpen size={18} color="#fff" strokeWidth={1.4}/>
            </div>
            <div>
              <div style={{color:"#fff",fontWeight:800,fontSize:15,letterSpacing:0.4}}>skroom226<span style={{color:"#60a5fa"}}>.site</span></div>
              <div style={{color:"#334155",fontSize:9,letterSpacing:3,fontFamily:"'Noto Serif JP',serif"}}>M.2/6 PORTAL</div>
            </div>
          </div>
          <button onClick={()=>setSidebarOpen(false)} className="icon-btn" style={{background:"none",border:"none",cursor:"pointer",color:"#475569",padding:4,borderRadius:6}}>
            <X size={17}/>
          </button>
        </div>
        <div style={{height:2,background:"linear-gradient(90deg,#3b82f6 0%,transparent 100%)"}}/>

        <div style={{flex:1,overflowY:"auto",padding:"14px 0"}}>
          <div style={{padding:"0 16px 6px",color:"#2563eb",fontSize:9,letterSpacing:3,fontWeight:700}}>ภาพรวม · 概要</div>
          {menuOverview.map(({id,label,jp,Icon:Ic},idx)=>{
            const active = id === "" ? (location.pathname === "/dashboard" || location.pathname === "/dashboard/") : location.pathname.includes(id);
            return (
              <button key={"m1"+idx} className="sidebar-item"
                onClick={()=>{navigate(`/dashboard/${id}`);setSidebarOpen(false);}}
                style={{display:"flex",alignItems:"center",gap:11,width:"100%",padding:"10px 16px",background:active?"rgba(59,130,246,0.14)":"transparent",border:"none",borderLeft:active?"3px solid #3b82f6":"3px solid transparent",cursor:"pointer",textAlign:"left",animation:sidebarOpen?`slideIn .3s ${idx*0.05}s both ${EASE}`:"none"}}>
                <div style={{width:30,height:30,borderRadius:8,background:active?"rgba(59,130,246,0.2)":"rgba(255,255,255,0.03)",display:"flex",alignItems:"center",justifyContent:"center",transition:"background .2s"}}>
                  <Ic size={15} color={active?"#60a5fa":"#475569"} strokeWidth={1.5}/>
                </div>
                <div style={{flex:1}}>
                  <div style={{color:active?"#fff":"#94a3b8",fontSize:13,fontWeight:active?600:400,fontFamily:"'Sarabun',serif"}}>{label}</div>
                  <div style={{color:"#1e3a5f",fontSize:9,fontFamily:"'Noto Serif JP',serif"}}>{jp}</div>
                </div>
                {active && <ChevronRight size={13} color="#3b82f6"/>}
              </button>
            );
          })}

          <div style={{height:1,background:"rgba(255,255,255,0.04)",margin:"10px 16px"}}/>

          <div style={{padding:"0 16px 6px",color:"#2563eb",fontSize:9,letterSpacing:3,fontWeight:700}}>กิจกรรม · 活動</div>
          {menuActivity.map(({id,label,jp,Icon:Ic},idx)=>{
            const active = location.pathname.includes(id);
            return (
              <button key={"m2"+idx} className="sidebar-item"
                onClick={()=>{navigate(`/dashboard/${id}`);setSidebarOpen(false);}}
                style={{display:"flex",alignItems:"center",gap:11,width:"100%",padding:"10px 16px",background:active?"rgba(59,130,246,0.14)":"transparent",border:"none",borderLeft:active?"3px solid #3b82f6":"3px solid transparent",cursor:"pointer",textAlign:"left",animation:sidebarOpen?`slideIn .3s ${idx*0.05+0.2}s both ${EASE}`:"none"}}>
                <div style={{width:30,height:30,borderRadius:8,background:active?"rgba(59,130,246,0.2)":"rgba(255,255,255,0.03)",display:"flex",alignItems:"center",justifyContent:"center",transition:"background .2s"}}>
                  <Ic size={15} color={active?"#60a5fa":"#475569"} strokeWidth={1.5}/>
                </div>
                <div style={{flex:1}}>
                  <div style={{color:active?"#fff":"#94a3b8",fontSize:13,fontWeight:active?600:400,fontFamily:"'Sarabun',serif"}}>{label}</div>
                  <div style={{color:"#1e3a5f",fontSize:9,fontFamily:"'Noto Serif JP',serif"}}>{jp}</div>
                </div>
                {active && <ChevronRight size={13} color="#3b82f6"/>}
              </button>
            );
          })}
        </div>

        <div style={{padding:14,borderTop:"1px solid rgba(255,255,255,0.04)",display:"flex",flexDirection:"column",gap:8}}>
          <button className="back-btn" onClick={() => {
              CustomPopup.fire({
                title: 'ออกจากระบบ?',
                text: "คุณต้องการออกจากระบบใช่หรือไม่?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#ef4444',
                cancelButtonColor: '#3b82f6',
                confirmButtonText: 'ออกจากระบบ',
                cancelButtonText: 'ยกเลิก'
              }).then((result) => {
                if (result.isConfirmed) {
                  localStorage.removeItem('student');
                  navigate("/");
                }
              })
            }}
            style={{border:"1px solid rgba(255,255,255,0.06)",color:"#64748b",background:"transparent",borderRadius:10,padding:"9px 14px",fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",gap:8,fontFamily:"'Sarabun',serif",transition:`all .2s ${EASE}`}}>
            <ArrowLeftRight size={14}/> ออกระบบ · ログアウト
          </button>
        </div>
      </motion.div>

      {/* ── NAVBAR ── */}
      <div style={{position:"relative",zIndex:1}}>
        <nav className="nav-fade" style={{background:"#0c1a40",padding:"11px 15px",display:"flex",alignItems:"center",justifyContent:"space-between",boxShadow:"0 2px 24px rgba(4,13,31,0.22)",position:"sticky",top:0,zIndex:30}}>
          <button className="icon-btn" onClick={()=>setSidebarOpen(true)} style={{background:"none",border:"none",cursor:"pointer",color:"#93c5fd",padding:5,borderRadius:8}}>
            <Menu size={21}/>
          </button>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:28,height:28,background:"linear-gradient(135deg,#3b82f6,#1d4ed8)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 8px rgba(59,130,246,0.3)"}}>
              <BookOpen size={14} color="#fff" strokeWidth={1.5}/>
            </div>
            <span style={{color:"#fff",fontWeight:800,fontSize:15,letterSpacing:0.4}}>
              skroom226<span style={{color:"#60a5fa"}}>.site</span>
            </span>
          </div>
        </nav>

        {/* Hero */}
        <div style={{background:"#0a0d12",padding:"26px 20px 40px",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle at top, rgba(59,130,246,0.15) 0%, rgba(10,13,18,0) 70%)",zIndex:0,pointerEvents:"none"}}/>
          <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(to right, rgba(128,128,128,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(128,128,128,0.04) 1px, transparent 1px)",backgroundSize:"32px 32px",zIndex:0,pointerEvents:"none"}}/>
          {[{s:200,r:-40,t:-40,o:0.08},{s:130,r:10,t:20,o:0.05},{s:70,r:30,t:55,o:0.06}].map((c,i)=>(
            <div key={i} style={{position:"absolute",right:c.r,top:c.t,width:c.s,height:c.s,borderRadius:"50%",border:`1px solid rgba(96,165,250,${c.o})`,pointerEvents:"none"}}/>
          ))}
          <div style={{position:"relative", zIndex:1}}>
          <AnimCard delay={0.12}>
            <h1 style={{color:"#fff",fontSize:24,fontWeight:800,margin:"0 0 4px",lineHeight:1.35, display: "flex", alignItems: "center", gap: 10}}>
              <span>{
                new Date().getHours() < 12 ? "สวัสดีตอนเช้า," : 
                new Date().getHours() < 16 ? "สวัสดีตอนบ่าย," : 
                new Date().getHours() < 19 ? "สวัสดีตอนเย็น," : "สวัสดียามค่ำ,"
              }</span>{" "}
              <div style={{display: "flex", alignItems: "center", gap: 8}}>
                 <div style={{position: "relative"}}>
                    <span>{tName}</span>
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: "100%" }} 
                      transition={{ duration: 0.6, delay: 0.5, ease: "circOut" }}
                      style={{ position: "absolute", bottom: -2, left: 0, height: 3, background: "#3b82f6", borderRadius: 4 }} 
                    />
                 </div>
                 <RankIcon rank={tRank} size={26} />
              </div>
            </h1>
            <div style={{color:"#334155",fontSize:10,letterSpacing:2.5,marginBottom:12,fontFamily:"'Noto Serif JP',serif"}}>
              こんにちは — ようこそ
            </div>
            <p style={{color:"#93c5fd",fontSize:12,margin:"0 0 18px",lineHeight:1.75,maxWidth:290}}>
              สรุปแต้มความดี ตารางเรียน และกิจกรรมประจำวัน
            </p>
          </AnimCard>
          <AnimCard delay={0.2}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{display:"flex",alignItems:"center",gap:5,color:"#475569",fontSize:11}}>
                <MapPin size={11} color="#475569"/> โรงเรียน · 22/5/2569
              </div>
              <div style={{position:"relative",display:"flex",alignItems:"center",gap:5,background:"rgba(34,197,94,0.1)",border:"1px solid rgba(34,197,94,0.25)",borderRadius:20,padding:"3px 10px"}}>
                <div style={{position:"relative",width:8,height:8}}>
                  <div style={{position:"absolute",inset:0,borderRadius:"50%",background:"#22c55e"}}/>
                  {livePulse && <div className="live-dot-ring" style={{position:"absolute",inset:-3,borderRadius:"50%",border:"2px solid #22c55e"}}/>}
                </div>
                <RefreshCw size={10} color="#22c55e"/>
                <span style={{color:"#22c55e",fontSize:11,fontWeight:600}}>LIVE</span>
              </div>
            </div>
          </AnimCard>
          </div>
        </div>

        <svg viewBox="0 0 430 30" style={{display:"block",background:"#eef2f9",marginTop:-1}}>
          <path d="M0,0 C100,30 330,2 430,20 L430,0 Z" fill="#0a0d12"/>
        </svg>

        {/* Dynamic Nested Content */}
        <Outlet context={{ livePulse }} />

        <div style={{textAlign:"center",padding:"0 0 32px",color:"#94a3b8",fontSize:10,letterSpacing:2.5,fontFamily:"'Noto Serif JP',serif", marginTop: 24}}>
          skroom226.site · M.2/6 PORTAL
        </div>
      </div>
    </div>
  );
}
