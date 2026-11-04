"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Prevent open-redirect: must be a relative path, not //evil.com
function safeNext(raw: FormDataEntryValue | null | undefined): string {
  if (typeof raw !== "string") return "/dashboard";
  if (!/^\/(?!\/)/.test(raw)) return "/dashboard";
  return raw;
}

// useActionState calls action(prevState, formData). Also guards against the
// initial render call where formData is null/undefined (Next.js 16 behavior
// with Cache Components + client-side useActionState hydration).
function isFormData(x: any): x is FormData {
  return x && typeof x.get === "function";
}

export async function login(prevState: any, formData: FormData | null) {
  // Initial render call from useActionState — return prevState, do nothing
  if (!isFormData(formData)) return prevState ?? null;

  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const next = safeNext(formData.get("next"));

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    redirect(`/login?message=${encodeURIComponent(error.message)}&next=${encodeURIComponent(next)}`);
  }

  revalidatePath("/", "layout");
  redirect(next);
}

export async function signup(prevState: any, formData: FormData | null) {
  if (!isFormData(formData)) return prevState ?? null;

  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("full_name") as string;
  const next = safeNext(formData.get("next"));

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });
  if (error) {
    redirect(`/register?message=${encodeURIComponent(error.message)}&next=${encodeURIComponent(next)}`);
  }

  revalidatePath("/", "layout");
  redirect(next);
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
