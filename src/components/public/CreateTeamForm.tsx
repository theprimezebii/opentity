"use client";

import { useActionState, useState, useEffect } from "react";
import { createTeam } from "@/app/actions/teams";
import { FormMessage } from "@/components/ui/FormMessage";
import { Plus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function CreateTeamForm() {
  const [state, formAction, isPending] = useActionState(createTeam, null);
  const [isDirty, setIsDirty] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) router.refresh();
  }, [state?.success, router]);

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><Plus className="w-5 h-5 text-orange-500" /> Create a Team</h2>
      <p className="text-sm text-slate-500 mb-4">Create a team to start inviting members and building squads.</p>

      <FormMessage error={state?.error} success={state?.success} />

      <form action={formAction} onChange={() => setIsDirty(true)} className="space-y-3">
        <input name="name" required placeholder="Team Name (e.g., The Builders)" className="w-full px-4 py-2 border rounded-lg" />
        <textarea name="description" placeholder="What are you building?" className="w-full px-4 py-2 border rounded-lg" rows={2}></textarea>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" name="looking_for_members" defaultChecked className="w-4 h-4 text-orange-500 rounded" />
          <span className="text-sm font-medium text-slate-700">We are looking for more members</span>
        </label>
        <button type="submit" disabled={!isDirty || isPending} className="px-6 py-2 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
          {isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</> : "Create Team"}
        </button>
      </form>
    </div>
  );
}
