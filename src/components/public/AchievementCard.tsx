"use client";

import Link from "next/link";
import { Award, ArrowRight } from "lucide-react";

export function AchievementCard({ savedCount }: { savedCount: number }) {
  let nextTarget = 5;
  let nextRank = "Explorer";
  
  if (savedCount >= 10) {
    nextTarget = 25;
    nextRank = "Veteran";
  } else if (savedCount >= 5) {
    nextTarget = 10;
    nextRank = "Elite Hunter";
  } else if (savedCount >= 25) {
    nextTarget = 50;
    nextRank = "Legend";
  } else if (savedCount >= 50) {
    nextTarget = 50;
    nextRank = "Legend";
  }

  const progress = Math.min((savedCount / nextTarget) * 100, 100);
  const isMax = savedCount >= 50;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between h-full">
      <div>
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-slate-400" /> Next Milestone
            </p>
            <span className="text-xl font-bold text-slate-900">{isMax ? "Maxed Out!" : nextRank}</span>
          </div>
          <div className="px-2.5 py-1 rounded-md text-xs font-bold border bg-slate-50 text-slate-600 border-slate-200">
            {savedCount} Saved
          </div>
        </div>

        {!isMax && (
          <>
            <div className="w-full bg-slate-100 rounded-full h-2 mb-2 mt-4">
              <div className="h-2 rounded-full bg-orange-500 transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-xs text-slate-500">
              Save <strong className="text-slate-900">{nextTarget - savedCount}</strong> more events to unlock <strong className="text-orange-500">{nextRank}</strong>.
            </p>
          </>
        )}
      </div>

      <Link href="/dashboard/badges" className="w-full mt-4 flex items-center justify-center gap-2 bg-slate-50 text-slate-700 border border-slate-200 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 transition">
        View All Badges <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
