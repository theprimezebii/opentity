import Link from "next/link";
import { formatDate, stripHtml, getEventStatus } from "@/lib/utils";
import { Calendar, Trophy } from "lucide-react";
import { EventImage } from "./EventImage";
import { SaveButton } from "./SaveButton";
import { ShareButton } from "./ShareButton";

interface EventCardProps {
  event: any;
  isSaved: boolean;
  pathname: string;
  isList?: boolean;
  queryString?: string;
}

export function EventCard({ event, isSaved, pathname, isList = false, queryString = "" }: EventCardProps) {
  const { regStatus, eventStatus } = getEventStatus(event);

  const categoryColors: Record<string, string> = {
    "AI": "bg-orange-50 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-500/30",
    "Web Development": "bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/30",
    "Mobile": "bg-purple-50 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-500/30",
    "Data Science": "bg-teal-50 dark:bg-teal-500/20 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-500/30",
    "Cybersecurity": "bg-rose-50 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/30",
    "Blockchain": "bg-orange-50 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-500/30",
    "IoT": "bg-cyan-50 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 border-cyan-200 dark:border-cyan-500/30",
    "Game Development": "bg-pink-50 dark:bg-pink-500/20 text-pink-700 dark:text-pink-400 border-pink-200 dark:border-pink-500/30",
    "Other": "bg-slate-50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600",
  };

  const categoryClass = categoryColors[event.category] || categoryColors["Other"];

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-500 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 relative group overflow-hidden shadow-sm ${
      isList 
        ? "flex flex-row h-[150px] sm:h-[170px]" // LIST: Horizontal, fixed height
        : "flex flex-col h-full" // GRID: Vertical, flexes to fill grid row
    }`}>
      
      {/* Actions (Share & Save) */}
      <div className="absolute top-2 right-2 z-20 flex gap-1.5">
        <ShareButton eventTitle={event.title} eventSlug={event.slug} />
        <SaveButton eventId={event.id} isSaved={isSaved} pathname={pathname} />
      </div>

      <Link href={`/events/${event.slug}${queryString ? `?returnUrl=${encodeURIComponent("/events?" + queryString)}` : ""}`} className={`flex w-full h-full ${
        isList ? "flex-row" : "flex-col"
      }`}>
        
        {/* Image Container */}
        <div className={`shrink-0 relative bg-slate-100 dark:bg-slate-900 overflow-hidden ${
          isList 
            ? "w-32 sm:w-64 h-full" // LIST: Fixed width, full height
            : "w-full h-40" // GRID: Full width, fixed height
        }`}>
          <EventImage 
            event={event} 
            className="w-full h-full object-cover" 
            showTitleInFallback={false} 
          />
        </div>

        {/* Content Container */}
        <div className="p-3 sm:p-5 flex flex-col flex-grow min-w-0 h-full">
          
          {/* TOP SECTION */}
          <div className="flex-1 overflow-hidden">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 mb-1 sm:mb-2">
              <span className={`px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider rounded border ${categoryClass}`}>
                {event.category}
              </span>
              {regStatus.label === "Registration Closing Soon" || regStatus.label === "Registration Closed" ? (
                <span className={`hidden sm:inline-block px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider rounded border ${regStatus.color} dark:bg-slate-700/50 dark:text-slate-300 dark:border-slate-600`}>
                  {regStatus.label}
                </span>
              ) : (
                <span className={`hidden sm:inline-block px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider rounded border ${eventStatus.color} dark:bg-slate-700/50 dark:text-slate-300 dark:border-slate-600`}>
                  {eventStatus.label}
                </span>
              )}
            </div>

            {/* Title */}
            <div className={`mb-1 sm:mb-2 ${isList ? "min-h-0" : "min-h-[2.5rem] sm:min-h-[3rem]"}`}>
              <h3 className={`text-[13px] sm:text-base font-bold text-slate-900 dark:text-white leading-tight group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors ${isList ? "line-clamp-2" : "line-clamp-2"}`}>
                {event.title}
              </h3>
            </div>

            {/* Description */}
            <p className={`text-slate-500 dark:text-slate-400 text-[11px] sm:text-xs leading-relaxed ${isList ? "line-clamp-2" : "line-clamp-1 sm:line-clamp-2"}`}>
              {stripHtml(event.description)}
            </p>
          </div>

          {/* BOTTOM SECTION (Footer) */}
          <div className="mt-auto pt-2 sm:pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between gap-2 w-full shrink-0">
            <div className="flex items-center gap-1 text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 min-w-0">
              <Calendar className="w-3 h-3 shrink-0" />
              <span className="truncate">{formatDate(event.start_date)}</span>
            </div>
            {event.prize_pool && (
              <div className="flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-slate-900 dark:text-white bg-orange-50 dark:bg-orange-500/20 border border-orange-100 dark:border-orange-500/30 px-1.5 py-0.5 rounded shrink-0">
                <Trophy className="w-3 h-3 text-yellow-600 dark:text-yellow-500" />
                <span className="whitespace-nowrap">{event.prize_pool}</span>
              </div>
            )}
          </div>

        </div>
      </Link>
    </div>
  );
}
