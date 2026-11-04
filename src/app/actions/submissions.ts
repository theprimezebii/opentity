"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function parseDate(value: any) {
  if (!value) return null;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

function buildPayload(formData: FormData) {
  const startDate = parseDate(formData.get("start_date"));
  const endDate = parseDate(formData.get("end_date"));
  const regStart = parseDate(formData.get("registration_start_date"));
  const regDeadline = parseDate(formData.get("registration_deadline"));
  
  return {
    startDate, endDate, regStart, regDeadline,
    payload: {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      event_type: formData.get("event_type") as string,
      category: formData.get("category") as string,
      format: formData.get("format") as string,
      city: formData.get("city") as string || null,
      location: formData.get("location") as string || null,
      start_date: startDate ? startDate.toISOString() : null,
      end_date: endDate ? endDate.toISOString() : null,
      registration_start_date: regStart ? regStart.toISOString() : null,
      registration_deadline: regDeadline ? regDeadline.toISOString() : null,
      prize_pool: formData.get("prize_pool") as string || null,
      eligibility: formData.get("eligibility") as string || null,
      registration_url: formData.get("registration_url") as string,
      organizer: formData.get("organizer") as string || null,
      organizer_contact: formData.get("organizer_contact") as string || null,
      image_url: formData.get("image_url") as string || null,
    }
  };
}

function validateDates(startDate: Date | null, endDate: Date | null, regStart: Date | null, regDeadline: Date | null): string | null {
  if (startDate && endDate && endDate < startDate) return "End date cannot be before the start date.";
  if (startDate && regDeadline && regDeadline > startDate) return "Registration deadline cannot be after the event start date.";
  if (regStart && regDeadline && regDeadline < regStart) return "Registration deadline cannot be before the registration start date.";
  return null;
}

export async function submitPublicEvent(prevState: any, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const rawFormData = Object.fromEntries(formData.entries());

  if (!user) return { error: "You must be logged in to submit an event.", formData: rawFormData };

  const { startDate, endDate, regStart, regDeadline, payload } = buildPayload(formData);
  const dateError = validateDates(startDate, endDate, regStart, regDeadline);
  if (dateError) return { error: dateError, formData: rawFormData };

  const data = { ...payload, submitted_by: user.id, submitter_email: user.email, status: "pending" };
  const { error } = await supabase.from("event_submissions").insert(data);
  if (error) return { error: `Failed to submit: ${error.message}`, formData: rawFormData };

  revalidatePath("/dashboard/submissions");
  revalidatePath("/admin/submissions");
  return { success: "Event submitted successfully! Our team will review it shortly." };
}

export async function updatePublicSubmission(prevState: any, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const rawFormData = Object.fromEntries(formData.entries());

  if (!user) return { error: "You must be logged in to edit an event.", formData: rawFormData };

  const submissionId = formData.get("submission_id") as string;
  if (!submissionId) return { error: "Invalid submission.", formData: rawFormData };

  const { data: existing } = await supabase
    .from("event_submissions")
    .select("id, submitted_by, status")
    .eq("id", submissionId)
    .single();

  if (!existing || existing.submitted_by !== user.id) {
    return { error: "Submission not found.", formData: rawFormData };
  }
  if (existing.status === "approved") {
    return { error: "Approved submissions cannot be edited.", formData: rawFormData };
  }

  const { startDate, endDate, regStart, regDeadline, payload } = buildPayload(formData);
  const dateError = validateDates(startDate, endDate, regStart, regDeadline);
  if (dateError) return { error: dateError, formData: rawFormData };

  const { error } = await supabase
    .from("event_submissions")
    .update({ ...payload, status: "pending", reviewer_notes: null })
    .eq("id", submissionId)
    .eq("submitted_by", user.id)
    .in("status", ["pending", "rejected"]);

  if (error) return { error: `Failed to update: ${error.message}`, formData: rawFormData };

  revalidatePath("/dashboard/submissions");
  revalidatePath("/admin/submissions");
  return { success: "Submission resubmitted! Our team will review it again." };
}

