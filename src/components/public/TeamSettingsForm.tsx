"use client";

import { useState, useActionState, useEffect, useTransition } from "react";
import { updateTeam } from "@/app/actions/teams";
import { checkTeamSlugAvailability } from "@/app/actions/team-slug-check";
import { FormMessage } from "@/components/ui/FormMessage";
import { Save, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { TeamLogoUploader } from "./TeamLogoUploader";
import { useRouter } from "next/navigation";

export function TeamSettingsForm({ team, userId }: { team: any, userId: string }) {
  const [state, formAction, isPending] = useActionState(
    (prev: any, fd: FormData) => updateTeam(team.id, prev, fd),
    null
  );
  const [isDirty, setIsDirty] = useState(false);
  const [slug, setSlug] = useState(team.slug);
  const [slugStatus, setSlugStatus] = useState<{ available: boolean, message: string } | null>(null);
  const [isCheckingSlug, startSlugCheck] = useTransition();
  const [isChecking, setIsChecking] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      setIsDirty(false);
      setSlugStatus(null);
      router.refresh();
    }
  }, [state?.success, router]);

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "");
    e.target.value = cleaned;
    setSlug(cleaned);
    setIsDirty(true);

    if (cleaned === team.slug) { setSlugStatus(null); return; }
    if (cleaned.length < 3) { setSlugStatus(null); return; }

    setIsChecking(true);
    startSlugCheck(async () => {
      const result = await checkTeamSlugAvailability(cleaned, team.id);
      setSlugStatus(result);
      setIsChecking(false);
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <h2 className="font-bold text-lg mb-4 flex items-center gap-2">Team Settings</h2>

      <FormMessage error={state?.error} success={state?.success} />

      <form action={formAction} onChange={() => setIsDirty(true)} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-6">
          <TeamLogoUploader name="logo_url" userId={userId} defaultValue={team.logo_url} />
          
          <div className="space-y-3 flex-grow">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Team Name</label>
              <input name="name" defaultValue={team.name} required className="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Team ID</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">@</span>
                <input 
                  name="slug" 
                  defaultValue={team.slug} 
                  onChange={handleSlugChange}
                  maxLength={30}
                  required 
                  className={`w-full pl-7 pr-10 py-2 border rounded-lg text-sm ${
                    slugStatus 
                      ? (slugStatus.available ? 'border-green-400 focus:ring-orange-400' : 'border-red-400 focus:ring-red-500') 
                      : ''
                  }`} 
                />
                {(isChecking || isCheckingSlug) && (
                  <Loader2 className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 animate-spin" />
                )}
                {!isChecking && !isCheckingSlug && slugStatus && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2">
                    {slugStatus.available ? <CheckCircle2 className="w-4 h-4 text-orange-400" /> : <XCircle className="w-4 h-4 text-red-500" />}
                  </span>
                )}
              </div>
              <p className={`text-[10px] mt-1 font-medium ${
                slugStatus 
                  ? (slugStatus.available ? 'text-orange-500' : 'text-red-600') 
                  : 'text-slate-400'
              }`}>
                {slugStatus ? slugStatus.message : "Unique ID for your team. Lowercase, numbers, underscores."}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Description</label>
              <textarea name="description" defaultValue={team.description} className="w-full px-3 py-2 border rounded-lg text-sm" rows={2} />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="looking_for_members" defaultChecked={team.looking_for_members} className="w-4 h-4 text-orange-500 rounded" />
              <span className="text-sm font-medium text-slate-700">Looking for members</span>
            </label>
          </div>
        </div>
        
        <div className="flex justify-end gap-3 pt-2">
          <button 
            type="submit" 
            disabled={!isDirty || isPending || (slugStatus !== null && !slugStatus.available)} 
            className="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save Changes</>}
          </button>
        </div>
      </form>
    </div>
  );
}
