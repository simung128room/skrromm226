import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, FileText, Settings, ShieldAlert, Volume2, Upload, Play } from 'lucide-react';
import { AnimCard } from '../components/Shared';
import { CustomPopup } from '../components/Popup';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(localStorage.getItem("admin_login_sound"));

  useEffect(() => {
    if (localStorage.getItem("admin_auth") !== "true") {
      navigate("/admin");
    }
  }, [navigate]);

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
         CustomPopup.fire({
            title: "อัปโหลดไม่สำเร็จ",
            text: "ไฟล์มีขนาดใหญ่เกินไป (สูงสุด 2MB)",
            icon: "error",
         });
         return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const base64 = event.target?.result as string;
          // limit to 2MB might still exceed localStorage limit (around 5MB, base64 expands 1.33x)
          localStorage.setItem("admin_login_sound", base64);
          setAudioUrl(base64);
          CustomPopup.fire({
            title: "สำเร็จ",
            text: "อัปโหลดเสียงสำเร็จ!",
            icon: "success",
            timer: 1500,
            showConfirmButton: false
          });
        } catch (err: any) {
          CustomPopup.fire({
            title: "ข้อผิดพลาด",
            text: "พื้นที่จัดเก็บเต็ม กรุณาใช้ไฟล์ที่เล็กกว่านี้",
            icon: "error",
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const playTestSound = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play().catch(e => {
        console.error("Error playing audio", e);
        CustomPopup.fire({
            title: "ไม่สามารถเล่นได้",
            text: "เบราว์เซอร์ไม่รองรับไฟล์เสียงนี้ หรือไฟล์อาจเสียหาย",
            icon: "error",
        });
      });
    }
  };

  const handleDeleteSound = async () => {
     const result = await CustomPopup.fire({
       title: "ยืนยันการลบเสียง",
       text: "คุณต้องการลบเสียงปุ่มเข้าสู่ระบบนี้หรือไม่?",
       icon: "warning",
       showCancelButton: true,
       confirmButtonText: "ลบเสียง",
       confirmButtonColor: "#ef4444"
     });
     if (result.isConfirmed) {
       localStorage.removeItem("admin_login_sound");
       setAudioUrl(null);
     }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#09090b",
      color: "#fafafa",
      fontFamily: "'Sarabun', sans-serif",
      padding: "32px 24px"
    }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 600, margin: "0 0 4px", letterSpacing: "-0.5px" }}>System Management</h1>
            <p style={{ color: "#a1a1aa", fontSize: 13, margin: 0 }}>Administrator Dashboard</p>
          </div>
          <button 
            onClick={() => {
              localStorage.removeItem("admin_auth");
              navigate("/admin");
            }}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "transparent", color: "#a1a1aa", border: "1px solid #27272a",
              padding: "8px 16px", borderRadius: 8, fontSize: 13, cursor: "pointer",
              transition: "background 0.2s, color 0.2s"
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = "#18181b"; e.currentTarget.style.color = "#fafafa"; }}
            onMouseOut={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#a1a1aa"; }}
          >
            <ArrowLeft size={14} /> Sign Out
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {[
            { icon: Users, label: "Manage Users" },
            { icon: FileText, label: "Manage Content" },
            { icon: ShieldAlert, label: "Reports" },
            { icon: Settings, label: "Settings" },
          ].map((item, idx) => (
            <AnimCard key={idx} delay={idx * 0.1}>
              <div style={{
                background: "#18181b",
                border: "1px solid #27272a",
                padding: 24,
                borderRadius: 12,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 16,
                cursor: "pointer",
                transition: "border-color 0.2s, background 0.2s"
              }}
              onMouseOver={(e) => { e.currentTarget.style.background = "#27272a"; }}
              onMouseOut={(e) => { e.currentTarget.style.background = "#18181b"; }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 8,
                  background: "#09090b", border: "1px solid #27272a", color: "#fafafa",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <item.icon size={20} />
                </div>
                <div style={{ fontSize: 14, fontWeight: 500, color: "#fafafa" }}>{item.label}</div>
              </div>
            </AnimCard>
          ))}
        </div>

        <div style={{ marginTop: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, display: "flex", alignItems: "center", gap: 8, color: "#fafafa" }}>
            <Volume2 size={16} color="#a1a1aa" /> Login Audio Settings
          </h2>
          <AnimCard delay={0.4}>
            <div style={{
              background: "#18181b",
              border: "1px solid #27272a",
              padding: 24,
              borderRadius: 12,
              display: "flex",
              flexDirection: "column",
              gap: 16
            }}>
               <p style={{ color: "#a1a1aa", fontSize: 13, margin: 0 }}>
                 Upload an audio file (.mp3, .wav) to play when a user clicks "Sign In". Maximum 2MB.
               </p>
               
               <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 8 }}>
                 <input 
                   type="file" 
                   accept="audio/*" 
                   ref={fileInputRef} 
                   onChange={handleAudioUpload} 
                   style={{ display: "none" }} 
                 />
                 <button 
                   onClick={() => fileInputRef.current?.click()}
                   style={{
                     display: "flex", alignItems: "center", gap: 8,
                     background: "#fafafa", color: "#09090b", border: "none",
                     padding: "10px 16px", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer",
                     transition: "opacity 0.2s"
                   }}
                   onMouseOver={(e) => e.currentTarget.style.opacity = "0.9"}
                   onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
                 >
                   <Upload size={14} /> Upload Audio
                 </button>
                 
                 {audioUrl && (
                   <button 
                     onClick={playTestSound}
                     style={{
                       display: "flex", alignItems: "center", gap: 8,
                       background: "transparent", color: "#fafafa", border: "1px solid #27272a",
                       padding: "10px 16px", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer",
                       transition: "background 0.2s"
                     }}
                     onMouseOver={(e) => e.currentTarget.style.background = "#27272a"}
                     onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
                   >
                     <Play size={14} fill="currentColor" /> Test Sound
                   </button>
                 )}
                 {audioUrl && (
                    <button 
                     onClick={handleDeleteSound}
                     style={{
                       display: "flex", alignItems: "center", gap: 8,
                       background: "transparent", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.3)",
                       padding: "10px 16px", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer",
                       transition: "background 0.2s"
                     }}
                     onMouseOver={(e) => e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)"}
                     onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
                   >
                     Delete
                   </button>
                 )}
               </div>
            </div>
          </AnimCard>
        </div>

      </div>
    </div>
  );
}
