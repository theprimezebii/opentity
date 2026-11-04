import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Calendar, MapPin, Trophy, ArrowRight } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import { SaveButton } from "./SaveButton";
import { ShareButton } from "./ShareButton";

export function FeaturedEventCard({ 
  event, 
  isSaved = false, 
  pathname = "/events" 
}: { 
  event: any; 
  isSaved?: boolean; 
  pathname?: string;
}) {
  return (
    <Link 
      href={`/events/${event.slug}`} 
      className="group flex flex-col h-full bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-500 hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-2 transition-all duration-300 relative"
    >
      {/* Actions (Share & Save) */}
      <div className="absolute top-4 right-4 z-20 flex gap-2">
        <ShareButton eventTitle={event.title} eventSlug={event.slug} />
        <SaveButton eventId={event.id} isSaved={isSaved} pathname={pathname} />
      </div>

      {/* Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
        <SafeImage
          src={event.image_url}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          fallback={
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
              <Trophy className="w-12 h-12 text-orange-500/50 mb-2" />
              <span className="text-white/80 font-semibold text-sm px-4 text-center">{event.category}</span>
            </div>
          }
        />
        
        {/* Category Pill */}
        <div className="absolute top-4 left-4 z-20">
          <span className="px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-lg shadow-sm">
            {event.category}
          </span>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-6 flex flex-col flex-grow">
        
        {/* Organizer / Format */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{event.organizer || "Opentity"}</span>
          <span className="text-slate-300 dark:text-slate-600">•</span>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{event.format}</span>
        </div>

        {/* Title */}
        <div className="min-h-[3.5rem] mb-4 flex flex-col justify-start">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-snug line-clamp-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
            {event.title}
          </h3>
        </div>

        {/* Meta Info List */}
        <div className="mt-auto space-y-2.5 mb-6">
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 font-medium">
            <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            {formatDate(event.start_date)}
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 font-medium">
            <MapPin className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            {event.city || "Online"}
          </div>
          
          {/* Cleanly Integrated Prize Pool */}
          {event.prize_pool && (
            <div className="flex items-center gap-2 text-sm font-bold text-orange-600 dark:text-orange-400 mt-1">
              <Trophy className="w-4 h-4 text-orange-500" />
              {event.prize_pool}
            </div>
          )}
        </div>

        {/* CTA Button */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between mt-auto">
          <span className="text-sm font-bold text-orange-600 dark:text-orange-400">View Details</span>
          <div className="w-8 h-8 rounded-full bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500 dark:group-hover:bg-orange-500 transition-colors">
            <ArrowRight className="w-4 h-4 text-orange-500 dark:text-orange-400 group-hover:text-white transition-colors group-hover:-rotate-45" />
          </div>
        </div>

      </div>
    </Link>
  );
}
