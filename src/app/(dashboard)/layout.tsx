import { createClient } from "@/lib/supabase/server";
import { connection } from "next/server";
import { Suspense } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { BadgeCelebrator } from "@/components/public/BadgeCelebrator";
import { QuestTracker } from "@/components/public/QuestTracker";
import { ReferralCelebrator } from "@/components/public/ReferralCelebrator";

async function NavWrapper() {
  await connection();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let profile = null;
  let referralCount = 0;
  
  if (user) {
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    profile = data;
    
    const { count } = await supabase.from("profiles").select("*", { count: "exact", head: true }).eq("referred_by", user.id);
    referralCount = count || 0;
  }

  return (
    <>
      <Navbar user={user} profile={profile} />
      <ReferralCelebrator currentCount={referralCount} />
    </>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Suspense fallback={<div className="h-16 bg-white border-b border-slate-200" />}>
        <NavWrapper />
      </Suspense>
      <div className="flex-grow">{children}</div>
      <BadgeCelebrator />
      <QuestTracker />
    </div>
  );
}
