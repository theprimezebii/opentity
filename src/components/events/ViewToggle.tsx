"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { LayoutGrid, List } from "lucide-react";

export function ViewToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentView = searchParams.get("view") || "grid";

  const setView = (view: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (view === "grid") params.delete("view");
    else params.set("view", view);
    params.delete("page"); // Reset page on view change
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
      <button
        onClick={() => setView("grid")}
        className={`p-2 rounded-md transition ${currentView === "grid" ? "bg-white dark:bg-slate-600 text-orange-500 shadow-sm" : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"}`}
        title="Grid View"
      >
        <LayoutGrid className="w-4 h-4" />
      </button>
      <button
        onClick={() => setView("list")}
        className={`p-2 rounded-md transition ${currentView === "list" ? "bg-white dark:bg-slate-600 text-orange-500 shadow-sm" : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"}`}
        title="List View"
      >
        <List className="w-4 h-4" />
      </button>
    </div>
  );
}
