import React, { Suspense, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { PopupContainer } from "./components/Popup";
import { Loader2 } from "lucide-react";

const Welcome = React.lazy(() => import("./pages/Welcome"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Overview = React.lazy(() => import("./pages/Overview"));
const ScheduleView = React.lazy(() => import("./pages/ScheduleView"));
const DutyView = React.lazy(() => import("./pages/DutyView"));
const FormsView = React.lazy(() => import("./pages/FormsView"));
const AdminLogin = React.lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = React.lazy(() => import("./pages/AdminDashboard"));

const FONT_URL = "https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&family=Noto+Serif+JP:wght@300;400;600&display=swap";

export default function App() {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet"; link.href = FONT_URL;
    document.head.appendChild(link);
  }, []);

  return (
    <>
    <PopupContainer />
    <Suspense fallback={
      <div style={{
        height: "100vh", 
        width: "100%",
        background: "#09090b",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#fafafa"
      }}>
        <Loader2 size={32} color="#a1a1aa" className="animate-spin" />
      </div>
    }>
      <Routes>
        <Route path="/" element={<Navigate to="/welcome" replace />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Overview />} />
          <Route path="schedule" element={<ScheduleView />} />
          <Route path="duty" element={<DutyView />} />
          <Route path="forms" element={<FormsView />} />
        </Route>
      </Routes>
    </Suspense>
    </>
  );
}
