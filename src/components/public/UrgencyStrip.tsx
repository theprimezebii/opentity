import { connection } from "next/server";
import Link from "next/link";
import { Flame, Sparkles, Clock, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { DaysUntil } from "@/components/public/DaysUntil";

export async function UrgencyStrip() {
  await connection();
  const supabase = await createClient();

  const now = new Date();
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [closingRes, newRes, nextRes] = await Promise.all([
    supabase.from("events").select("*", { count: "exact", head: true }).neq("status", "draft").gte("registration_deadline", now.toISOString()).lte("registration_deadline", sevenDaysFromNow.toISOString()),
    supabase.from("events").select("*", { count: "exact", head: true }).neq("status", "draft").gte("created_at", sevenDaysAgo.toISOString()),
    supabase.from("events").select("title, slug, registration_deadline").neq("status", "draft").gte("registration_deadline", now.toISOString()).order("registration_deadline", { ascending: true }).limit(1).maybeSingle(),
  ]);

  const closingCount = closingRes.count || 0;
  const newCount = newRes.count || 0;
  const next = nextRes.data as { title: string; slug: string; registration_deadline: string } | null;

  if (closingCount === 0 && newCount === 0 && !next) return null;

  return (
    <div className="border-b border-orange-100 dark:border-slate-800 bg-orange-50/50 dark:bg-slate-900/50 backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-500 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
        
        {/* Mobile: vertical stack. Desktop: horizontal flex */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3 lg:gap-6">
          
          <div className="flex flex-wrap justify-center lg:justify-start items-center gap-2 sm:gap-4 w-full lg:w-auto">
            {closingCount > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-800 rounded-full shadow-sm border border-orange-200 dark:border-slate-700 shrink-0">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
                </span>
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                <span className="text-[11px] sm:text-xs font-bold text-slate-800 dark:text-white">
                  {closingCount} closing this week
                </span>
              </div>
            )}
            {newCount > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-800 rounded-full shadow-sm border border-slate-200 dark:border-slate-700 shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-[11px] sm:text-xs font-bold text-slate-800 dark:text-white">
                  {newCount} new this week
                </span>
              </div>
            )}
          </div>

          {next && (
            <Link href={`/events/${next.slug}`} className="group flex items-center justify-center gap-1.5 sm:gap-2 text-[11px] sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors w-full lg:w-auto mt-1 lg:mt-0">
              <Clock className="w-3.5 h-3.5 text-orange-500 shrink-0" />
              <span className="hidden sm:inline">Next deadline:</span>
              <span className="truncate max-w-[120px] sm:max-w-[200px] text-slate-900 dark:text-white">{next.title}</span>
              <span className="flex items-center gap-0.5 bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 px-1.5 py-0.5 rounded text-[10px] sm:text-xs font-bold shrink-0">
                <DaysUntil deadline={next.registration_deadline} />
              </span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform shrink-0" />
            </Link>
          )}

        </div>
      </div>
    </div>
  );
}
