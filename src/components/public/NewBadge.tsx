"use client";

import { useEffect, useState } from "react";

export function NewBadge({ createdAt }: { createdAt: string | null | undefined }) {
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    if (!createdAt) return;
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    setIsNew(new Date(createdAt).getTime() > Date.now() - sevenDaysMs);
  }, [createdAt]);

  if (!isNew) return null;

  return (
    <span className="absolute top-3 right-3 px-2.5 py-1 bg-orange-500 text-xs font-bold text-white uppercase rounded-md shadow-lg shadow-orange-500/30 animate-in fade-in slide-in-from-top-1 duration-500">
      New
    </span>
  );
}
