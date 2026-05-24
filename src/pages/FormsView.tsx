import { useState } from "react";
import { AnimCard } from "../components/Shared";
import { AlertTriangle, MessageSquare } from "lucide-react";
import { CustomPopup } from "../components/Popup";

export default function FormsView() {
  const [formType, setFormType] = useState('report');

  return (
    <div style={{padding:"0 14px 28px"}}>
        <AnimCard delay={0}>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:12}}>
                <div style={{width:16,height:2,background:"#3b82f6",borderRadius:2}}/>
                <span style={{color:"#64748b",fontSize:10,letterSpacing:2}}>ศูนย์รับเรื่อง · 報告</span>
            </div>
        </AnimCard>
        
        <AnimCard delay={0.05}>
          <div style={{display:"flex",gap:8,marginBottom:16}}>
             <button onClick={()=>setFormType('report')} style={{flex:1,padding:"10px",borderRadius:10,border:`1px solid ${formType==='report'?"#fecaca":"rgba(219,234,254,0.9)"}`,background:formType==='report'?"#fef2f2":"#fff",color:formType==='report'?"#ef4444":"#94a3b8",fontWeight:600,fontSize:12,display:"flex",alignItems:"center",justifyContent:"center",gap:6,transition:"all 0.2s"}}><AlertTriangle size={14}/> แจ้งปัญหา</button>
             <button onClick={()=>setFormType('suggest')} style={{flex:1,padding:"10px",borderRadius:10,border:`1px solid ${formType==='suggest'?"#bfdbfe":"rgba(219,234,254,0.9)"}`,background:formType==='suggest'?"#eff6ff":"#fff",color:formType==='suggest'?"#3b82f6":"#94a3b8",fontWeight:600,fontSize:12,display:"flex",alignItems:"center",justifyContent:"center",gap:6,transition:"all 0.2s"}}><MessageSquare size={14}/> เสนอแนะ</button>
          </div>
        </AnimCard>

        <AnimCard delay={0.1}>
            <div className="stat-card" style={{background:"#fff",borderRadius:14,padding:"18px 15px",border:"1px solid rgba(219,234,254,0.9)",boxShadow:"0 1px 8px rgba(26,47,94,0.05)"}}>
               <div style={{fontSize:12,fontWeight:700,color:"#1a2f5e",marginBottom:12}}>
                  {formType === 'report' ? "ฟอร์มแจ้งพฤติกรรม" : "ฟอร์มเสนอแนะฟีเจอร์"}
               </div>
               
               <input type="text" placeholder={formType === 'report' ? "ชื่อผู้ถูกร้องเรียน..." : "หัวข้อข้อเสนอแนะ..."} style={{width:"100%",padding:"12px 14px",borderRadius:10,border:"1px solid #e2e8f0",background:"#f8fafc",marginBottom:12,fontSize:13,fontFamily:"'Sarabun',serif",outline:"none",color:"#1a2f5e"}} />
               
               <textarea rows={4} placeholder="รายละเอียดเพิ่มเติม..." style={{width:"100%",padding:"12px 14px",borderRadius:10,border:"1px solid #e2e8f0",background:"#f8fafc",marginBottom:16,fontSize:13,fontFamily:"'Sarabun',serif",outline:"none",color:"#1a2f5e",resize:"none"}} />

               <button 
                onClick={() => {
                  CustomPopup.fire({
                    title: formType === 'report' ? 'ส่งรายงานสำเร็จ' : 'ขอบคุณสำหรับข้อเสนอแนะ!',
                    text: formType === 'report' ? 'ข้อมูลถูกส่งไปยังแอดมินแล้ว ขอบคุณที่ช่วยดูแลห้องเรียน' : 'เราจะนำไอเดียของคุณไปพิจารณาพัฒนาเว็บต่อไป',
                    icon: 'success',
                    confirmButtonColor: formType === 'report' ? '#dc2626' : '#2563eb'
                  });
                }}
                style={{width:"100%",padding:"12px",borderRadius:10,background:formType==='report'?"#ef4444":"#3b82f6",color:"#fff",border:"none",fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"'Sarabun',serif",display:"flex",alignItems:"center",justifyContent:"center",gap:8,boxShadow:formType==='report'?"0 4px 12px rgba(239,68,68,0.3)":"0 4px 12px rgba(59,130,246,0.3)"}}>
                  ส่งข้อความ
               </button>
            </div>
        </AnimCard>
    </div>
  )
}
