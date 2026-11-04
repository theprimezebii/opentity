import { Zap, Award } from "lucide-react";

export function ActivityFeed({ recentMilestones }: { recentMilestones: any[] }) {
  const ALL_BOTS_MILESTONES = [
    { id: "bot_a1", full_name: "Hamza Tariq", badge_id: "elite_hunter", minutes_ago: 15 },
    { id: "bot_a2", full_name: "Sana Rehman", badge_id: "first_step", minutes_ago: 45 },
    { id: "bot_a3", full_name: "Usman Ali", badge_id: "streak_starter", minutes_ago: 120 },
    { id: "bot_a4", full_name: "Ayesha Khan", badge_id: "beta_tester", minutes_ago: 180 },
    { id: "bot_a5", full_name: "Fatima Sheikh", badge_id: "ai_enthusiast", minutes_ago: 240 },
    { id: "bot_a6", full_name: "Bilal Ahmad", badge_id: "explorer", minutes_ago: 360 },
    { id: "bot_a7", full_name: "Zainab Malik", badge_id: "web_wizard", minutes_ago: 480 },
    { id: "bot_a8", full_name: "Ali Hassan", badge_id: "all_star", minutes_ago: 600 },
    { id: "bot_a9", full_name: "Maryam Iqbal", badge_id: "cyber_sentinel", minutes_ago: 720 },
    { id: "bot_a10", full_name: "Hassan Raza", badge_id: "contributor", minutes_ago: 1440 },
    { id: "bot_a11", full_name: "Noor Fatima", badge_id: "veteran", minutes_ago: 1500 },
    { id: "bot_a12", full_name: "Kamran Shah", badge_id: "polyglot", minutes_ago: 1600 },
  ];

  const formatTimeAgo = (dateString: string) => {
    const diff = new Date().getTime() - new Date(dateString).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const realCount = recentMilestones?.length || 0;
  const botsNeeded = Math.max(0, 10 - realCount);
  
  const injectedBots = ALL_BOTS_MILESTONES.slice(0, botsNeeded).map(bot => ({
    ...bot,
    earned_at: new Date(Date.now() - bot.minutes_ago * 60000).toISOString()
  }));

  const combinedFeed = [...(recentMilestones || []), ...injectedBots]
    .sort((a, b) => new Date(b.earned_at).getTime() - new Date(a.earned_at).getTime())
    .slice(0, 10);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden min-h-[600px]">
      <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 flex-shrink-0">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500" /> Live Milestones
        </h2>
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Real-time</span>
      </div>

      <div className="flex-grow flex flex-col justify-evenly divide-y divide-slate-100 px-5">
        {combinedFeed.map((milestone: any, i: number) => {
          const displayName = milestone.full_name || milestone.email?.split("@")[0] || "A student";
          const initial = displayName.charAt(0).toUpperCase();
          
          const badgeTitle = milestone.badge_id
            .split('_')
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

          return (
            <div key={milestone.id || i} className="flex items-center gap-4 py-3">
              <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold uppercase flex-shrink-0 border border-slate-200 text-slate-600">
                {initial}
              </div>
              <div className="flex-grow min-w-0">
                <p className="text-sm text-slate-600 leading-tight">
                  <span className="font-semibold text-slate-900 truncate">{displayName}</span> unlocked
                </p>
                <p className="text-sm font-bold text-orange-500 flex items-center gap-1.5 mt-1 truncate">
                  <Award className="w-4 h-4 flex-shrink-0" /> {badgeTitle}
                </p>
              </div>
              <div className="text-xs font-medium text-slate-400 whitespace-nowrap pt-1">
                {formatTimeAgo(milestone.earned_at)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
