"use server";

import { createClient } from "@/lib/supabase/server";
import { APP_URL } from "@/lib/constants";

export async function forgotPassword(prevState: any, formData: FormData) {
  const email = (formData.get("email") as string)?.trim();
  if (!email) return { error: "Please enter your email address." };

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${APP_URL}/auth/callback?next=/reset-password`,
  });

  // Always show success to prevent email enumeration attacks
  return { success: "If an account exists with that email, you'll receive a reset link shortly. Check your inbox and spam folder." };
}

export async function resetPassword(prevState: any, formData: FormData) {
  const password = formData.get("password") as string;
  const confirm = formData.get("confirm_password") as string;

  if (!password || password.length < 6) return { error: "Password must be at least 6 characters." };
  if (password !== confirm) return { error: "Passwords do not match." };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Your reset link has expired. Please request a new one." };

  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: error.message };
  
  return { success: "Password updated successfully! Redirecting..." };
}
