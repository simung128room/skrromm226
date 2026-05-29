import React from "react";
import { Palette, Globe } from "lucide-react";
import { useSettings } from "../../contexts/SettingsContext";

export default function AppearanceSettings() {
  const { settings, updateSetting } = useSettings();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div
        style={{
          background: "#18181b",
          borderRadius: 16,
          border: "1px solid #27272a",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid #27272a",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "rgba(234, 179, 8, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Palette size={16} color="#eab308" />
          </div>
          <h2
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: "#fafafa",
              margin: 0,
            }}
          >
            รูปแบบสี (Theme)
          </h2>
        </div>
        <div style={{ padding: 20 }}>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
          >
            <div
              onClick={() => updateSetting("theme", "dark")}
              style={{
                border:
                  settings.theme === "dark"
                    ? "2px solid #3b82f6"
                    : "2px solid #27272a",
                background: "#09090b",
                borderRadius: 12,
                padding: 16,
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.2s",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  background: "#18181b",
                  borderRadius: 8,
                  margin: "0 auto 12px",
                  border: "1px solid #27272a",
                }}
              />
              <div style={{ color: "#fafafa", fontSize: 14, fontWeight: 500 }}>
                โหมดมืด (Dark)
              </div>
            </div>

            <div
              onClick={() => updateSetting("theme", "light")}
              style={{
                border:
                  settings.theme === "light"
                    ? "2px solid #3b82f6"
                    : "2px solid #27272a",
                background: "#fafafa",
                borderRadius: 12,
                padding: 16,
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.2s",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  background: "#e4e4e7",
                  borderRadius: 8,
                  margin: "0 auto 12px",
                  border: "1px solid #d4d4d8",
                }}
              />
              <div style={{ color: "#09090b", fontSize: 14, fontWeight: 500 }}>
                โหมดสว่าง (Light)
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          background: "#18181b",
          borderRadius: 16,
          border: "1px solid #27272a",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid #27272a",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "rgba(168, 85, 247, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Globe size={16} color="#a855f7" />
          </div>
          <h2
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: "#fafafa",
              margin: 0,
            }}
          >
            ภาษา (Language)
          </h2>
        </div>
        <div style={{ padding: 20 }}>
          <select
            value={settings.language}
            onChange={(e) =>
              updateSetting("language", e.target.value as "th" | "en")
            }
            style={{
              width: "100%",
              background: "#09090b",
              border: "1px solid #27272a",
              color: "#fafafa",
              padding: "12px 16px",
              borderRadius: 8,
              fontSize: 14,
              outline: "none",
            }}
          >
            <option value="th">ไทย (Thai)</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>
    </div>
  );
}
