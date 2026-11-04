import Link from "next/link";
import { MapPin } from "lucide-react";
import { UserAvatar } from "@/components/ui/UserAvatar";
import type { PublicLeaderboardGroup, PublicLeaderboardRow } from "@/lib/queries/leaderboard";

const LEAGUE_META: Record<string, { label: string; header: string; rankBadge: string }> = {
  master:  { label: "Master",  header: "bg-orange-500 text-white", rankBadge: "bg-orange-100 text-orange-700" },
  diamond: { label: "Diamond", header: "bg-cyan-600 text-white",   rankBadge: "bg-cyan-100 text-cyan-700"     },
  gold:    { label: "Gold",    header: "bg-yellow-500 text-white", rankBadge: "bg-yellow-100 text-yellow-800" },
  silver:  { label: "Silver",  header: "bg-slate-600 text-white",  rankBadge: "bg-slate-200 text-slate-700"   },
  bronze:  { label: "Bronze",  header: "bg-amber-700 text-white",  rankBadge: "bg-amber-100 text-amber-800"   },
};

export function PublicLeaderboardTable({ groups }: { groups: PublicLeaderboardGroup[] }) {
  return (
    <div className="space-y-5">
      {groups.map((group) => {
        const meta = LEAGUE_META[group.league] || LEAGUE_META.bronze;
        return (
          <section key={group.league} className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className={`flex items-center justify-between px-5 py-3 ${meta.header}`}>
              <span className="text-xs font-bold uppercase tracking-wider">
                {meta.label} League
              </span>
              <span className="text-[11px] font-medium opacity-80">Top 3</span>
            </div>
            <ul className="divide-y divide-slate-100">
              {group.rows.map((row) => (
                <RowItem key={`${group.league}-${row.rank}-${row.full_name}`} row={row} meta={meta} />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

function RowItem({
  row,
  meta,
}: {
  row: PublicLeaderboardRow;
  meta: { rankBadge: string };
}) {
  const inner = (
    <>
      <div
        className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold shrink-0 ${meta.rankBadge}`}
      >
        {row.rank}
      </div>
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <UserAvatar name={row.full_name} url={row.avatar_url} size="sm" />
        <div className="min-w-0">
          <p className="font-semibold text-slate-900 text-sm truncate">{row.full_name}</p>
          {row.city && (
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3" /> {row.city}
            </p>
          )}
        </div>
      </div>
      <div className="text-right shrink-0">
        <span className="text-base font-bold text-slate-900 tabular-nums">
          {row.weekly_points}
        </span>
        <span className="text-xs text-slate-400 ml-1">pts</span>
      </div>
    </>
  );

  if (row.username && !row.is_bot) {
    return (
      <li>
        <Link
          href={`/u/${row.username}`}
          className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 active:bg-slate-100 transition-colors"
        >
          {inner}
        </Link>
      </li>
    );
  }

  return <li className="flex items-center gap-3 px-5 py-3">{inner}</li>;
}
