import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { ArrowRight, Clock, User, Bookmark, Target, Users, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { EventCard } from "@/components/events/EventCard";
import { FormMessage } from "@/components/ui/FormMessage";
import { StreakCard } from "@/components/public/StreakCard";
import { AchievementCard } from "@/components/public/AchievementCard";
import { WeeklyLeagueCard } from "@/components/public/WeeklyLeagueCard";

export const metadata = { title: "Dashboard" };
export const instant = false;

async function DashboardContent() {
  await connection();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // OPTIMIZATION: Fetch profile, saved events, and weekly data IN PARALLEL
  const [
    profileRes,
    savedRes,
    weeklySavesRes,
    weeklyCheckinsRes,
    leaderboardRes
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("saved_events").select("event_id, events(*)").eq("user_id", user.id).order("created_at", { ascending: false }),
    supabase.from("saved_events").select("*", { count: "exact", head: true }).eq("user_id", user.id).gte("created_at", new Date(new Date().setDate(new Date().getDate() - 7)).toISOString()),
    supabase.from("daily_checkins").select("*", { count: "exact", head: true }).eq("user_id", user.id).gte("checkin_date", new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split("T")[0]),
    supabase.rpc("get_weekly_leaderboard_by_league", { p_league: "bronze" }) // Placeholder for real league, fixed in next step
  ]);

  const profile = profileRes.data;
  // Admins are allowed to view the regular dashboard, no forced redirect.

  const savedEvents = (savedRes.data?.map(r => r.events).filter(Boolean) as any[]) || [];
  const savedCount = savedEvents.length;
  const weeklyPoints = (weeklySavesRes.count || 0) + (weeklyCheckinsRes.count || 0);
  
  // Get user's league and rank
  const { data: realLeaderboard } = await supabase.rpc("get_weekly_leaderboard_by_league", { p_league: profile.league || "bronze" });
  const currentRank = realLeaderboard?.find((u: any) => u.user_id === user.id)?.rank || null;

  const now = new Date();
  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(now.getDate() + 3);
  
  const closingSoon = savedEvents.filter(e => {
    if (!e.registration_deadline) return false;
    const deadline = new Date(e.registration_deadline);
    return deadline >= now && deadline <= threeDaysFromNow;
  });

  const openEvents = savedEvents.filter(e => {
    if (!e.registration_deadline) return true;
    return new Date(e.registration_deadline) >= now;
  }).sort((a, b) => new Date(a.registration_deadline || 0).getTime() - new Date(b.registration_deadline || 0).getTime());

  const closedEvents = savedEvents.filter(e => {
    if (!e.registration_deadline) return false;
    return new Date(e.registration_deadline) < now;
  });

  const top3Events = [...openEvents, ...closedEvents].slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Welcome back, {profile?.full_name?.split(" ")[0] || "Student"}</h1>
          <p className="text-slate-500 mt-1.5 text-sm sm:text-base">Here is your personalized opportunity radar.</p>
        </div>
        <Link href="/dashboard/profile" className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition shadow-sm">
          <User className="w-4 h-4" /> Edit Profile
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <StreakCard profile={profile} />
        <WeeklyLeagueCard league={profile.league || "bronze"} weeklyPoints={weeklyPoints} currentRank={currentRank} />
        <AchievementCard savedCount={savedCount} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/dashboard/quests" className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-orange-300 hover:shadow-sm transition group">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><Target className="w-5 h-5" /></div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Daily Quests & Referrals</p>
              <p className="text-xs text-slate-500">Earn bonus points by inviting friends.</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-orange-500 transition" />
        </Link>
        
        <Link href="/dashboard/community" className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-orange-300 hover:shadow-sm transition group">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><Users className="w-5 h-5" /></div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Community & Leaderboards</p>
              <p className="text-xs text-slate-500">See who is climbing the ranks this week.</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-orange-500 transition" />
        </Link>
      </div>

      {closingSoon.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-100 rounded-full mt-0.5"><Clock className="w-5 h-5 text-red-600" /></div>
            <div>
              <h3 className="text-red-800 font-semibold text-sm">Closing Soon</h3>
              <p className="text-red-700 text-sm mt-0.5">You have {closingSoon.length} saved event{closingSoon.length > 1 ? 's' : ''} with registration closing in the next 3 days.</p>
            </div>
          </div>
          <Link href="/events/saved" className="text-sm font-semibold bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-center whitespace-nowrap shadow-sm">Review Deadlines</Link>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-slate-400" /> Top Saved Events
          </h2>
          {savedCount > 3 && (
            <Link href="/events/saved" className="text-sm font-medium text-orange-500 hover:text-orange-600 flex items-center gap-1">
              View All ({savedCount}) <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {savedEvents.length === 0 ? (
          <div className="p-8 sm:p-12 bg-white rounded-xl border border-slate-200 text-center shadow-sm">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bookmark className="w-6 h-6 text-slate-300" />
            </div>
            <h3 className="text-slate-900 font-medium mb-1">No saved events yet</h3>
            <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">When you find a hackathon you like, click the bookmark icon to save it here.</p>
            <Link href="/events" className="inline-flex items-center gap-2 text-sm font-medium bg-orange-500 text-white px-5 py-2.5 rounded-lg hover:bg-orange-600 transition shadow-sm">Browse Events <ArrowRight className="w-4 h-4" /></Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {top3Events.map(event => <EventCard key={event.id} event={event} isSaved={true} pathname="/dashboard" />)}
          </div>
        )}
      </div>
    </div>
  );
}

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ success?: string }> }) {
  const { success } = await searchParams;
  return (
    <main>
      {success && <FormMessage success={success} autoHide clearUrl />}
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </main>
  );
}

function DashboardSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 animate-pulse space-y-8">
      <div className="h-10 bg-slate-200 rounded-lg w-64"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-40 bg-slate-200 rounded-xl"></div>
        <div className="h-40 bg-slate-200 rounded-xl"></div>
        <div className="h-40 bg-slate-200 rounded-xl"></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="h-20 bg-slate-200 rounded-xl"></div>
        <div className="h-20 bg-slate-200 rounded-xl"></div>
      </div>
      <div className="h-64 bg-slate-200 rounded-xl"></div>
    </div>
  );
}
