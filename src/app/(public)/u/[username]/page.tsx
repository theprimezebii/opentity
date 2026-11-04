import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import Link from "next/link";
import { getUserBadges } from "@/lib/badges";
import { ShareProfileButton } from "@/components/public/ShareProfileButton";
import { Metadata } from "next";
import { APP_NAME } from "@/lib/constants";
import { 
  MapPin, Building2, Briefcase, Code, Globe, MessageCircle, ExternalLink, 
  Award, Flame, GraduationCap, Calendar, ArrowLeft, Users, FileText,
  Target, Zap, Trophy, User, Shield, Star, Link as LinkIcon, Bookmark, 
  CheckCircle, Crown, Cpu, Database, Monitor, Map, Plane, Coins, Gem, 
  Send, PenTool, ShieldAlert, Layers, Grid, DollarSign, Megaphone, Rocket
} from "lucide-react";

export const instant = false;

const IconMap: Record<string, any> = {
  Target, Zap, Trophy, Flame, User, Shield, Star, Award, Link: LinkIcon, Bookmark, CheckCircle,
  Crown, Cpu, Globe, Database, Monitor, Map, Plane, Coins, Gem, Send, PenTool, ShieldAlert,
  Layers, Grid, DollarSign, FileText, Megaphone, Rocket, MapPin, Users
};

const getProfileData = async (username: string) => {
  const supabase = await createClient();
  const { data: profile } = await supabase.from("profiles").select("*").eq("username", username).single();
  return profile;
};

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  await connection();
  const { username } = await params;
  const profile = await getProfileData(username);
  if (!profile) return { title: "User Not Found" };

  const title = `${profile.full_name} (@${profile.username}) | ${APP_NAME}`;
  const description = profile.bio || `Check out ${profile.full_name}'s profile on Opentity.`;

  return {
    title, description,
    openGraph: { title, description, type: "profile", url: `https://opentity.com/u/${profile.username}`, siteName: APP_NAME, images: profile.avatar_url ? [{ url: profile.avatar_url }] : [] },
    twitter: { card: "summary", title, description, images: profile.avatar_url ? [profile.avatar_url] : [] },
  };
}

