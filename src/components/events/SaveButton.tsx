"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Bookmark, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { showToast } from "@/components/ui/GlobalToast";

export function SaveButton({
  eventId,
  isSaved,
  pathname,
}: {
  eventId: string;
  isSaved: boolean;
  pathname: string;
}) {
  const [saved, setSaved] = useState(isSaved);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const currentPath = usePathname();

  useEffect(() => {
    setSaved(isSaved);
  }, [isSaved]);

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const wasSaved = saved;

    // 1. INSTANT optimistic flip (0ms visual feedback)
    setSaved(!wasSaved);
    setIsPending(true);

    try {
      // 2. Direct client-side Supabase call (50-100ms, no server round trip)
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setSaved(wasSaved);
        setIsPending(false);
        router.push(`/login?next=${encodeURIComponent(pathname)}`);
        return;
      }

      let error;
      if (wasSaved) {
        const res = await supabase
          .from("saved_events")
          .delete()
          .eq("user_id", user.id)
          .eq("event_id", eventId);
        error = res.error;
      } else {
        const res = await supabase
          .from("saved_events")
          .insert({ user_id: user.id, event_id: eventId });
        error = res.error;
      }

      if (error) {
        setSaved(wasSaved);
        showToast("Failed to update. Please try again.", "error");
        return;
      }

      showToast(wasSaved ? "Removed from saved" : "Event saved!", "success");

      // 3. Fire-and-forget: badge check + saved page refresh
      setTimeout(() => {
        window.dispatchEvent(new Event("opentity_check_badges"));
      }, 100);

      if (currentPath.includes("/saved")) {
        setTimeout(() => router.refresh(), 200);
      }
    } catch {
      setSaved(wasSaved);
      showToast("Something went wrong.", "error");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleSave}
      disabled={isPending}
      aria-label={saved ? "Remove from saved" : "Save event"}
      className={`p-2 rounded-full shadow-sm transition-all duration-150 flex items-center justify-center backdrop-blur-md ${
        saved
          ? "bg-orange-500 text-white scale-110"
          : "bg-white/90 dark:bg-slate-900/80 text-slate-400 dark:text-slate-300 hover:text-orange-500 dark:hover:text-orange-400 hover:bg-white dark:hover:bg-slate-900"
      }`}
    >
      {isPending ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Bookmark className="w-4 h-4" fill={saved ? "currentColor" : "none"} />
      )}
    </button>
  );
}
