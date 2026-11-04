"use client";

import { useTransition } from "react";
import { checkInDaily } from "@/app/actions/engagement";
import { Loader2, Flame } from "lucide-react";
import { showToast } from "@/components/ui/GlobalToast";

export function CheckInButton() {
  const [isPending, startTransition] = useTransition();

  const handleCheckIn = () => {
    startTransition(async () => {
      const res = await checkInDaily();
      
      if (res?.success) {
        showToast(res.success, "success");
      } else if (res?.error) {
        showToast(res.error, "error");
      }
    });
  };

  return (
    <button
      onClick={handleCheckIn}
      disabled={isPending}
      className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition shadow-sm disabled:opacity-70"
    >
      {isPending ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <Flame className="w-5 h-5" />
      )}
      {isPending ? "Checking in..." : "Check In Now"}
    </button>
  );
}
