import React, { useState, FormEvent } from "react";
import { LogIn, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { STUDENTS } from "../data";
import { CustomPopup } from "../components/Popup";

const EASE = "cubic-bezier(0.4, 0, 0.2, 1)";

export default function Welcome() {
  const navigate = useNavigate();
  const [transitioning, setTransitioning] = useState(false);
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const playLoginSound = () => {
    const soundData = localStorage.getItem("admin_login_sound");
    if (soundData) {
      new Audio(soundData).play().catch(e => console.error("Could not play sound:", e));
    }
  };

  const handleLogin = (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!username || !password) {
      CustomPopup.fire({ icon: 'warning', title: 'แจ้งเตือน', text: 'กรุณากรอกข้อมูลให้ครบถ้วน', confirmButtonColor: '#171717' });
      return;
    }
    
    if (username === "admin" && password === "123456") {
      playLoginSound();
      localStorage.setItem("admin_auth", "true");
      setTransitioning(true);
      setTimeout(() => { navigate("/admin/dashboard"); }, 300);
      return;
    }

    const tstudent = STUDENTS.find(s => s.id === username);
    if (tstudent && username === password) {
      playLoginSound();
      localStorage.setItem('student', JSON.stringify(tstudent));
      setTransitioning(true);
      setTimeout(() => { navigate("/dashboard", { state: { student: tstudent } }); }, 300);
    } else {
      CustomPopup.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง', confirmButtonColor: '#ef4444' });
    }
  };

  const handleVisit = () => {
    localStorage.removeItem('student');
    setTransitioning(true);
    setTimeout(() => { navigate("/dashboard"); }, 300);
  };

  return (
    <div style={{ 
      background: "#09090b",
      fontFamily: "'Sarabun', sans-serif",
      minHeight: "100vh", color: "#fafafa",
      position: "relative", overflowX: "hidden",
      display: "flex", alignItems: "center", justifyContent: "center",
      transform: transitioning ? "scale(0.98)" : "scale(1)",
      opacity: transitioning ? 0 : 1,
      transition: `opacity 0.3s ${EASE}, transform 0.3s ${EASE}`,
    }}>
      <style>{`
        .input-solid {
          width: 100%;
          padding: 12px 16px;
          border-radius: 8px;
          border: 1px solid #27272a;
          background: #09090b;
          color: #fafafa;
          font-family: inherit;
          font-size: 14px;
          transition: border-color 0.2s;
          outline: none;
        }
        .input-solid:focus {
          border-color: #fafafa;
        }
        .input-solid::placeholder { color: #52525b; }
        .btn-primary {
          background: #fafafa;
          color: #09090b;
          transition: opacity 0.2s;
        }
        .btn-primary:hover { opacity: 0.9; }
        .btn-secondary {
          background: transparent;
          color: #a1a1aa;
          border: 1px solid #27272a;
          transition: background 0.2s, color 0.2s;
        }
        .btn-secondary:hover {
          background: #18181b;
          color: #fafafa;
        }
      `}</style>
      
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at center, rgba(39,39,42,0.4) 0%, transparent 60%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 360, padding: 24 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ 
            width: 64, height: 64, background: "#fafafa", borderRadius: 16, 
            display: "flex", alignItems: "center", justifyContent: "center", 
            margin: "0 auto 16px", boxShadow: "0 4px 12px rgba(0,0,0,0.3)" 
          }}>
            <img 
              src="https://img1.pic.in.th/images/IMG_679416662d67a142bdf0.png" 
              alt="Logo" 
              style={{ width: 56, height: 56, objectFit: "contain", display: "block" }}
            />
          </div>
          <h1 style={{ fontWeight: 600, fontSize: 24, letterSpacing: "-0.5px", margin: "0 0 8px 0" }}>
            skroom226.site
          </h1>
          <p style={{ color: "#a1a1aa", fontSize: 13, margin: 0 }}>
            Authentication Portal
          </p>
        </div>

        <div style={{ background: "#18181b", padding: 24, borderRadius: 12, border: "1px solid #27272a" }}>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: "block", color: "#a1a1aa", fontSize: 13, marginBottom: 6 }}>Username</label>
              <input 
                type="text" 
                className="input-solid" 
                placeholder="Enter username"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>
            
            <div>
              <label style={{ display: "block", color: "#a1a1aa", fontSize: 13, marginBottom: 6 }}>Password</label>
              <input 
                type="password" 
                className="input-solid" 
                placeholder="Enter password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-primary"
              style={{ width: "100%", padding: "12px 0", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 8 }}>
              <LogIn size={16} />
              Sign In
            </button>
            
            <button type="button" onClick={handleVisit} className="btn-secondary"
              style={{ width: "100%", padding: "12px 0", borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <Globe size={16} />
              Guest Access
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

