import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, Shield, Flame } from "lucide-react";
import { LeaderboardCard } from "@/components/public/LeaderboardCard";
import { ActivityFeed } from "@/components/public/ActivityFeed";

export const metadata = { title: "Community" };
export const instant = false;

const LEAGUES = [
  { id: "bronze", name: "Bronze", color: "text-amber-600 bg-amber-50 border-amber-200" },
  { id: "silver", name: "Silver", color: "text-slate-600 bg-slate-100 border-slate-300" },
  { id: "gold", name: "Gold", color: "text-yellow-700 bg-yellow-50 border-yellow-300" },
  { id: "diamond", name: "Diamond", color: "text-cyan-700 bg-cyan-50 border-cyan-300" },
  { id: "master", name: "Master", color: "text-orange-600 bg-orange-50 border-violet-300" },
];

async function CommunityContent() {
  await connection();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("league").eq("id", user.id).single();
  const myLeague = profile?.league || "bronze";
  const leagueInfo = LEAGUES.find(l => l.id === myLeague) || LEAGUES[0];

  // Fetch the real users in the cohort
  const { data: realUsers, error } = await supabase.rpc("get_cohort_leaderboard", { p_user_id: user.id });
  
  if (error) {
    console.error("Leaderboard Error:", error);
  }

  const myRank = realUsers?.find((u: any) => u.user_id === user.id)?.rank || null;
  
  // If we have 5 real users, group is full. Otherwise, it's a group of 10 (including bots).
  const realCount = realUsers?.length || 0;
  const displayCohortSize = realCount > 5 ? realCount : 10;

  // Monthly
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  const { data: monthlyAwards } = await supabase.from("badge_awards").select("user_id").gte("earned_at", startOfMonth.toISOString());
  const badgeCounts: Record<string, number> = {};
  monthlyAwards?.forEach(a => { badgeCounts[a.user_id] = (badgeCounts[a.user_id] || 0) + 1; });
  const topMonthlyIds = Object.entries(badgeCounts).sort(([, a], [, b]) => b - a).slice(0, 3).map(([id]) => id);

  let monthlyTop3: any[] = [];
  if (topMonthlyIds.length > 0) {
    const { data: profiles } = await supabase.from("profiles").select("id, full_name, email").in("id", topMonthlyIds);
    monthlyTop3 = topMonthlyIds.map(id => {
      const p = profiles?.find(pr => pr.id === id);
      return { ...p, badge_count: badgeCounts[id] };
    }).filter(Boolean);
  }

  // Milestone Feed
  const { data: rawMilestones } = await supabase
    .from("badge_awards")
    .select("badge_id, earned_at, profiles(id, full_name, email, created_at)")
    .order("earned_at", { ascending: false })
    .limit(30);

  const uniqueMilestones: any[] = [];
  const seenUsers = new Set();
  if (rawMilestones) {
    for (const m of rawMilestones) {
      const profileInfo = m.profiles as any;
      if (!profileInfo || seenUsers.has(profileInfo.id)) continue;
      uniqueMilestones.push({ ...m, ...profileInfo });
      seenUsers.add(profileInfo.id);
      if (uniqueMilestones.length === 5) break;
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      <div>
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-4 transition">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Community</h1>
            <p className="text-slate-500 mt-1">See what other students are up to.</p>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${leagueInfo.color}`}>
            <Shield className="w-4 h-4" />
            <span className="text-sm font-bold">{leagueInfo.name} League</span>
            {myRank && <span className="text-xs font-semibold opacity-70">· Rank #{myRank}</span>}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-orange-500 to-fuchsia-600 rounded-xl p-4 sm:p-5 text-white shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-full flex-shrink-0">
            <Flame className="w-6 h-6 text-yellow-300" />
          </div>
          <div>
            <h2 className="font-bold text-sm sm:text-base">Keep Fighting!</h2>
            <p className="text-xs sm:text-sm text-orange-100 mt-0.5">
              You are in a group of 10. Top 3 promote, Bottom 3 demote, middle 4 stay. Resets Sunday at 11:59 PM.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        <LeaderboardCard weeklyTop={realUsers || []} monthlyTop={monthlyTop3} currentUserId={user.id} leagueName={leagueInfo.name} />
        <ActivityFeed recentMilestones={uniqueMilestones} />
      </div>
    </div>
  );
}

export default function CommunityPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto p-12 animate-pulse space-y-6"><div className="h-8 bg-slate-200 w-48 rounded"></div><div className="grid grid-cols-2 gap-6"><div className="h-64 bg-slate-200 rounded-xl"></div><div className="h-64 bg-slate-200 rounded-xl"></div></div></div>}>
      <CommunityContent />
    </Suspense>
  );
}
