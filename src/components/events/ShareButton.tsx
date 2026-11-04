"use client";

import { Share2, Check } from "lucide-react";
import { useState } from "react";

export function ShareButton({ eventTitle, eventSlug }: { eventTitle: string, eventSlug: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to the event page
    
    const url = `${window.location.origin}/events/${eventSlug}`;
    const text = `Check out this hackathon on Opentity: ${eventTitle}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: eventTitle, text, url });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      // Fallback: Copy to clipboard
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleShare}
      aria-label="Share event"
      className="p-2 rounded-full shadow-sm transition flex items-center justify-center bg-white/90 dark:bg-slate-900/80 text-slate-400 dark:text-slate-300 hover:text-orange-500 dark:hover:text-orange-400 hover:bg-white dark:hover:bg-slate-900"
    >
      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
    </button>
  );
}
