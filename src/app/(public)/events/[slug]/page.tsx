import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { formatDate, stripHtml } from "@/lib/utils";
import { Calendar, MapPin, Trophy, ExternalLink, ArrowLeft, ShieldCheck, Link as LinkIcon, Clock } from "lucide-react";
import { toggleSaveEvent } from "@/app/actions/saved-events";
import { connection } from "next/server";
import { Suspense, cache } from "react";
import { Metadata } from "next";
import { APP_NAME, APP_URL } from "@/lib/constants";
import { EventImage } from "@/components/events/EventImage";
import { AddToCalendar } from "@/components/events/AddToCalendar";
import { ShareButton } from "@/components/events/ShareButton";
import { SaveButton } from "@/components/events/SaveButton";
import Link from "next/link";

export const instant = false;

const getEvent = cache(async (slug: string) => {
  const supabase = await createClient();
  const { data } = await supabase.from("events").select("*").eq("slug", slug).single();
  return data;
});

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  await connection();
  const { slug } = await params;
  const event = await getEvent(slug);

  if (!event) return { title: "Event Not Found" };

  const plainDesc = event.description 
    ? stripHtml(event.description).slice(0, 160) + "..."
    : `Join ${event.title} on Opentity.`;

  return {
    title: `${event.title} | ${APP_NAME}`,
    description: plainDesc,
    alternates: { canonical: `${APP_URL}/events/${event.slug}` },
    openGraph: {
      title: event.title,
      description: plainDesc,
      type: "website",
      url: `${APP_URL}/events/${event.slug}`,
      siteName: APP_NAME,
      images: event.image_url ? [{ url: event.image_url }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: event.title,
      description: plainDesc,
      images: event.image_url ? [event.image_url] : [],
    },
  };
}

