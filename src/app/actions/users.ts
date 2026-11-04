"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateUserRole(targetUserId: string, newRole: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== 'admin') return { error: "Unauthorized" };

  if (user.id === targetUserId) {
    return { error: "You cannot change your own role." };
  }

  const { error } = await supabase.from("profiles").update({ 
    role: newRole, 
    is_admin: newRole === 'admin' 
  }).eq("id", targetUserId);
  
  if (error) return { error: error.message };

  revalidatePath("/admin/users");
  return { success: true };
}
