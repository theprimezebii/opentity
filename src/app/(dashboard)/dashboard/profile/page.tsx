import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { ProfileForm } from "@/components/public/ProfileForm";
import { ProjectsManager } from "@/components/public/ProjectsManager";
import { AcademicsManager } from "@/components/public/AcademicsManager";
import { FeaturedBadgesSelector } from "@/components/public/FeaturedBadgesSelector";
import { BottomSaveButton } from "@/components/public/BottomSaveButton";
import { getUserBadges } from "@/lib/badges";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";

export const metadata = { title: "Profile Settings" };
export const instant = false;

async function ProfileContent() {
  await connection();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (!profile) redirect("/dashboard");

  const [projectsRes, academicsRes, badgesRes] = await Promise.all([
    supabase.from("projects").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
    supabase.from("academics").select("*").eq("user_id", user.id).order("end_year", { ascending: false }),
    supabase.from("badge_awards").select("badge_id").eq("user_id", user.id),
  ]);

  // Prepare available badges for featured selector
  const allBadgeDefs = getUserBadges(profile, [], 0, 0);
  const availableBadges = (badgesRes.data || []).map((awarded: any) => {
    const def = allBadgeDefs.find(b => b.id === awarded.badge_id);
    return { id: awarded.badge_id, title: def?.title || awarded.badge_id, color: def?.color || "", bgColor: def?.bgColor || "" };
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-3 transition">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Profile Settings</h1>
          <p className="text-slate-500 mt-1">Manage your personal info, education, and projects.</p>
        </div>
        {profile.username && (
          <Link href={`/u/${profile.username}`} target="_blank" className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition shadow-sm flex-shrink-0">
            View Public Profile <ExternalLink className="w-4 h-4" />
          </Link>
        )}
      </div>

      <ProfileForm profile={profile} academicCount={academicsRes.data?.length || 0} />
      
      <div className="mt-8 space-y-6">
        <FeaturedBadgesSelector availableBadges={availableBadges} currentFeatured={profile.featured_badges || []} />
        <AcademicsManager academics={academicsRes.data || []} />
        <ProjectsManager projects={projectsRes.data || []} />
      </div>

      <BottomSaveButton />
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto p-12 animate-pulse space-y-6"><div className="h-8 bg-slate-200 w-48 rounded"></div><div className="h-96 bg-slate-200 rounded-xl"></div></div>}>
      <ProfileContent />
    </Suspense>
  );
}
