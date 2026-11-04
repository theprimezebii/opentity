"use client";

import { 
  Lock, CheckCircle2, Share2, Target, Zap, Trophy, Flame, User, 
  Shield, Star, Award, Link as LinkIcon, Bookmark, CheckCircle,
  Crown, Cpu, Globe, Database, Monitor, Map, Plane, Coins, Gem, Send, PenTool, ShieldAlert,
  Layers, Grid, DollarSign, FileText, Megaphone, Rocket, MapPin, Users
} from "lucide-react";

const IconMap: Record<string, any> = {
  Target, Zap, Trophy, Flame, User, Shield, Star, Award, Link: LinkIcon, Bookmark, CheckCircle,
  Crown, Cpu, Globe, Database, Monitor, Map, Plane, Coins, Gem, Send, PenTool, ShieldAlert,
  Layers, Grid, DollarSign, FileText, Megaphone, Rocket, MapPin, Users
};

export function BadgeCard({ badge }: { badge: any }) {
  const IconComponent = IconMap[badge.iconName] || Target;

  const handleShare = () => {
    const url = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(badge.shareText)}`;
    window.open(url, "_blank");
  };

  return (
    <div 
      className={`bg-white rounded-xl border p-6 flex flex-col transition-all ${
        badge.unlocked ? `${badge.bgColor} shadow-sm` : 'border-slate-200 opacity-70 grayscale'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-white border shadow-sm ${badge.unlocked ? badge.color : 'text-slate-400'}`}>
          <IconComponent className="w-6 h-6" />
        </div>
        {badge.unlocked ? (
          <span className="flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-100 px-2.5 py-1 rounded-full border border-orange-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Unlocked
          </span>
        ) : (
          <span className="flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
            <Lock className="w-3.5 h-3.5" /> Locked
          </span>
        )}
      </div>

      <div className="flex-grow">
        <h3 className={`text-lg font-bold mb-1 ${badge.unlocked ? 'text-slate-900' : 'text-slate-600'}`}>
          {badge.title}
        </h3>
        <p className="text-sm text-slate-600 mb-4">{badge.description}</p>
      </div>

      {badge.unlocked ? (
        <button 
          onClick={handleShare}
          className="w-full flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-200 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-50 transition shadow-sm"
        >
          <Share2 className="w-4 h-4 text-[#0A66C2]" /> Share on LinkedIn
        </button>
      ) : (
        <div className="w-full flex items-center justify-center gap-2 bg-slate-50 text-slate-500 py-2.5 rounded-lg text-xs font-medium border border-slate-100">
          Requirement: {badge.requirement}
        </div>
      )}
    </div>
  );
}
