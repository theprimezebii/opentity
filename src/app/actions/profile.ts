"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const CURRENT_YEAR = new Date().getFullYear();

const ProfileSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters").max(100, "Full name cannot exceed 100 characters"),
  username: z.string().min(3, "Username must be at least 3 characters").max(20, "Username cannot exceed 20 characters").regex(/^[a-z0-9]([a-z0-9_]*[a-z0-9])?$/, "Username cannot start or end with an underscore"),
  city: z.string().max(50, "City name is too long").optional(),
  bio: z.string().max(250, "Bio cannot exceed 250 characters").optional(),
  skills: z.string().max(300, "Skills list cannot exceed 300 characters").optional(),
  linkedin_url: z.string().url("Invalid LinkedIn URL").max(255, "URL is too long").optional().or(z.literal("")),
  github_url: z.string().url("Invalid GitHub URL").max(255, "URL is too long").optional().or(z.literal("")),
  portfolio_url: z.string().url("Invalid Portfolio URL").max(255, "URL is too long").optional().or(z.literal("")),
  twitter_url: z.string().url("Invalid Twitter URL").max(255, "URL is too long").optional().or(z.literal("")),
  resume_url: z.string().url("Invalid Resume URL").max(255, "URL is too long").optional().or(z.literal("")),
  avatar_url: z.string().optional(),
  looking_for_team: z.string().optional(),
});

export async function updateProfile(prevState: any, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const rawData = Object.fromEntries(formData.entries());
  const parsed = ProfileSchema.safeParse(rawData);
  if (!parsed.success) return { error: parsed.error.issues[0].message, formData: rawData };

  const data = parsed.data;
  const { data: existing } = await supabase.from("profiles").select("id").eq("username", data.username).neq("id", user.id).maybeSingle();
  if (existing) return { error: "This username is already taken. Please choose another.", formData: rawData };

  const skills = data.skills ? data.skills.split(",").map(s => s.trim()).filter(Boolean) : [];

  const { error } = await supabase.from("profiles").update({
    full_name: data.full_name,
    username: data.username,
    avatar_url: data.avatar_url || null,
    city: data.city || null,
    bio: data.bio || null,
    linkedin_url: data.linkedin_url || null,
    github_url: data.github_url || null,
    portfolio_url: data.portfolio_url || null,
    twitter_url: data.twitter_url || null,
    resume_url: data.resume_url || null,
    skills: skills,
    looking_for_team: data.looking_for_team === "on",
  }).eq("id", user.id);

  if (error) return { error: error.message, formData: rawData };
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/profile");
  return { success: "Profile updated successfully!" };
}

export async function updateFeaturedBadges(badgeIds: string[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase.from("profiles").update({ featured_badges: badgeIds }).eq("id", user.id);
  if (error) return { error: error.message };
  
  revalidatePath("/dashboard/profile");
  return { success: "Featured badges updated!" };
}

// ... keep existing Academic and Project actions below (copy from previous code) ...
function validateYears(start_year: number | null, end_year: number | null) {
  if (start_year && start_year > CURRENT_YEAR) return `Start year cannot be in the future. Current year is ${CURRENT_YEAR}.`;
  if (start_year && end_year && start_year > end_year) return "Start year cannot be after end year.";
  return null;
}

export async function addAcademic(prevState: any, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const rawData = Object.fromEntries(formData.entries());
  const institution = (formData.get("institution") as string)?.trim();
  const degree = (formData.get("degree") as string)?.trim();
  const start_year = formData.get("start_year") ? parseInt(formData.get("start_year") as string) : null;
  const end_year = formData.get("end_year") ? parseInt(formData.get("end_year") as string) : null;

  if (!institution) return { error: "Institution name is required.", formData: rawData };
  if (!degree) return { error: "Degree is required.", formData: rawData };
  const yearError = validateYears(start_year, end_year);
  if (yearError) return { error: yearError, formData: rawData };

  const { error } = await supabase.from("academics").insert({ user_id: user.id, institution, degree, start_year, end_year });
  if (error) return { error: error.message, formData: rawData };
  revalidatePath("/dashboard/profile");
  return { success: "Academic record added!" };
}

export async function updateAcademic(id: string, prevState: any, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const rawData = Object.fromEntries(formData.entries());
  const institution = (formData.get("institution") as string)?.trim();
  const degree = (formData.get("degree") as string)?.trim();
  const start_year = formData.get("start_year") ? parseInt(formData.get("start_year") as string) : null;
  const end_year = formData.get("end_year") ? parseInt(formData.get("end_year") as string) : null;

  if (!institution) return { error: "Institution name is required.", formData: rawData };
  if (!degree) return { error: "Degree is required.", formData: rawData };
  const yearError = validateYears(start_year, end_year);
  if (yearError) return { error: yearError, formData: rawData };

  const { error } = await supabase.from("academics").update({ institution, degree, start_year, end_year }).eq("id", id).eq("user_id", user.id);
  if (error) return { error: error.message, formData: rawData };
  revalidatePath("/dashboard/profile");
  return { success: "Academic record updated!" };
}

export async function deleteAcademic(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("academics").delete().eq("id", id).eq("user_id", user.id);
  revalidatePath("/dashboard/profile");
}

export async function addProject(prevState: any, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const rawData = Object.fromEntries(formData.entries());
  const title = (formData.get("title") as string)?.trim();
  if (!title) return { error: "Project title is required.", formData: rawData };
  if (title.length > 100) return { error: "Project title cannot exceed 100 characters.", formData: rawData };

  const { error } = await supabase.from("projects").insert({ user_id: user.id, title, description: formData.get("description") as string, tech_stack: formData.get("tech_stack") as string, project_url: formData.get("project_url") as string, hackathon_name: formData.get("hackathon_name") as string });
  if (error) return { error: error.message, formData: rawData };
  revalidatePath("/dashboard/profile");
  return { success: "Project added!" };
}

export async function updateProject(id: string, prevState: any, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const rawData = Object.fromEntries(formData.entries());
  const title = (formData.get("title") as string)?.trim();
  if (!title) return { error: "Project title is required.", formData: rawData };
  if (title.length > 100) return { error: "Project title cannot exceed 100 characters.", formData: rawData };

  const { error } = await supabase.from("projects").update({ title, description: formData.get("description") as string, tech_stack: formData.get("tech_stack") as string, project_url: formData.get("project_url") as string, hackathon_name: formData.get("hackathon_name") as string }).eq("id", id).eq("user_id", user.id);
  if (error) return { error: error.message, formData: rawData };
  revalidatePath("/dashboard/profile");
  return { success: "Project updated!" };
}

export async function deleteProject(projectId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("projects").delete().eq("id", projectId).eq("user_id", user.id);
  revalidatePath("/dashboard/profile");
}
