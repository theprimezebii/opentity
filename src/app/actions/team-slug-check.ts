"use server";

import { createClient } from "@/lib/supabase/server";

export async function checkTeamSlugAvailability(slug: string, currentTeamId: string): Promise<{ available: boolean, message: string }> {
  const cleaned = slug.toLowerCase().trim().replace(/[^a-z0-9_]/g, "");

  if (cleaned.length < 3) {
    return { available: false, message: "Team ID must be at least 3 characters." };
  }
  
  if (cleaned.length > 30) {
    return { available: false, message: "Team ID cannot exceed 30 characters." };
  }

  if (!/^[a-z0-9]([a-z0-9_]*[a-z0-9])?$/.test(cleaned)) {
    return { available: false, message: "Cannot start or end with an underscore." };
  }

  const supabase = await createClient();
  
  const { data: existing } = await supabase
    .from("teams")
    .select("id")
    .eq("slug", cleaned)
    .neq("id", currentTeamId)
    .maybeSingle();

  if (existing) {
    return { available: false, message: "This Team ID is already taken." };
  }

  return { available: true, message: "Team ID is available!" };
}
