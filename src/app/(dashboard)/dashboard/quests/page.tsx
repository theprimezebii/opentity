import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { Target, CheckCircle2, Flame, Trophy, Calendar, Zap, ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import { CheckInButton } from "@/components/public/CheckInButton";

export const metadata = { title: "Daily Quests" };
export const instant = false;

async function QuestsContent() {
  await connection();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const isCheckedInToday = profile?.last_check_in ? new Date(profile.last_check_in).toDateString() === today.toDateString() : false;

  // Get events saved today
  const { count: savedTodayCount } = await supabase
    .from("saved_events")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", new Date(new Date().setHours(0,0,0,0)).toISOString());

  // Get events saved this week
  const { count: savedThisWeekCount } = await supabase
    .from("saved_events")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", new Date(new Date().setDate(new Date().getDate() - 7)).toISOString());

  const currentStreak = profile?.current_streak || 0;

  // Calculate time until reset (midnight)
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const hoursLeft = Math.floor((midnight.getTime() - now.getTime()) / (1000 * 60 * 60));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-8">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">Daily Quests</h1>
          <p className="text-slate-500 dark:text-slate-400">Complete tasks, keep your streak alive, and earn XP.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300">
          <Calendar className="w-4 h-4 text-orange-500" />
          Resets in {hoursLeft}h
        </div>
      </div>

      {/* STREAK TRACKER */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Flame className="w-32 h-32" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-500/20 rounded-2xl flex items-center justify-center">
                <Flame className="w-7 h-7 text-orange-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Current Streak</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Longest: {profile?.longest_streak || 0} days</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-4xl font-black text-orange-500">{currentStreak} <span className="text-lg text-slate-400 font-bold">days</span></p>
            </div>
          </div>
          
          {/* Weekly Dots */}
          <div className="flex items-center justify-between gap-2 mt-6">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => {
              // Simplistic visual for the last 7 days
              const isActive = i < currentStreak;
              return (
                <div key={day} className="flex flex-col items-center gap-2 flex-1">
                  <div className={`w-full max-w-[40px] aspect-square rounded-full flex items-center justify-center border-2 transition-all ${
                    isActive 
                      ? "bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-500/30" 
                      : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-300 dark:text-slate-600"
                  }`}>
                    {isActive ? <CheckCircle2 className="w-5 h-5" /> : <div className="w-2 h-2 rounded-full bg-current" />}
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-slate-400">{day}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* QUEST GRID */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Quest 1: Daily Check-in */}
        <div className={`bg-white dark:bg-slate-900 rounded-2xl p-6 border shadow-sm flex flex-col ${isCheckedInToday ? "border-emerald-200 dark:border-emerald-500/30" : "border-slate-200 dark:border-slate-800"}`}>
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-500/20 rounded-xl flex items-center justify-center">
              <Flame className="w-6 h-6 text-orange-500" />
            </div>
            <span className="px-3 py-1 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-bold rounded-lg">+1 XP</span>
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-1">Daily Check-In</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex-grow">Log in every day to keep your streak alive and earn points.</p>
          
          <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
            {isCheckedInToday ? (
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm bg-emerald-50 dark:bg-emerald-500/10 p-3 rounded-xl">
                <CheckCircle2 className="w-5 h-5" /> Completed Today
              </div>
            ) : (
              <CheckInButton />
            )}
          </div>
        </div>

        {/* Quest 2: Save 1 Event Today */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-blue-500" />
            </div>
            <span className="px-3 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-lg">+5 XP</span>
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-1">Opportunity Hunter</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 flex-grow">Save at least 1 new event to your dashboard today.</p>
          
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
              <span>Progress</span>
              <span>{savedTodayCount || 0}/1</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
              <div className={`h-2 rounded-full transition-all duration-500 ${savedTodayCount && savedTodayCount >= 1 ? "bg-blue-500" : "bg-blue-300 dark:bg-blue-700"}`} style={{ width: `${Math.min(((savedTodayCount || 0) / 1) * 100, 100)}%` }}></div>
            </div>
          </div>

          <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
            {savedTodayCount && savedTodayCount >= 1 ? (
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm bg-blue-50 dark:bg-blue-500/10 p-3 rounded-xl">
                <CheckCircle2 className="w-5 h-5" /> Quest Completed
              </div>
            ) : (
              <Link href="/events" className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-blue-500 text-white rounded-xl font-bold text-sm hover:bg-blue-600 transition">
                Find an Event <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>

      </div>

      {/* WEEKLY QUEST (Featured) */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 rounded-3xl p-6 md:p-8 border border-slate-800 dark:border-slate-700 shadow-xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 p-6 opacity-10">
          <Trophy className="w-40 h-40" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5 w-full md:w-auto">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20 shrink-0">
              <Star className="w-8 h-8 text-yellow-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-yellow-400/20 text-yellow-300 text-[10px] font-bold uppercase rounded">Weekly Quest</span>
                <span className="text-xs font-bold text-slate-300">+25 XP</span>
              </div>
              <h3 className="font-bold text-white text-xl mb-1">Weekly Champion</h3>
              <p className="text-slate-300 text-sm">Save 3 events this week to unlock a bonus badge.</p>
            </div>
          </div>
          
          <div className="w-full md:w-64 shrink-0">
             <div className="flex justify-between text-xs font-bold text-slate-300 mb-2">
              <span>Progress</span>
              <span>{Math.min(savedThisWeekCount || 0, 3)}/3</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 mb-3">
              <div className="h-2 rounded-full bg-yellow-400 transition-all duration-500" style={{ width: `${Math.min(((savedThisWeekCount || 0) / 3) * 100, 100)}%` }}></div>
            </div>
            {savedThisWeekCount && savedThisWeekCount >= 3 ? (
               <div className="text-center text-sm font-bold text-yellow-400 bg-yellow-400/10 py-2 rounded-lg border border-yellow-400/20">Completed!</div>
            ) : (
              <Link href="/events" className="block text-center px-6 py-2.5 bg-orange-500 text-white font-bold rounded-xl text-sm hover:bg-orange-600 transition">
                Continue Quest
              </Link>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}

export default function QuestsPage() {
  return (
    <Suspense fallback={<div className="max-w-5xl mx-auto p-12 animate-pulse space-y-6"><div className="h-12 w-64 bg-slate-200 dark:bg-slate-800 rounded"></div><div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-3xl"></div><div className="grid md:grid-cols-2 gap-6"><div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div><div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div></div></div>}>
      <QuestsContent />
    </Suspense>
  );
}
