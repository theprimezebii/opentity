"use client";

import { useState, useMemo } from "react";
import { Crown, Shield, Calendar, ShieldAlert, ShieldCheck } from "lucide-react";

export function LeaderboardCard({ 
  weeklyTop, 
  monthlyTop, 
  currentUserId, 
  leagueName = "Bronze" 
}: { 
  weeklyTop: any[], 
  monthlyTop: any[], 
  currentUserId: string, 
  leagueName?: string 
}) {
  const [activeTab, setActiveTab] = useState<"weekly" | "monthly">("weekly");

  const ALL_WEEKLY_BOTS = [
    { user_id: "bot_w1", full_name: "Hamza Tariq", weekly_points: 9 },
    { user_id: "bot_w2", full_name: "Sana Rehman", weekly_points: 8 },
    { user_id: "bot_w3", full_name: "Ayesha Khan", weekly_points: 6 },
    { user_id: "bot_w4", full_name: "Usman Ali", weekly_points: 5 },
    { user_id: "bot_w5", full_name: "Fatima Sheikh", weekly_points: 4 },
    { user_id: "bot_w6", full_name: "Bilal Ahmad", weekly_points: 3 },
    { user_id: "bot_w7", full_name: "Zainab Malik", weekly_points: 2 },
    { user_id: "bot_w8", full_name: "Ali Hassan", weekly_points: 2 },
    { user_id: "bot_w9", full_name: "Maryam Iqbal", weekly_points: 1 },
    { user_id: "bot_w10", full_name: "Hassan Raza", weekly_points: 1 },
    { user_id: "bot_w11", full_name: "Noor Fatima", weekly_points: 1 },
    { user_id: "bot_w12", full_name: "Kamran Shah", weekly_points: 1 },
  ];

  const ALL_MONTHLY_BOTS = [
    { id: "bot_m1", full_name: "Hamza Tariq", badge_count: 15 },
    { id: "bot_m2", full_name: "Sana Rehman", badge_count: 14 },
    { id: "bot_m3", full_name: "Usman Ali", badge_count: 12 },
    { id: "bot_m4", full_name: "Ayesha Khan", badge_count: 10 },
    { id: "bot_m5", full_name: "Fatima Sheikh", badge_count: 9 },
    { id: "bot_m6", full_name: "Bilal Ahmad", badge_count: 8 },
    { id: "bot_m7", full_name: "Zainab Malik", badge_count: 7 },
    { id: "bot_m8", full_name: "Ali Hassan", badge_count: 6 },
    { id: "bot_m9", full_name: "Maryam Iqbal", badge_count: 5 },
    { id: "bot_m10", full_name: "Hassan Raza", badge_count: 4 },
    { id: "bot_m11", full_name: "Noor Fatima", badge_count: 3 },
    { id: "bot_m12", full_name: "Kamran Shah", badge_count: 2 },
  ];

  const enhancedWeeklyTop = useMemo(() => {
    const realCount = weeklyTop?.length || 0;
    const botsNeeded = Math.max(0, 10 - realCount);
    const botsToUse = ALL_WEEKLY_BOTS.slice(0, botsNeeded);
    
    let combined = [...(weeklyTop || []), ...botsToUse];
    combined.sort((a, b) => (b.weekly_points || 0) - (a.weekly_points || 0));
    return combined.slice(0, 10).map((user, idx) => ({ ...user, rank: idx + 1 }));
  }, [weeklyTop]);

  const enhancedMonthlyTop = useMemo(() => {
    const realCount = monthlyTop?.length || 0;
    const botsNeeded = Math.max(0, 10 - realCount);
    const botsToUse = ALL_MONTHLY_BOTS.slice(0, botsNeeded);
    
    let combined = [...(monthlyTop || []), ...botsToUse];
    combined.sort((a, b) => (b.badge_count || 0) - (a.badge_count || 0));
    return combined.slice(0, 10).map((user, idx) => ({ ...user, rank: idx + 1 }));
  }, [monthlyTop]);

  const data = activeTab === "weekly" ? enhancedWeeklyTop : enhancedMonthlyTop;
  const label = activeTab === "weekly" ? "pts" : "badges";

  const renderRow = (user: any, idx: number) => {
    const rank = user.rank || (idx + 1);
    const displayName = user.full_name || user.email?.split("@")[0] || "Student";
    const initial = displayName.charAt(0).toUpperCase();
    const isMe = user.user_id === currentUserId || user.id === currentUserId;
    const medalColor = rank === 1 ? "text-amber-500" : rank === 2 ? "text-slate-400" : rank === 3 ? "text-orange-600" : "text-slate-400";

    return (
      <div 
        key={user.user_id || user.id || idx} 
        className={`px-5 py-3.5 flex items-center gap-3 transition ${isMe ? 'bg-orange-50' : 'hover:bg-slate-50'}`}
      >
        <div className={`w-6 flex-shrink-0 flex justify-center ${medalColor}`}>
          {rank === 1 ? <Crown className="w-5 h-5" /> : <span className="text-sm font-bold">{rank}</span>}
        </div>
        <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold uppercase flex-shrink-0 text-slate-600">
          {initial}
        </div>
        <div className="flex-grow min-w-0">
          <p className={`text-sm font-semibold truncate ${isMe ? 'text-orange-600' : 'text-slate-900'}`}>
            {displayName} {isMe && <span className="text-[10px] bg-orange-500 text-white px-1.5 py-0.5 rounded ml-1 uppercase">You</span>}
          </p>
        </div>
        <div className="text-sm font-bold text-slate-700 flex-shrink-0">
          {activeTab === 'weekly' ? (user.weekly_points || 0) : (user.badge_count || 0)}
          <span className="text-xs font-medium text-slate-400 ml-1">{label}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full min-h-[600px]">
      <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 flex-shrink-0">
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab("weekly")}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-bold rounded-md transition ${activeTab === 'weekly' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500 hover:bg-slate-200'}`}
          >
            <Shield className="w-4 h-4 text-orange-500" /> {leagueName}
          </button>
          <button 
            onClick={() => setActiveTab("monthly")}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-bold rounded-md transition ${activeTab === 'monthly' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500 hover:bg-slate-200'}`}
          >
            <Calendar className="w-4 h-4 text-orange-400" /> Monthly
          </button>
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          10 Players
        </span>
      </div>

      <div className="flex-grow flex flex-col">
        {activeTab === "monthly" ? (
          <div className="flex-grow flex flex-col divide-y divide-slate-100">
            {data.map((user, idx) => renderRow(user, idx))}
          </div>
        ) : (
          <div className="flex-grow flex flex-col">
            <div className="bg-orange-50/50 px-5 py-2 border-y border-orange-100 flex items-center justify-center gap-2 flex-shrink-0">
              <ShieldCheck className="w-4 h-4 text-orange-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600">Promotion Zone</span>
            </div>
            <div className="divide-y divide-slate-100">
              {data.slice(0, 3).map((user, idx) => renderRow(user, idx))}
            </div>

            <div className="bg-slate-50 px-5 py-2 border-y border-slate-200 flex items-center justify-center gap-2 flex-shrink-0">
              <span className="text-slate-500 font-bold">—</span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Safe Zone</span>
            </div>
            <div className="divide-y divide-slate-100">
              {data.slice(3, 7).map((user, idx) => renderRow(user, idx + 3))}
            </div>

            <div className="bg-red-50/50 px-5 py-2 border-y border-red-100 flex items-center justify-center gap-2 flex-shrink-0">
              <ShieldAlert className="w-4 h-4 text-red-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-red-600">Danger Zone</span>
            </div>
            <div className="divide-y divide-slate-100">
              {data.slice(7, 10).map((user, idx) => renderRow(user, idx + 7))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
