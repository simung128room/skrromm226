import React, { useState, FormEvent, useEffect, JSX, SVGProps, useRef } from "react";
import { Github, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { STUDENTS } from "../data";
import { CustomPopup } from "../components/Popup";
import { motion, AnimatePresence } from "motion/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const GoogleIcon = (
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) => (
  <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="M3.06364 7.50914C4.70909 4.24092 8.09084 2 12 2C14.6954 2 16.959 2.99095 18.6909 4.60455L15.8227 7.47274C14.7864 6.48185 13.4681 5.97727 12 5.97727C9.39542 5.97727 7.19084 7.73637 6.40455 10.1C6.2045 10.7 6.09086 11.3409 6.09086 12C6.09086 12.6591 6.2045 13.3 6.40455 13.9C7.19084 16.2636 9.39542 18.0227 12 18.0227C13.3454 18.0227 14.4909 17.6682 15.3864 17.0682C16.4454 16.3591 17.15 15.3 17.3818 14.05H12V10.1818H21.4181C21.5364 10.8363 21.6 11.5182 21.6 12.2273C21.6 15.2727 20.5091 17.8363 18.6181 19.5773C16.9636 21.1046 14.7 22 12 22C8.09084 22 4.70909 19.7591 3.06364 16.4909C2.38638 15.1409 2 13.6136 2 12C2 10.3864 2.38638 8.85911 3.06364 7.50914Z" />
  </svg>
);

const PRESET_AVATARS = [
  "https://i.postimg.cc/nMfFrwcY/IMG-6675.jpg",
  "https://i.postimg.cc/8sgpcnPL/IMG-6676.jpg",
  "https://i.postimg.cc/PNnXJFrY/IMG-6677.jpg",
  "https://i.postimg.cc/grbzjBkk/IMG-6678.jpg"
];

