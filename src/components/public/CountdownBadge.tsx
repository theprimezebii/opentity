"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface Props {
  deadline: string;
  className?: string;
}

function formatRemaining(ms: number): { label: string; urgent: boolean } | null {
  if (ms <= 0) return null;
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 30) return null;
  if (days >= 1) return { label: `${days}d ${hours}h left`, urgent: days <= 2 };
  if (hours >= 1) return { label: `${hours}h ${minutes}m left`, urgent: true };
  return { label: `${minutes}m left`, urgent: true };
}

export function CountdownBadge({ deadline, className = "" }: Props) {
  const [remaining, setRemaining] = useState<{ label: string; urgent: boolean } | null>(null);

  useEffect(() => {
    const tick = () => {
      const ms = new Date(deadline).getTime() - Date.now();
      setRemaining(formatRemaining(ms));
    };
    tick();
    const id = setInterval(tick, 60 * 1000);
    return () => clearInterval(id);
  }, [deadline]);

  if (!remaining) return null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold ${
        remaining.urgent
          ? "bg-red-50 text-red-700 border border-red-200"
          : "bg-orange-50 text-orange-700 border border-orange-200"
      } ${className}`}
    >
      <Clock className="w-3 h-3" />
      {remaining.label}
    </span>
  );
}
