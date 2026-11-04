"use client";

import { Shield, TrendingUp, Trophy } from "lucide-react";

const LEAGUES = [
  { id: "bronze", name: "Bronze", color: "from-orange-500 to-amber-700", border: "border-amber-600", icon: Shield },
  { id: "silver", name: "Silver", color: "from-slate-400 to-slate-600", border: "border-slate-500", icon: Shield },
  { id: "gold", name: "Gold", color: "from-yellow-500 to-amber-600", border: "border-yellow-600", icon: Trophy },
  { id: "diamond", name: "Diamond", color: "from-cyan-500 to-blue-700", border: "border-cyan-600", icon: Trophy },
  { id: "master", name: "Master", color: "from-orange-500 to-fuchsia-700", border: "border-orange-600", icon: Trophy },
];

export function WeeklyLeagueCard({ league = "bronze", weeklyPoints, currentRank }: { league: string, weeklyPoints: number, currentRank: number | null }) {
  const currentLeague = LEAGUES.find(l => l.id === league) || LEAGUES[0];
  const LeagueIcon = currentLeague.icon;

  return (
    <div className={`relative bg-gradient-to-br ${currentLeague.color} rounded-xl p-5 shadow-sm flex flex-col justify-between h-full overflow-hidden text-white`}>
      <Trophy className="absolute -bottom-4 -right-4 w-32 h-32 text-white/10" />

      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-white/80 mb-1 flex items-center gap-1.5">
              <LeagueIcon className="w-4 h-4" /> {currentLeague.name} League
            </p>
            <div className="flex items-baseline gap-2">
              {currentRank ? (
                <span className="text-2xl font-bold">Rank #{currentRank}</span>
              ) : (
                <span className="text-lg font-bold">Unranked</span>
              )}
              <span className="text-xs text-white/70">{weeklyPoints} pts</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 relative z-10">
        {currentRank && currentRank <= 3 ? (
          <div className="flex items-center justify-center gap-1.5 bg-white/20 py-2 rounded-lg text-xs font-bold border border-white/20 mb-2">
            <TrendingUp className="w-3.5 h-3.5" /> Promoting to next league!
          </div>
        ) : (
          <div className="w-full bg-black/25 rounded-full h-3 overflow-hidden mb-2">
            <div 
              className="h-3 bg-white rounded-full transition-all duration-500" 
              style={{ width: `${Math.min((weeklyPoints / 10) * 100, 100)}%` }}
            />
          </div>
        )}
        
        <button 
          className="w-full bg-white/20 hover:bg-white/30 border border-white/20 py-2 rounded-lg text-xs font-bold transition"
          onClick={() => window.location.href = "/dashboard/community"}
        >
          View {currentLeague.name} Leaderboard
        </button>
      </div>
    </div>
  );
}
