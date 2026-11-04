import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { getUserBadges } from "@/lib/badges";
import { Award, Lock, CheckCircle2 } from "lucide-react";

export const metadata = { title: "My Badges" };
export const instant = false;

async function BadgesContent() {
  await connection();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  const { data: savedRelations } = await supabase.from("saved_events").select("event_id, events(*)").eq("user_id", user.id);
  const savedEvents = savedRelations?.map(r => r.events).filter(Boolean) || [];
  const { count: submissionCount } = await supabase.from("event_submissions").select("*", { count: "exact", head: true }).eq("submitter_email", profile?.email || "");
  const { count: referralCount } = await supabase.from("profiles").select("*", { count: "exact", head: true }).eq("referred_by", user.id);

  const badges = getUserBadges(profile, savedEvents, submissionCount || 0, referralCount || 0);
  const unlockedCount = badges.filter(b => b.unlocked).length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">My Badges</h1>
        <p className="text-slate-500 dark:text-slate-400">You have unlocked <span className="font-bold text-orange-500">{unlockedCount}</span> out of {badges.length} badges.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {badges.map((badge) => (
          <div key={badge.id} className={`relative bg-white dark:bg-slate-900 rounded-2xl p-6 border shadow-sm flex flex-col items-center text-center transition-all duration-300 ${badge.unlocked ? "border-slate-200 dark:border-slate-800 hover:shadow-md" : "border-slate-100 dark:border-slate-800/50 opacity-60 grayscale"}`}>
            {badge.unlocked && (
              <div className="absolute top-3 right-3 text-emerald-500">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            )}
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${badge.unlocked ? badge.bgColor : "bg-slate-100 dark:bg-slate-800 text-slate-400"}`}>
              <Award className={`w-8 h-8 ${badge.unlocked ? badge.color : "text-slate-400"}`} />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">{badge.title}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{badge.description}</p>
            
            {!badge.unlocked && (
              <div className="mt-3 flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded">
                <Lock className="w-3 h-3" /> Locked
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BadgesPage() {
  return (
    <Suspense fallback={<div className="max-w-6xl mx-auto p-12 animate-pulse"><div className="h-10 w-48 bg-slate-200 dark:bg-slate-800 rounded mb-8"></div><div className="grid grid-cols-2 md:grid-cols-4 gap-4"><div className="h-40 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div><div className="h-40 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div><div className="h-40 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div><div className="h-40 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div></div></div>}>
      <BadgesContent />
    </Suspense>
  );
}
