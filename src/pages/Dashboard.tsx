import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  Plus,
  Users,
  Globe,
  Bell,
  MessageSquare,
  Sparkles,
  ArrowLeftRight,
  BookOpen,
  MapPin,
  RefreshCw,
  ArrowUpRight,
  ChevronRight,
  X,
  Menu,
  Shield,
  Star,
  CalendarDays,
  Trophy,
  AlertTriangle,
  CheckCircle2,
  Camera,
  CheckSquare,
  Coffee,
  Search,
  Settings,
  User,
  Lock,
  Palette,
  Cloud,
  Database,
  Trash2,
  HelpCircle,
  Tent,
  Gamepad2,
  Share2,
  Bot,
  Library,
} from "lucide-react";
import { Link, useNavigate, Outlet, useLocation } from "react-router-dom";
import {
  AnimCard,
  CountUp,
  getRankColor,
  RankIcon,
} from "../components/Shared";
import { CustomPopup } from "../components/Popup";
import { PERIODS, C, SCHEDULE, DAYS, LEADERBOARD, STUDENTS } from "../data";

const EASE = "cubic-bezier(0.4,0,0.2,1)";
const SPRING = "cubic-bezier(0.34,1.56,0.64,1)";

function getTodayIdx() {
  const d = new Date().getDay();
  return d === 0 || d === 6 ? 0 : d - 1;
}

function getCurrentPeriod() {
  const now = new Date();
  const t = now.getHours() * 60 + now.getMinutes();
  const r = [
    [8 * 60 + 30, 9 * 60 + 25],
    [9 * 60 + 25, 10 * 60 + 20],
    [10 * 60 + 20, 11 * 60 + 15],
    [11 * 60 + 15, 12 * 60 + 10],
    [12 * 60 + 10, 13 * 60 + 5],
    [13 * 60 + 5, 14 * 60],
    [14 * 60, 14 * 60 + 55],
    [14 * 60 + 55, 15 * 60 + 50],
    [15 * 60 + 50, 16 * 60 + 30],
  ];
  for (let i = 0; i < r.length; i++) if (t >= r[i][0] && t < r[i][1]) return i;
  return -1;
}

