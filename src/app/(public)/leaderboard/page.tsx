import Link from "next/link";
import { Trophy, Lock, ArrowRight } from "lucide-react";
import { cacheLife } from "next/cache";
import { getPublicLeaderboard } from "@/lib/queries/leaderboard";
import { PublicLeaderboardTable } from "@/components/public/PublicLeaderboardTable";

export const metadata = {
  title: "Leaderboard",
  description: "Top students on Opentity, ranked by saved events and daily check-ins.",
};

export default async function LeaderboardPage() {
  "use cache";
  cacheLife("minutes");

  const groups = await getPublicLeaderboard();

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium mb-4">
          <Trophy className="w-4 h-4" />
          Weekly leaderboard
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
          Top students this week
        </h1>
        <p className="text-slate-600 max-w-xl mx-auto">
          Ranked by saved events and daily check-ins over the last 7 days.
        </p>
        <p className="text-xs text-slate-500 mt-2">
          Leagues reset weekly. Top 3 promote, bottom 3 demote, middle 4 stay.
        </p>
      </div>

      <div className="mb-6 flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
        <Lock className="w-5 h-5 text-slate-500 shrink-0" />
        <p className="text-sm text-slate-600 leading-snug">
          <strong className="text-slate-900">Top 3 per league.</strong>{" "}
          Sign in to see the full standings, your own rank, and your league.
        </p>
      </div>

      <PublicLeaderboardTable groups={groups} />

      <div className="mt-8 text-center">
        <Link
          href="/login?next=/dashboard/community"
          className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 active:scale-[0.97] transition-all shadow-sm shadow-orange-500/25"
        >
          Sign in to see your rank <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </main>
  );
}
