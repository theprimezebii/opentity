import { createClient } from "@/lib/supabase/server";
import { connection } from "next/server";
import { Suspense } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { BadgeCelebrator } from "@/components/public/BadgeCelebrator";
import { Footer } from "@/components/layout/Footer";

async function NavWrapper() {
  await connection();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let profile = null;
  if (user) {
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    profile = data;
  }

  return <Navbar user={user} profile={profile} />;
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Suspense fallback={<div className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800" />}>
        <NavWrapper />
      </Suspense>
      <main className="flex-grow">{children}</main>
      <Footer />
      <BadgeCelebrator />
    </div>
  );
}
