import React, { Suspense, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { PopupContainer } from "./components/Popup";
import { Loader2 } from "lucide-react";
import { Toaster } from "sonner";
import { SettingsProvider } from "./contexts/SettingsContext";
import { ErrorBoundary } from "./components/ErrorBoundary";

const Welcome = React.lazy(() => import("./pages/Welcome"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Overview = React.lazy(() => import("./pages/Overview"));
const ScheduleView = React.lazy(() => import("./pages/ScheduleView"));
const DutyView = React.lazy(() => import("./pages/DutyView"));
const FormsView = React.lazy(() => import("./pages/FormsView"));
const AssignmentsView = React.lazy(() => import("./pages/AssignmentsView"));
const AdminLogin = React.lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = React.lazy(() => import("./pages/AdminDashboard"));
const Terms = React.lazy(() => import("./pages/Terms"));

const SettingsLayout = React.lazy(
  () => import("./pages/settings/SettingsLayout"),
);
const AccountSettings = React.lazy(
  () => import("./pages/settings/AccountSettings"),
);
const AppearanceSettings = React.lazy(
  () => import("./pages/settings/AppearanceSettings"),
);
const NotificationSettings = React.lazy(
  () => import("./pages/settings/NotificationSettings"),
);
const StorageSettings = React.lazy(
  () => import("./pages/settings/StorageSettings"),
);

const FONT_URL =
  "https://fonts.googleapis.com/css2?family=Prompt:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap";

export default function App() {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = FONT_URL;
    document.head.appendChild(link);
  }, []);

  return (
    <ErrorBoundary>
      <SettingsProvider>
        <PopupContainer />
        <Toaster
          position="bottom-center"
          toastOptions={{
            duration: 3000,
          }}
        />
        <Suspense
          fallback={
            <div
              style={{
                height: "100vh",
                width: "100%",
                background: "var(--background)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--foreground)",
              }}
            >
              <Loader2 size={32} className="animate-spin text-muted-foreground" />
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Navigate to="/welcome" replace />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/dashboard" element={<Dashboard />}>
              <Route index element={<Overview />} />
              <Route path="schedule" element={<ScheduleView />} />
              <Route path="assignments" element={<AssignmentsView />} />
              <Route path="duty" element={<DutyView />} />
              <Route path="forms" element={<FormsView />} />
              <Route path="settings" element={<SettingsLayout />}>
                <Route index element={<Navigate to="account" replace />} />
                <Route path="account" element={<AccountSettings />} />
                <Route path="appearance" element={<AppearanceSettings />} />
                <Route
                  path="notifications"
                  element={<NotificationSettings />}
                />
                <Route path="storage" element={<StorageSettings />} />
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </SettingsProvider>
    </ErrorBoundary>
  );
}
