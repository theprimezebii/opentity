"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

interface Result {
  success?: string;
  error?: string;
}

async function assertAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, error: "Not signed in", supabase };
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") return { ok: false as const, error: "Admin only", supabase };
  return { ok: true as const, supabase };
}

export async function updateStatsFloors(prevState: Result | null, formData: FormData): Promise<Result> {
  const auth = await assertAdmin();
  if (!auth.ok) return { error: auth.error };

  const events = formData.get("events_floor") as string;
  const students = formData.get("students_floor") as string;
  const cities = formData.get("cities_floor") as string;
  // Unchecked checkbox is absent from FormData — only "on" when checked
  const showReal = formData.get("stats_show_real") === "on";

  const parse = (v: string) => {
    const n = parseInt(v || "", 10);
    return Number.isFinite(n) && n >= 0 ? n : null;
  };

  const e = parse(events);
  const s = parse(students);
  const c = parse(cities);

  if (e === null || s === null || c === null) {
    return { error: "All values must be non-negative whole numbers." };
  }

  const rows = [
    { key: "stats_events_floor", value: String(e) },
    { key: "stats_students_floor", value: String(s) },
    { key: "stats_cities_floor", value: String(c) },
    { key: "stats_show_real", value: showReal ? "true" : "false" },
  ];

  const { error } = await auth.supabase
    .from("site_settings")
    .upsert(rows, { onConflict: "key" });

  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/admin/homepage");
  return { success: "Homepage settings updated." };
}
