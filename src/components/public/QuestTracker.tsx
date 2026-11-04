"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getLocalDateString } from "@/lib/date-helper";

export function QuestTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const today = getLocalDateString();
    const key = `opentity_pages_${today}`;
    
    let pages: string[] = [];
    try {
      const stored = localStorage.getItem(key);
      if (stored) pages = JSON.parse(stored);
    } catch (e) {}

    let newPage: string | null = null;
    
    if (pathname === "/dashboard/profile") newPage = "profile";
    else if (pathname === "/dashboard/community") newPage = "community";
    else if (pathname === "/dashboard/badges") newPage = "badges";
    else if (pathname === "/dashboard/saved") newPage = "week";

    if (newPage && !pages.includes(newPage)) {
      pages.push(newPage);
      localStorage.setItem(key, JSON.stringify(pages));
    }
  }, [pathname]);

  return null;
}
