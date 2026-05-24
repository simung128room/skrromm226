import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, XCircle, HelpCircle, X } from 'lucide-react';

export interface PopupOptions {
  id: string;
  title: string;
  text?: string;
  icon?: 'success' | 'warning' | 'error' | 'info' | 'question';
  showCancelButton?: boolean;
  confirmButtonColor?: string;
  cancelButtonColor?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  timer?: number;
  showConfirmButton?: boolean;
  resolve: (value: {isConfirmed: boolean}) => void;
}

class PopupManager {
  listeners: ((popups: PopupOptions[]) => void)[] = [];
  popups: PopupOptions[] = [];
  idCounter = 0;

  subscribe(listener: (popups: PopupOptions[]) => void) {
    this.listeners.push(listener);
    listener(this.popups);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(l => l([...this.popups]));
  }

  fire(options: Omit<PopupOptions, 'id' | 'resolve'>): Promise<{isConfirmed: boolean}> {
    return new Promise((resolve) => {
       const id = String(this.idCounter++);
       const popup: PopupOptions = {
          ...options,
          id,
          resolve: (val) => {
             this.popups = this.popups.filter(p => p.id !== id);
             this.notify();
             resolve(val);
          }
       };
       this.popups.push(popup);
       this.notify();
       
       if (options.timer) {
          setTimeout(() => {
             if (this.popups.find(p => p.id === id)) {
                 popup.resolve({isConfirmed: false});
             }
          }, options.timer);
       }
    });
  }
}

export const CustomPopup = new PopupManager();

export function PopupContainer() {
  const [popups, setPopups] = useState<PopupOptions[]>([]);

  useEffect(() => {
    return CustomPopup.subscribe(setPopups);
  }, []);

  return (
    <div style={{ position: 'fixed', top: 24, right: 24, zIndex: 999999, display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-end', pointerEvents: 'none' }}>
      <AnimatePresence>
        {popups.map(p => (
           <PopupItem key={p.id} popup={p} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function PopupItem({ popup }: { popup: PopupOptions }) {
   const getIcon = () => {
      switch(popup.icon) {
         case 'success': return <div style={{width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(16,185,129,0.05))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981'}}><CheckCircle2 size={18} /></div>;
         case 'warning': return <div style={{width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(245,158,11,0.05))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b'}}><AlertCircle size={18} /></div>;
         case 'error': return <div style={{width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg, rgba(239,68,68,0.2), rgba(239,68,68,0.05))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444'}}><XCircle size={18} /></div>;
         case 'question': return <div style={{width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(59,130,246,0.05))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6'}}><HelpCircle size={18} /></div>;
         default: return <div style={{width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg, rgba(148,163,184,0.2), rgba(148,163,184,0.05))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1'}}><Info size={18} /></div>;
      }
   }

   const hasButtons = popup.showCancelButton || !!popup.confirmButtonText || (popup.showConfirmButton !== false && popup.icon && popup.icon !== 'success'); 
   // Success usually auto closes or doesn't need explicit OK button if it's a timer

   return (
      <motion.div
        initial={{ opacity: 0, x: 50, scale: 0.95, filter: 'blur(4px)' }}
        animate={{ opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' }}
        exit={{ opacity: 0, x: 20, scale: 0.98, filter: 'blur(2px)' }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        style={{
           width: 340,
           background: 'rgba(10, 13, 18, 0.75)',
           backdropFilter: 'blur(24px)',
           border: '1px solid rgba(255,255,255,0.08)',
           borderRadius: 16,
           padding: '16px',
           boxShadow: '0 20px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
           pointerEvents: 'auto',
           display: 'flex',
           flexDirection: 'column',
           gap: 12,
           overflow: 'hidden',
           position: 'relative'
        }}
      >
         <div style={{ position: 'absolute', top: -50, right: -50, width: 100, height: 100, background: popup.icon === 'success' ? '#10b981' : popup.icon === 'error' ? '#ef4444' : popup.icon === 'warning' ? '#f59e0b' : '#3b82f6', opacity: 0.15, filter: 'blur(30px)', borderRadius: '50%', pointerEvents: 'none' }} />
         
         <div style={{ display: 'flex', gap: 14 }}>
            {getIcon()}
            <div style={{ flex: 1, paddingTop: 4 }}>
               <h3 style={{ margin: 0, color: '#fff', fontSize: 14, fontWeight: 700 }}>{popup.title}</h3>
               {popup.text && <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: 13, lineHeight: 1.4 }}>{popup.text}</p>}
            </div>
            {!hasButtons && (
               <button onClick={() => popup.resolve({isConfirmed: false})} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: 4, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <X size={16} />
               </button>
            )}
         </div>
         
         {hasButtons && (
            <div style={{ display: 'flex', gap: 8, marginTop: 4, justifyContent: 'flex-end' }}>
               {popup.showCancelButton && (
                  <button 
                     onClick={() => popup.resolve({isConfirmed: false})}
                     style={{
                        padding: '8px 14px',
                        background: 'rgba(255,255,255,0.05)',
                        border: 'none',
                        borderRadius: 8,
                        color: typeof popup.cancelButtonColor === 'string' && popup.cancelButtonColor !== '#3b82f6' ? '#fff' : '#cbd5e1', 
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                     }}>
                     {popup.cancelButtonText || 'ยกเลิก'}
                  </button>
               )}
               {popup.showConfirmButton !== false && (
                  <button 
                     onClick={() => popup.resolve({isConfirmed: true})}
                     style={{
                        padding: '8px 14px',
                        background: popup.confirmButtonColor || '#3b82f6',
                        border: 'none',
                        borderRadius: 8,
                        color: '#fff',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                        boxShadow: `0 4px 12px ${popup.confirmButtonColor ? popup.confirmButtonColor + '40' : 'rgba(59,130,246,0.3)'}`,
                        transition: 'background 0.2s, transform 0.1s'
                     }}>
                     {popup.confirmButtonText || 'ตกลง'}
                  </button>
               )}
            </div>
         )}
      </motion.div>
   )
}
