import { useEffect, useState } from "react";
import { BookOpen, CalendarDays, Sparkles, Trophy, Shield, LayoutDashboard, ChevronRight, LogIn, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { RankIcon } from "../components/Shared";
import { STUDENTS } from "../data";
import { CustomPopup } from "../components/Popup";

const EASE = "cubic-bezier(0.4,0,0.2,1)";
const SPRING = "cubic-bezier(0.34,1.56,0.64,1)";

export default function Welcome() {
  const navigate = useNavigate();
  const [transitioning, setTransitioning] = useState(false);
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!username || !password) {
      CustomPopup.fire({ icon: 'warning', title: 'แจ้งเตือน', text: 'กรุณากรอกข้อมูลให้ครบถ้วน', confirmButtonColor: '#3b82f6' });
      return;
    }
    
    // Check if match any student id
    const tstudent = STUDENTS.find(s => s.id === username);
    if (tstudent && username === password) {
      localStorage.setItem('student', JSON.stringify(tstudent));
      CustomPopup.fire({ icon: 'success', title: 'เข้าสู่ระบบสำเร็จ', timer: 1500, showConfirmButton: false });
      setTransitioning(true);
      setTimeout(() => { navigate("/dashboard", { state: { student: tstudent } }); }, 1500);
    } else {
      CustomPopup.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง', confirmButtonColor: '#ef4444' });
    }
  };

  const handleVisit = () => {
    localStorage.removeItem('student');
    setTransitioning(true);
    setTimeout(() => { navigate("/dashboard"); }, 320);
  };

  return (
    <div style={{ 
      background:"#040d1f",
      fontFamily:"'Sarabun','Noto Serif JP',serif",
      minHeight:"100vh", color:"#1a2f5e",
      maxWidth:430, margin:"0 auto",
      position:"relative", overflow:"hidden",
      transform: transitioning ? "scale(0.97)" : "scale(1)",
      opacity: transitioning ? 0 : 1,
      transition:`opacity 0.32s ${EASE}, transform 0.32s ${EASE}`,
    }}>
      <style>{`
        @keyframes floatUp{from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)}}
        @keyframes glow{0%,100%{box-shadow:0 0 24px rgba(59,130,246,0.3)}50%{box-shadow:0 0 48px rgba(59,130,246,0.7)}}
        @keyframes orbit{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes orbitR{from{transform:rotate(0deg)}to{transform:rotate(-360deg)}}
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}

        @keyframes logoFloat{
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-4px) rotate(4deg); }
          75% { transform: translateY(-4px) rotate(-4deg); }
        }

        .f1{animation:floatUp .7s .05s both ${SPRING}}
        .f2{animation:floatUp .7s .18s both ${SPRING}}
        .f3{animation:floatUp .7s .31s both ${SPRING}}
        .f4{animation:floatUp .7s .44s both ${SPRING}}

        .logo-glow{animation:glow 2.5s ease-in-out infinite}
        .orbit1{animation:orbit 12s linear infinite}
        .orbit2{animation:orbitR 18s linear infinite}
        .orbit3{animation:orbit 25s linear infinite}

        .shimmer-btn{
          background:linear-gradient(90deg,#1d4ed8 0%,#3b82f6 40%,#60a5fa 50%,#3b82f6 60%,#1d4ed8 100%);
          background-size:200% auto;
          animation:shimmer 2.5s linear infinite;
        }

        .cta-btn{transition:transform .18s ${SPRING},box-shadow .18s ${EASE}}
        .cta-btn:hover{transform:translateY(-3px) scale(1.02);box-shadow:0 12px 36px rgba(59,130,246,0.55)!important}
        .cta-btn:active{transform:scale(0.97)}
        
        .sec-btn{transition:all .2s ${EASE}; cursor:pointer;}
        .sec-btn:hover{background:rgba(59,130,246,0.1)!important; border-color:rgba(59,130,246,0.3)!important}
        
        .input-field {
          width: 100%;
          padding: 14px 16px;
          border-radius: 12px;
          border: 1px solid rgba(59,130,246,0.3);
          background: rgba(4, 13, 31, 0.4);
          color: white;
          font-family: inherit;
          font-size: 15px;
          transition: all 0.2s ${EASE};
          margin-bottom: 16px;
          outline: none;
        }
        .input-field:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.2);
          background: rgba(4, 13, 31, 0.7);
        }
        .input-field::placeholder { color: #64748b; }
      `}</style>

      <div style={{position:"fixed",inset:0,background:"#0a0d12",zIndex:0}}/>
      <div style={{position:"fixed",inset:0,backgroundImage:"radial-gradient(circle at top, rgba(59,130,246,0.15) 0%, rgba(10,13,18,0) 70%)",zIndex:0,pointerEvents:"none"}}/>
      <div style={{position:"fixed",inset:0,backgroundImage:"linear-gradient(to right, rgba(128,128,128,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(128,128,128,0.04) 1px, transparent 1px)",backgroundSize:"32px 32px",zIndex:0,pointerEvents:"none"}}/>

      <div style={{position:"relative",zIndex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",padding:"40px 28px",textAlign:"center"}}>
        <div className="f1" style={{marginBottom:20}}>
          <img 
            src="https://img1.pic.in.th/images/IMG_679416662d67a142bdf0.png" 
            alt="Logo" 
            style={{
              width:90, height:90, objectFit:"contain", margin:"0 auto", display:"block", 
              filter:"drop-shadow(0 10px 15px rgba(0,0,0,0.5))",
              animation:"logoFloat 3s ease-in-out infinite"
            }}
          />
        </div>

        <div className="f2" style={{marginBottom:4}}>
          <span style={{color:"#fff",fontWeight:800,fontSize:32,letterSpacing:0.5}}>
            skroom226<span style={{color:"#60a5fa"}}>.site</span>
          </span>
        </div>
        <div className="f3" style={{color:"#94a3b8",fontSize:13,letterSpacing:1,marginBottom:32}}>
          รายชื่อนักเรียน ปีการศึกษา 2569 <br/> ภาคเรียนที่ 1 ชั้น ม.2 ห้องที่ 6
        </div>

        <div className="f4" style={{width:"100%",maxWidth:320, background: "rgba(15,23,42,0.6)", padding: "24px 20px", borderRadius: 24, border: "1px solid rgba(59,130,246,0.15)", backdropFilter: "blur(12px)"}}>
          <form onSubmit={handleLogin} style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
            <label style={{color: "#cbd5e1", fontSize: 14, fontWeight: 600, marginBottom: 8}}>Username</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="กรอกชื่อผู้ใช้ของคุณ"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
            
            <label style={{color: "#cbd5e1", fontSize: 14, fontWeight: 600, marginBottom: 8}}>Password</label>
            <input 
              type="password" 
              className="input-field" 
              placeholder="กรอกรหัสผ่านของคุณ"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />

            <button type="submit" className="shimmer-btn cta-btn"
              style={{width:"100%",padding:"15px 0",border:"none",borderRadius:14,color:"#fff",fontSize:16,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:10,boxShadow:"0 8px 28px rgba(59,130,246,0.4)",fontFamily:"'Sarabun',serif", marginBottom: 12}}>
              <LogIn size={18} strokeWidth={2}/>
              เข้าสู่ระบบ
            </button>
            
            <button type="button" onClick={handleVisit} className="sec-btn"
              style={{width:"100%",padding:"15px 0",border:"1px solid rgba(59,130,246,0.2)",background:"transparent",borderRadius:14,color:"#93c5fd",fontSize:16,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",gap:10,fontFamily:"'Sarabun',serif"}}>
              <Globe size={18} strokeWidth={2}/>
              เยี่ยมชมเว็บไซต์
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
