"use client";

import { useEffect } from "react";
import { getLocalDateString } from "@/lib/date-helper";

export function EventViewTracker({ category, city }: { category: string, city?: string }) {
  useEffect(() => {
    const today = getLocalDateString();
    
    // 1. Increment view count
    const viewKey = `opentity_views_${today}`;
    const currentViews = parseInt(localStorage.getItem(viewKey) || "0");
    localStorage.setItem(viewKey, (currentViews + 1).toString());

    // 2. Track category and city for quest progress
    const pageKey = `opentity_pages_${today}`;
    let pages: string[] = [];
    try {
      const stored = localStorage.getItem(pageKey);
      if (stored) pages = JSON.parse(stored);
    } catch (e) {}

    let changed = false;
    
    if (category && !pages.includes(`cat:${category}`)) {
      pages.push(`cat:${category}`);
      changed = true;
    }
    if (city && !pages.includes(`city:${city}`)) {
      pages.push(`city:${city}`);
      changed = true;
    }
    
    if (changed) localStorage.setItem(pageKey, JSON.stringify(pages));
  }, [category, city]);

  return null;
}
