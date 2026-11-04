import { createClient } from "@/lib/supabase/server";
import { connection } from "next/server";
import { Suspense } from "react";
import { EventCard } from "@/components/events/EventCard";
import { PublicFilterBar } from "@/components/public/PublicFilterBar";
import { PublicPagination } from "@/components/public/PublicPagination";
import { EventsSkeleton } from "@/components/events/EventsSkeleton";
import { History, PlusCircle } from "lucide-react";
import Link from "next/link";
import { LocationDetector } from "@/components/public/LocationDetector";
import { EventsStateManager } from "@/components/public/EventsStateManager";
import { ViewToggle } from "@/components/events/ViewToggle";
import { PageHero } from "@/components/public/PageHero";
import { Metadata } from "next";
import { APP_NAME, APP_URL } from "@/lib/constants";

export async function generateMetadata({ searchParams }: { searchParams: Promise<any> }): Promise<Metadata> {
  const params = await searchParams;
  let title = "Discover Global Tech Events & Hackathons";
  
  if (params.category && params.city) title = `${params.category} Hackathons in ${params.city}`;
  else if (params.category) title = `${params.category} Hackathons & Competitions`;
  else if (params.city) title = `Tech Events & Hackathons in ${params.city}`;
  else if (params.timeframe === "past") title = `Past Hackathons & Tech Events`;

  return {
    title: `${title} | ${APP_NAME}`,
    description: `Find the best ${params.category || "tech"} events ${params.city ? `in ${params.city}` : "globally"}. Discover hackathons, workshops, and competitions on Opentity.`,
    alternates: { canonical: `${APP_URL}/events` },
  };
}

