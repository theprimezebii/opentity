"use server";

import { createClient } from "@/lib/supabase/server";

export async function getMyReferrals() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { count: 0, referrals: [], referrerName: null };

  // 1. Get users who signed up with my code
  const { data: referrals } = await supabase
    .from("profiles")
    .select("id, full_name, email, created_at, university")
    .eq("referred_by", user.id)
    .order("created_at", { ascending: false });

  // 2. Check if I was referred by someone
  const { data: myProfile } = await supabase
    .from("profiles")
    .select("referred_by, profiles!referred_by(full_name, email)")
    .eq("id", user.id)
    .single();

  const referrerName = myProfile?.profiles 
    ? ((myProfile.profiles as any).full_name || (myProfile.profiles as any).email?.split("@")[0])
    : null;

  return {
    count: referrals?.length || 0,
    referrals: (referrals || []).map(r => ({
      name: r.full_name || r.email?.split("@")[0] || "Student",
      joinedAt: r.created_at,
      university: r.university
    })),
    referrerName
  };
}
