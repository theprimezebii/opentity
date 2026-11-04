"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, X } from "lucide-react";

interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'error';
}

export function GlobalToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handleToast = (e: Event) => {
      const customEvent = e as CustomEvent;
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const newToast: ToastItem = { id, ...customEvent.detail };
      
      // Add the new toast at the top, keep max 5 visible
      setToasts((prev) => [newToast, ...prev].slice(0, 5));

      // Auto-dismiss after 4s
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    };

    window.addEventListener("trigger-toast", handleToast);
    return () => window.removeEventListener("trigger-toast", handleToast);
  }, []);

  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] flex flex-col gap-2 items-center w-full max-w-md px-4 pointer-events-none">
      {toasts.map((toast) => (
        <div 
          key={toast.id}
          className={`pointer-events-auto w-full flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border animate-in slide-in-from-top-3 fade-in duration-300 ${
            toast.type === 'success' 
              ? 'bg-orange-50 border-orange-200 text-emerald-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          {toast.type === 'success' 
            ? <CheckCircle2 className="w-5 h-5 text-orange-400 flex-shrink-0" /> 
            : <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />}
          <p className="font-semibold text-sm flex-grow">{toast.message}</p>
          <button 
            onClick={() => dismiss(toast.id)} 
            className="flex-shrink-0 opacity-40 hover:opacity-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

// Helper - works from anywhere, no import of component needed
export function showToast(message: string, type: 'success' | 'error' = 'success') {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('trigger-toast', { detail: { message, type } }));
  }
}
