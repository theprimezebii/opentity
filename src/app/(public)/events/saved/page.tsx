import { createClient } from "@/lib/supabase/server";
import { connection } from "next/server";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { FeaturedEventCard } from "@/components/events/FeaturedEventCard";
import { EventsSkeleton } from "@/components/events/EventsSkeleton";
import { PageHero } from "@/components/public/PageHero";
import { Bookmark } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Saved Events" };

async function SavedEventsList() {
  await connection();
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/events/saved");

  // Fetch saved events with the related event data
  const { data: savedRelations } = await supabase
    .from("saved_events")
    .select("event_id, events(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const savedEvents = (savedRelations?.map(r => r.events).filter(Boolean) as any[]) || [];

  if (savedEvents.length === 0) {
    return (
      <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mt-8">
        <Bookmark className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
        <p className="text-slate-500 dark:text-slate-400 font-medium mb-2">No saved events yet.</p>
        <p className="text-sm text-slate-400 dark:text-slate-500 mb-6">Start exploring and save events you're interested in.</p>
        <Link href="/events" className="inline-flex items-center gap-2 px-6 py-2.5 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 transition shadow-sm">
          Browse Events
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {savedEvents.map((event) => (
        <FeaturedEventCard 
          key={event.id} 
          event={event} 
          isSaved={true} 
          pathname="/events/saved" 
        />
      ))}
    </div>
  );
}

export default function SavedEventsPage() {
  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-20">
      
      {/* CINEMATIC HERO */}
      <PageHero
        badge="Your Bookmarks"
        title="Saved Events"
        subtitle="Keep track of the hackathons, competitions, and workshops you want to attend. Never miss a deadline again."
      />

      {/* CONTENT */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 mt-8">
        <Suspense fallback={<EventsSkeleton />}>
          <SavedEventsList />
        </Suspense>
      </main>
      
    </div>
  );
}