export default function Welcome() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  const [step, setStep] = useState<"login" | "loading" | "setup">("login");
  const [loadingText, setLoadingText] = useState("กำลังซิงค์ข้อมูล...");
  
  const [profileName, setProfileName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [studentData, setStudentData] = useState<any>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const adminAuth = localStorage.getItem("admin_auth");
    const studentAuth = localStorage.getItem("student");

    if (adminAuth === "true") {
      navigate("/admin/dashboard");
    } else if (studentAuth) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const playLoginSound = () => {
    const soundData = localStorage.getItem("admin_login_sound");
    if (soundData) {
      new Audio(soundData)
        .play()
        .catch((e) => console.error("Could not play sound:", e));
    }
  };

  const handleLogin = (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!username || !password) {
      CustomPopup.fire({
        icon: "warning",
        title: "แจ้งเตือน",
        text: "กรุณากรอกข้อมูลให้ครบถ้วน",
        confirmButtonColor: "#171717",
      });
      return;
    }

    if (username === "admin" && password === "123456") {
      playLoginSound();
      localStorage.setItem("admin_auth", "true");
      navigate("/admin/dashboard");
      return;
    }

    const tstudent = STUDENTS.find((s) => s.id === username);
    if (tstudent && username === password) {
      playLoginSound();
      setStudentData(tstudent);
      setProfileName(tstudent.name || "");
      
      setStep("loading");
      setTimeout(() => {
        setLoadingText("กำลังโหลดข้อมูลของคุณ...");
        setTimeout(() => {
          setStep("setup");
        }, 1500);
      }, 1500);
      
    } else {
      CustomPopup.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  const handleVisit = () => {
    localStorage.removeItem("student");
    navigate("/dashboard");
  };

  const handleSetupComplete = () => {
    if (studentData) {
      localStorage.setItem("student", JSON.stringify(studentData));
      localStorage.setItem("student_profile", JSON.stringify({ name: profileName, avatar: avatarUrl }));
      navigate("/dashboard", { state: { student: studentData } });
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-dvh bg-zinc-950 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-yellow-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      <style>{`
        @keyframes rotateDual {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <div className="flex flex-1 flex-col justify-center px-4 py-10 lg:px-6 relative z-10 w-full max-w-[480px]">
        <AnimatePresence mode="wait">
          {step === "login" && (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              className="w-full bg-zinc-900/60 backdrop-blur-xl text-zinc-100 shadow-2xl rounded-[24px] border border-white/10 p-8 sm:p-10 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-yellow-500/5 pointer-events-none" />
              
              <div className="w-full flex flex-col items-center justify-center gap-5 mb-10 relative z-10">
                <img
                  src="https://img1.pic.in.th/images/IMG_679416662d67a142bdf0.png"
                  alt="Logo"
                  width={56}
                  height={56}
                  style={{ objectFit: "contain", borderRadius: 14 }}
                  className="shadow-lg shadow-black/50"
                />
                <h2 className="text-balance text-center text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-white/60">
                  ยินดีต้อนรับเข้าสู่ห้องเรียน 226
                </h2>
              </div>

              <div className="relative my-8 text-center z-10">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase font-medium tracking-wider">
                  <span className="bg-zinc-900/60 px-3 text-zinc-400 rounded-full">
                    สำหรับผู้พัฒนา
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3 z-10 relative">
                <Button
                  variant="outline"
                  className="flex w-full items-center justify-center space-x-3 h-14 rounded-xl bg-white/5 border-white/10 hover:bg-white/10 text-white transition-all"
                  onClick={handleVisit}
                >
                  <GoogleIcon className="size-5" aria-hidden={true} />
                  <span className="font-medium text-base">ดำเนินการต่อด้วย Google</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex w-full items-center justify-center space-x-3 h-14 rounded-xl bg-white/5 border-white/10 hover:bg-white/10 text-white transition-all"
                  onClick={handleVisit}
                >
                  <Github className="size-5" aria-hidden={true} />
                  <span className="font-medium text-base">ดำเนินการต่อด้วย GitHub</span>
                </Button>
              </div>

              <div className="relative my-8 text-center z-10">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase font-medium tracking-wider">
                  <span className="bg-zinc-900/60 px-3 text-zinc-400 rounded-full">
                    เข้าสู่ระบบนักเรียน
                  </span>
                </div>
              </div>

              <form onSubmit={handleLogin} className="space-y-6 z-10 relative">
                <div>
                  <Input
                    type="text"
                    id="username"
                    name="username"
                    autoComplete="username"
                    placeholder="กรอกชื่อผู้ใช้"
                    className="h-[64px] text-[18px] rounded-[16px] px-5 bg-black/40 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-2 focus-visible:ring-purple-500/50 focus-visible:border-purple-500 transition-all duration-300"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div>
                  <Input
                    type="password"
                    id="password"
                    name="password"
                    autoComplete="current-password"
                    placeholder="กรอกรหัสผ่าน"
                    className="h-[64px] text-[18px] rounded-[16px] px-5 bg-black/40 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-2 focus-visible:ring-purple-500/50 focus-visible:border-purple-500 transition-all duration-300"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div className="flex justify-end mt-3">
                    <span
                      className="text-zinc-400 text-sm font-medium cursor-pointer hover:text-purple-400 transition-colors"
                      onClick={() =>
                        CustomPopup.fire({
                          title: "ลืมรหัสผ่าน",
                          text: "กรุณาติดต่อผู้ดูแลระบบ",
                          icon: "info",
                        })
                      }
                    >
                      ลืมรหัสผ่าน?
                    </span>
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="mt-8 w-full h-[62px] rounded-[18px] text-[18px] font-bold bg-gradient-to-r from-purple-600 to-yellow-500 hover:from-purple-500 hover:to-yellow-400 text-white shadow-[0_4px_20px_rgba(168,85,247,0.3)] hover:shadow-[0_6px_25px_rgba(168,85,247,0.4)] hover:-translate-y-0.5 transition-all duration-300 border-none outline-none"
                >
                  ดำเนินการต่อ
                </Button>
              </form>

              <p className="text-pretty mt-8 text-center text-xs text-zinc-500 z-10 relative">
                <span
                  onClick={() => navigate("/terms")}
                  className="cursor-pointer hover:text-zinc-300 transition-colors"
                >
                  ข้อกำหนดการให้บริการ และ นโยบายความเป็นส่วนตัว
                </span>
              </p>
            </motion.div>
          )}

          {step === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-black/70 backdrop-blur-md"
            >
              <div className="relative flex items-center justify-center size-36 mb-10">
                <div 
                  className="absolute inset-0 rounded-full border-[4px] border-transparent border-t-purple-500 border-b-yellow-400 shadow-[0_0_20px_rgba(168,85,247,0.4),inset_0_0_20px_rgba(250,204,21,0.2)]"
                  style={{ animation: "rotateDual 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite" }}
                />
                <div 
                  className="absolute inset-2 rounded-full border-[2px] border-transparent border-l-purple-400/50 border-r-yellow-300/50"
                  style={{ animation: "rotateDual 2s linear infinite reverse" }}
                />
                <span className="text-5xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-br from-white to-purple-200 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">SK</span>
              </div>
              <AnimatePresence mode="wait">
                <motion.p
                  key={loadingText}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="text-xl font-semibold text-zinc-200 tracking-wide"
                >
                  {loadingText}
                </motion.p>
              </AnimatePresence>
            </motion.div>
          )}

          {step === "setup" && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-full bg-zinc-900/80 backdrop-blur-xl text-zinc-100 shadow-2xl rounded-[24px] border border-white/10 p-8 sm:p-10 relative z-10 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent pointer-events-none" />

              <div className="text-center mb-8 relative z-10">
                <h2 className="text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">กำหนดโปรไฟล์ของคุณ</h2>
                <p className="text-zinc-400 text-sm">เลือกรูปภาพและชื่อเพื่อใช้ในการแสดงผล</p>
              </div>

              <div className="flex flex-col items-center gap-8 mb-10 relative z-10">
                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <div className="size-32 rounded-full overflow-hidden border-4 border-zinc-800 bg-black/50 flex items-center justify-center transition-all duration-300 group-hover:border-purple-500 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] shadow-xl">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <Upload className="size-10 text-zinc-500 group-hover:text-purple-400 transition-colors duration-300" />
                    )}
                  </div>
                  <div className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
                    <span className="text-white text-sm font-semibold tracking-wide">อัพโหลด (PNG/JPG)</span>
                  </div>
                  <input
                     type="file"
                     ref={fileInputRef}
                     onChange={handleAvatarUpload}
                     accept="image/png, image/jpeg, image/jpg"
                     className="hidden"
                  />
                </div>

                <div className="w-full max-w-[280px]">
                  <p className="text-sm font-medium text-center mb-4 text-zinc-400">หรือใช้โปรไฟล์พรีเซ็ตของเรา</p>
                  <div className="grid grid-cols-2 gap-4">
                    {PRESET_AVATARS.map((url, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setAvatarUrl(url)}
                        className={`w-full aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-300 ${avatarUrl === url ? "border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)] scale-105" : "border-white/5 hover:border-white/20 hover:scale-105"}`}
                      >
                        <img src={url} alt={`Preset ${i}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-10 relative z-10 w-full max-w-[280px] mx-auto">
                <Input
                  type="text"
                  placeholder="ตั้งชื่อโปรไฟล์ของคุณ"
                  className="h-[64px] text-center text-[18px] font-medium rounded-[16px] bg-black/40 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-2 focus-visible:ring-purple-500/50 focus-visible:border-purple-500 transition-all duration-300"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  maxLength={24}
                  minLength={2}
                />
              </div>

              <div className="relative z-10">
                <motion.button 
                  onClick={handleSetupComplete}
                  disabled={!profileName || profileName.length < 2 || !avatarUrl}
                  whileHover={{ scale: (!profileName || profileName.length < 2 || !avatarUrl) ? 1 : 1.02 }}
                  whileTap={{ scale: (!profileName || profileName.length < 2 || !avatarUrl) ? 1 : 0.98 }}
                  className={`w-full h-[62px] text-[18px] font-bold rounded-[18px] transition-all duration-300 ${(!profileName || profileName.length < 2 || !avatarUrl) ? 'opacity-50 cursor-not-allowed bg-zinc-800 text-zinc-500' : 'bg-gradient-to-r from-purple-600 to-yellow-500 text-white shadow-[0_4px_20px_rgba(168,85,247,0.3)] hover:shadow-[0_6px_25px_rgba(168,85,247,0.4)]'}`}
                >
                  เริ่มเข้าสู่ระบบ
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
