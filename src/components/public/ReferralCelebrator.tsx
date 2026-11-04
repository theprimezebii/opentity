"use client";

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { Gift, X, Users } from "lucide-react";
import Link from "next/link";

export function ReferralCelebrator({ currentCount }: { currentCount: number }) {
  const [showCelebration, setShowCelebration] = useState(false);
  const [newJoinerName, setNewJoinerName] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("opentity_referral_count");
    const lastCount = stored ? parseInt(stored) : -1;

    // First time seeing this - just save
    if (lastCount === -1) {
      localStorage.setItem("opentity_referral_count", currentCount.toString());
      return;
    }

    // Someone new joined!
    if (currentCount > lastCount) {
      setShowCelebration(true);
      
      const duration = 3000;
      const end = Date.now() + duration;
      const frame = () => {
        confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#7c3aed', '#f59e0b', '#10b981'] });
        confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#7c3aed', '#f59e0b', '#10b981'] });
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();

      localStorage.setItem("opentity_referral_count", currentCount.toString());
    }
  }, [currentCount]);

  if (!showCelebration) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300 relative text-center">
        <div className="h-2 w-full bg-gradient-to-r from-orange-400 via-fuchsia-500 to-pink-500" />

        <button 
          onClick={() => setShowCelebration(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition p-1 hover:bg-slate-100 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="pt-8 pb-8 px-8">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 bg-orange-100 rounded-full animate-ping opacity-75"></div>
            <div className="relative w-20 h-20 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center border-4 border-white">
              <Users className="w-10 h-10" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Someone Joined!</h2>
          <p className="text-slate-600 mb-6 text-sm leading-relaxed">
            A friend just signed up using your referral link. You now have <strong className="text-orange-500">{currentCount}</strong> {currentCount === 1 ? "referral" : "referrals"}!
          </p>

          <Link 
            href="/dashboard/quests"
            onClick={() => setShowCelebration(false)}
            className="w-full flex items-center justify-center gap-2 bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition shadow-sm"
          >
            <Gift className="w-4 h-4" /> See My Referrals
          </Link>
        </div>
      </div>
    </div>
  );
}