async function EventDetail({ slug }: { slug: string }) {
  await connection();
  const event = await getEvent(slug);

  if (!event) notFound();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let isSaved = false;
  if (user) {
    const { data: saved } = await supabase.from("saved_events").select("id").eq("user_id", user.id).eq("event_id", event.id).single();
    isSaved = !!saved;
  }

  const safeCategory = event.category || "General";
  const safeFormat = event.format || "Event";
  const safeLocation = event.location || event.city || (safeFormat === "Online" ? "Online" : "Location TBA");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    startDate: event.start_date || new Date().toISOString(),
    endDate: event.end_date || undefined,
    eventAttendanceMode: safeFormat === "Online" ? "https://schema.org/OnlineEventAttendanceMode" : "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: safeLocation,
      address: { "@type": "PostalAddress", addressLocality: event.city || "Global" }
    },
    image: event.image_url ? [event.image_url] : [],
    description: event.description ? stripHtml(event.description) : "",
    organizer: {
      "@type": "Organization",
      name: event.organizer || "Opentity",
      url: event.registration_url || APP_URL
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* 🚀 CINEMATIC HERO SECTION */}
      <div className="relative w-full h-[350px] md:h-[450px] bg-slate-900 overflow-hidden">
        {event.image_url ? (
          <img src={event.image_url} alt={event.title} className="absolute inset-0 w-full h-full object-cover opacity-60" />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-slate-800 to-slate-900" />
        )}
        
        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />

        {/* Top Controls (Back, Share, Save) */}
        <div className="absolute top-0 left-0 right-0 p-4 md:p-6 flex items-center justify-between z-20">
          <Link href={"/events"} className="inline-flex items-center gap-2 px-3 py-1.5 bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/20 text-white rounded-lg text-sm font-semibold transition">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <div className="flex gap-2">
            <ShareButton eventTitle={event.title} eventSlug={event.slug} />
            <form action={async () => { "use server"; await toggleSaveEvent(event.id, `/events/${event.slug}`); }}>
              <SaveButton eventId={event.id} isSaved={isSaved} pathname={`/events/${event.slug}`} />
            </form>
          </div>
        </div>

        {/* Title & Badges Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 max-w-5xl mx-auto z-10">
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="px-3 py-1 bg-orange-500 text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-sm">
              {safeCategory}
            </span>
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider rounded-md border border-white/20">
              {safeFormat}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-lg max-w-4xl">
            {event.title}
          </h1>
        </div>
      </div>

      {/* 📦 MAIN CONTENT GRID */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12 grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
        
        {/* LEFT COLUMN: Description & Details */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* About Section */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">About this event</h2>
            {event.description ? (
              <div className="text-slate-700 dark:text-slate-300 rich-text-content leading-relaxed" dangerouslySetInnerHTML={{ __html: event.description }} />
            ) : (
              <p className="text-slate-500 dark:text-slate-400 italic">No description provided for this event.</p>
            )}
          </div>

          {/* Eligibility Section */}
          {event.eligibility && (
            <div className="bg-yellow-50 dark:bg-yellow-500/10 rounded-2xl p-6 border border-yellow-200 dark:border-yellow-500/30 flex items-start gap-4 shadow-sm">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-500/20 rounded-lg shrink-0">
                <ShieldCheck className="w-6 h-6 text-yellow-600 dark:text-yellow-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-yellow-800 dark:text-yellow-400 mb-1">Eligibility Criteria</h3>
                <p className="text-yellow-700 dark:text-yellow-300 text-sm leading-relaxed">{event.eligibility}</p>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Sticky Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden">
            
            {/* Sidebar Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Event Details</p>
              <p className="text-sm text-slate-600 dark:text-slate-300">Organized by <strong className="text-slate-900 dark:text-white">{event.organizer || "Opentity"}</strong></p>
            </div>

            {/* Sidebar Info */}
            <div className="p-6 space-y-5">
              {event.start_date && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-orange-50 dark:bg-orange-500/10 rounded-lg shrink-0">
                    <Calendar className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{formatDate(event.start_date)}</p>
                    {event.end_date && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Ends: {formatDate(event.end_date)}</p>}
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-50 dark:bg-orange-500/10 rounded-lg shrink-0">
                  <MapPin className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Location</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{safeLocation}</p>
                </div>
              </div>

              {event.prize_pool && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-orange-50 dark:bg-orange-500/10 rounded-lg shrink-0">
                    <Trophy className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Prize Pool</p>
                    <p className="text-sm font-bold text-orange-600 dark:text-orange-400">{event.prize_pool}</p>
                  </div>
                </div>
              )}

              {event.registration_deadline && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-rose-50 dark:bg-rose-500/10 rounded-lg shrink-0">
                    <Clock className="w-5 h-5 text-rose-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Registration Deadline</p>
                    <p className="text-sm font-semibold text-rose-600 dark:text-rose-400">{formatDate(event.registration_deadline)}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Actions (Hidden on mobile to prevent duplication) */}
            <div className="hidden lg:block p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 space-y-3">
              {event.registration_url ? (
                <a 
                  href={event.registration_url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-center gap-2 w-full bg-orange-500 text-white py-3.5 rounded-xl font-bold text-lg hover:bg-orange-600 transition shadow-lg shadow-orange-500/25"
                >
                  Register Now <ExternalLink className="w-5 h-5" />
                </a>
              ) : (
                <div className="flex items-center justify-center gap-2 w-full bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 py-3.5 rounded-xl font-bold cursor-not-allowed">
                  <LinkIcon className="w-5 h-5" /> Link Unavailable
                </div>
              )}
              
              {event.start_date ? (
                <AddToCalendar event={event} />
              ) : (
                <div className="flex items-center justify-center gap-2 w-full bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 py-3.5 rounded-xl font-bold text-sm cursor-not-allowed">
                  Date TBA - Can't Add
                </div>
              )}
            </div>

          </div>
        </div>

      </div>

      {/* 📱 MOBILE STICKY BOTTOM BAR (Stops at the footer) */}
      <div className="lg:hidden sticky bottom-0 w-full p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] mt-auto">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Starts</p>
            <p className="text-sm font-bold text-slate-900 dark:text-white">{event.start_date ? formatDate(event.start_date) : "TBA"}</p>
          </div>
          {event.registration_url ? (
            <a 
              href={event.registration_url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex-1 flex items-center justify-center gap-2 bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition"
            >
              Register Now <ExternalLink className="w-4 h-4" />
            </a>
          ) : (
            <div className="flex-1 flex items-center justify-center gap-2 bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 py-3 rounded-xl font-bold cursor-not-allowed">
              Unavailable
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

export default async function EventDetailPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ slug: string }>; 
  searchParams: Promise<{ returnUrl?: string }> 
}) {
  const { slug } = await params;
  const { returnUrl } = await searchParams;
  const backUrl = returnUrl ? decodeURIComponent(returnUrl) : "/events";

  return (
    <Suspense fallback={<div className="text-center py-20 text-slate-500">Loading event details...</div>}>
      <EventDetail slug={slug} />
    </Suspense>
  );
}
