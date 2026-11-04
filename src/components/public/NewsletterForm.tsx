"use client";

import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/actions/newsletter";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

export function NewsletterForm() {
  const [state, action, isPending] = useActionState(subscribeToNewsletter, null);

  if (state?.success) {
    return (
      <div className="flex items-center justify-center gap-2 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 font-semibold animate-in fade-in zoom-in-95">
        <CheckCircle2 className="w-5 h-5" />
        {state.success}
      </div>
    );
  }

  return (
    <div className="w-full">
      <form action={action} className="flex flex-col sm:flex-row gap-2 w-full">
        <input 
          type="email" 
          name="email"
          placeholder="Enter your email" 
          required
          className="flex-1 px-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 text-sm w-full transition" 
        />
        <button 
          type="submit" 
          disabled={isPending}
          className="px-8 py-3.5 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors text-sm w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Subscribe"}
          {!isPending && <ArrowRight className="w-4 h-4" />}
        </button>
      </form>
      {state?.error && (
        <p className="text-red-400 text-xs mt-2 text-left">{state.error}</p>
      )}
    </div>
  );
}
