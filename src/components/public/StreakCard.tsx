"use client";

import { useState, useTransition, useEffect } from "react";
import { Flame, CheckCircle2, AlertTriangle, Sun, Moon, Sparkles } from "lucide-react";
import { dailyCheckIn } from "@/app/actions/engagement";

export function StreakCard({ profile }: { profile: any }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showPlusOne, setShowPlusOne] = useState(false);
  const [optimisticCheckedIn, setOptimisticCheckedIn] = useState(false);
  
  // Use state for time to avoid hydration mismatches
  const [currentHour, setCurrentHour] = useState<number>(12);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setCurrentHour(new Date().getHours());
    setIsClient(true);
  }, []);

  const lastCheckIn = profile.last_check_in ? new Date(profile.last_check_in) : null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isCheckedInToday = optimisticCheckedIn || (lastCheckIn 
    ? lastCheckIn.toDateString() === new Date().toDateString()
    : false);

  // Calculate if the streak is broken
  let isStreakBroken = false;
  if (lastCheckIn && !isCheckedInToday) {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (lastCheckIn < yesterday) {
      isStreakBroken = true;
    }
  }

  const displayStreak = isStreakBroken ? 0 : (profile.current_streak || 0);

  const handleCheckIn = () => {
    if (isCheckedInToday) return;

    setIsAnimating(true);
    setShowPlusOne(true);
    setOptimisticCheckedIn(true);

    startTransition(async () => {
      const res = await dailyCheckIn();
      if (res.error) {
        setError(res.error);
        setOptimisticCheckedIn(false);
        setIsAnimating(false);
      } else {
        window.dispatchEvent(new Event("opentity_check_badges"));
      }
    });
  };

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => setIsAnimating(false), 600);
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  useEffect(() => {
    if (showPlusOne) {
      const timer = setTimeout(() => setShowPlusOne(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [showPlusOne]);

  // Determine the message and styling based on time and status
  let message = "";
  let messageColor = "text-orange-100";
  let MessageIcon = Flame;

  if (isCheckedInToday) {
    message = "Awesome! You're on fire. See you tomorrow!";
    messageColor = "text-white font-medium drop-shadow-sm"; // Changed to white for contrast
    MessageIcon = Sparkles; // Changed to Sparkles to avoid duplicate CheckCircle
  } else if (isStreakBroken) {
    message = "Your streak was broken. Start a new one today!";
    messageColor = "text-red-100"; 
    MessageIcon = AlertTriangle;
  } else if (isClient && currentHour >= 21) {
    message = "⚠️ Hurry! Check in before midnight to keep your streak!";
    messageColor = "text-yellow-200 font-semibold";
    MessageIcon = Moon;
  } else if (isClient && currentHour < 12) {
    message = "Good morning! Start your day strong.";
    messageColor = "text-orange-100";
    MessageIcon = Sun;
  } else {
    message = "Don't forget to check in today!";
    messageColor = "text-orange-100";
    MessageIcon = Flame;
  }

  return (
    <div className={`relative bg-gradient-to-br ${isStreakBroken && !isCheckedInToday ? 'from-slate-600 to-slate-800 border-slate-500' : 'from-orange-500 to-rose-600 border-orange-400'} rounded-xl p-5 shadow-sm flex flex-col justify-between h-full overflow-hidden text-white border transition-colors duration-500`}>
      
      <Flame className={`absolute -bottom-4 -right-4 w-32 h-32 ${isStreakBroken && !isCheckedInToday ? 'text-white/5' : 'text-white/10'}`} />

      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div>
            <p className={`text-sm font-medium ${isStreakBroken && !isCheckedInToday ? 'text-slate-300' : 'text-orange-100'} mb-1 flex items-center gap-1.5`}>
              <Flame className={`w-4 h-4 text-white ${isAnimating ? 'animate-flame' : ''}`} /> Current Streak
            </p>
            <div className="flex items-baseline gap-1 relative">
              <span className="text-4xl font-bold text-white">{displayStreak}</span>
              <span className={`text-sm ${isStreakBroken && !isCheckedInToday ? 'text-slate-300' : 'text-orange-100'}`}>days</span>
              
              {showPlusOne && (
                <span className="absolute -top-4 left-8 text-xl font-bold text-yellow-300 animate-float-up pointer-events-none drop-shadow-md">
                  +1
                </span>
              )}
            </div>
          </div>
          <div className={`px-2.5 py-1 ${isStreakBroken && !isCheckedInToday ? 'bg-black/30' : 'bg-black/20'} text-white rounded-md text-xs font-semibold border border-white/10 backdrop-blur-sm`}>
            Best: {profile.longest_streak || 0}
          </div>
        </div>
      </div>

      <div className="mt-4 relative z-10">
        {error ? (
          <p className="text-xs text-white bg-red-900/50 p-2 rounded-md border border-red-500/50">{error}</p>
        ) : (
          <>
            {/* Encouragement/Urgency Message */}
            <div className={`flex items-center gap-1.5 text-[11px] mb-3 ${messageColor}`}>
              <MessageIcon className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="leading-tight">{message}</span>
            </div>

            {/* Action Button */}
            {isCheckedInToday ? (
              <div className="flex items-center justify-center gap-2 bg-white/20 text-white py-2 rounded-lg text-sm font-medium border border-white/10 backdrop-blur-sm">
                <CheckCircle2 className="w-4 h-4 text-green-300" /> Checked in today
              </div>
            ) : (
              <button 
                onClick={handleCheckIn} 
                disabled={isPending}
                className={`w-full ${isStreakBroken ? 'bg-white text-slate-900' : 'bg-white text-orange-600'} py-2 rounded-lg text-sm font-bold hover:bg-opacity-90 transition shadow-sm flex justify-center items-center gap-2 disabled:opacity-70 ${!isStreakBroken && currentHour >= 21 ? 'animate-pulse' : ''}`}
              >
                {isPending ? "Claiming..." : isStreakBroken ? "Start New Streak" : "Claim Daily Streak"}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
