"use client";

import { useState } from "react";

export interface MarqueeLogoItem {
  name: string;
  logo: string;
}

function LogoItem({ item }: { item: MarqueeLogoItem }) {
  const [errored, setErrored] = useState(false);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-500/50 hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center min-w-[180px] md:min-w-[220px] h-[150px] md:h-[180px] gap-3">
      
      {/* Logo Wrapper - Tightly hugs the logo with a white background in dark mode */}
      <div className="flex-grow flex items-center justify-center w-full">
        {errored ? (
          <span className="text-sm font-bold text-slate-400 text-center leading-tight px-2">
            {item.name}
          </span>
        ) : (
          <div className="dark:bg-white dark:p-3 dark:rounded-xl transition-all duration-300">
            <img
              src={item.logo}
              alt={item.name}
              className="h-14 md:h-20 w-auto max-w-[120px] md:max-w-[160px] object-contain"
              onError={() => setErrored(true)}
              loading="lazy"
            />
          </div>
        )}
      </div>

      <span className="text-[11px] md:text-xs font-semibold text-slate-500 dark:text-slate-400 text-center leading-tight line-clamp-1">
        {item.name}
      </span>
    </div>
  );
}

export function Marquee({
  items,
  className = "",
}: {
  items: MarqueeLogoItem[];
  className?: string;
}) {
  if (items.length === 0) return null;
  const looped = [...items, ...items];

  return (
    <div className={`overflow-hidden relative ${className}`}>
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-slate-50 dark:from-slate-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-50 dark:from-slate-950 to-transparent z-10 pointer-events-none" />
      <div className="flex animate-marquee gap-6 items-center whitespace-nowrap py-2">
        {looped.map((item, i) => (
          <div key={`${item.name}-${i}`} className="shrink-0" title={item.name}>
            <LogoItem item={item} />
          </div>
        ))}
      </div>
    </div>
  );
}
