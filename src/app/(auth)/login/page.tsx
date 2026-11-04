import { AuthSlider } from "@/components/auth/AuthSlider";
import { createClient } from "@/lib/supabase/server";
import { connection } from "next/server";

export const metadata = { title: "Sign In" };
export const instant = false;

async function getStats() {
  await connection();
  const supabase = await createClient();
  const { count: eventCount } = await supabase.from("events").select("*", { count: "exact", head: true }).neq("status", "draft");
  const { count: userCount } = await supabase.from("profiles").select("*", { count: "exact", head: true });
  return { events: eventCount || 0, users: userCount || 0 };
}


export default async function LoginPage({ searchParams }: { searchParams: Promise<{ message: string; next?: string }> }) {
  const { message, next } = await searchParams;
  const stats = await getStats();

  return <AuthSlider defaultMode="login" stats={stats} initialError={message} nextUrl={next} />;
}
