"use client";

import { useState } from "react";
import { BadgeCard } from "./BadgeCard";
import { CheckCircle2, Lock } from "lucide-react";

export function BadgesTabs({ earnedBadges, lockedBadges, totalCount }: { earnedBadges: any[], lockedBadges: any[], totalCount: number }) {
  const [activeTab, setActiveTab] = useState<"earned" | "locked">("earned");

  return (
    <div>
      {/* Tab Switcher */}
      <div className="flex border-b border-slate-200 mb-8">
        <button
          onClick={() => setActiveTab("earned")}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === "earned" 
              ? "border-orange-500 text-orange-500" 
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <CheckCircle2 className="w-4 h-4" /> 
          Earned Badges ({earnedBadges.length})
        </button>
        <button
          onClick={() => setActiveTab("locked")}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === "locked" 
              ? "border-orange-500 text-orange-500" 
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <Lock className="w-4 h-4" /> 
          Upcoming Milestones ({totalCount - earnedBadges.length})
        </button>
      </div>

      {/* Content */}
      {activeTab === "earned" ? (
        <div>
          {earnedBadges.length === 0 ? (
            <div className="bg-slate-50 border border-slate-200 border-dashed rounded-xl p-12 text-center">
              <p className="text-slate-500">You haven't earned any badges yet. Start saving events to unlock your first achievement!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {earnedBadges.map((badge) => (
                <BadgeCard key={badge.id} badge={badge} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {lockedBadges.map((badge) => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500">more badges waiting to be discovered as you level up.</p>
          </div>
        </div>
      )}
    </div>
  );
}
