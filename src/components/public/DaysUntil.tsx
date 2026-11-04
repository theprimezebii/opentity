"use client";

import { useEffect, useState } from "react";

export function DaysUntil({
  deadline,
  className = "",
}: {
  deadline: string;
  className?: string;
}) {
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => {
      const ms = new Date(deadline).getTime() - Date.now();
      setDays(Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24))));
    };
    tick();
    const id = setInterval(tick, 60 * 1000);
    return () => clearInterval(id);
  }, [deadline]);

  if (days === null) return <span className={className}>—</span>;
  return <span className={className}>{days}d</span>;
}
