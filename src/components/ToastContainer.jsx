import { useEffect, useState } from 'react';
import toastService from '../utils/toast';

const typeStyles = {
  success: 'bg-green-600',
  error: 'bg-red-600',
  warning: 'bg-yellow-600',
  info: 'bg-gray-800',
};

export default function ToastContainer(){
  const [toasts, setToasts] = useState([]);

  useEffect(()=>{
    const unsub = toastService.subscribe((ev)=>{
      if (ev.action === 'add') setToasts((t)=>[...t, ev.toast]);
      else if (ev.action === 'remove') setToasts((t)=>t.filter(x=>x.id !== ev.id));
    });
    return unsub;
  },[]);

  useEffect(()=>{
    const timers = toasts.map((t)=>{
      const id = setTimeout(()=>{
        setToasts((cur)=>cur.filter(x=>x.id !== t.id));
      }, t.duration);
      return () => clearTimeout(id);
    });
    return ()=>timers.forEach((c)=>c && c());
  },[toasts]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 items-end">
      {toasts.map((t)=>(
        <div key={t.id} className={`max-w-sm w-full text-white px-4 py-3 rounded shadow-lg flex items-start gap-3 ${typeStyles[t.type] || typeStyles.info}`}>
          <div className="flex-1">
            <div className="font-semibold">{t.type === 'success' ? 'Success' : t.type === 'error' ? 'Error' : t.type === 'warning' ? 'Warning' : 'Notice'}</div>
            <div className="text-sm mt-1">{t.message}</div>
          </div>
          <button aria-label="dismiss" onClick={()=>{ setToasts((cur)=>cur.filter(x=>x.id!==t.id)); toastService.dismiss(t.id); }} className="text-white opacity-90 hover:opacity-100">✕</button>
        </div>
      ))}
    </div>
  );
}
