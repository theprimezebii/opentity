import { SafeImage } from "@/components/ui/SafeImage";

export function EventImage({
  event,
  className = "h-48",
  showTitleInFallback = false,
}: {
  event: any;
  className?: string;
  showTitleInFallback?: boolean;
}) {
  const fallback = (
    <GradientFallback event={event} showTitle={showTitleInFallback} />
  );

  if (event.image_url) {
    return (
      <div className={`w-full overflow-hidden bg-slate-100 ${className}`}>
        <SafeImage
          src={event.image_url}
          alt={event.title}
          className="w-full h-full object-cover"
          fallback={fallback}
        />
      </div>
    );
  }

  return <div className={`w-full ${className}`}>{fallback}</div>;
}

function GradientFallback({ event, showTitle }: { event: any; showTitle: boolean }) {
  const gradients: Record<string, string> = {
    "AI": "from-orange-500 to-rose-700",
    "Web Development": "from-cyan-500 to-blue-700",
    "Mobile": "from-orange-500 to-rose-700",
    "Data Science": "from-orange-400 to-teal-800",
    "Cybersecurity": "from-red-600 to-slate-900",
    "Blockchain": "from-orange-500 to-amber-800",
    "IoT": "from-teal-500 to-emerald-800",
    "Game Development": "from-pink-500 to-rose-800",
    "Other": "from-slate-600 to-slate-900",
  };

  const gradientClass = gradients[event.category] || gradients["Other"];

  return (
    <div
      className={`w-full h-full bg-gradient-to-br ${gradientClass} relative flex flex-col items-center justify-center p-4 text-center overflow-hidden`}
    >
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-black/20 rounded-full blur-2xl translate-x-1/3 translate-y-1/3"></div>

      <div className="relative z-10 flex flex-col items-center w-full">
        
        {/* Full Logo with Invert Filter for Dark Backgrounds */}
        <div className="mb-3 flex items-center justify-center">
          <img
            src="/logos/logo-full-transparent.png"
            alt="Opentity"
            className="h-10 md:h-14 w-auto max-w-[180px] md:max-w-[220px] object-contain brightness-0 invert opacity-95 drop-shadow-lg"
          />
        </div>

        {showTitle && (
          <div className="h-12 flex items-center justify-center w-full px-2 mb-1">
            <h3 className="text-white font-bold text-base md:text-lg leading-tight line-clamp-2 drop-shadow-md">
              {event.title}
            </h3>
          </div>
        )}

        <span className="text-white/90 text-[10px] font-bold tracking-widest uppercase bg-black/30 px-3 py-1 rounded-full backdrop-blur-md border border-white/10 mt-auto">
          {event.category || "Event"}
        </span>
      </div>
    </div>
  );
}
