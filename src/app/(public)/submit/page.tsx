import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { SubmitEventForm } from "@/components/public/SubmitEventForm";
import { PageHero } from "@/components/public/PageHero";
import { FileText, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Submit an Event" };
export const instant = false;

async function SubmitPageContent() {
  await connection();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/submit");
  }

  return (
    <>
      {/* HERO */}
      <PageHero
        badge="Community Contribution"
        title="Submit an Event"
        subtitle="Found a hackathon, workshop, or competition that isn't on Opentity yet? Help the community by adding it. All submissions are reviewed within 24-48 hours."
      >
        <Link 
          href="/dashboard/submissions" 
          className="group inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-xl font-bold transition-all hover:scale-105 active:scale-95"
        >
          <FileText className="w-4 h-4" />
          Track Your Submissions
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </PageHero>

      {/* FORM */}
      <main className="bg-slate-50 dark:bg-slate-950 py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <SubmitEventForm />
        </div>
      </main>
    </>
  );
}

export default function SubmitPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-500 animate-pulse">Loading...</div>}>
      <SubmitPageContent />
    </Suspense>
  );
}
