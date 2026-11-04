"use client";

import { useRef, useEffect, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export function FormMessage({ 
  error, 
  success, 
  autoHide = true,
  clearUrl = false 
}: { 
  error?: string | null; 
  success?: string | null; 
  autoHide?: boolean;
  clearUrl?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [showSuccess, setShowSuccess] = useState(!!success);
  const router = useRouter();
  const pathname = usePathname();

  // Scroll to message when it appears
  useEffect(() => {
    if (error || success) {
      setTimeout(() => {
        ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 50);
    }
  }, [error, success]);

  // Auto-hide success + clear URL
  useEffect(() => {
    if (success) {
      setShowSuccess(true);
      if (clearUrl) router.replace(pathname, { scroll: false });
      if (autoHide) {
        const timer = setTimeout(() => setShowSuccess(false), 5000);
        return () => clearTimeout(timer);
      }
    }
  }, [success, autoHide, clearUrl, router, pathname]);

  if (error) {
    return (
      <div ref={ref} className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm font-medium flex items-center gap-2 scroll-mt-24">
        <XCircle className="w-5 h-5 flex-shrink-0" />
        <span>{error}</span>
      </div>
    );
  }

  if (success && showSuccess) {
    return (
      <div ref={ref} className="mb-4 p-4 bg-orange-50 text-orange-600 rounded-lg border border-orange-200 text-sm font-medium flex items-center gap-2 scroll-mt-24">
        <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
        <span>{success}</span>
      </div>
    );
  }

  return null;
}
