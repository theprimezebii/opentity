"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function checkInDaily() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { error: "You must be logged in to check in." };

  // 1. Fetch the user's profile to get the last check-in date
  const { data: profile } = await supabase
    .from("profiles")
    .select("last_check_in, current_streak, longest_streak")
    .eq("id", user.id)
    .single();

  if (!profile) return { error: "Profile not found." };

  const today = new Date();
  const lastCheckIn = profile.last_check_in ? new Date(profile.last_check_in) : null;

  // 2. Check if they already checked in today
  if (lastCheckIn && lastCheckIn.toDateString() === today.toDateString()) {
    return { error: "You have already checked in today!" };
  }

  // 3. Calculate the new streak
  let newStreak = 1;
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (lastCheckIn && lastCheckIn.toDateString() === yesterday.toDateString()) {
    newStreak = (profile.current_streak || 0) + 1;
  }

  const newLongestStreak = Math.max(newStreak, profile.longest_streak || 0);

  // 4. Update the profile and insert the daily check-in record
  const [updateRes, insertRes] = await Promise.all([
    supabase.from("profiles").update({
      last_check_in: today.toISOString(),
      current_streak: newStreak,
      longest_streak: newLongestStreak,
    }).eq("id", user.id),
    supabase.from("daily_checkins").insert({
      user_id: user.id,
      checkin_date: today.toISOString().split("T")[0], // YYYY-MM-DD
    })
  ]);

  if (updateRes.error || insertRes.error) {
    return { error: "Failed to save check-in. Please try again." };
  }

  // 5. Revalidate the dashboard and quests pages to show the updated state
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/quests");
  
  return { success: "Checked in successfully! +1 Point" };
}

// Alias function for backwards compatibility with StreakCard
export async function dailyCheckIn() {
  return await checkInDaily();
}
