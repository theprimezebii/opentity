"use client";

import { useState, useTransition } from "react";
import { updateFeaturedBadges } from "@/app/actions/profile";
import { Loader2, Star, CheckCircle2 } from "lucide-react";

export function FeaturedBadgesSelector({ availableBadges, currentFeatured }: { availableBadges: any[], currentFeatured: string[] }) {
  const [selected, setSelected] = useState<string[]>(currentFeatured || []);
  const [isPending, startTransition] = useTransition();

  const toggleBadge = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(b => b !== id));
    } else {
      if (selected.length >= 3) return; // Max 3
      setSelected([...selected, id]);
    }
  };

  const handleSave = () => {
    startTransition(async () => {
      await updateFeaturedBadges(selected);
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mt-6">
      <div className="flex items-center justify-between mb-4 border-b pb-2">
        <h3 className="text-md font-semibold text-slate-900 flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-500" /> Featured Badges
        </h3>
        <span className="text-xs text-slate-500">Pick up to 3</span>
      </div>
      
      {availableBadges.length === 0 ? (
        <p className="text-sm text-slate-500">No badges available yet.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
            {availableBadges.map(badge => {
              const isSelected = selected.includes(badge.id);
              return (
                <button
                  key={badge.id}
                  onClick={() => toggleBadge(badge.id)}
                  className={`flex items-center gap-2 p-3 rounded-lg border text-left transition ${
                    isSelected ? 'bg-orange-50 border-orange-300 ring-1 ring-orange-300' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className={`p-1.5 rounded-md ${badge.bgColor} flex-shrink-0`}>
                    <CheckCircle2 className={`w-4 h-4 ${badge.color}`} />
                  </div>
                  <span className="text-xs font-bold text-slate-700 truncate">{badge.title}</span>
                </button>
              );
            })}
          </div>
          <button onClick={handleSave} disabled={isPending} className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition flex items-center gap-2">
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Featured Badges"}
          </button>
        </>
      )}
    </div>
  );
}
