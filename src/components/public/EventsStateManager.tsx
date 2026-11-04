"use client";

import { useEffect } from "react";
import { useSearchParams, usePathname } from "next/navigation";

export function EventsStateManager() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Only save state when we are actually on the /events page
    if (pathname !== "/events") return;
    
    const current = searchParams.toString();
    if (current) {
      // Save to cookie for 1 day
      document.cookie = `events_filters=${current}; path=/; max-age=86400; SameSite=Lax`;
    }
  }, [searchParams, pathname]);

  return null;
}
