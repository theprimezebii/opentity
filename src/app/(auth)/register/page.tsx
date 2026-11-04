import { AuthSlider } from "@/components/auth/AuthSlider";
import { createClient } from "@/lib/supabase/server";
import { connection } from "next/server";

export const metadata = { title: "Sign Up" };
export const instant = false;

async function getStatsAndReferrer(ref?: string) {
  await connection();
  const supabase = await createClient();
  const { count: eventCount } = await supabase.from("events").select("*", { count: "exact", head: true }).neq("status", "draft");
  const { count: userCount } = await supabase.from("profiles").select("*", { count: "exact", head: true });

  let referrerName: string | null = null;
  if (ref) {
    const { data } = await supabase.from("profiles").select("full_name, email").eq("referral_code", ref).single();
    if (data) referrerName = data.full_name || data.email?.split("@")[0] || null;
  }

  return { stats: { events: eventCount || 0, users: userCount || 0 }, referrerName };
}


export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ message: string; ref?: string; next?: string }> }) {
  const { message, ref, next } = await searchParams;
  const { stats, referrerName } = await getStatsAndReferrer(ref);

  return <AuthSlider defaultMode="register" stats={stats} referrerName={referrerName} refCode={ref} initialError={message} nextUrl={next} />;
}
