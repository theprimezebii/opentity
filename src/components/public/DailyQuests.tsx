"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Circle, Trophy, Zap, Target, Eye, Bookmark, Flame, Share2, User, Sparkles, Gift, MapPin, Calendar } from "lucide-react";
import { getLocalDateString, getLocalDayIndex } from "@/lib/date-helper";

const QUEST_POOL = [
  { id: "view", title: "Explore 3 new events", icon: Eye, type: "view", target: 3 },
  { id: "save", title: "Save an opportunity", icon: Bookmark, type: "save", target: 1 },
  { id: "checkin", title: "Claim daily streak", icon: Flame, type: "checkin", target: 1 },
  { id: "view5", title: "Explore 5 events today", icon: Zap, type: "view", target: 5 },
  { id: "save2", title: "Save 2 opportunities", icon: Trophy, type: "save", target: 2 },
  { id: "profile", title: "Update your profile", icon: User, type: "profile", target: 1 },
  { id: "community", title: "Visit the community page", icon: Sparkles, type: "community", target: 1 },
  { id: "badges", title: "Check your badge collection", icon: Gift, type: "badges", target: 1 },
  { id: "share", title: "Share an event with a friend", icon: Share2, type: "share", target: 1 },
  { id: "city", title: "Explore events in 2 cities", icon: MapPin, type: "city", target: 2 },
  { id: "category", title: "View 3 events in different categories", icon: Target, type: "category", target: 3 },
  { id: "week", title: "See what's happening this week", icon: Calendar, type: "week", target: 1 },
];

export function DailyQuests({ hasSavedToday, hasCheckedInToday }: { hasSavedToday: boolean, hasCheckedInToday: boolean }) {
  const [viewedEvents, setViewedEvents] = useState(0);
  const [savedCount, setSavedCount] = useState(0);
  const [visitedPages, setVisitedPages] = useState<string[]>([]);
  const [todaysQuests, setTodaysQuests] = useState<typeof QUEST_POOL>([]);

  // 1. Load or generate today's quests (persisted in localStorage, keyed by LOCAL date)
  useEffect(() => {
    const todayKey = getLocalDateString();
    const storageKey = `opentity_quests_${todayKey}`;
    
    // Check if we already picked quests today
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const storedIds: string[] = JSON.parse(stored);
        const quests = storedIds.map(id => QUEST_POOL.find(q => q.id === id)).filter(Boolean) as typeof QUEST_POOL;
        if (quests.length === 3) {
          setTodaysQuests(quests);
          return;
        }
      } catch (e) {}
    }

    // First visit today - deterministically pick 3 quests
    const dayIndex = getLocalDayIndex();
    const startIdx = (dayIndex * 3) % QUEST_POOL.length;
    const picked = [];
    for (let i = 0; i < 3; i++) {
      picked.push(QUEST_POOL[(startIdx + i) % QUEST_POOL.length]);
    }
    
    // Save to localStorage so it never changes for the rest of the day
    localStorage.setItem(storageKey, JSON.stringify(picked.map(q => q.id)));
    setTodaysQuests(picked);
  }, []);

  // 2. Load progress from localStorage (using LOCAL date)
  useEffect(() => {
    const today = getLocalDateString();
    
    const viewsStored = localStorage.getItem(`opentity_views_${today}`);
    if (viewsStored) setViewedEvents(parseInt(viewsStored));
    
    const savesStored = localStorage.getItem(`opentity_saves_${today}`);
    if (savesStored) setSavedCount(parseInt(savesStored));
    
    const pagesStored = localStorage.getItem(`opentity_pages_${today}`);
    if (pagesStored) setVisitedPages(JSON.parse(pagesStored));
  }, []);

  // 3. Calculate progress for each quest
  const getQuestProgress = (quest: any) => {
    switch (quest.type) {
      case "view":
        return { current: Math.min(viewedEvents, quest.target), completed: viewedEvents >= quest.target };
      case "save":
        const saveProgress = hasSavedToday ? Math.max(savedCount, 1) : 0;
        return { current: Math.min(saveProgress, quest.target), completed: saveProgress >= quest.target };
      case "checkin":
        return { current: hasCheckedInToday ? 1 : 0, completed: hasCheckedInToday };
      case "profile":
        return { current: visitedPages.includes("profile") ? 1 : 0, completed: visitedPages.includes("profile") };
      case "community":
        return { current: visitedPages.includes("community") ? 1 : 0, completed: visitedPages.includes("community") };
      case "badges":
        return { current: visitedPages.includes("badges") ? 1 : 0, completed: visitedPages.includes("badges") };
      case "share":
        return { current: visitedPages.includes("shared") ? 1 : 0, completed: visitedPages.includes("shared") };
      case "city":
        return { current: Math.min(visitedPages.filter(p => p.startsWith("city:")).length, quest.target), completed: visitedPages.filter(p => p.startsWith("city:")).length >= quest.target };
      case "category":
        return { current: Math.min(visitedPages.filter(p => p.startsWith("cat:")).length, quest.target), completed: visitedPages.filter(p => p.startsWith("cat:")).length >= quest.target };
      case "week":
        return { current: visitedPages.includes("week") ? 1 : 0, completed: visitedPages.includes("week") };
      default:
        return { current: 0, completed: false };
    }
  };

  const questStates = todaysQuests.map(q => ({ ...q, ...getQuestProgress(q) }));
  const completedCount = questStates.filter(q => q.completed).length;
  const allCompleted = completedCount === 3;

  // Loading state
  if (todaysQuests.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col h-full">
        <div className="animate-pulse space-y-4">
          <div className="h-5 bg-slate-200 rounded w-32"></div>
          <div className="h-6 bg-slate-200 rounded w-full"></div>
          <div className="h-6 bg-slate-200 rounded w-full"></div>
          <div className="h-6 bg-slate-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
          <Target className="w-4 h-4 text-orange-400" /> Daily Quests
        </h2>
        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
          {completedCount}/3
        </span>
      </div>

      <div className="space-y-3 flex-grow">
        {questStates.map((q) => {
          const Icon = q.icon;
          return (
            <div key={q.id} className="flex items-center gap-3">
              {q.completed ? (
                <CheckCircle2 className="w-5 h-5 text-orange-400 flex-shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-slate-300 flex-shrink-0" />
              )}
              <Icon className={`w-4 h-4 flex-shrink-0 ${q.completed ? 'text-slate-300' : 'text-slate-400'}`} />
              <div className="flex-grow">
                <p className={`text-sm font-medium ${q.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                  {q.title}
                </p>
              </div>
              <span className="text-xs font-bold text-slate-400">
                {q.current}/{q.target}
              </span>
            </div>
          );
        })}
      </div>

      <div className={`mt-4 p-2 rounded-lg text-center text-xs font-bold ${allCompleted ? 'bg-orange-50 text-orange-600 border border-orange-200' : 'bg-slate-50 text-slate-400 border border-slate-200'}`}>
        {allCompleted ? "🎉 All Quests Completed!" : "Complete all 3 to earn bonus points!"}
      </div>
    </div>
  );
}
