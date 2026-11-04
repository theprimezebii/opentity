import { createPublicClient } from "@/lib/supabase/public";

export interface PublicLeaderboardRow {
  rank: number;
  full_name: string;
  username: string | null;
  avatar_url: string | null;
  city: string | null;
  league: string | null;
  weekly_points: number;
  is_bot?: boolean;
}

export interface PublicLeaderboardGroup {
  league: string;
  rows: PublicLeaderboardRow[];
}

export const LEAGUES_ORDER = ["master", "diamond", "gold", "silver", "bronze"] as const;
export const PUBLIC_TOP_N = 3;

// Bot pool per league — used only when real users < 3.
// Points are computed dynamically below (never hardcoded).
const BOT_POOL: Record<string, { name: string; city: string }[]> = {
  master:  [
    { name: "Hamza Siddiqui", city: "Karachi" },
    { name: "Ayesha Tariq",   city: "Lahore" },
    { name: "Muhammad Usman", city: "Islamabad" },
  ],
  diamond: [
    { name: "Zainab Hashmi",  city: "Karachi" },
    { name: "Bilal Chaudhry", city: "Rawalpindi" },
    { name: "Hira Qureshi",   city: "Faisalabad" },
  ],
  gold:    [
    { name: "Ahmed Raza",     city: "Lahore" },
    { name: "Fatima Malik",   city: "Islamabad" },
    { name: "Hassan Mirza",   city: "Peshawar" },
  ],
  silver:  [
    { name: "Anum Zafar",     city: "Lahore" },
    { name: "Rizwan Ahmed",   city: "Karachi" },
    { name: "Madiha Ilyas",   city: "Islamabad" },
  ],
  bronze:  [
    { name: "Ali Hussain",    city: "Islamabad" },
    { name: "Sana Iqbal",     city: "Quetta" },
    { name: "Fahad Khan",     city: "Karachi" },
  ],
};

function buildLeagueRows(league: string, realSorted: any[]): PublicLeaderboardRow[] {
  // Real users already sorted by points desc (we sort below)
  const reals = realSorted.slice(0, PUBLIC_TOP_N).map((r, i) => ({
    rank: i + 1,
    full_name: r.full_name ?? "Anonymous Student",
    username: r.username ?? null,
    avatar_url: r.avatar_url ?? null,
    city: r.city ?? null,
    league,
    weekly_points: Number(r.weekly_points),
    is_bot: false,
  }));

  if (reals.length >= PUBLIC_TOP_N) return reals;

  const needed = PUBLIC_TOP_N - reals.length;
  const minRealPoints = reals.length > 0 ? reals[reals.length - 1].weekly_points : 0;
  const bots = BOT_POOL[league] || [];

  const botRows: PublicLeaderboardRow[] = [];
  for (let i = 0; i < needed; i++) {
    const bot = bots[i] || { name: "Student", city: null as any };
    // Bots stay strictly below lowest real user; start at 0 if no real users
    const botPoints = Math.max(0, minRealPoints - 1 - i);
    botRows.push({
      rank: reals.length + i + 1,
      full_name: bot.name,
      username: null,
      avatar_url: null,
      city: bot.city,
      league,
      weekly_points: botPoints,
      is_bot: true,
    });
  }

  return [...reals, ...botRows];
}

export async function getPublicLeaderboard(): Promise<PublicLeaderboardGroup[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase.rpc("get_public_leaderboard", { p_limit: 100 });

    if (error) {
      console.error("Public leaderboard error:", error.message);
      return LEAGUES_ORDER.map((l) => ({ league: l, rows: buildLeagueRows(l, []) }));
    }

    const byLeague: Record<string, any[]> = {};
    for (const row of data || []) {
      if (!row.league) continue;
      if (!byLeague[row.league]) byLeague[row.league] = [];
      byLeague[row.league].push(row);
    }
    for (const l of Object.keys(byLeague)) {
      byLeague[l].sort((a, b) => Number(b.weekly_points) - Number(a.weekly_points));
    }

    return LEAGUES_ORDER.map((league) => ({
      league,
      rows: buildLeagueRows(league, byLeague[league] || []),
    }));
  } catch (err) {
    console.error("Public leaderboard fetch failed:", err);
    return LEAGUES_ORDER.map((l) => ({ league: l, rows: buildLeagueRows(l, []) }));
  }
}
