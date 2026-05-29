import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

import { captureTelemetry } from "../utils/telemetry";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // In a real production app, this would send to Sentry, LogRocket, etc.
    console.error("Uncaught error:", error, errorInfo);
    // Simulating telemetry
    this.logErrorToTelemetry(error, errorInfo);
  }

  private logErrorToTelemetry(error: Error, errorInfo: ErrorInfo) {
    captureTelemetry("FATAL_CRASH", {
      errorMessage: error.message,
      stack: errorInfo.componentStack,
    });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#09090b",
            color: "#fafafa",
            padding: 24,
          }}
        >
          <div
            style={{
              background: "#18181b",
              padding: 32,
              borderRadius: 16,
              border: "1px solid #27272a",
              maxWidth: 480,
              width: "100%",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "rgba(239, 68, 68, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
              }}
            >
              <AlertTriangle size={32} color="#ef4444" />
            </div>
            <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>
              เกิดข้อผิดพลาดของระบบ
            </h1>
            <p
              style={{
                color: "#a1a1aa",
                fontSize: 14,
                marginBottom: 24,
                lineHeight: 1.6,
              }}
            >
              ระบบพบปัญหาที่ทำให้ไม่สามารถแสดงผลหน้านี้ได้
              เราได้บันทึกข้อผิดพลาดนี้ไว้สำหรับการตรวจสอบแล้ว
            </p>

            <div
              style={{
                background: "#000",
                padding: 12,
                borderRadius: 8,
                textAlign: "left",
                marginBottom: 24,
                overflow: "auto",
                maxHeight: 100,
              }}
            >
              <code style={{ fontSize: 12, color: "#fca5a5" }}>
                {this.state.error?.message || "Unknown Error"}
              </code>
            </div>

            <button
              onClick={this.handleReset}
              style={{
                background: "#fafafa",
                color: "#09090b",
                border: "none",
                padding: "12px 24px",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <RefreshCw size={16} />
              โหลดหน้าใหม่
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
