"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function toggleSaveEvent(eventId: string, pathname: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in to save events." };
  }

  // Check if the event is already saved (single fast query)
  const { data: existing } = await supabase
    .from("saved_events")
    .select("id")
    .eq("user_id", user.id)
    .eq("event_id", eventId)
    .maybeSingle();

  if (existing) {
    // Unsave
    const { error } = await supabase
      .from("saved_events")
      .delete()
      .eq("user_id", user.id)
      .eq("event_id", eventId);

    if (error) return { error: "Failed to remove event. Please try again." };

    revalidatePath("/dashboard/saved");
    revalidatePath("/events/saved");
    return { success: "Event removed from saved.", action: "unsaved" };
  } else {
    // Save
    const { error } = await supabase
      .from("saved_events")
      .insert({ user_id: user.id, event_id: eventId });

    if (error) return { error: "Failed to save event. Please try again." };

    revalidatePath("/dashboard/saved");
    revalidatePath("/events/saved");
    return { success: "Event saved successfully!", action: "saved" };
  }
}
