import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, ArrowLeft } from "lucide-react";
import { CustomPopup } from "../components/Popup";
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
        icon: "error",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-dvh">
      <div className="flex flex-1 flex-col justify-center px-4 py-10 lg:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="sm:mx-auto sm:w-full sm:max-w-[400px] bg-card text-card-foreground shadow-sm rounded-xl border p-6 sm:p-8"
        >
          <div className="w-full flex flex-col items-center justify-center mb-8">
            <div className="size-12 rounded-xl bg-foreground text-background flex items-center justify-center mb-4 shadow-lg">
              <Lock size={24} />
            </div>
            <h2 className="text-balance text-center text-2xl font-semibold text-foreground">
              Admin Portal
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              Sign in to manage the system
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label
                htmlFor="username"
                className="text-sm font-medium text-foreground dark:text-foreground"
              >
                Username
              </Label>
              <Input
                type="text"
                id="username"
                name="username"
                autoComplete="username"
                placeholder="Username"
                className="mt-2"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-foreground dark:text-foreground"
                >
                  Password
                </Label>
              </div>
              <Input
                type="password"
                id="password"
                name="password"
                autoComplete="current-password"
                placeholder="Password"
                className="mt-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="flex justify-end mt-1">
                <span
                  className="text-foreground text-sm cursor-pointer hover:text-muted-foreground transition-colors"
                  onClick={() =>
                    CustomPopup.fire({
                      title: "ลืมรหัสผ่าน",
                      text: "กรุณาติดต่อผู้ดูแลระบบ",
                      icon: "info",
                    })
                  }
                >
                  ลืมรหัสผ่าน
                </span>
              </div>
            </div>
            <Button type="submit" className="mt-4 w-full py-2 font-medium">
              Sign In
            </Button>
            
            <div
              onClick={() => navigate("/dashboard")}
              className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
            >
              <ArrowLeft size={16} /> Back to dashboard
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
