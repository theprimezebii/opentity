"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { Search, X } from "lucide-react";
import { EVENT_CATEGORIES } from "@/lib/constants";

const REG_STATUSES = [
  { label: "All Registration Statuses", value: "" },
  { label: "Opens Soon", value: "reg_opening" },
  { label: "Open", value: "reg_open" },
  { label: "Closing Soon", value: "reg_closing" },
  { label: "Closed", value: "reg_closed" },
];

const EVENT_STATUSES = [
  { label: "All Event Statuses", value: "" },
  { label: "Upcoming", value: "evt_upcoming" },
  { label: "Ongoing", value: "evt_ongoing" },
  { label: "Completed", value: "evt_completed" },
];

export function EventsFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") || "");

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(name, value);
      else params.delete(name);
      params.set("page", "1");
      return params.toString();
    },
    [searchParams]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`${pathname}?${createQueryString("q", query)}`);
  };

  const handleFilterChange = (name: string, value: string) => {
    router.push(`${pathname}?${createQueryString(name, value)}`);
  };

  const clearFilters = () => {
    setQuery("");
    router.push(pathname);
  };

  const hasFilters = searchParams.toString().length > 0;

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-col xl:flex-row gap-4 items-center justify-between">
      <form onSubmit={handleSearch} className="relative w-full xl:w-80">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search events..."
          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand outline-none bg-white text-slate-900 text-sm"
        />
      </form>

      <div className="flex flex-wrap gap-3 w-full xl:w-auto">
        <select
          value={searchParams.get("category") || ""}
          onChange={(e) => handleFilterChange("category", e.target.value)}
          className="px-3 py-2 text-sm flex-1 xl:flex-none"
        >
          <option value="">All Categories</option>
          {EVENT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select
          value={searchParams.get("reg_status") || ""}
          onChange={(e) => handleFilterChange("reg_status", e.target.value)}
          className="px-3 py-2 text-sm flex-1 xl:flex-none"
        >
          {REG_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>

        <select
          value={searchParams.get("evt_status") || ""}
          onChange={(e) => handleFilterChange("evt_status", e.target.value)}
          className="px-3 py-2 text-sm flex-1 xl:flex-none"
        >
          {EVENT_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="px-3 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition flex items-center gap-1"
          >
            <X className="w-4 h-4" /> Clear
          </button>
        )}
      </div>
    </div>
  );
}
