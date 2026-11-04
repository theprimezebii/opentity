"use client";

import { useState, useEffect } from "react";
import { Gift, Copy, CheckCircle2, Share2, Briefcase, MessageCircle, Trophy, Sparkles } from "lucide-react";
import { showToast } from "@/components/ui/GlobalToast";

interface ReferralData {
  count: number;
  referrals: { name: string; joinedAt: string; university?: string }[];
}

export function ReferralCard({ referralCode, referrals }: { referralCode: string, referrals: ReferralData }) {
  const [copied, setCopied] = useState(false);
  const [baseUrl, setBaseUrl] = useState("");

  // Use the actual domain (localhost:3000 or opentity.vercel.app)
  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

  const referralLink = `${baseUrl}/register?ref=${referralCode}`;
  const shareText = `Join me on Opentity to discover the best hackathons and opportunities in Pakistan! Sign up with my link: ${referralLink}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    showToast("Referral link copied!", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank");
  };

  const handleLinkedIn = () => {
    window.open(`https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(shareText)}`, "_blank");
  };

  // Milestone logic
  let nextMilestone = { target: 1, badge: "Connector", current: referrals.count };
  if (referrals.count >= 1 && referrals.count < 3) nextMilestone = { target: 3, badge: "Influencer", current: referrals.count };
  if (referrals.count >= 3 && referrals.count < 5) nextMilestone = { target: 5, badge: "Referral Legend", current: referrals.count };
  if (referrals.count >= 5) nextMilestone = { target: 5, badge: "Completed", current: 5 };

  const progressPercent = Math.min((nextMilestone.current / nextMilestone.target) * 100, 100);
  const isMaxed = referrals.count >= 5;

  return (
    <div className="bg-gradient-to-br from-orange-500 to-fuchsia-700 rounded-xl p-5 shadow-sm flex flex-col justify-between h-full text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-orange-100 flex items-center gap-1.5">
            <Gift className="w-4 h-4" /> Invite & Earn Rewards
          </p>
          <div className="px-2 py-1 bg-white/20 rounded-md text-xs font-bold">
            {referrals.count} {referrals.count === 1 ? 'Friend' : 'Friends'}
          </div>
        </div>
        
        <h2 className="text-lg font-bold mb-1 leading-tight">Help your friends win.</h2>
        <p className="text-orange-100 text-xs leading-relaxed mb-4">
          Share Opentity with your university network. When they sign up, you both unlock exclusive badges!
        </p>

        {/* Milestone Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-xs font-semibold mb-1 text-orange-100">
            <span>{isMaxed ? "All rewards unlocked!" : `Next: ${nextMilestone.badge}`}</span>
            <span>{nextMilestone.current}/{nextMilestone.target}</span>
          </div>
          <div className="w-full bg-black/20 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${isMaxed ? 'bg-yellow-400' : 'bg-white'}`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="relative z-10 space-y-2">
        {/* Referral Link Preview */}
        <div className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 flex items-center gap-2">
          <span className="text-xs text-orange-200 truncate flex-grow font-mono">{referralLink}</span>
          <button 
            onClick={handleCopy}
            className="flex-shrink-0 text-white hover:text-green-300 transition"
            title="Copy Link"
          >
            {copied ? <CheckCircle2 className="w-5 h-5 text-green-300" /> : <Copy className="w-5 h-5" />}
          </button>
        </div>

        {/* Share Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={handleWhatsApp}
            className="flex items-center justify-center gap-1.5 bg-white text-orange-600 hover:bg-orange-50 py-2 rounded-lg text-sm font-bold transition shadow-sm"
          >
            <MessageCircle className="w-4 h-4" /> WhatsApp
          </button>
          <button 
            onClick={handleLinkedIn}
            className="flex items-center justify-center gap-1.5 bg-white text-blue-700 hover:bg-blue-50 py-2 rounded-lg text-sm font-bold transition shadow-sm"
          >
            <Briefcase className="w-4 h-4" /> LinkedIn
          </button>
        </div>

        {/* Recent Referrals List */}
        {referrals.referrals.length > 0 && (
          <div className="mt-3 pt-3 border-t border-white/20">
            <p className="text-[10px] uppercase tracking-wider text-orange-200 font-semibold mb-2 flex items-center gap-1">
              <Trophy className="w-3 h-3" /> Recent Joins
            </p>
            <div className="space-y-1 max-h-20 overflow-y-auto pr-1">
              {referrals.referrals.slice(0, 4).map((r, i) => (
                <div key={i} className="flex items-center gap-2 text-xs bg-white/10 px-2 py-1.5 rounded-md">
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[9px] font-bold uppercase flex-shrink-0">
                    {r.name.charAt(0)}
                  </div>
                  <span className="truncate flex-grow">{r.name}</span>
                  <Sparkles className="w-3 h-3 text-yellow-300 flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
