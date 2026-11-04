import { createClient } from "@/lib/supabase/server";

export interface SiteSettings {
  events_floor: number;
  students_floor: number;
  cities_floor: number;
  show_real: boolean;
}

const DEFAULTS: SiteSettings = {
  events_floor: 500,
  students_floor: 10000,
  cities_floor: 10,
  show_real: false,
};

function parsePositiveInt(v: string | undefined, fallback: number): number {
  const n = parseInt(v || "", 10);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("site_settings").select("key, value");
    const map: Record<string, string> = {};
    (data || []).forEach((row: any) => {
      map[row.key] = row.value;
    });
    return {
      events_floor: parsePositiveInt(map["stats_events_floor"], DEFAULTS.events_floor),
      students_floor: parsePositiveInt(map["stats_students_floor"], DEFAULTS.students_floor),
      cities_floor: parsePositiveInt(map["stats_cities_floor"], DEFAULTS.cities_floor),
      show_real: map["stats_show_real"] === "true",
    };
  } catch {
    return DEFAULTS;
  }
}
