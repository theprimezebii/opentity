import Image from "next/image";
import { ReactNode } from "react";
import { Sparkles } from "lucide-react";

interface PageHeroProps {
  badge?: string;
  title: ReactNode;
  subtitle: string;
  children?: ReactNode;
}

export function PageHero({ badge, title, subtitle, children }: PageHeroProps) {
  return (
    <section className="relative h-[500px] md:h-[600px] w-full flex items-center justify-center overflow-hidden bg-slate-900">
      {/* 1. INSTANT POSTER IMAGE */}
      <Image
        src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1920&q=80"
        alt="Background"
        fill
        priority
        className="object-cover opacity-50 dark:opacity-30"
      />
      
      {/* 2. BACKGROUND VIDEO */}
      <video
        autoPlay
        loop
        muted
        playsInline
        poster="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1920&q=80"
        className="absolute inset-0 w-full h-full object-cover opacity-50 dark:opacity-30"
      >
        <source src="https://cdn.pixabay.com/video/2022/12/11/142505-780456717_large.mp4" type="video/mp4" />
      </video>

      {/* 3. DARK OVERLAY */}
      <div className="absolute inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-[1px]"></div>

      {/* 4. CONTENT */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center animate-in fade-in zoom-in-95 duration-1000">
        {badge && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full text-sm font-medium mb-6 shadow-xl">
            <Sparkles className="w-4 h-4 text-orange-400" />
            {badge}
          </div>
        )}

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-6 drop-shadow-lg">
          {title}
        </h1>

        <p className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto mb-8 leading-relaxed drop-shadow-md">
          {subtitle}
        </p>

        {children && (
          <div className="flex flex-wrap items-center justify-center gap-4">
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
