import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ArrowLeft } from 'lucide-react';
import { CustomPopup } from '../components/Popup';

const EASE = "cubic-bezier(0.4, 0, 0.2, 1)";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "123456") {
      localStorage.setItem("admin_auth", "true");
      navigate("/admin/dashboard");
    } else {
      CustomPopup.fire({
        title: "เกิดข้อผิดพลาด",
        text: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",
        icon: "error"
      });
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#09090b",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Sarabun', sans-serif"
    }}>
      <style>{`
        .input-solid {
          width: 100%;
          padding: 12px 16px 12px 42px;
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
      `}</style>
      
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at center, rgba(39,39,42,0.4) 0%, transparent 60%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none" }} />

      <div 
        style={{
          position: "relative", zIndex: 1,
          background: "#18181b",
          padding: 32,
          borderRadius: 12,
          width: "100%",
          maxWidth: 380,
          border: "1px solid #27272a",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
             width: 48, height: 48, borderRadius: 12, 
             background: "#fafafa", border: "1px solid #e4e4e7",
             color: "#09090b", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px",
             boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
          }}>
            <Lock size={24} />
          </div>
          <h1 style={{ color: "#fafafa", fontSize: 20, fontWeight: 600, margin: "0 0 8px", letterSpacing: "-0.5px" }}>
            Admin Portal
          </h1>
          <p style={{ color: "#a1a1aa", fontSize: 13, margin: 0 }}>
            Sign in to manage the system
          </p>
        </div>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: 14, top: 12, color: "#a1a1aa" }}><User size={16} /></div>
            <input 
              type="text" 
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="input-solid"
            />
          </div>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: 14, top: 12, color: "#a1a1aa" }}><Lock size={16} /></div>
            <input 
              type="password" 
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="input-solid"
            />
          </div>
          <button 
            type="submit"
            className="btn-primary"
            style={{
              marginTop: 8, padding: "12px 0", border: "none", borderRadius: 8,
              fontSize: 14, fontWeight: 500, cursor: "pointer", display: "flex", justifyContent: "center"
            }}
          >
            Sign In
          </button>
          
          <div 
            onClick={() => navigate("/dashboard")}
            style={{ 
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              color: "#a1a1aa", fontSize: 13, cursor: "pointer", marginTop: 8 
            }}
          >
            <ArrowLeft size={14} /> Back to dashboard
          </div>
        </form>
      </div>
    </div>
  );
}