const AnimatedMenuIcon = ({
  isOpen,
  color = "#93c5fd",
  size = 20,
}: {
  isOpen: boolean;
  color?: string;
  size?: number;
}) => {
  const lineVariants = {
    top: {
      closed: { rotate: 0, y: 0 },
      opened: { rotate: 45, y: 6 },
    },
    middle: {
      closed: { opacity: 1, scale: 1 },
      opened: { opacity: 0, scale: 0 },
    },
    bottom: {
      closed: { rotate: 0, y: 0 },
      opened: { rotate: -45, y: -6 },
    },
  };

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      animate={isOpen ? "opened" : "closed"}
      variants={{
        closed: { rotate: 0 },
        opened: { rotate: 180 },
      }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      style={{ overflow: "visible" }}
    >
      <motion.line
        x1="3"
        y1="6"
        x2="21"
        y2="6"
        variants={lineVariants.top}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        style={{ transformOrigin: "center" }}
      />
      <motion.line
        x1="3"
        y1="12"
        x2="21"
        y2="12"
        variants={lineVariants.middle}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        style={{ transformOrigin: "center" }}
      />
      <motion.line
        x1="3"
        y1="18"
        x2="21"
        y2="18"
        variants={lineVariants.bottom}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        style={{ transformOrigin: "center" }}
      />
    </motion.svg>
  );
};

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [livePulse, setLivePulse] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Settings States
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    localStorage.getItem("setting_notifications") !== "false",
  );
  const [appTheme, setAppTheme] = useState(
    localStorage.getItem("setting_theme") || "dark",
  );
  const [appLanguage, setAppLanguage] = useState(
    localStorage.getItem("setting_language") || "th",
  );
  const [cloudSyncOpen, setCloudSyncOpen] = useState(
    localStorage.getItem("setting_cloudSync") !== "false",
  );
  const [storageUsed, setStorageUsed] = useState("15.2 MB");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSearchStudent, setSelectedSearchStudent] = useState<any>(null);

  const filteredStudents =
    searchQuery.trim() === ""
      ? []
      : STUDENTS.filter((st) => {
          const query = searchQuery.toLowerCase();
          return (
            st.name.toLowerCase().includes(query) ||
            st.id.includes(query) ||
            st.no.toString() === query
          );
        });

  // derive active menu from location
  const path = location.pathname.split("/").pop() || "overview";

  const fallbackStudent = JSON.parse(localStorage.getItem("student") || "null");
  const tstudent = location.state?.student || fallbackStudent;

  let tName = "ผู้เยี่ยมชม";
  let tSeed = "s5";
  let tRank = "Legend";

  const EnNames: Record<string, string> = {
    กรวิชญ์: "Korawit",
    กรวิทย์: "Kornvit",
    จิรายุ: "Jirayu",
    เฉลิมชัย: "Chalermchai",
    ฐีระวัฒน์: "Teerawat",
    ณฐูนนท์: "Nathunon",
    ณัฐภิมินทร์: "Nattapimin",
    ธนโชติ: "Thanachot",
    ปกรณ์: "Pakorn",
    กนกพล: "Kanokpon",
    อภิลักษณ์: "Aphilak",
    ณตรชัย: "Natarachai",
    ปรินทร์: "Parin",
    ศุภณัฐ: "Suphanut",
    กรนนก: "Kornnok",
    ก้านยกร: "Kanyakorn",
    ขวัญข้าว: "Kwankhao",
    ทิตะยา: "Titaya",
    นัชนิกาณจน์: "Natchanikan",
    ณัฐณิชา: "Nattanicha",
    ณัฐอิตา: "Nattaita",
    นภัสร: "Napasorn",
    น้ำฝน: "Namfon",
    บุษรินทร์: "Bussarin",
    ศุภิสรา: "Supisara",
    สดาวรรณ: "Sadawan",
    อมิตา: "Amita",
    ธิรากรณ์: "Thirakorn",
    วรัญญา: "Waranya",
    ธัญญาภรณ์: "Thanyaporn",
    มนัสภรณ์: "Manatsaporn",
    สิริญากรณ์: "Sirinyakorn",
    ลภัสรดา: "Lapasrada",
    ชฎาภา: "Chadapa",
    เดชินี: "Dechini",
    วรนทรา: "Waranatara",
    สุณิสา: "Sunisa",
    ฐิติบัณท์: "Thitiban",
    พลอยใส: "Ploysai",
    ผู้เยี่ยมชม: "Visitor",
  };

  if (tstudent) {
    const nameWithoutTitle = tstudent.name
      .replace(/เด็กชาย|เด็กหญิง/, "")
      .trim();
    tName = nameWithoutTitle.split(" ")[0];
    const lbEntry = LEADERBOARD.find((x) => x.name.includes(tName));
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
    { id: "", label: "แดชบอร์ด", Icon: LayoutDashboard },
    { id: "assignments", label: "ส่งงาน", Icon: BookOpen },
    { id: "schedule", label: "ตารางเรียน", Icon: CalendarDays },
  ];
  const menuActivity = [
    { id: "duty", label: "ตารางเวร", Icon: Sparkles },
    { id: "forms", label: "แจ้งปัญหา", Icon: AlertTriangle },
    { id: "leaderboard", label: "จัดอันดับ", Icon: Trophy },
    { id: "camps", label: "กิจกรรม / ค่าย", Icon: Tent },
  ];
  const menuLearning = [
    { id: "ai", label: "ผู้ช่วย AI", Icon: Bot },
    { id: "courses", label: "คอร์สเรียน", Icon: Library },
    { id: "shared", label: "คลังความรู้", Icon: Share2 },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "สวัสดีตอนเช้า";
    if (hour >= 12 && hour < 13) return "สวัสดีตอนเที่ยง";
    if (hour >= 13 && hour < 17) return "สวัสดีตอนบ่าย";
    if (hour >= 17 && hour < 20) return "สวัสดีตอนเย็น";
    return "สวัสดีตอนค่ำ";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        color: "var(--foreground)",
        maxWidth: 430,
        margin: "0 auto",
        position: "relative",
        overflowX: "clip",
        background: "var(--background)",
      }}
    >
      <style>{`
        @keyframes flowX {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes liveRing { 0% { transform: scale(1); opacity: 0.8; } 100% { transform: scale(3); opacity: 0; } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

        .stat-card {
          transition: border-color 0.2s, background 0.2s;
          cursor: pointer;
        }
        .stat-card:hover {
          background: var(--border) !important;
        }
        .sidebar-item { transition: background 0.2s, color 0.2s; }
        .sidebar-item:hover { background: var(--border) !important; color: var(--foreground) !important; }
        .icon-btn { transition: background 0.2s, color 0.2s; }
        .icon-btn:hover { background: var(--border) !important; color: var(--foreground) !important; }
      `}</style>

      {/* BG dot grid */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          opacity: 0.1,
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      {/* Sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
            onClick={() => setSidebarOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.6)",
              zIndex: 40,
              backdropFilter: "blur(4px)",
              willChange: "opacity",
            }}
          />
        )}
      </AnimatePresence>

      {/* ── SIDEBAR ── */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: sidebarOpen ? 0 : "-100%" }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 300,
          mass: 0.8,
        }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 280,
          height: "100%",
          background: "var(--background)",
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          borderRight: "1px solid var(--border)",
          willChange: "transform",
        }}
      >
        <div
          style={{
            padding: "20px 20px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 28,
                height: 28,
                background: "transparent",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <img
                src="https://img1.pic.in.th/images/IMG_679416662d67a142bdf0.png"
                alt="Logo"
                style={{ width: 20, height: 20, objectFit: "contain" }}
              />
            </div>
            <div>
              <div
                style={{
                  color: "var(--foreground)",
                  fontWeight: 600,
                  fontSize: 15,
                  letterSpacing: "-0.5px",
                }}
              >
                skroom226.site
              </div>
              <div
                style={{ color: "var(--muted-foreground)", fontSize: 10, letterSpacing: "1px" }}
              >
                WORKSPACE
              </div>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="icon-btn"
            style={{
              background: "none",
              border: "1px solid var(--border)",
              cursor: "pointer",
              color: "var(--muted-foreground)",
              padding: 6,
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={14} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "16px 12px" }}>
          <div
            style={{
              padding: "0 8px 8px",
              color: "var(--muted-foreground)",
              fontSize: 11,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            ภาพรวม
          </div>
          {menuOverview.map(({ id, label, Icon: Ic }, idx) => {
            const active =
              id === ""
                ? location.pathname === "/dashboard" ||
                  location.pathname === "/dashboard/"
                : location.pathname.includes(id);
            return (
              <button
                key={"m1" + idx}
                className="sidebar-item"
                onClick={() => {
                  navigate(`/dashboard/${id}`);
                  setSidebarOpen(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  width: "100%",
                  padding: "10px 12px",
                  background: active ? "#2563eb" : "transparent",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                  textAlign: "left",
                  marginBottom: 2,
                }}
              >
                <Ic size={16} color={active ? "var(--foreground)" : "var(--muted-foreground)"} />
                <div
                  style={{
                    flex: 1,
                    color: active ? "var(--foreground)" : "var(--muted-foreground)",
                    fontSize: 14,
                    fontWeight: active ? 500 : 400,
                  }}
                >
                  {label}
                </div>
              </button>
            );
          })}

          <div
            style={{
              padding: "16px 8px 8px",
              color: "var(--muted-foreground)",
              fontSize: 11,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginTop: 8,
            }}
          >
            กิจกรรม
          </div>
          {menuActivity.map(({ id, label, Icon: Ic }, idx) => {
            const active = location.pathname.includes(id);
            return (
              <button
                key={"m2" + idx}
                className="sidebar-item"
                onClick={() => {
                  navigate(`/dashboard/${id}`);
                  setSidebarOpen(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  width: "100%",
                  padding: "10px 12px",
                  background: active ? "#2563eb" : "transparent",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                  textAlign: "left",
                  marginBottom: 2,
                }}
              >
                <Ic size={16} color={active ? "var(--foreground)" : "var(--muted-foreground)"} />
                <div
                  style={{
                    flex: 1,
                    color: active ? "var(--foreground)" : "var(--muted-foreground)",
                    fontSize: 14,
                    fontWeight: active ? 500 : 400,
                  }}
                >
                  {label}
                </div>
              </button>
            );
          })}

          <div
            style={{
              padding: "16px 8px 8px",
              color: "var(--muted-foreground)",
              fontSize: 11,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginTop: 8,
            }}
          >
            การเรียนรู้ใหม่
          </div>
          {menuLearning.map(({ id, label, Icon: Ic }, idx) => {
            const active = location.pathname.includes(id);
            return (
              <button
                key={"m3" + idx}
                className="sidebar-item"
                onClick={() => {
                  navigate(`/dashboard/${id}`);
                  setSidebarOpen(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  width: "100%",
                  padding: "10px 12px",
                  background: active ? "#2563eb" : "transparent",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                  textAlign: "left",
                  marginBottom: 2,
                }}
              >
                <Ic size={16} color={active ? "var(--foreground)" : "var(--muted-foreground)"} />
                <div
                  style={{
                    flex: 1,
                    color: active ? "var(--foreground)" : "var(--muted-foreground)",
                    fontSize: 14,
                    fontWeight: active ? 500 : 400,
                  }}
                >
                  {label}
                </div>
              </button>
            );
          })}
        </div>

        <div style={{ padding: 16, borderTop: "1px solid var(--border)" }}>
          <button
            className="sidebar-item"
            onClick={() => {
              navigate("/dashboard/settings");
              setSidebarOpen(false);
            }}
            style={{
              width: "100%",
              border: "none",
              color: location.pathname.includes("/settings")
                ? "var(--foreground)"
                : "var(--muted-foreground)",
              background: location.pathname.includes("/settings")
                ? "rgba(255,255,255,0.05)"
                : "transparent",
              borderRadius: 8,
              padding: "10px 12px",
              fontSize: 14,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontWeight: 500,
              marginBottom: 8,
              textAlign: "left",
            }}
          >
            <Settings size={16} /> การตั้งค่า
          </button>

          <button
            className="sidebar-item"
            onClick={() => {
              CustomPopup.fire({
                title: "ออกจากระบบ?",
                text: "คุณต้องการออกจากระบบใช่หรือไม่?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#ef4444",
                cancelButtonColor: "var(--border)",
                confirmButtonText: "ออกจากระบบ",
                cancelButtonText: "ยกเลิก",
              }).then((result) => {
                if (result.isConfirmed) {
                  localStorage.removeItem("student");
                  navigate("/");
                }
              });
            }}
            style={{
              width: "100%",
              border: "1px solid var(--border)",
              color: "var(--foreground)",
              background: "transparent",
              borderRadius: 8,
              padding: "10px 12px",
              fontSize: 14,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontWeight: 500,
            }}
          >
            <ArrowLeftRight size={16} /> Sign out
          </button>
        </div>
      </motion.div>

      {/* ── NAVBAR ── */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <div
          style={{
            position: "fixed",
            top: 16,
            width: "100%",
            maxWidth: 430,
            left: 0,
            right: 0,
            margin: "0 auto",
            zIndex: 30,
            padding: "0 16px",
          }}
        >
          <nav
            style={{
              background: "color-mix(in srgb, var(--background) 80%, transparent)",
              backdropFilter: "blur(12px)",
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              border: "1px solid var(--border)",
              borderRadius: 20,
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 24,
                  height: 24,
                  background: "transparent",
                  borderRadius: 6,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                <img
                  src="https://img1.pic.in.th/images/IMG_679416662d67a142bdf0.png"
                  alt="Logo"
                  style={{ width: 16, height: 16, objectFit: "contain" }}
                />
              </div>
              <span
                style={{
                  color: "var(--foreground)",
                  fontWeight: 600,
                  fontSize: 14,
                  letterSpacing: "-0.5px",
                }}
              >
                skroom226.site
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button
                className="icon-btn"
                onClick={() => setIsSearchOpen(true)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--muted-foreground)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 4,
                }}
              >
                <Search size={18} />
              </button>
              <button
                className="icon-btn"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--muted-foreground)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 4,
                }}
              >
                <Menu size={20} />
              </button>
            </div>
          </nav>
        </div>
        <div style={{ height: 80 }} />

        {/* ── SEARCH OVERLAY ── */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                position: "fixed",
                inset: 0,
                background: "color-mix(in srgb, var(--background) 80%, transparent)",
                backdropFilter: "blur(8px)",
                zIndex: 100,
                display: "flex",
                flexDirection: "column",
                padding: "16px",
                maxWidth: 430,
                margin: "0 auto",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 16,
                }}
              >
                <div style={{ flex: 1, position: "relative" }}>
                  <Search
                    size={16}
                    color="var(--muted-foreground)"
                    style={{
                      position: "absolute",
                      left: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Search name, ID, or roll number..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    style={{
                      width: "100%",
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      padding: "10px 12px 10px 36px",
                      fontSize: 14,
                      color: "var(--foreground)",
                      outline: "none",
                      fontFamily: "'Prompt', sans-serif",
                    }}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      style={{
                        position: "absolute",
                        right: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        color: "var(--muted-foreground)",
                        cursor: "pointer",
                        padding: 0,
                      }}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
                <button
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery("");
                    setSelectedSearchStudent(null);
                  }}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "var(--foreground)",
                    fontSize: 13,
                    padding: "10px 8px",
                    cursor: "pointer",
                    fontFamily: "'Prompt', sans-serif",
                  }}
                >
                  Cancel
                </button>
              </div>

              <div
                style={{
                  flex: 1,
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                {selectedSearchStudent ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: 12,
                      padding: 20,
                      color: "var(--foreground)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: 16,
                      }}
                    >
                      <div>
                        <span
                          style={{
                            fontSize: 11,
                            background: "var(--border)",
                            color: "var(--foreground)",
                            padding: "2px 8px",
                            borderRadius: 12,
                            fontWeight: 600,
                          }}
                        >
                          Roll {selectedSearchStudent.no}
                        </span>
                        <h3
                          style={{
                            fontSize: 18,
                            fontWeight: 600,
                            marginTop: 8,
                            color: "var(--foreground)",
                          }}
                        >
                          {selectedSearchStudent.name}
                        </h3>
                        <p
                          style={{
                            fontSize: 12,
                            color: "var(--muted-foreground)",
                            marginTop: 2,
                          }}
                        >
                          ID: {selectedSearchStudent.id}
                        </p>
                      </div>
                      {(() => {
                        const firstName = selectedSearchStudent.name
                          .replace(/เด็กชาย|เด็กหญิง/, "")
                          .trim()
                          .split(" ")[0];
                        const lb = LEADERBOARD.find((x) =>
                          x.name.includes(firstName),
                        );
                        const rank = lb ? lb.rank : "Bronze";
                        return (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            <RankIcon rank={rank} size={36} />
                            <span
                              style={{
                                fontSize: 10,
                                fontWeight: 600,
                                color: "var(--muted-foreground)",
                              }}
                            >
                              {rank.toUpperCase()}
                            </span>
                          </div>
                        );
                      })()}
                    </div>

                    <div
                      style={{
                        height: 1,
                        background: "var(--border)",
                        margin: "14px 0",
                      }}
                    />

                    {(() => {
                      const firstName = selectedSearchStudent.name
                        .replace(/เด็กชาย|เด็กหญิง/, "")
                        .trim()
                        .split(" ")[0];
                      const lb = LEADERBOARD.find((x) =>
                        x.name.includes(firstName),
                      );
                      const points = lb ? lb.points : 45;
                      const streak = lb ? lb.streak : 0;
                      return (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 12,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              fontSize: 13,
                            }}
                          >
                            <span style={{ color: "var(--muted-foreground)" }}>Points:</span>
                            <span style={{ fontWeight: 600, color: "var(--foreground)" }}>
                              {points} PT
                            </span>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              fontSize: 13,
                            }}
                          >
                            <span style={{ color: "var(--muted-foreground)" }}>Streak:</span>
                            <span style={{ fontWeight: 600, color: "var(--foreground)" }}>
                              {streak} Days
                            </span>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              fontSize: 13,
                            }}
                          >
                            <span style={{ color: "var(--muted-foreground)" }}>Class:</span>
                            <span style={{ fontWeight: 600, color: "var(--foreground)" }}>
                              M.2/6
                            </span>
                          </div>
                        </div>
                      );
                    })()}

                    <button
                      onClick={() => setSelectedSearchStudent(null)}
                      style={{
                        width: "100%",
                        background: "var(--border)",
                        color: "var(--foreground)",
                        border: "1px solid var(--border)",
                        padding: "10px 0",
                        borderRadius: 8,
                        marginTop: 24,
                        cursor: "pointer",
                        fontSize: 13,
                        fontWeight: 500,
                        fontFamily: "'Prompt', sans-serif",
                      }}
                    >
                      Back to results
                    </button>
                  </motion.div>
                ) : searchQuery.trim() === "" ? (
                  <div
                    style={{
                      padding: "40px 20px",
                      textAlign: "center",
                      color: "var(--muted-foreground)",
                      fontSize: 13,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <Search size={24} color="var(--muted-foreground)" strokeWidth={2} />
                    <span>Enter search query</span>
                  </div>
                ) : filteredStudents.length === 0 ? (
                  <div
                    style={{
                      padding: "40px 20px",
                      textAlign: "center",
                      color: "var(--muted-foreground)",
                      fontSize: 13,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <AlertTriangle size={24} color="var(--muted-foreground)" strokeWidth={2} />
                    <span>No students found for "{searchQuery}"</span>
                  </div>
                ) : (
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 8 }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        color: "var(--muted-foreground)",
                        fontWeight: 600,
                        paddingLeft: 4,
                      }}
                    >
                      {filteredStudents.length} results
                    </span>
                    {filteredStudents.map((st) => {
                      const firstName = st.name
                        .replace(/เด็กชาย|เด็กหญิง/, "")
                        .trim()
                        .split(" ")[0];
                      const lb = LEADERBOARD.find((x) =>
                        x.name.includes(firstName),
                      );
                      const rank = lb ? lb.rank : "Bronze";
                      const points = lb ? lb.points : 45;

                      return (
                        <motion.div
                          key={st.id}
                          whileHover={{ scale: 1.01, background: "var(--border)" }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => setSelectedSearchStudent(st)}
                          style={{
                            background: "var(--card)",
                            border: "1px solid var(--border)",
                            borderRadius: 8,
                            padding: 12,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            cursor: "pointer",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 12,
                            }}
                          >
                            <span
                              style={{
                                fontSize: 11,
                                background: "var(--border)",
                                color: "var(--muted-foreground)",
                                padding: "2px 6px",
                                borderRadius: 4,
                                width: 20,
                                textAlign: "center",
                                fontWeight: 600,
                              }}
                            >
                              {st.no}
                            </span>
                            <div>
                              <div
                                style={{
                                  fontSize: 13,
                                  fontWeight: 600,
                                  color: "var(--foreground)",
                                }}
                              >
                                {st.name}
                              </div>
                              <div style={{ fontSize: 11, color: "var(--muted-foreground)" }}>
                                {st.id}
                              </div>
                            </div>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                            }}
                          >
                            <span
                              style={{
                                fontSize: 11,
                                color: "var(--foreground)",
                                fontWeight: 600,
                              }}
                            >
                              {points} PT
                            </span>
                            <RankIcon rank={rank} size={16} />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero */}
        {(location.pathname === "/dashboard" || location.pathname === "/dashboard/") && (
          <div
            style={{
              background: "var(--background)",
              padding: "32px 20px",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <AnimCard delay={0.1}>
              <h1
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  flexWrap: "wrap",
                  gap: "8px",
                  margin: 0,
                  letterSpacing: "-0.5px",
                }}
              >
                <span style={{ color: "var(--muted-foreground)", fontSize: 24, fontWeight: 500 }}>
                  {getGreeting()},
                </span>
                <div
                  style={{
                    position: "relative",
                    display: "inline-block",
                    fontSize: 24,
                    fontWeight: 600,
                  }}
                >
                  <span
                    style={{
                      background: "linear-gradient(90deg, #3b82f6, #a855f7)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {tName}
                  </span>
                  <div
                    style={{
                      position: "absolute",
                      bottom: -2,
                      left: 0,
                      width: "100%",
                      height: 2,
                      background: "var(--border)",
                      overflow: "hidden",
                      borderRadius: 2,
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        background:
                          "linear-gradient(90deg, transparent, #3b82f6, transparent)",
                        animation: "flowX 2s linear infinite",
                      }}
                    />
                  </div>
                </div>
              </h1>
            </AnimCard>
          </div>
        )}

        <div style={{ height: 16 }} />

        {/* Dynamic Nested Content */}
        <Outlet context={{ livePulse }} />

        <div
          style={{
            textAlign: "center",
            padding: "32px 0",
            color: "var(--muted-foreground)",
            fontSize: 11,
            letterSpacing: "1px",
          }}
        >
          skroom226.site · M.2/6
        </div>
      </div>
    </div>
  );
}
