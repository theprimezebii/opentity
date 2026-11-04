"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function generateBaseSlug(name: string) {
  return name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '_');
}

export async function createTeam(prevState: any, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { data: existing } = await supabase.from("team_members").select("id").eq("user_id", user.id).maybeSingle();
  if (existing) return { error: "You are already in a team." };

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const looking_for_members = formData.get("looking_for_members") === "on";
  if (!name) return { error: "Team name is required." };

  let baseSlug = generateBaseSlug(name);
  if (!baseSlug) baseSlug = "team";
  let slug = baseSlug;
  let counter = 1;
  
  while (true) {
    const { data: slugCheck } = await supabase.from("teams").select("id").eq("slug", slug).maybeSingle();
    if (!slugCheck) break;
    slug = `${baseSlug}_${counter}`;
    counter++;
  }

  const { data: team, error } = await supabase.from("teams").insert({
    name, slug, description, looking_for_members, created_by: user.id
  }).select().single();

  if (error || !team) return { error: error?.message || "Failed to create team." };

  await supabase.from("team_members").insert({ team_id: team.id, user_id: user.id, role: "leader" });
  revalidatePath("/dashboard/teams");
  return { success: "Team created successfully!" };
}

export async function updateTeam(teamId: string, prevState: any, formData: FormData) {
  const supabase = await createClient();
  const name = formData.get("name") as string;
  const slug = (formData.get("slug") as string)?.toLowerCase().trim().replace(/[^a-z0-9_]/g, "");
  const description = formData.get("description") as string;
  const logo_url = formData.get("logo_url") as string;
  const looking_for_members = formData.get("looking_for_members") === "on";

  if (!name) return { error: "Name is required." };
  if (!slug || slug.length < 3) return { error: "Team ID must be at least 3 characters." };
  if (slug.length > 30) return { error: "Team ID cannot exceed 30 characters." };
  if (!/^[a-z0-9]([a-z0-9_]*[a-z0-9])?$/.test(slug)) return { error: "Team ID cannot start or end with an underscore." };

  // Check slug uniqueness
  const { data: existingSlug } = await supabase.from("teams").select("id").eq("slug", slug).neq("id", teamId).maybeSingle();
  if (existingSlug) return { error: "This Team ID is already taken." };

  const { error } = await supabase.from("teams").update({ name, slug, description, logo_url: logo_url || null, looking_for_members }).eq("id", teamId);
  if (error) return { error: error.message };
  
  revalidatePath("/dashboard/teams");
  return { success: "Team updated successfully!" };
}

export async function deleteTeam(teamId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("teams").delete().eq("id", teamId);
  if (error) return { error: error.message };
  revalidatePath("/dashboard/teams");
  return { success: "Team deleted successfully!" };
}

export async function inviteUser(teamId: string, userId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("team_invites").insert({ team_id: teamId, user_id: userId });
  if (error) return { error: "Invite already sent or user unavailable." };
  revalidatePath("/dashboard/teams");
  return { success: "Invite sent!" };
}

export async function respondToInvite(inviteId: string, accept: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  if (accept) {
    const { data: invite } = await supabase.from("team_invites").select("*").eq("id", inviteId).single();
    if (invite) {
      const { data: existing } = await supabase.from("team_members").select("id").eq("user_id", user.id).maybeSingle();
      if (!existing) await supabase.from("team_members").insert({ team_id: invite.team_id, user_id: user.id, role: "member" });
    }
  }
  await supabase.from("team_invites").update({ status: accept ? "accepted" : "rejected" }).eq("id", inviteId);
  revalidatePath("/dashboard/teams");
  return { success: accept ? "Joined team!" : "Invite declined." };
}

export async function removeMember(teamId: string, userId: string) {
  const supabase = await createClient();
  await supabase.from("team_members").delete().eq("team_id", teamId).eq("user_id", userId);
  revalidatePath("/dashboard/teams");
  return { success: "Member removed." };
}

export async function leaveTeam(teamId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };
  await supabase.from("team_members").delete().eq("team_id", teamId).eq("user_id", user.id);
  revalidatePath("/dashboard/teams");
  return { success: "Left team." };
}

export async function addEventSquad(teamId: string, prevState: any, formData: FormData) {
  const supabase = await createClient();
  const name = formData.get("name") as string;
  const event_id = formData.get("event_id") as string;
  const member_ids = formData.getAll("member_ids");
  
  if (!name || !event_id || member_ids.length === 0) return { error: "All fields are required." };

  const { error } = await supabase.from("team_events").insert({ team_id: teamId, name, event_id, member_ids });
  if (error) {
    if (error.code === '23505') return { error: "A squad with this name already exists." };
    return { error: error.message };
  }
  revalidatePath("/dashboard/teams");
  return { success: "Squad created!" };
}

export async function updateEventSquad(squadId: string, prevState: any, formData: FormData) {
  const supabase = await createClient();
  const name = formData.get("name") as string;
  const event_id = formData.get("event_id") as string;
  const member_ids = formData.getAll("member_ids");
  
  if (!name || !event_id || member_ids.length === 0) return { error: "All fields are required." };

  const { error } = await supabase.from("team_events").update({ name, event_id, member_ids }).eq("id", squadId);
  if (error) {
    if (error.code === '23505') return { error: "A squad with this name already exists." };
    return { error: error.message };
  }
  revalidatePath("/dashboard/teams");
  return { success: "Squad updated!" };
}

export async function deleteEventSquad(squadId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("team_events").delete().eq("id", squadId);
  if (error) return { error: error.message };
  revalidatePath("/dashboard/teams");
  return { success: "Squad deleted." };
}

export async function requestToJoin(teamId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };
  const { error } = await supabase.from("team_requests").insert({ team_id: teamId, user_id: user.id });
  if (error) return { error: "Request already sent." };
  revalidatePath("/dashboard/teams");
  return { success: "Request sent!" };
}

export async function handleRequest(requestId: string, accept: boolean) {
  const supabase = await createClient();
  if (accept) {
    const { data: request } = await supabase.from("team_requests").select("*").eq("id", requestId).single();
    if (request) await supabase.from("team_members").insert({ team_id: request.team_id, user_id: request.user_id, role: "member" });
  }
  await supabase.from("team_requests").update({ status: accept ? "accepted" : "rejected" }).eq("id", requestId);
  revalidatePath("/dashboard/teams");
  return { success: accept ? "Request accepted." : "Request rejected." };
}
