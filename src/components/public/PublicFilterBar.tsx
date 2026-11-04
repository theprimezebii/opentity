"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect, useRef } from "react";
import { Search, X, Tag, Monitor, MapPin, ArrowDownWideNarrow, Check, ChevronDown, Layers, Clock, SlidersHorizontal } from "lucide-react";
import { EVENT_CATEGORIES, EVENT_FORMATS, PAKISTAN_CITIES, EVENT_TYPES } from "@/lib/constants";

const SORT_OPTIONS = [
  { label: "Recommended", value: "" },
  { label: "Trending", value: "trending" },
  { label: "Newest", value: "newest" },
  { label: "Deadline", value: "deadline" },
];

const TIMEFRAME_OPTIONS = [
  { label: "Upcoming", value: "upcoming" },
  { label: "Past Events", value: "past" },
];

interface Props {
  initialParams?: {
    q?: string;
    category?: string;
    format?: string;
    city?: string;
    event_type?: string;
    sort?: string;
    timeframe?: string;
  };
}

export function PublicFilterBar({ initialParams = {} }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentQ = searchParams.get("q") ?? initialParams.q ?? "";
  const currentSort = searchParams.get("sort") ?? initialParams.sort ?? "";
  const currentTimeframe = searchParams.get("timeframe") ?? initialParams.timeframe ?? "upcoming";

  const [query, setQuery] = useState(currentQ);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const currentCategories = searchParams.get("category")?.split(",") ?? [];
  const currentFormats = searchParams.get("format")?.split(",") ?? [];
  const currentCities = searchParams.get("city")?.split(",") ?? [];
  const currentTypes = searchParams.get("event_type")?.split(",") ?? [];

  useEffect(() => {
    setQuery(currentQ);
  }, [currentQ]);

  useEffect(() => {
    if (showMobileFilters) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [showMobileFilters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (query) {
      params.set("q", query);
      const currentPage = params.get("page");
      if (currentPage && currentPage !== "1") params.set("returnPage", currentPage);
      params.delete("page"); 
    } else {
      params.delete("q");
      const returnPage = params.get("returnPage");
      if (returnPage) {
        params.set("page", returnPage);
        params.delete("returnPage");
      }
    }
    router.push(params.toString() ? `${pathname}?${params.toString()}` : pathname);
    setShowMobileFilters(false);
  };

  const handleMultiSelect = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentValues = params.get(name)?.split(",") || [];
    
    let newValues;
    if (currentValues.includes(value)) {
      newValues = currentValues.filter(v => v !== value);
    } else {
      newValues = [...currentValues, value];
    }

    if (newValues.length > 0) {
      params.set(name, newValues.join(","));
    } else {
      params.delete(name);
    }

    const currentPage = params.get("page");
    if (currentPage && currentPage !== "1") params.set("returnPage", currentPage);
    params.delete("page"); 

    router.push(params.toString() ? `${pathname}?${params.toString()}` : pathname);
  };

  const handleSingleSelect = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(name, value);
    else params.delete(name);
    params.delete("page");
    router.push(params.toString() ? `${pathname}?${params.toString()}` : pathname);
  };

  const clearFilters = () => {
    setQuery("");
    sessionStorage.removeItem("events_filters"); // <-- Clear saved state
    router.push(pathname);
    setShowMobileFilters(false);
  };

  const activeFilterCount = [currentQ, currentSort, currentTimeframe === "past" ? "past" : "", ...currentCategories, ...currentFormats, ...currentCities, ...currentTypes].filter(Boolean).length;
  const hasFilters = activeFilterCount > 0;

  return (
    <>
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg dark:shadow-none mb-8 sticky top-20 z-30 p-4 transition-colors duration-300">
        
        {/* ROW 1: SEARCH BAR */}
        <form onSubmit={handleSearch} className="relative w-full flex gap-2 sm:mb-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              enterKeyHint="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search events by title..."
              className="w-full pl-9 pr-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm transition placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>
          <button type="submit" className="px-4 py-2.5 bg-slate-900 dark:bg-slate-800 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-slate-700 transition shrink-0 font-medium text-sm">
            Search
          </button>
          
          {/* Mobile Filter Trigger */}
          <button
            type="button"
            onClick={() => setShowMobileFilters(true)}
            className="sm:hidden flex items-center justify-center gap-1.5 px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-200 transition shrink-0 font-medium text-sm"
          >
            <SlidersHorizontal className="w-4 h-4" />
            {activeFilterCount > 0 && (
              <span className="bg-orange-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold ml-0.5">
                {activeFilterCount}
              </span>
            )}
          </button>
        </form>

        {/* ROW 2: DESKTOP FILTER PILLS */}
        <div className="hidden sm:grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 w-full">
          <MultiSelectDropdown label="Category" icon={<Tag className="w-4 h-4" />} options={EVENT_CATEGORIES} selected={currentCategories} onChange={(v) => handleMultiSelect("category", v)} />
          <MultiSelectDropdown label="Type" icon={<Layers className="w-4 h-4" />} options={EVENT_TYPES} selected={currentTypes} onChange={(v) => handleMultiSelect("event_type", v)} />
          <MultiSelectDropdown label="Format" icon={<Monitor className="w-4 h-4" />} options={EVENT_FORMATS} selected={currentFormats} onChange={(v) => handleMultiSelect("format", v)} />
          <MultiSelectDropdown label="City" icon={<MapPin className="w-4 h-4" />} options={PAKISTAN_CITIES} selected={currentCities} onChange={(v) => handleMultiSelect("city", v)} />
          <SingleSelectDropdown label="Timeframe" icon={<Clock className="w-4 h-4" />} value={currentTimeframe} defaultValue="upcoming" onChange={(v) => handleSingleSelect("timeframe", v)} options={TIMEFRAME_OPTIONS} />
          <SingleSelectDropdown label="Sort By" icon={<ArrowDownWideNarrow className="w-4 h-4" />} value={currentSort} defaultValue="" onChange={(v) => handleSingleSelect("sort", v)} options={SORT_OPTIONS} />
        </div>

        {/* ROW 3: ACTIVE FILTER CHIPS (Horizontal Scroll) */}
        {hasFilters && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100 w-full overflow-hidden">
            <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">Active:</span>
            <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1 w-full">
              {currentTimeframe === "past" && <FilterChip label="Past Events" onRemove={() => handleSingleSelect("timeframe", "upcoming")} />}
              {currentQ && <FilterChip label={`"${currentQ}"`} onRemove={() => { setQuery(""); handleSingleSelect("q", ""); }} />}
              {currentCategories.map(c => <FilterChip key={c} label={c} onRemove={() => handleMultiSelect("category", c)} />)}
              {currentTypes.map(t => <FilterChip key={t} label={t} onRemove={() => handleMultiSelect("event_type", t)} />)}
              {currentFormats.map(f => <FilterChip key={f} label={f} onRemove={() => handleMultiSelect("format", f)} />)}
              {currentCities.map(c => <FilterChip key={c} label={c} onRemove={() => handleMultiSelect("city", c)} />)}
              {currentSort && <FilterChip label={`Sort: ${SORT_OPTIONS.find(o => o.value === currentSort)?.label}`} onRemove={() => handleSingleSelect("sort", "")} />}
              
              <button onClick={clearFilters} className="shrink-0 ml-1 text-xs font-semibold text-red-600 hover:text-red-700 hover:underline transition flex items-center gap-1">
                <X className="w-3 h-3" /> Clear All
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MOBILE FILTERS DRAWER (Bottom Sheet) */}
      {showMobileFilters && (
        <div className="sm:hidden fixed inset-0 z-[100] flex flex-col justify-end">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={() => setShowMobileFilters(false)} />
          
          <div className="relative bg-white dark:bg-slate-900 w-full max-h-[85vh] rounded-t-3xl shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-300 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Filters</h2>
              <button onClick={() => setShowMobileFilters(false)} className="p-2 bg-slate-100 rounded-full text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Category</h3>
                <div className="flex flex-wrap gap-2">
                  {EVENT_CATEGORIES.map(c => (
                    <button key={c} onClick={() => handleMultiSelect("category", c)} className={`px-3 py-1.5 text-sm rounded-lg border transition ${currentCategories.includes(c) ? "bg-orange-500 text-white border-orange-500 shadow-sm" : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700"}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Event Type</h3>
                <div className="flex flex-wrap gap-2">
                  {EVENT_TYPES.map(t => (
                    <button key={t} onClick={() => handleMultiSelect("event_type", t)} className={`px-3 py-1.5 text-sm rounded-lg border transition ${currentTypes.includes(t) ? "bg-orange-500 text-white border-orange-500 shadow-sm" : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700"}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Format</h3>
                <div className="flex flex-wrap gap-2">
                  {EVENT_FORMATS.map(f => (
                    <button key={f} onClick={() => handleMultiSelect("format", f)} className={`px-3 py-1.5 text-sm rounded-lg border transition ${currentFormats.includes(f) ? "bg-orange-500 text-white border-orange-500 shadow-sm" : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700"}`}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">City</h3>
                <div className="flex flex-wrap gap-2">
                  {PAKISTAN_CITIES.map(c => (
                    <button key={c} onClick={() => handleMultiSelect("city", c)} className={`px-3 py-1.5 text-sm rounded-lg border transition ${currentCities.includes(c) ? "bg-orange-500 text-white border-orange-500 shadow-sm" : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700"}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Timeframe</h3>
                <div className="space-y-2">
                  {TIMEFRAME_OPTIONS.map(t => (
                    <label key={t.value} className="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer bg-white dark:bg-slate-800">
                      <input type="radio" checked={currentTimeframe === t.value} onChange={() => handleSingleSelect("timeframe", t.value)} className="w-4 h-4 text-orange-500 focus:ring-orange-500" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Sort By</h3>
                <div className="space-y-2">
                  {SORT_OPTIONS.map(s => (
                    <label key={s.value} className="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer bg-white dark:bg-slate-800">
                      <input type="radio" checked={currentSort === s.value} onChange={() => handleSingleSelect("sort", s.value)} className="w-4 h-4 text-orange-500 focus:ring-orange-500" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{s.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex gap-3">
              <button onClick={clearFilters} className="flex-1 py-3 px-4 border border-slate-300 text-slate-700 rounded-xl font-bold text-sm">
                Clear All
              </button>
              <button onClick={() => setShowMobileFilters(false)} className="flex-1 py-3 px-4 bg-orange-500 text-white rounded-xl font-bold text-sm shadow-sm shadow-orange-500/25">
                Show Results
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* Desktop Dropdown Components */
function MultiSelectDropdown({ label, icon, options, selected, onChange }: { label: string, icon: React.ReactNode, options: readonly string[], selected: string[], onChange: (v: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button type="button" onClick={() => setIsOpen(!isOpen)} className={`w-full h-10 flex items-center justify-between px-3 text-sm rounded-lg border outline-none cursor-pointer transition ${selected.length > 0 ? "bg-orange-50 dark:bg-orange-500/20 border-orange-300 dark:border-orange-500/50 text-orange-900 dark:text-orange-400 font-semibold" : "bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"}`}>
        <div className="flex items-center gap-2 truncate pr-2">{icon}<span className="truncate">{selected.length === 0 ? label : `${label} (${selected.length})`}</span></div>
        <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full min-w-[200px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto p-1.5 animate-in fade-in zoom-in-95 duration-100">
          {options.map((opt) => {
            const isChecked = selected.includes(opt);
            return (
              <button key={opt} type="button" onClick={() => onChange(opt)} className="w-full flex items-center gap-2 px-2 py-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded text-sm text-left transition">
                <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${isChecked ? 'bg-orange-500 border-orange-500' : 'border-slate-300'}`}>{isChecked && <Check className="w-3 h-3 text-white" />}</div>
                <span className="truncate text-slate-700 dark:text-slate-200">{opt}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SingleSelectDropdown({ label, icon, value, defaultValue, onChange, options }: { label: string, icon: React.ReactNode, value: string, defaultValue: string, onChange: (v: string) => void, options: {label: string, value: string}[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isDefault = value === defaultValue;
  const currentLabel = isDefault ? label : (options.find(o => o.value === value)?.label || label);
  const isActive = !isDefault;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button type="button" onClick={() => setIsOpen(!isOpen)} className={`w-full h-10 flex items-center justify-between px-3 text-sm rounded-lg border outline-none cursor-pointer transition ${isActive ? "bg-orange-50 dark:bg-orange-500/20 border-orange-300 dark:border-orange-500/50 text-orange-900 dark:text-orange-400 font-semibold" : "bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"}`}>
        <div className="flex items-center gap-2 truncate pr-2">{icon}<span className="truncate">{currentLabel}</span></div>
        <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full min-w-[150px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto p-1.5 animate-in fade-in zoom-in-95 duration-100">
          {options.map((opt) => {
            const isChecked = value === opt.value;
            return (
              <button key={opt.value} type="button" onClick={() => { onChange(opt.value); setIsOpen(false); }} className={`w-full flex items-center gap-2 px-2 py-2 rounded text-sm text-left transition ${isChecked ? 'bg-slate-100 dark:bg-slate-700 font-semibold' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${isChecked ? 'border-orange-500' : 'border-slate-300'}`}>{isChecked && <div className="w-2 h-2 rounded-full bg-orange-500" />}</div>
                <span className="truncate text-slate-700 dark:text-slate-200">{opt.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-md border border-slate-200 dark:border-slate-700">
      {label}
      <button onClick={onRemove} className="hover:bg-slate-300 rounded-full p-0.5 transition"><X className="w-3 h-3" /></button>
    </span>
  );
}
