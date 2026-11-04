"use client";

import { useActionState } from "react";
import { updateProfile } from "@/app/actions/profile";
import { PAKISTAN_CITIES } from "@/lib/constants";
import { Loader2, CheckCircle2 } from "lucide-react";

const inputClass = "w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand outline-none bg-white text-slate-900";

export function ProfileSettingsForm({ profile }: { profile: any }) {
  const [state, formAction, isPending] = useActionState(updateProfile, null);

  return (
    <form action={formAction} className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm space-y-6">
      {state?.error && <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm font-medium">{state.error}</div>}
      {state?.success && (
        <div className="p-4 bg-orange-50 text-orange-600 rounded-lg border border-orange-200 text-sm font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> {state.success}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
        <input type="email" disabled value={profile.email} className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed" />
        <p className="text-xs text-slate-400 mt-1">Email cannot be changed.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
        <input name="full_name" defaultValue={profile.full_name || ""} required className={inputClass} />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">University</label>
        <input name="university" defaultValue={profile.university || ""} placeholder="e.g., NUST, FAST, LUMS" className={inputClass} />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
        <select name="city" defaultValue={profile.city || ""} className={inputClass}>
          <option value="">Select City</option>
          {PAKISTAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="pt-2">
        <button type="submit" disabled={isPending} className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition disabled:opacity-70 flex items-center justify-center gap-2">
          {isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
