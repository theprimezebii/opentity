import { createClient } from "@/lib/supabase/server";

export interface GalleryImage {
  id: string;
  url: string;
  alt: string | null;
  sort_order: number;
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("gallery_images")
      .select("id, url, alt, sort_order")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    return data || [];
  } catch {
    return [];
  }
}