export async function approveSubmission(input: FormData | string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const { data: adminProfile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (adminProfile?.role !== "admin") return { error: "Admin access required." };

  const submissionId = typeof input === "string" ? input : (input.get("id") as string);
  if (!submissionId) return { error: "Submission ID missing." };

  const { data: sub } = await supabase.from("event_submissions").select("*").eq("id", submissionId).single();
  if (!sub) return { error: "Submission not found." };
  if (sub.status !== "pending") return { error: "Already reviewed." };

  const baseSlug = sub.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
  let slug = baseSlug || "event-" + Date.now();
  let attempts = 0;
  while (attempts < 5) {
    const { data: existing } = await supabase.from("events").select("id").eq("slug", slug).maybeSingle();
    if (!existing) break;
    slug = baseSlug + "-" + Math.random().toString(36).slice(2, 6);
    attempts++;
  }

  const { error: insertError } = await supabase.from("events").insert({
    title: sub.title,
    slug,
    description: sub.description || null,
    image_url: sub.image_url || null,
    category: sub.category,
    format: sub.format,
    city: sub.city,
    location: sub.location,
    start_date: sub.start_date,
    end_date: sub.end_date,
    registration_start_date: sub.registration_start_date,
    registration_deadline: sub.registration_deadline,
    prize_pool: sub.prize_pool,
    eligibility: sub.eligibility,
    registration_url: sub.registration_url,
    organizer: sub.organizer,
    event_type: sub.event_type || "Hackathon",
    status: "upcoming",
    is_featured: false,
    is_sponsored: false,
  });

  if (insertError) return { error: "Failed to create event: " + insertError.message };

  const { error: updateError } = await supabase.from("event_submissions").update({ status: "approved" }).eq("id", submissionId);
  if (updateError) return { error: "Event created but status update failed." };

  revalidatePath("/admin/submissions");
  revalidatePath("/events");
  revalidatePath("/");
  revalidatePath("/dashboard/submissions");
  return { success: "Submission approved!" };
}

export async function rejectSubmission(input: FormData | string, notes?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const { data: adminProfile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (adminProfile?.role !== "admin") return { error: "Admin access required." };

  const submissionId = typeof input === "string" ? input : (input.get("id") as string);
  const reviewerNotes = notes || (typeof input === "string" ? "" : ((input.get("reviewer_notes") as string) || ""));

  if (!submissionId) return { error: "Submission ID missing." };

  const { error } = await supabase.from("event_submissions").update({
    status: "rejected",
    reviewer_notes: reviewerNotes || "Submission rejected. Please review the details and resubmit.",
  }).eq("id", submissionId).eq("status", "pending");

  if (error) return { error: "Failed to reject: " + error.message };

  revalidatePath("/admin/submissions");
  revalidatePath("/dashboard/submissions");
  return { success: "Submission rejected." };
}

// ============================================
// UTILITY ACTIONS
// ============================================

export async function checkUrlHealth(url: string) {
  if (!url || !url.startsWith("http")) return { valid: false, error: "Invalid URL format" };
  
  try {
    const response = await fetch(url, { method: 'HEAD', headers: { 'User-Agent': 'Mozilla/5.0' } });
    return { valid: response.ok, status: response.status };
  } catch (e) {
    // If fetch fails (e.g., CORS or site blocks HEAD), assume it might be valid but unverifiable
    return { valid: true, warning: "Could not verify link automatically." };
  }
}

export async function checkDuplicateTitle(title: string) {
  if (!title || title.length < 5) return { exists: false };
  
  const supabase = await createClient();
  const { data } = await supabase
    .from("events")
    .select("title")
    .ilike("title", `%${title}%`)
    .limit(1);

  if (data && data.length > 0) {
    return { exists: true, matchedTitle: data[0].title };
  }
  return { exists: false };
}
