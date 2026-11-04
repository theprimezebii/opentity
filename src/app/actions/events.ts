"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import { z } from "zod";

const EventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title cannot exceed 100 characters"),
  description: z.string().max(5000, "Description is too long (max 5000 characters)").optional(),
  event_type: z.string().default("Hackathon"),
  category: z.string().default("Other"),
  format: z.string().default("Online"),
  city: z.string().max(50, "City name is too long").optional(),
  location: z.string().max(150, "Location details are too long (max 150 characters)").optional(),
  registration_start_date: z.string().optional(),
  registration_deadline: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  prize_amount: z.string().optional(),
  prize_currency: z.string().default("PKR"),
  eligibility: z.string().max(250, "Eligibility text is too long (max 250 characters)").optional(),
  registration_url: z.string().optional(),
  organizer: z.string().max(100, "Organizer name is too long (max 100 characters)").optional(),
});

export async function createEvent(prevState: any, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== 'admin' && profile?.role !== 'contributor') return { error: "Unauthorized" };

  const isDraft = formData.get("submit_action") === "draft";
  const rawData = Object.fromEntries(formData.entries());
  
  const parsed = EventSchema.safeParse(rawData);
  if (!parsed.success) return { error: parsed.error.issues[0].message, formData: rawData };

  const data = parsed.data;

  if (!isDraft) {
    if (!data.description || data.description.length < 10) return { error: "Description must be at least 10 characters to publish.", formData: rawData };
    if (!data.registration_start_date || !data.registration_deadline || !data.start_date || !data.end_date) return { error: "All dates are required to publish.", formData: rawData };
    if (!data.registration_url) return { error: "Registration URL is required to publish.", formData: rawData };
    if (!z.string().url().safeParse(data.registration_url).success) return { error: "Registration URL must be valid.", formData: rawData };
  }

  const prize_amount = data.prize_amount ? parseFloat(data.prize_amount) : null;
  let slug = slugify(data.title).slice(0, 60);
  if (!slug) slug = "event";
  
  const { data: existing } = await supabase.from("events").select("id").eq("slug", slug).maybeSingle();
  if (existing) slug = `${slug}-${Math.random().toString(36).substring(2, 6)}`;

  const dbData = {
    ...data,
    description: data.description || null,
    registration_start_date: data.registration_start_date || null,
    registration_deadline: data.registration_deadline || null,
    start_date: data.start_date || null,
    end_date: data.end_date || null,
    registration_url: data.registration_url || null,
    status: isDraft ? "draft" : "upcoming",
    prize_amount,
    prize_pool: prize_amount ? `${data.prize_currency} ${prize_amount.toLocaleString()}` : null,
    slug
  };

  const { error } = await supabase.from("events").insert(dbData);

  if (error) return { error: error.message, formData: rawData };

  revalidatePath("/events");
  revalidatePath("/admin/events");
  revalidatePath("/");
  
  const isContributor = profile?.role === "contributor";
  const dest = isContributor ? "/dashboard?success=" : "/admin/events?success=";
  redirect(dest + encodeURIComponent(isDraft ? "Event saved as draft!" : "Event published successfully!"));
}

export async function updateEvent(eventId: string, prevState: any, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== 'admin') return { error: "Unauthorized" };

  const isDraft = formData.get("submit_action") === "draft";
  const rawData = Object.fromEntries(formData.entries());
  
  const parsed = EventSchema.safeParse(rawData);
  if (!parsed.success) return { error: parsed.error.issues[0].message, formData: rawData };

  const data = parsed.data;

  if (!isDraft) {
    if (!data.description || data.description.length < 10) return { error: "Description must be at least 10 characters to publish.", formData: rawData };
    if (!data.registration_start_date || !data.registration_deadline || !data.start_date || !data.end_date) return { error: "All dates are required to publish.", formData: rawData };
    if (!data.registration_url) return { error: "Registration URL is required to publish.", formData: rawData };
    if (!z.string().url().safeParse(data.registration_url).success) return { error: "Registration URL must be valid.", formData: rawData };
  }

  const prize_amount = data.prize_amount ? parseFloat(data.prize_amount) : null;
  let newSlug = slugify(data.title).slice(0, 60);
  if (!newSlug) newSlug = "event";
  
  const { data: existing } = await supabase.from("events").select("id").eq("slug", newSlug).neq("id", eventId).maybeSingle();
  if (existing) newSlug = `${newSlug}-${Math.random().toString(36).substring(2, 6)}`;

  const dbData = {
    ...data,
    description: data.description || null,
    registration_start_date: data.registration_start_date || null,
    registration_deadline: data.registration_deadline || null,
    start_date: data.start_date || null,
    end_date: data.end_date || null,
    registration_url: data.registration_url || null,
    status: isDraft ? "draft" : "upcoming",
    prize_amount,
    prize_pool: prize_amount ? `${data.prize_currency} ${prize_amount.toLocaleString()}` : null,
    slug: newSlug
  };

  const { error } = await supabase.from("events").update(dbData).eq("id", eventId);

  if (error) return { error: error.message, formData: rawData };

  revalidatePath("/events");
  revalidatePath("/admin/events");
  revalidatePath("/");
  redirect("/admin/events?success=" + encodeURIComponent(isDraft ? "Event updated as draft!" : "Event updated successfully!"));
}

// ... (keep toggleFeaturedEvent, publishDraft, deleteEvent exactly as they were)
export async function toggleFeaturedEvent(eventId: string, currentStatus: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== 'admin') return redirect("/dashboard");
  await supabase.from("events").update({ is_featured: !currentStatus }).eq("id", eventId);
  revalidatePath("/");
  revalidatePath("/events");
  revalidatePath("/admin/events");
  redirect("/admin/events?success=" + encodeURIComponent(!currentStatus ? "Event featured on homepage!" : "Event removed from featured."));
}

export async function publishDraft(eventId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== 'admin') return redirect("/dashboard");
  await supabase.from("events").update({ status: "upcoming" }).eq("id", eventId);
  revalidatePath("/events");
  revalidatePath("/admin/events");
  revalidatePath("/");
  redirect("/admin/events?success=" + encodeURIComponent("Draft published successfully!"));
}

export async function deleteEvent(eventId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== 'admin') return redirect("/dashboard");
  await supabase.from("events").delete().eq("id", eventId);
  revalidatePath("/events");
  revalidatePath("/admin/events");
  revalidatePath("/");
  redirect("/admin/events?success=" + encodeURIComponent("Event deleted successfully!"));
}
