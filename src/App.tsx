import React, { Suspense, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { PopupContainer } from "./components/Popup";

const Welcome = React.lazy(() => import("./pages/Welcome"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Overview = React.lazy(() => import("./pages/Overview"));
const ScheduleView = React.lazy(() => import("./pages/ScheduleView"));
const DutyView = React.lazy(() => import("./pages/DutyView"));
const FormsView = React.lazy(() => import("./pages/FormsView"));

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
        background: "#040d1f",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{
          position: "relative",
          display: "flex",
          fontWeight: 900,
          fontSize: "64px",
          fontFamily: "'Syne', sans-serif",
          letterSpacing: "-4px"
        }}>
          <span style={{ color: "#a855f7", zIndex: 2, transform: "translateX(4px)", textShadow: "0 4px 12px rgba(168,85,247,0.4)" }}>S</span>
          <span style={{ color: "#eab308", zIndex: 1, transform: "translateX(-4px)", textShadow: "0 4px 12px rgba(234,179,8,0.4)" }}>K</span>
        </div>
      </div>
    }>
      <Routes>
        <Route path="/" element={<Navigate to="/welcome" replace />} />
        <Route path="/welcome" element={<Welcome />} />
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
