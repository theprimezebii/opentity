"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getUserBadges } from "@/lib/badges";

export async function getBadgeStatus() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { newBadges: [], allBadgeIds: [] };

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (!profile) return { newBadges: [], allBadgeIds: [] };

  const { data: savedRelations } = await supabase.from("saved_events").select("event_id, events(*)").eq("user_id", user.id);
  const savedEvents = savedRelations?.map(r => r.events).filter(Boolean) || [];
  const { count: submissionCount } = await supabase.from("event_submissions").select("*", { count: "exact", head: true }).eq("submitter_email", profile.email || "");
  
  // Fetch referral count
  const { count: referralCount } = await supabase.from("profiles").select("*", { count: "exact", head: true }).eq("referred_by", user.id);

  const currentBadges = getUserBadges(profile, savedEvents, submissionCount || 0, referralCount || 0);
  const currentlyUnlockedIds = currentBadges.filter(b => b.unlocked).map(b => b.id);

  const { data: existingAwards } = await supabase.from("badge_awards").select("badge_id").eq("user_id", user.id);
  const awardedIds = existingAwards?.map(a => a.badge_id) || [];

  const newlyEarnedIds = currentlyUnlockedIds.filter(id => !awardedIds.includes(id));
  if (newlyEarnedIds.length > 0) {
    await supabase.from("badge_awards").insert(newlyEarnedIds.map(badge_id => ({ user_id: user.id, badge_id })));
  }

  const allOwnedIds = Array.from(new Set([...awardedIds, ...currentlyUnlockedIds]));
  const seenIds = profile.seen_badges || [];
  const newBadges = allOwnedIds.filter(id => !seenIds.includes(id));

  return { newBadges, allBadgeIds: allOwnedIds };
}

export async function markBadgesAsSeen(badgeIds: string[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { data: profile } = await supabase.from("profiles").select("seen_badges").eq("id", user.id).single();
  const existingSeen = profile?.seen_badges || [];
  const updatedSeen = Array.from(new Set([...existingSeen, ...badgeIds]));

  await supabase.from("profiles").update({ seen_badges: updatedSeen }).eq("id", user.id);
  revalidatePath("/dashboard");
  return { success: true };
}
