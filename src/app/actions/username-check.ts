"use server";

import { createClient } from "@/lib/supabase/server";

export async function checkUsernameAvailability(username: string): Promise<{ available: boolean, message: string }> {
  if (!username || username.length < 3) {
    return { available: false, message: "Username must be at least 3 characters." };
  }
  
  if (username.length > 20) {
    return { available: false, message: "Username cannot exceed 20 characters." };
  }

  // Cannot start or end with an underscore, must be lowercase letters, numbers, underscores
  if (!/^[a-z0-9]([a-z0-9_]*[a-z0-9])?$/.test(username)) {
    return { available: false, message: "Cannot start or end with an underscore." };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { available: false, message: "Not logged in." };

  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username)
    .neq("id", user.id)
    .maybeSingle();

  if (existing) {
    return { available: false, message: "This username is already taken." };
  }

  return { available: true, message: "Username is available!" };
}