async function PublicProfileContent({ username }: { username: string }) {
  await connection();
  const supabase = await createClient();

  const profile = await getProfileData(username);
  if (!profile) notFound();

  const [badgesRes, projectsRes, academicsRes] = await Promise.all([
    supabase.from("badge_awards").select("badge_id, earned_at").eq("user_id", profile.id).order("earned_at", { ascending: false }),
    supabase.from("projects").select("*").eq("user_id", profile.id).order("created_at", { ascending: false }),
    supabase.from("academics").select("*").eq("user_id", profile.id).order("end_year", { ascending: false }),
  ]);

  const awardedBadges = badgesRes.data || [];
  const projects = projectsRes.data || [];
  const academics = academicsRes.data || [];

  const allBadgeDefinitions = getUserBadges(profile, [], 0, 0);
  
  const enrichedBadges = awardedBadges.map((awarded: any) => {
    const definition = allBadgeDefinitions.find((b: any) => b.id === awarded.badge_id);
    return {
      id: awarded.badge_id,
      title: definition?.title || awarded.badge_id.replace(/_/g, ' '),
      iconName: definition?.iconName || "Award",
      color: definition?.color || "text-slate-600",
      bgColor: definition?.bgColor || "bg-slate-50 border-slate-200",
    };
  });

  let displayBadges = enrichedBadges.slice(0, 3);
  if (profile.featured_badges && profile.featured_badges.length > 0) {
    displayBadges = profile.featured_badges.map((id: string) => enrichedBadges.find((b: any) => b.id === id)).filter(Boolean);
  }

  const totalBadges = enrichedBadges.length;
  const memberSince = new Date(profile.created_at).toLocaleDateString("en-PK", { month: "long", year: "numeric" });

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        
        <Link href="/events" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-6 transition">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>

        {/* HERO BANNER */}
        <div className="relative bg-gradient-to-br from-orange-600 via-orange-500 to-fuchsia-700 rounded-3xl overflow-hidden shadow-xl mb-8">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          
          <div className="absolute top-4 right-4 flex gap-2 z-20">
            <ShareProfileButton username={profile.username} name={profile.full_name} />
            {profile.linkedin_url && <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-white transition-all shadow-sm" title="LinkedIn"><Briefcase className="w-4 h-4" /></a>}
            {profile.github_url && <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-white transition-all shadow-sm" title="GitHub"><Code className="w-4 h-4" /></a>}
            {profile.portfolio_url && <a href={profile.portfolio_url} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-white transition-all shadow-sm" title="Portfolio"><Globe className="w-4 h-4" /></a>}
            {profile.twitter_url && <a href={profile.twitter_url} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-white transition-all shadow-sm" title="Twitter"><MessageCircle className="w-4 h-4" /></a>}
          </div>

          <div className="relative z-10 p-6 sm:p-10">
            <div className="flex flex-col sm:flex-row items-center sm:items-center gap-5 sm:gap-6">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-2xl overflow-hidden flex-shrink-0 bg-white/10 backdrop-blur-sm">
                {profile.avatar_url ? <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold uppercase">{profile.full_name?.charAt(0)}</div>}
              </div>
              <div className="flex-grow text-center sm:text-left">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-sm leading-tight">{profile.full_name}</h1>
                <p className="text-orange-100 text-base sm:text-lg font-medium mt-1">@{profile.username}</p>
                <div className="flex items-center justify-center sm:justify-start gap-1.5 mt-2">
                  <Calendar className="w-3.5 h-3.5 text-violet-300" />
                  <p className="text-orange-200 text-xs font-medium">Member since {memberSince}</p>
                </div>
              </div>
            </div>

            {profile.bio && <p className="text-white/95 text-center sm:text-left max-w-3xl leading-relaxed mt-6 text-sm sm:text-base">{profile.bio}</p>}

            {/* Info Pills - Includes "Looking for Team" back in its original position */}
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-6">
              {academics[0] && (
                <div className="flex items-center gap-1.5 px-3.5 py-2 bg-white text-orange-800 rounded-lg text-xs sm:text-sm font-bold shadow-md">
                  <Building2 className="w-3.5 h-3.5" /> {academics[0].institution}
                </div>
              )}
              {profile.city && (
                <div className="flex items-center gap-1.5 px-3.5 py-2 bg-white text-orange-800 rounded-lg text-xs sm:text-sm font-bold shadow-md">
                  <MapPin className="w-3.5 h-3.5" /> {profile.city}
                </div>
              )}
              {profile.looking_for_team && (
                <div className="flex items-center gap-1.5 px-3.5 py-2 bg-orange-400 text-white rounded-lg text-xs sm:text-sm font-bold shadow-md ring-1 ring-orange-300/50">
                  <Users className="w-3.5 h-3.5" /> Looking for Team
                </div>
              )}
              <div className="flex items-center gap-1.5 px-3.5 py-2 bg-orange-500 text-white rounded-lg text-xs sm:text-sm font-bold shadow-md ring-1 ring-orange-400/50">
                <Flame className="w-3.5 h-3.5" /> {profile.current_streak || 0} Day Streak
              </div>
              <div className="flex items-center gap-1.5 px-3.5 py-2 bg-white/95 text-orange-800 rounded-lg text-xs sm:text-sm font-bold shadow-md">
                <Award className="w-3.5 h-3.5" /> {totalBadges} Badges
              </div>
            </div>

            {/* ACTION BUTTONS: Only Resume (if exists) */}
            {profile.resume_url && (
              <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-8 pt-6 border-t border-white/20">
                <a href={profile.resume_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white rounded-xl font-bold transition shadow-sm text-sm">
                  <FileText className="w-4 h-4" /> View Resume
                </a>
              </div>
            )}
          </div>
        </div>

        {/* TWO COLUMN LAYOUT */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-6">
            {profile.skills && profile.skills.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-5"><div className="p-1.5 bg-orange-50 text-orange-500 rounded-lg"><Code className="w-4 h-4" /></div><h2 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Skills</h2></div>
                <div className="flex flex-wrap gap-2">{profile.skills.map((skill: string) => <span key={skill} className="px-3 py-1.5 bg-slate-50 text-slate-700 text-xs font-bold rounded-lg border border-slate-200">{skill}</span>)}</div>
              </div>
            )}

            {academics.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-5"><div className="p-1.5 bg-orange-50 text-orange-500 rounded-lg"><GraduationCap className="w-4 h-4" /></div><h2 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Education</h2></div>
                <div className="space-y-5 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                  {academics.map((acad: any) => (
                    <div key={acad.id} className="relative flex items-start gap-4">
                      <div className="flex items-center justify-center w-4 h-4 bg-white border-2 border-orange-300 rounded-full mt-1 flex-shrink-0 z-10" />
                      <div><p className="font-bold text-slate-900 text-sm leading-tight">{acad.degree}</p><p className="text-xs text-slate-600 mt-0.5">{acad.institution}</p><p className="text-[10px] font-medium text-slate-400 mt-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> {acad.start_year || "?"} – {acad.end_year || "Present"}</p></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2"><div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg"><Award className="w-4 h-4" /></div><h2 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Featured Badges</h2></div>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-md">{totalBadges}</span>
              </div>
              {displayBadges.length > 0 ? (
                <div className="space-y-2.5">
                  {displayBadges.map((badge: any, i: number) => {
                    const Icon = IconMap[badge.iconName] || Award;
                    return (
                      <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border ${badge.bgColor} hover:shadow-sm transition`}>
                        <div className="p-2 rounded-lg bg-white shadow-sm"><Icon className={`w-5 h-5 ${badge.color}`} /></div>
                        <div className="flex-grow min-w-0"><p className="text-sm font-bold text-slate-900 truncate">{badge.title}</p></div>
                      </div>
                    );
                  })}
                  {totalBadges > 3 && <p className="text-[10px] text-center text-slate-400 pt-1 font-medium">+{totalBadges - 3} more badges</p>}
                </div>
              ) : <p className="text-sm text-slate-500 text-center py-4">No badges yet.</p>}
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm min-h-full">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
                <div className="p-1.5 bg-orange-50 text-orange-500 rounded-lg"><Code className="w-4 h-4" /></div>
                <h2 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Projects & Hackathons</h2>
                <span className="ml-auto px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-md">{projects.length}</span>
              </div>
              {projects.length > 0 ? (
                <div className="space-y-5">
                  {projects.map((proj: any) => (
                    <div key={proj.id} className="group p-5 bg-white border border-slate-200 rounded-xl hover:border-orange-300 hover:shadow-md transition-all">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 group-hover:text-orange-500 transition">{proj.title}</h3>
                          {proj.hackathon_name && <p className="text-xs font-bold text-orange-500 mt-1 flex items-center gap-1.5"><Award className="w-3.5 h-3.5" /> {proj.hackathon_name}</p>}
                        </div>
                        {proj.project_url && <a href={proj.project_url} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 hover:text-orange-500 hover:border-violet-300 hover:bg-white transition flex-shrink-0 shadow-sm" title="View Project"><ExternalLink className="w-4 h-4" /></a>}
                      </div>
                      {proj.description && <p className="text-sm text-slate-600 mb-4 leading-relaxed">{proj.description}</p>}
                      {proj.tech_stack && <div className="flex flex-wrap gap-2">{proj.tech_stack.split(',').map((tech: string) => <span key={tech} className="px-2.5 py-1 bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-bold uppercase tracking-wider rounded-md">{tech.trim()}</span>)}</div>}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16"><div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4"><Code className="w-8 h-8 text-slate-300" /></div><h3 className="text-slate-900 font-medium mb-1">No projects yet</h3><p className="text-sm text-slate-500 max-w-xs mx-auto">This user hasn't added any hackathon projects to their profile yet.</p></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  return (
    <Suspense fallback={<div className="max-w-5xl mx-auto px-4 py-12 animate-pulse space-y-8"><div className="h-80 bg-slate-200 rounded-3xl"></div><div className="grid grid-cols-3 gap-8"><div className="h-96 bg-slate-200 rounded-2xl"></div><div className="h-96 bg-slate-200 rounded-2xl col-span-2"></div></div></div>}>
      <PublicProfileContent username={username} />
    </Suspense>
  );
}
