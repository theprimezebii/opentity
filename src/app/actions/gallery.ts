"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const BUCKET = "gallery";
const MAX_SIZE = 5 * 1024 * 1024;

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

export async function uploadGalleryImage(
  prevState: Result | null,
  formData: FormData
): Promise<Result> {
  const auth = await assertAdmin();
  if (!auth.ok) return { error: auth.error };

  const file = formData.get("file");
  const alt = (formData.get("alt") as string || "").trim();

  if (!file || !(file instanceof File) || file.size === 0) {
    return { error: "Please select an image file." };
  }
  if (!file.type.startsWith("image/")) {
    return { error: "Only image files are allowed." };
  }
  if (file.size > MAX_SIZE) {
    return { error: "File too large. Maximum size is 5MB." };
  }

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error: uploadError } = await auth.supabase.storage
    .from(BUCKET)
    .upload(filename, file, { contentType: file.type, upsert: false });

  if (uploadError) return { error: `Upload failed: ${uploadError.message}` };

  const { data: urlData } = auth.supabase.storage.from(BUCKET).getPublicUrl(filename);
  const publicUrl = urlData.publicUrl;

  const { data: maxRow } = await auth.supabase
    .from("gallery_images")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextSort = ((maxRow?.sort_order as number | undefined) ?? -1) + 1;

  const { error: dbError } = await auth.supabase.from("gallery_images").insert({
    url: publicUrl,
    alt: alt || null,
    sort_order: nextSort,
    storage_path: filename,
  });

  if (dbError) {
    await auth.supabase.storage.from(BUCKET).remove([filename]);
    return { error: `Database error: ${dbError.message}` };
  }

  revalidatePath("/");
  revalidatePath("/admin/homepage/gallery");
  return { success: "Image uploaded." };
}

export async function deleteGalleryImage(id: string): Promise<Result> {
  const auth = await assertAdmin();
  if (!auth.ok) return { error: auth.error };

  const { data: row } = await auth.supabase
    .from("gallery_images")
    .select("storage_path")
    .eq("id", id)
    .single();

  if (row?.storage_path) {
    await auth.supabase.storage.from(BUCKET).remove([row.storage_path]);
  }

  const { error } = await auth.supabase.from("gallery_images").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/admin/homepage/gallery");
  return { success: "Image deleted." };
}

export async function moveGalleryImage(id: string, direction: "up" | "down"): Promise<Result> {
  const auth = await assertAdmin();
  if (!auth.ok) return { error: auth.error };

  const { data: current } = await auth.supabase
    .from("gallery_images")
    .select("id, sort_order")
    .eq("id", id)
    .single();
  if (!current) return { error: "Image not found." };

  const targetOrder =
    direction === "up" ? (current.sort_order as number) - 1 : (current.sort_order as number) + 1;

  const { data: target } = await auth.supabase
    .from("gallery_images")
    .select("id, sort_order")
    .eq("sort_order", targetOrder)
    .maybeSingle();

  if (!target) return { error: "Cannot move further." };

  await auth.supabase.from("gallery_images").update({ sort_order: -999999 }).eq("id", current.id);
  await auth.supabase.from("gallery_images").update({ sort_order: current.sort_order }).eq("id", target.id);
  await auth.supabase.from("gallery_images").update({ sort_order: targetOrder }).eq("id", current.id);

  revalidatePath("/");
  revalidatePath("/admin/homepage/gallery");
  return { success: "Moved." };
}
