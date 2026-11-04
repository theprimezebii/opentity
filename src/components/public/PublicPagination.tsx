"use client";

import Link from "next/link";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, ChevronDown, LayoutGrid } from "lucide-react";
import { useRef, useState, useEffect } from "react";

export function PublicPagination({ totalPages }: { totalPages: number }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const currentPage = Number(searchParams.get("page")) || 1;
  const currentLimit = searchParams.get("limit") || "9";

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLimitChange = (newLimit: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", newLimit);
    params.delete("page");
    // scroll: false keeps the user exactly where they are
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    setDropdownOpen(false);
  };

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    return `${pathname}?${params.toString()}`;
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) pages.push(1, 2, 3, 4, "...", totalPages);
      else if (currentPage >= totalPages - 2) pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      else pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
    }
    return pages;
  };

  const arrowBtn = (disabled: boolean) =>
    `w-10 h-10 flex items-center justify-center rounded-xl border transition ${
      disabled
        ? "pointer-events-none opacity-40 bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-400"
        : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-orange-50 dark:hover:bg-orange-500/10 hover:text-orange-500 hover:border-orange-300 dark:hover:border-orange-500"
    }`;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 mb-8 w-full">
      
      {/* PREMIUM PER-PAGE DROPDOWN */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-sm"
        >
          <LayoutGrid className="w-4 h-4 text-orange-500" />
          <span>Show {currentLimit}</span>
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
        </button>

        {dropdownOpen && (
          <div className="absolute top-full left-0 mt-2 w-40 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 p-1.5 animate-in fade-in zoom-in-95 duration-100">
            {["9", "12", "15"].map((val) => (
              <button
                key={val}
                onClick={() => handleLimitChange(val)}
                className={`w-full text-left px-3 py-2 text-sm rounded-lg transition ${
                  currentLimit === val
                    ? "bg-orange-50 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 font-bold"
                    : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
                }`}
              >
                {val} per page
              </button>
            ))}
          </div>
        )}
      </div>

      {/* PAGINATION NUMBERS */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5">
          <Link href={createPageUrl(currentPage - 1)} scroll={true} className={arrowBtn(currentPage === 1)} aria-label="Previous page">
            <ChevronLeft className="w-4 h-4" />
          </Link>

          {getPageNumbers().map((page, index) => {
            if (page === "...") return <span key={`e-${index}`} className="px-1 text-slate-400">...</span>;
            const pageNum = page as number;
            const isActive = currentPage === pageNum;
            return (
              <Link 
                key={pageNum} 
                href={createPageUrl(pageNum)} 
                scroll={true}
                className={`min-w-[40px] h-10 flex items-center justify-center rounded-xl border text-sm font-bold transition ${
                  isActive
                    ? "bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/30"
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-500 hover:text-orange-500"
                }`}
              >
                {pageNum}
              </Link>
            );
          })}

          <Link href={createPageUrl(currentPage + 1)} scroll={true} className={arrowBtn(currentPage === totalPages)} aria-label="Next page">
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Spacer for symmetry on desktop */}
      <div className="hidden sm:block w-[120px]"></div>
    </div>
  );
}
