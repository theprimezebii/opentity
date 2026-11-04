"use client";

import { useActionState, useEffect, useState } from "react";
import { resetPassword } from "@/app/actions/password-reset";
import { FormMessage } from "@/components/ui/FormMessage";
import { FormSubmitButton } from "@/components/ui/FormSubmitButton";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

export function ResetPasswordForm() {
  const [state, formAction] = useActionState(resetPassword, null);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (state?.success) {
      const timer = setTimeout(() => { router.push("/dashboard"); router.refresh(); }, 1500);
      return () => clearTimeout(timer);
    }
  }, [state?.success, router]);

  return (
    <>
      <FormMessage error={state?.error} success={state?.success} />
      <form action={formAction} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">New password</label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              name="password" 
              type={showPassword ? "text" : "password"} 
              required 
              minLength={6} 
              placeholder="At least 6 characters" 
              className="w-full pl-11 pr-12 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition bg-white text-slate-900" 
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition p-1"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm new password</label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              name="confirm_password" 
              type={showConfirm ? "text" : "password"} 
              required 
              minLength={6} 
              placeholder="Re-enter password" 
              className="w-full pl-11 pr-12 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition bg-white text-slate-900" 
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition p-1"
              tabIndex={-1}
              aria-label={showConfirm ? "Hide password" : "Show password"}
            >
              {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>
        <FormSubmitButton loadingText="Updating..." className="w-full flex items-center justify-center gap-2 bg-orange-500 text-white py-3 rounded-lg font-bold hover:bg-orange-600 transition shadow-sm">
          Update Password
        </FormSubmitButton>
      </form>
    </>
  );
}
