import { useState } from "react";
import { AnimCard } from "../components/Shared";
import { UploadCloud, CheckCircle2, FileText, ImageIcon, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function AssignmentsView() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleUpload = () => {
    if (!file) return;
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setFile(null);
      }, 3000);
    }, 1500);
  };

  return (
    <div style={{ padding: "0 16px 24px" }}>
      <AnimCard delay={0}>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: "var(--foreground)", marginBottom: 8 }}>ส่งงาน</h2>
          <p style={{ fontSize: 14, color: "var(--muted-foreground)" }}>ระบบส่งงานที่ง่าย รวดเร็ว และรองรับการใช้งานบนมือถือ</p>
        </div>

        <div 
          style={{
            background: "var(--card)",
            border: "2px dashed var(--border)",
            borderRadius: 16,
            padding: "40px 20px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            position: "relative",
            overflow: "hidden",
            cursor: "pointer",
            transition: "all 0.2s"
          }}
          onClick={() => {
            if (!file && !isUploading && !isSuccess) {
               document.getElementById("file-upload")?.click();
            }
          }}
        >
          <input 
            type="file" 
            id="file-upload" 
            style={{ display: 'none' }} 
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setFile(e.target.files[0]);
              }
            }}
          />

          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                key="success"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}
              >
                <div style={{ width: 80, height: 80, borderRadius: 40, background: "rgba(34, 197, 94, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <CheckCircle2 size={40} color="#22c55e" />
                </div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 600, color: "var(--foreground)" }}>ส่งงานเรียบร้อย!</div>
                  <div style={{ fontSize: 14, color: "var(--muted-foreground)" }}>ครูผู้สอนได้รับงานของคุณแล้ว</div>
                </div>
              </motion.div>
            ) : isUploading ? (
              <motion.div
                key="uploading"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}
              >
                <Loader2 size={40} className="animate-spin text-primary" />
                <div style={{ fontSize: 16, fontWeight: 500, color: "var(--foreground)" }}>กำลังอัพโหลดไฟล์...</div>
              </motion.div>
            ) : file ? (
              <motion.div
                key="file"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, width: "100%" }}
              >
                 <div style={{ 
                   display: "flex", 
                   alignItems: "center", 
                   gap: 16, 
                   background: "var(--muted)", 
                   padding: "16px 20px", 
                   borderRadius: 16,
                   width: "100%",
                   maxWidth: 320,
                   position: "relative"
                 }}>
                    {file.type.includes('image') ? <ImageIcon size={28} className="text-primary" /> : <FileText size={28} className="text-primary" />}
                    <div style={{ flex: 1, overflow: "hidden", textAlign: "left" }}>
                       <div style={{ fontSize: 15, fontWeight: 500, color: "var(--foreground)", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>{file.name}</div>
                       <div style={{ fontSize: 13, color: "var(--muted-foreground)" }}>{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setFile(null); }}
                      style={{ background: "var(--background)", border: "1px solid var(--border)", cursor: "pointer", padding: 6, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                       <X size={16} className="text-muted-foreground" />
                    </button>
                 </div>

                 <button
                    onClick={(e) => { e.stopPropagation(); handleUpload(); }}
                    style={{
                      background: "var(--primary)",
                      color: "var(--primary-foreground)",
                      border: "none",
                      padding: "16px 32px",
                      borderRadius: 14,
                      fontSize: 16,
                      fontWeight: 600,
                      cursor: "pointer",
                      width: "100%",
                      maxWidth: 320,
                      boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
                      transition: "transform 0.1s"
                    }}
                 >
                   ยืนยันการส่งงาน
                 </button>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}
              >
                <div style={{ width: 80, height: 80, borderRadius: 40, background: "var(--muted)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
                  <UploadCloud size={40} className="text-muted-foreground" />
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "var(--foreground)" }}>แตะเพื่อเลือกไฟล์ หรือ ถ่ายรูป</div>
                  <div style={{ fontSize: 13, color: "var(--muted-foreground)", marginTop: 6 }}>รองรับไฟล์ภาพ และเอกสารทั่วไป</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </AnimCard>
    </div>
  );
}
