import { useState } from "react";
import { AnimCard } from "../components/Shared";
import { Camera, CheckSquare } from "lucide-react";
import { CustomPopup } from "../components/Popup";

export default function DutyView() {
  const [uploaded, setUploaded] = useState(false);

  return (
    <div style={{ padding: "0 14px 28px" }}>
      <AnimCard delay={0}>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:12}}>
              <div style={{width:16,height:2,background:"#3b82f6",borderRadius:2}}/>
              <span style={{color:"#64748b",fontSize:10,letterSpacing:2}}>ตารางเวร · 当番</span>
          </div>
      </AnimCard>
      
      <AnimCard delay={0.08} style={{marginBottom:16}}>
         <div className="stat-card" style={{ background:"#fff", borderRadius:14, padding: "24px", textAlign: "center", border:"1px dashed #93c5fd", cursor:"pointer" }} onClick={() => {
              if (uploaded) return;
              CustomPopup.fire({
                title: 'อัปโหลดรูปภาพ',
                text: "ยืนยันการส่งรูปภาพหลักฐานการทำเวร?",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#10b981',
                cancelButtonColor: '#64748b',
                confirmButtonText: 'ยืนยัน',
                cancelButtonText: 'ยกเลิก'
              }).then((result) => {
                if (result.isConfirmed) {
                  setUploaded(true);
                  CustomPopup.fire({
                    title: 'ส่งหลักฐานสำเร็จ!',
                    text: 'รอหัวหน้าห้องตรวจสอบเพื่อรับแต้ม',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                  });
                }
              })
            }}>
            {!uploaded ? (
               <>
                 <Camera size={32} color="#3b82f6" style={{ margin:"0 auto 12px" }} />
                 <div style={{ fontSize:14, fontWeight:700, color:"#1a2f5e" }}>คลิกเพื่ออัปโหลดรูปภาพ</div>
                 <div style={{ fontSize:10, color:"#64748b", marginTop:4 }}>รองรับไฟล์ JPG, PNG</div>
               </>
            ) : (
               <>
                 <CheckSquare size={32} color="#22c55e" style={{ margin:"0 auto 12px" }} />
                 <div style={{ fontSize:14, fontWeight:700, color:"#16a34a" }}>ส่งหลักฐานสำเร็จแล้ว!</div>
                 <div style={{ fontSize:10, color:"#64748b", marginTop:4 }}>รอแอดมินตรวจสอบเพื่อรับแต้ม</div>
               </>
            )}
         </div>
      </AnimCard>
      
      <AnimCard delay={0.16}>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:12}}>
              <div style={{width:16,height:2,background:"#3b82f6",borderRadius:2}}/>
              <span style={{color:"#64748b",fontSize:10,letterSpacing:2}}>ระดับความขยัน · レベル</span>
          </div>
      </AnimCard>
      
      {[
        {v:"V1 (มือใหม่)", desc:"ทำเวรครบ 1-5 ครั้ง", limit:"ไม่จำกัดคน", bg:"#f1f5f9", color:"#475569"},
        {v:"V2 (แรกเริ่ม)", desc:"ทำเวรครบ 6-15 ครั้ง", limit:"ไม่จำกัดคน", bg:"#dbeafe", color:"#2563eb"},
        {v:"V3 (เด็กขยัน)", desc:"ทำเวรครบ 15+ ครั้ง", limit:"จำกัด 30 คน", bg:"#f3e8ff", color:"#9333ea"},
      ].map((lvl,i)=>(
          <AnimCard key={i} delay={0.24 + i*0.08} style={{marginBottom:8}}>
              <div className="node-row" style={{background:"#fff",borderRadius:13,padding:"13px 15px",border:"1px solid rgba(219,234,254,0.9)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <div style={{display:"flex",alignItems:"center",gap:11}}>
                      <div style={{padding:"4px 8px",background:lvl.bg,color:lvl.color,borderRadius:6,fontSize:10,fontWeight:700}}>{lvl.v}</div>
                      <div>
                          <div style={{fontSize:12,fontWeight:700,color:"#1a2f5e"}}>{lvl.desc}</div>
                      </div>
                  </div>
                  <div style={{fontSize:10,color:"#94a3b8",fontFamily:"'Noto Serif JP',serif"}}>{lvl.limit}</div>
              </div>
          </AnimCard>
      ))}
    </div>
  )
}
