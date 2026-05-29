import React from "react";
import { Outlet, Navigate, NavLink } from "react-router-dom";
import { useSettings } from "../../contexts/SettingsContext";
import {
  Shield,
  Bell,
  Palette,
  Database,
  User,
  Lock,
  ArrowLeft,
  AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function SettingsLayout() {
  const { isOfflineMode } = useSettings();
  const tabs = [
    {
      id: "account",
      label: "บัญชีและความปลอดภัย",
      icon: User,
      path: "/dashboard/settings/account",
    },
    {
      id: "appearance",
      label: "การแสดงผล",
      icon: Palette,
      path: "/dashboard/settings/appearance",
    },
    {
      id: "notifications",
      label: "การแจ้งเตือน",
      icon: Bell,
      path: "/dashboard/settings/notifications",
    },
    {
      id: "storage",
      label: "ข้อมูลและการจัดเก็บ",
      icon: Database,
      path: "/dashboard/settings/storage",
    },
  ];

  return (
    <div style={{ padding: "0 16px" }}>
      {isOfflineMode && (
        <div
          style={{
            background: "rgba(245, 158, 11, 0.1)",
            border: "1px solid rgba(245, 158, 11, 0.2)",
            borderRadius: 12,
            padding: "12px 16px",
            marginBottom: 20,
            display: "flex",
            gap: 12,
            alignItems: "center",
          }}
        >
          <AlertTriangle size={20} color="#f59e0b" />
          <div style={{ color: "#f59e0b", fontSize: 13, lineHeight: 1.5 }}>
            <b>โหมดออฟไลน์ (Safe Mode):</b> ระบบกำลังทำงานบนข้อมูลออฟไลน์
            การบันทึกบางอย่างจะถูกจัดคิวไว้เพื่อซิงค์ภายหลัง
          </div>
        </div>
      )}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            background: "#18181b",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid #27272a",
          }}
        >
          <Shield size={20} color="#3b82f6" />
        </div>
        <div>
          <h1
            style={{
              color: "#fafafa",
              fontSize: 20,
              fontWeight: 600,
              margin: 0,
              letterSpacing: "-0.5px",
            }}
          >
            การตั้งค่าระบบ
          </h1>
          <div style={{ color: "#a1a1aa", fontSize: 13, marginTop: 2 }}>
            จัดการข้อมูล บัญชี และการแสดงผล
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: 8,
          overflowX: "auto",
          paddingBottom: 12,
          marginBottom: 16,
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
        className="settings-nav"
      >
        {tabs.map((tab) => (
          <NavLink
            key={tab.id}
            to={tab.path}
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 16px",
              borderRadius: 20,
              background: isActive ? "#fafafa" : "#18181b",
              color: isActive ? "#09090b" : "#a1a1aa",
              fontSize: 14,
              fontWeight: 500,
              textDecoration: "none",
              border: isActive ? "1px solid #fafafa" : "1px solid #27272a",
              whiteSpace: "nowrap",
              transition: "all 0.2s",
            })}
          >
            <tab.icon size={16} />
            {tab.label}
          </NavLink>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