function formatList(items: string[], conjunction: string = "or") {
  if (!items || items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} ${conjunction} ${items[1]}`;
  const last = items.pop();
  return `${items.join(", ")}, ${conjunction} ${last}`;
}

async function EventsList({ searchParams }: { searchParams: any }) {
  await connection();
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  const { q, category, format, city, event_type, page, sort, timeframe, view, country } = searchParams;
  
  const currentPage = Number(page) || 1;
  const limitParam = Number(searchParams.limit) || 9;
  const itemsPerPage = [9, 12, 15].includes(limitParam) ? limitParam : 9;
  const from = (currentPage - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;

  let eventsData: any[] | null = null;
  let count = 0;

  // 1. If a country was auto-detected, use our custom RPC to prioritize local events
  if (country) {
    const { data } = await supabase.rpc("get_prioritized_events", {
      p_country: country,
      p_limit: itemsPerPage,
      p_offset: from,
      p_search: q || null,
      p_category: category || null,
      p_format: format || null,
      p_city: city || null,
      p_event_type: event_type || null,
      p_timeframe: timeframe || "upcoming",
      p_sort: sort || "recommended"
    });
    eventsData = data;

    // Get total count for pagination (ignoring sort)
    let countQuery = supabase.from("events").select("*", { count: "exact", head: true }).neq("status", "draft");
    if (timeframe === "past") countQuery = countQuery.lt("start_date", new Date().toISOString());
    else countQuery = countQuery.gte("start_date", new Date().toISOString());
    if (q) countQuery = countQuery.ilike("title", `%${q}%`);
    if (category) countQuery = countQuery.in("category", category.split(","));
    if (format) countQuery = countQuery.in("format", format.split(","));
    if (city) countQuery = countQuery.in("city", city.split(","));
    if (event_type) countQuery = countQuery.in("event_type", event_type.split(","));
    const { count: exactCount } = await countQuery;
    count = exactCount || 0;

  } else {
    // 2. Standard query (no location detected or user clicked "Show Global")
    let query = supabase
      .from("events")
      .select("*", { count: "exact" })
      .neq("status", "draft");

    if (timeframe === "past") query = query.lt("start_date", new Date().toISOString());
    else query = query.gte("start_date", new Date().toISOString());

    if (q) query = query.ilike("title", `%${q}%`);
    if (category) query = query.in("category", category.split(","));
    if (format) query = query.in("format", format.split(","));
    if (city) query = query.in("city", city.split(","));
    if (event_type) query = query.in("event_type", event_type.split(","));

    if (sort === "deadline") query = query.order("registration_deadline", { ascending: true, nullsFirst: false });
    else if (sort === "newest") query = query.order("created_at", { ascending: false });
    else query = query.order("is_featured", { ascending: false }).order("start_date", { ascending: true });

    const { data, count: exactCount } = await query.range(from, to);
    eventsData = data;
    count = exactCount || 0;
  }

  const totalPages = count ? Math.ceil(count / itemsPerPage) : 0;

  let savedEventIds: string[] = [];
  if (user) {
    const { data: saved } = await supabase.from("saved_events").select("event_id").eq("user_id", user.id);
    savedEventIds = saved?.map(s => s.event_id) || [];
  }

  if (!eventsData || eventsData.length === 0) {
    return (
      <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <History className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
        <p className="text-slate-500 dark:text-slate-400 font-medium mb-2">No events found.</p>
        <p className="text-sm text-slate-400 dark:text-slate-500">Try removing some filters or searching a different keyword.</p>
      </div>
    );
  }

  const isListView = view === "list";
  
  // Build the current query string to pass to the detail page
  const currentQuery = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value && key !== "returnUrl") currentQuery.set(key, String(value));
  });
  const queryString = currentQuery.toString();

  return (
    <>
      <div className={isListView ? "flex flex-col gap-4" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"}>
        {eventsData.map((event) => (
          <EventCard 
            key={event.id} 
            event={event} 
            isSaved={savedEventIds.includes(event.id)} 
            pathname="/events" 
            isList={isListView} 
            queryString={queryString}
          />
        ))}
      </div>
      <PublicPagination totalPages={totalPages} />
    </>
  );
}

export default async function EventsPage({ searchParams }: { searchParams: Promise<any> }) {
  const params = await searchParams;
  
  let pageTitle = "Discover Global Tech Events";
  if (params.category && params.city) pageTitle = `${params.category} Hackathons in ${params.city}`;
  else if (params.category) pageTitle = `${params.category} Hackathons`;
  else if (params.city) pageTitle = `Tech Events in ${params.city}`;
  else if (params.timeframe === "past") pageTitle = `Past Hackathons`;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-12">
      <EventsStateManager />
      
      <PageHero
        badge="Global Opportunities"
        title={<>{pageTitle}</>}
        subtitle="Find hackathons, competitions, and workshops from across the globe."
      >
        <Link 
          href="/submit" 
          className="group flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-xl transition-all duration-300 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105 active:scale-95"
        >
          <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" /> 
          Submit an Event
        </Link>
        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
          <span className="text-sm font-medium text-white hidden sm:block">View:</span>
          <Suspense fallback={<div className="w-20 h-8 bg-white/20 rounded animate-pulse" />}>
            <ViewToggle />
          </Suspense>
        </div>
      </PageHero>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 mt-8">
      <LocationDetector />

      <PublicFilterBar initialParams={{ 
        q: params.q, category: params.category, format: params.format, city: params.city, event_type: params.event_type, sort: params.sort, timeframe: params.timeframe
      }} />

      <Suspense fallback={<EventsSkeleton />}>
        <EventsList searchParams={params} />
      </Suspense>

      {/* Missing an Event Promo */}
      <div className="group mt-12 mb-6 bg-slate-50 hover:bg-orange-50/50 dark:bg-slate-900/50 dark:hover:bg-slate-800/80 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-orange-400 dark:hover:border-orange-500/50 rounded-2xl p-8 text-center flex flex-col items-center justify-center transition-all duration-300">
        <div className="w-14 h-14 bg-orange-100 dark:bg-orange-500/20 text-orange-500 rounded-full flex items-center justify-center mb-5 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-300 shadow-sm group-hover:shadow-orange-500/20">
          <PlusCircle className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 transition-colors group-hover:text-orange-600 dark:group-hover:text-orange-400">
          Can't find a specific event?
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
          Help the community by submitting it for review. We'll add it to the platform so thousands of students can discover it.
        </p>
        <Link 
          href="/submit" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all duration-300 shadow-md hover:shadow-xl"
        >
          Submit an Event for Review
        </Link>
      </div>

      {/* SEO TEXT BLOCK (Only show on Page 1) */}
      {(!params.page || params.page === "1") && (
        <div className="mt-20 mb-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 md:p-12 shadow-sm relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-orange-500/5 dark:bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-start relative z-10">
            <div className="md:col-span-4 flex flex-col items-start">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold uppercase tracking-wider mb-4 border border-slate-200 dark:border-slate-700">
                About this page
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white leading-tight">
                {params.category ? `${formatList(params.category.split(","), "and")} Events` : "Tech Events"} {params.city ? `in ${formatList(params.city.split(","))}` : ""}
              </h2>
              <div className="h-1.5 w-12 bg-orange-500 rounded-full mt-5" />
            </div>
            <div className="md:col-span-8">
              <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg leading-relaxed">
                Opentity aggregates the best tech opportunities from around the world. Whether you are looking for a{" "}
                <strong className="text-slate-900 dark:text-white font-semibold">
                  {params.category ? `${params.category.split(",")[0]} hackathon` : "weekend hackathon"}
                </strong>
                , a{" "}
                <strong className="text-slate-900 dark:text-white font-semibold">
                  {params.category ? `${params.category.split(",")[0]} competition` : "coding competition"}
                </strong>
                , or a{" "}
                <strong className="text-slate-900 dark:text-white font-semibold">
                  developer conference
                </strong>{" "}
                {params.city ? `in ${formatList(params.city.split(","))}` : "near you"}, we have curated them all in one place.
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg leading-relaxed mt-4">
                Save events, track registration deadlines, and join teams to compete for prizes. Our platform is designed for university students and developers looking to level up their skills and build an impressive portfolio.
              </p>
            </div>
          </div>
        </div>
      )}
      </main>
    </div>
  );
}
