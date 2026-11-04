"use client";

import { useEffect, useState, useCallback } from "react";
import confetti from "canvas-confetti";
import { getBadgeStatus, markBadgesAsSeen } from "@/app/actions/badge-checker";
import { Award, ArrowRight, X, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function BadgeCelebrator() {
  const [newBadgesCount, setNewBadgesCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  const checkBadges = useCallback(async () => {
    if (isVisible) return;

    const { newBadges, allBadgeIds } = await getBadgeStatus();
    
    if (newBadges.length > 0) {
      setNewBadgesCount(newBadges.length);
      setIsVisible(true);
      
      // Mark them as seen in the database immediately so they don't pop up again
      await markBadgesAsSeen(allBadgeIds);

      // Fire confetti
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#059669', '#7c3aed', '#eab308']
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#059669', '#7c3aed', '#eab308']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [isVisible]);

  // Check on page navigation
  useEffect(() => {
    checkBadges();
  }, [pathname, checkBadges]);

  // Check on tab focus or custom event
  useEffect(() => {
    const handleFocus = () => checkBadges();
    const handleCustomEvent = () => checkBadges();

    window.addEventListener("focus", handleFocus);
    window.addEventListener("opentity_check_badges", handleCustomEvent);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("opentity_check_badges", handleCustomEvent);
    };
  }, [checkBadges]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300 relative text-center">
        
        <div className="h-2 w-full bg-gradient-to-r from-orange-400 via-orange-400 to-orange-500" />

        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition p-1 hover:bg-slate-100 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="pt-8 pb-8 px-8">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 bg-orange-100 rounded-full animate-ping opacity-75"></div>
            <div className="relative w-24 h-24 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center shadow-inner border-4 border-white">
              <Award className="w-12 h-12" />
            </div>
            <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-yellow-400 animate-pulse" />
          </div>
          
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Achievement Unlocked!</h2>
          <p className="text-slate-600 mb-8 text-sm leading-relaxed">
            Incredible work! You just unlocked <strong className="text-orange-500">{newBadgesCount}</strong> new badge{newBadgesCount > 1 ? 's' : ''} on Opentity.
          </p>

          <div className="flex flex-col gap-3">
            <Link 
              href="/dashboard/badges"
              onClick={() => setIsVisible(false)}
              className="w-full flex items-center justify-center gap-2 bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition shadow-sm"
            >
              View My Badges <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              onClick={() => setIsVisible(false)}
              className="w-full py-3 text-sm font-medium text-slate-500 hover:text-slate-800 transition"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
