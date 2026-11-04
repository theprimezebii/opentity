"use client";

import { useActionState } from "react";
import { forgotPassword } from "@/app/actions/password-reset";
import { FormMessage } from "@/components/ui/FormMessage";
import { FormSubmitButton } from "@/components/ui/FormSubmitButton";
import { Mail, Send } from "lucide-react";

export function ForgotPasswordForm() {
  const [state, formAction] = useActionState(forgotPassword, null);

  return (
    <>
      <FormMessage error={state?.error} success={state?.success} autoHide={false} />
      <form action={formAction} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              name="email" 
              type="email" 
              required 
              placeholder="you@example.com"
              className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition bg-white text-slate-900" 
            />
          </div>
        </div>
        <FormSubmitButton 
          loadingText="Sending..."
          className="w-full flex items-center justify-center gap-2 bg-orange-500 text-white py-3 rounded-lg font-bold hover:bg-orange-600 transition shadow-sm"
        >
          <Send className="w-4 h-4" /> Send Reset Link
        </FormSubmitButton>
      </form>
    </>
  );
}
