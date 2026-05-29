import React, {
  useState,
  FormEvent,
  useEffect,
  JSX,
  SVGProps,
  useRef,
} from "react";
import { Github, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import localforage from "localforage";
import { STUDENTS } from "../data";
import { CustomPopup } from "../components/Popup";
import { motion, AnimatePresence } from "motion/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const GoogleIcon = (
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>,
) => (
  <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="M3.06364 7.50914C4.70909 4.24092 8.09084 2 12 2C14.6954 2 16.959 2.99095 18.6909 4.60455L15.8227 7.47274C14.7864 6.48185 13.4681 5.97727 12 5.97727C9.39542 5.97727 7.19084 7.73637 6.40455 10.1C6.2045 10.7 6.09086 11.3409 6.09086 12C6.09086 12.6591 6.2045 13.3 6.40455 13.9C7.19084 16.2636 9.39542 18.0227 12 18.0227C13.3454 18.0227 14.4909 17.6682 15.3864 17.0682C16.4454 16.3591 17.15 15.3 17.3818 14.05H12V10.1818H21.4181C21.5364 10.8363 21.6 11.5182 21.6 12.2273C21.6 15.2727 20.5091 17.8363 18.6181 19.5773C16.9636 21.1046 14.7 22 12 22C8.09084 22 4.70909 19.7591 3.06364 16.4909C2.38638 15.1409 2 13.6136 2 12C2 10.3864 2.38638 8.85911 3.06364 7.50914Z" />
  </svg>
);

const PRESET_AVATARS = [
  "https://i.postimg.cc/nMfFrwcY/IMG-6675.jpg",
  "https://i.postimg.cc/8sgpcnPL/IMG-6676.jpg",
  "https://i.postimg.cc/PNnXJFrY/IMG-6677.jpg",
  "https://i.postimg.cc/grbzjBkk/IMG-6678.jpg",
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

  const handleSetupComplete = async () => {
    if (studentData) {
      const profileInfo = { name: profileName, avatar: avatarUrl };
      localStorage.setItem("student", JSON.stringify(studentData));
      localStorage.setItem("student_profile", JSON.stringify(profileInfo));

      // Save to database
      await localforage.setItem("studentData", studentData);
      await localforage.setItem("studentProfile", profileInfo);

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
    <div className="flex items-center justify-center min-h-dvh bg-background relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />
      <style>{`
        @keyframes flowX {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
      <div className="flex flex-1 flex-col justify-center px-4 py-10 lg:px-6 relative z-10 w-full max-w-[400px]">
        <AnimatePresence mode="wait">
          {step === "login" && (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              className="w-full bg-card text-card-foreground shadow-sm rounded-2xl border p-6 sm:p-8 relative overflow-hidden"
            >
              <div className="w-full flex flex-col items-center justify-center gap-5 mb-8 relative z-10">
                <img
                  src="https://img1.pic.in.th/images/IMG_679416662d67a142bdf0.png"
                  alt="Logo"
                  width={56}
                  height={56}
                  style={{ objectFit: "contain", borderRadius: 14 }}
                  className="shadow-sm"
                />
                <h2 className="text-balance text-center text-2xl font-semibold text-foreground">
                  เข้าสู่ระบบนักเรียน
                </h2>
              </div>

              <form onSubmit={handleLogin} className="space-y-4 z-10 relative">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    ชื่อผู้ใช้
                  </label>
                  <Input
                    type="text"
                    id="username"
                    name="username"
                    autoComplete="username"
                    placeholder=""
                    className="h-[56px] text-[16px] rounded-[14px] px-5 bg-background border-border text-foreground transition-all duration-300"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    รหัสผ่าน
                  </label>
                  <Input
                    type="password"
                    id="password"
                    name="password"
                    autoComplete="current-password"
                    placeholder=""
                    className="h-[56px] text-[16px] rounded-[14px] px-5 bg-background border-border text-foreground transition-all duration-300"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div className="flex justify-end mt-2">
                    <span
                      className="text-muted-foreground text-sm font-medium cursor-pointer hover:text-foreground transition-colors"
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
                  className="mt-6 w-full h-[56px] rounded-[14px] text-[16px] font-semibold transition-all duration-300"
                >
                  ดำเนินการต่อ
                </Button>
              </form>

              <p className="text-pretty mt-6 text-center text-xs text-muted-foreground z-10 relative">
                <span
                  onClick={() => navigate("/terms")}
                  className="cursor-pointer hover:text-foreground transition-colors"
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
              className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-background/95 backdrop-blur-sm"
            >
              <div className="relative flex items-center justify-center size-24 mb-8">
                <div className="absolute inset-0 rounded-full border-2 border-muted" />
                <div
                  className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary border-r-primary"
                  style={{ animation: "rotateDual 1s linear infinite" }}
                />
                <span className="text-2xl font-bold tracking-widest text-foreground">
                  SK
                </span>
              </div>
              <AnimatePresence mode="wait">
                <motion.p
                  key={loadingText}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="text-lg font-medium text-foreground tracking-wide"
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
              className="w-full bg-card text-card-foreground shadow-sm rounded-2xl border p-6 sm:p-8 relative z-10 overflow-hidden"
            >
              <div className="text-center mb-8 relative z-10">
                <h2 className="text-2xl font-semibold mb-2 text-foreground">
                  กำหนดโปรไฟล์ของคุณ
                </h2>
                <p className="text-muted-foreground text-sm">
                  เลือกรูปภาพและชื่อเพื่อใช้ในการแสดงผล
                </p>
              </div>

              <div className="flex flex-col items-center gap-8 mb-8 relative z-10">
                <div
                  className="relative group cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="size-28 rounded-full overflow-hidden border-2 border-border bg-muted flex items-center justify-center transition-all duration-300 group-hover:border-primary shadow-sm">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Upload className="size-8 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                    )}
                  </div>
                  <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px]">
                    <span className="text-white text-xs font-medium tracking-wide">
                      อัพโหลด
                    </span>
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
                  <p className="text-sm font-medium text-center mb-4 text-muted-foreground">
                    หรือใช้โปรไฟล์พรีเซ็ตของเรา
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {PRESET_AVATARS.map((url, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setAvatarUrl(url)}
                        className={`w-full aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-300 ${avatarUrl === url ? "border-primary shadow-sm scale-105" : "border-border hover:border-muted-foreground hover:scale-105"}`}
                      >
                        <img
                          src={url}
                          alt={`Preset ${i}`}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-8 relative z-10 w-full max-w-[280px] mx-auto">
                <Input
                  type="text"
                  placeholder="ตั้งชื่อโปรไฟล์ของคุณ"
                  className="h-[56px] text-center text-[16px] font-medium rounded-[14px] bg-background border-border text-foreground transition-all duration-300"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  maxLength={24}
                  minLength={2}
                />
              </div>

              <div className="relative z-10">
                <Button
                  onClick={handleSetupComplete}
                  disabled={
                    !profileName || profileName.length < 2 || !avatarUrl
                  }
                  className="w-full h-[56px] text-[16px] font-semibold rounded-[14px] transition-all duration-300"
                >
                  เริ่มเข้าสู่ระบบ
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
