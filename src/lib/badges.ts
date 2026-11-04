export interface Badge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  category: "Saved" | "Streak" | "Profile" | "Category" | "Format" | "Community" | "Prize";
  color: string;
  bgColor: string;
  unlocked: boolean;
  requirement: string;
  shareText: string;
  targetCount?: number;
}

export function getUserBadges(profile: any, savedEvents: any[], submissionCount: number, referralCount: number = 0): Badge[] {
  const streak = profile?.current_streak || 0;
  const savedCount = savedEvents.length;
  
  const hasBio = !!profile?.bio;
  const hasLinkedin = !!profile?.linkedin_url;
  const hasUniversity = !!profile?.university;
  const hasCity = !!profile?.city;

  const categories = savedEvents.map(e => e.category).filter(Boolean);
  const uniqueCategories = new Set(categories).size;
  const cities = new Set(savedEvents.map(e => e.city).filter(Boolean));
  
  const aiCount = categories.filter(c => c === 'AI').length;
  const webCount = categories.filter(c => c === 'Web Development').length;
  const cyberCount = categories.filter(c => c === 'Cybersecurity').length;
  const dataCount = categories.filter(c => c === 'Data Science').length;

  const onlineCount = savedEvents.filter(e => e.format === 'Online').length;
  const offlineCount = savedEvents.filter(e => e.format === 'In-person').length;
  
  const paidEvents = savedEvents.filter(e => e.prize_amount && e.prize_amount > 0).length;
  const hasBigPrize = savedEvents.some(e => e.prize_amount && e.prize_amount >= 100000);

  return [
    // --- SAVED MILESTONES ---
    { id: "first_step", title: "First Step", description: "Saved your first opportunity.", iconName: "Target", category: "Saved", color: "text-blue-600", bgColor: "bg-blue-50 border-blue-200", unlocked: savedCount >= 1, requirement: "Save 1 event", targetCount: 1, shareText: "I just started my journey on Opentity by saving my first hackathon! 🚀 Check out opentity.com" },
    { id: "explorer", title: "Explorer", description: "Actively exploring opportunities.", iconName: "Zap", category: "Saved", color: "text-emerald-600", bgColor: "bg-emerald-50 border-emerald-200", unlocked: savedCount >= 5, requirement: "Save 5 events", targetCount: 5, shareText: "I'm officially an Explorer on Opentity! 🧭 opentity.com" },
    { id: "elite_hunter", title: "Elite Hunter", description: "You have a keen eye for top hackathons.", iconName: "Trophy", category: "Saved", color: "text-yellow-600", bgColor: "bg-yellow-50 border-yellow-200", unlocked: savedCount >= 10, requirement: "Save 10 events", targetCount: 10, shareText: "I'm an Elite Hunter on Opentity with 10+ saved hackathons. 🏆 opentity.com" },
    { id: "veteran", title: "Hackathon Veteran", description: "A true veteran of the scene.", iconName: "Shield", category: "Saved", color: "text-slate-600", bgColor: "bg-slate-50 border-slate-200", unlocked: savedCount >= 25, requirement: "Save 25 events", targetCount: 25, shareText: "I'm a Hackathon Veteran on Opentity! 25+ opportunities saved. 🛡️ opentity.com" },
    { id: "legend", title: "Opportunity Legend", description: "You have saved a massive collection.", iconName: "Crown", category: "Saved", color: "text-amber-600", bgColor: "bg-amber-50 border-amber-200", unlocked: savedCount >= 50, requirement: "Save 50 events", targetCount: 50, shareText: "Opportunity Legend status on Opentity. 50+ events saved. 👑 opentity.com" },

    // --- STREAK MILESTONES ---
    { id: "streak_starter", title: "On Fire", description: "Maintained a 3-day login streak.", iconName: "Flame", category: "Streak", color: "text-orange-600", bgColor: "bg-orange-50 border-orange-200", unlocked: streak >= 3, requirement: "3-day streak", shareText: "Day 3 on Opentity! 🔥 opentity.com" },
    { id: "streak_master", title: "Unstoppable", description: "Maintained a 7-day login streak.", iconName: "Flame", category: "Streak", color: "text-rose-600", bgColor: "bg-rose-50 border-rose-200", unlocked: streak >= 7, requirement: "7-day streak", shareText: "1 week streak on Opentity! 💯 opentity.com" },
    { id: "streak_legend", title: "Legendary", description: "Maintained a 14-day login streak.", iconName: "Star", category: "Streak", color: "text-purple-600", bgColor: "bg-purple-50 border-purple-200", unlocked: streak >= 14, requirement: "14-day streak", shareText: "14-day streak on Opentity! 👑 opentity.com" },
    { id: "streak_immortal", title: "Immortal", description: "Maintained a 30-day login streak.", iconName: "Award", category: "Streak", color: "text-indigo-600", bgColor: "bg-indigo-50 border-indigo-200", unlocked: streak >= 30, requirement: "30-day streak", shareText: "30 days. Immortal status achieved. 🏆 opentity.com" },

    // --- PROFILE MILESTONES ---
    { id: "bio_added", title: "Storyteller", description: "Added a bio to your profile.", iconName: "User", category: "Profile", color: "text-teal-600", bgColor: "bg-teal-50 border-teal-200", unlocked: hasBio, requirement: "Add a bio", shareText: "Just updated my bio on Opentity! opentity.com" },
    { id: "linkedin_added", title: "Networker", description: "Connected your LinkedIn profile.", iconName: "Link", category: "Profile", color: "text-[#0A66C2]", bgColor: "bg-blue-50 border-blue-200", unlocked: hasLinkedin, requirement: "Add LinkedIn", shareText: "Connected my LinkedIn to Opentity! opentity.com" },
    { id: "college_pride", title: "College Pride", description: "Added your university.", iconName: "Bookmark", category: "Profile", color: "text-orange-600", bgColor: "bg-orange-50 border-orange-200", unlocked: hasUniversity, requirement: "Add University", shareText: "Representing my university on Opentity! 🎓 opentity.com" },
    { id: "local_hero", title: "Local Hero", description: "Set your home city.", iconName: "MapPin", category: "Profile", color: "text-rose-600", bgColor: "bg-rose-50 border-rose-200", unlocked: hasCity, requirement: "Set your city", shareText: "Setting my roots on Opentity. opentity.com" },
    { id: "all_star", title: "All-Star Profile", description: "Completed your entire profile.", iconName: "CheckCircle", category: "Profile", color: "text-emerald-600", bgColor: "bg-emerald-50 border-emerald-200", unlocked: hasBio && hasLinkedin && hasUniversity && hasCity, requirement: "100% Profile", shareText: "My Opentity profile is 100% complete! opentity.com" },

    // --- CATEGORY SPECIFIC ---
    { id: "ai_enthusiast", title: "AI Enthusiast", description: "Saved 3 Artificial Intelligence events.", iconName: "Cpu", category: "Category", color: "text-emerald-600", bgColor: "bg-emerald-50 border-emerald-200", unlocked: aiCount >= 3, requirement: "Save 3 AI events", shareText: "Deep diving into AI on Opentity! 🤖 opentity.com" },
    { id: "web_wizard", title: "Web Wizard", description: "Saved 3 Web Development events.", iconName: "Globe", category: "Category", color: "text-blue-600", bgColor: "bg-blue-50 border-blue-200", unlocked: webCount >= 3, requirement: "Save 3 Web events", shareText: "Building the web on Opentity! 🌐 opentity.com" },
    { id: "cyber_sentinel", title: "Cyber Sentinel", description: "Saved 3 Cybersecurity events.", iconName: "Lock", category: "Category", color: "text-red-600", bgColor: "bg-red-50 border-red-200", unlocked: cyberCount >= 3, requirement: "Save 3 Cyber events", shareText: "Securing the future on Opentity! 🛡️ opentity.com" },
    { id: "data_geek", title: "Data Geek", description: "Saved 3 Data Science events.", iconName: "Database", category: "Category", color: "text-purple-600", bgColor: "bg-purple-50 border-purple-200", unlocked: dataCount >= 3, requirement: "Save 3 Data events", shareText: "Crunching numbers on Opentity! 📊 opentity.com" },
    { id: "polyglot", title: "Polyglot", description: "Saved events from 4 different categories.", iconName: "Layers", category: "Category", color: "text-amber-600", bgColor: "bg-amber-50 border-amber-200", unlocked: uniqueCategories >= 4, requirement: "4 unique categories", shareText: "Exploring all tech domains on Opentity! 🚀 opentity.com" },

    // --- EVENT DISCOVERY (Format) ---
    { id: "virtual_voyager", title: "Virtual Voyager", description: "Saved 3 Online events.", iconName: "Monitor", category: "Format", color: "text-cyan-600", bgColor: "bg-cyan-50 border-cyan-200", unlocked: onlineCount >= 3, requirement: "Save 3 Online events", shareText: "Attending from my desk on Opentity! 💻 opentity.com" },
    { id: "on_site", title: "On-Site Specialist", description: "Saved 3 In-person events.", iconName: "Map", category: "Format", color: "text-teal-600", bgColor: "bg-teal-50 border-teal-200", unlocked: offlineCount >= 3, requirement: "Save 3 In-person events", shareText: "Ready to network in person on Opentity! 🤝 opentity.com" },
    { id: "globetrotter", title: "Globetrotter", description: "Saved events from 3 different cities.", iconName: "Plane", category: "Format", color: "text-sky-600", bgColor: "bg-sky-50 border-sky-200", unlocked: cities.size >= 3, requirement: "Events in 3 cities", shareText: "Exploring opportunities across Pakistan on Opentity! 🗺️ opentity.com" },
    { id: "format_master", title: "Format Master", description: "Saved 5 Online and 5 In-person events.", iconName: "Grid", category: "Format", color: "text-indigo-600", bgColor: "bg-indigo-50 border-indigo-200", unlocked: onlineCount >= 5 && offlineCount >= 5, requirement: "5 Online & 5 In-person", shareText: "Mastering both virtual and physical hackathons! 🌍 opentity.com" },

    // --- PRIZES ---
    { id: "prize_hunter", title: "Prize Hunter", description: "Saved an event with a cash prize.", iconName: "Coins", category: "Prize", color: "text-yellow-600", bgColor: "bg-yellow-50 border-yellow-200", unlocked: paidEvents >= 1, requirement: "Save a paid event", shareText: "Going for the prize pool on Opentity! 💰 opentity.com" },
    { id: "big_game", title: "Big Game Hunter", description: "Saved an event with a prize over 100k.", iconName: "Gem", category: "Prize", color: "text-rose-600", bgColor: "bg-rose-50 border-rose-200", unlocked: hasBigPrize, requirement: "Save a 100k+ event", shareText: "Aiming for the big leagues on Opentity! 💎 opentity.com" },
    { id: "prize_collector", title: "Prize Collector", description: "Saved 3 events with cash prizes.", iconName: "DollarSign", category: "Prize", color: "text-emerald-600", bgColor: "bg-emerald-50 border-emerald-200", unlocked: paidEvents >= 3, requirement: "Save 3 paid events", shareText: "Collecting prize pools on Opentity! 💸 opentity.com" },

    // --- COMMUNITY ---
    { id: "scout", title: "Scout", description: "Submitted an event to the platform.", iconName: "Send", category: "Community", color: "text-indigo-600", bgColor: "bg-indigo-50 border-indigo-200", unlocked: submissionCount >= 1, requirement: "Submit 1 event", shareText: "Contributing to the community on Opentity! 🚀 opentity.com" },
    { id: "content_king", title: "Content King", description: "Submitted 3 events.", iconName: "FileText", category: "Community", color: "text-orange-600", bgColor: "bg-orange-50 border-orange-200", unlocked: submissionCount >= 3, requirement: "Submit 3 events", shareText: "Building the Opentity database! 👑 opentity.com" },
    { id: "ambassador", title: "Ambassador", description: "Submitted 5 events.", iconName: "Megaphone", category: "Community", color: "text-rose-600", bgColor: "bg-rose-50 border-rose-200", unlocked: submissionCount >= 5, requirement: "Submit 5 events", shareText: "Official Opentity Ambassador! 📢 opentity.com" },
    { id: "contributor_role", title: "Official Contributor", description: "Granted event organizer access.", iconName: "PenTool", category: "Community", color: "text-fuchsia-600", bgColor: "bg-fuchsia-50 border-fuchsia-200", unlocked: profile?.role === 'contributor' || profile?.role === 'admin', requirement: "Contributor Role", shareText: "I'm an official Contributor on Opentity! opentity.com" },
    { id: "architect", title: "The Architect", description: "Platform Administrator.", iconName: "ShieldAlert", category: "Community", color: "text-slate-900", bgColor: "bg-slate-100 border-slate-300", unlocked: profile?.role === 'admin', requirement: "Admin status", shareText: "Building the future of Opentity. opentity.com" },

    // --- REFERRAL BADGES ---
    { id: "connector", title: "Connector", description: "Invited your first friend to Opentity.", iconName: "Users", category: "Community", color: "text-blue-600", bgColor: "bg-blue-50 border-blue-200", unlocked: referralCount >= 1, requirement: "Refer 1 friend", shareText: "Just invited my first friend to Opentity! 🎉 opentity.com" },
    { id: "influencer", title: "Influencer", description: "Invited 3 friends to Opentity.", iconName: "Megaphone", category: "Community", color: "text-violet-600", bgColor: "bg-violet-50 border-violet-200", unlocked: referralCount >= 3, requirement: "Refer 3 friends", shareText: "Building the Opentity community! 3 friends joined. opentity.com" },
    { id: "referral_legend", title: "Referral Legend", description: "Invited 5+ friends to Opentity.", iconName: "Crown", category: "Community", color: "text-amber-600", bgColor: "bg-amber-50 border-amber-200", unlocked: referralCount >= 5, requirement: "Refer 5 friends", shareText: "Top referral on Opentity! 🏆 Bringing the squad. opentity.com" },

    // --- TEST / SPECIAL ---
    { id: "beta_tester", title: "Beta Tester", description: "You are one of the first to try Opentity!", iconName: "Rocket", category: "Community", color: "text-indigo-600", bgColor: "bg-indigo-50 border-indigo-200", unlocked: true, requirement: "Join Opentity", shareText: "I am a Beta Tester on Opentity! opentity.com" }
  ];
}

// Merges historical awards with current unlocks to ensure permanent ownership
export function mergePermanentBadges(currentBadges: Badge[], awardedBadgeIds: string[]): Badge[] {
  return currentBadges.map(badge => {
    if (awardedBadgeIds.includes(badge.id)) {
      return { ...badge, unlocked: true };
    }
    return badge;
  });
}
