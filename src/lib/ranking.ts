export interface RankTier {
  name: string;
  minPoints: number;
  icon: string;
  color: string;
  gradient: string;
  glowColor: string;
}

export const RANK_TIERS: RankTier[] = [
  { name: "Rookie", minPoints: 0, icon: "🌱", color: "hsl(150 30% 50%)", gradient: "from-emerald-800/40 to-emerald-900/40", glowColor: "hsl(150 30% 50% / 0.3)" },
  { name: "Bronze", minPoints: 50, icon: "🥉", color: "hsl(30 60% 55%)", gradient: "from-amber-700/40 to-orange-900/40", glowColor: "hsl(30 60% 55% / 0.3)" },
  { name: "Silver", minPoints: 150, icon: "🥈", color: "hsl(0 0% 70%)", gradient: "from-gray-400/30 to-gray-600/30", glowColor: "hsl(0 0% 70% / 0.3)" },
  { name: "Gold", minPoints: 400, icon: "🥇", color: "hsl(45 90% 55%)", gradient: "from-yellow-500/30 to-amber-600/30", glowColor: "hsl(45 90% 55% / 0.4)" },
  { name: "Platinum", minPoints: 800, icon: "💎", color: "hsl(200 80% 65%)", gradient: "from-cyan-400/30 to-blue-600/30", glowColor: "hsl(200 80% 65% / 0.4)" },
  { name: "Diamond", minPoints: 1500, icon: "👑", color: "hsl(280 70% 65%)", gradient: "from-purple-400/30 to-pink-600/30", glowColor: "hsl(280 70% 65% / 0.5)" },
  { name: "Legend", minPoints: 3000, icon: "🔥", color: "hsl(15 90% 55%)", gradient: "from-red-500/30 to-orange-500/30", glowColor: "hsl(15 90% 55% / 0.5)" },
];

export function calculatePoints(totalWorkouts: number, totalMinutes: number, streak: number): number {
  return totalWorkouts * 10 + Math.floor(totalMinutes / 5) + streak * 5;
}

export function getRank(points: number): RankTier {
  let rank = RANK_TIERS[0];
  for (const tier of RANK_TIERS) {
    if (points >= tier.minPoints) rank = tier;
  }
  return rank;
}

export function getNextRank(points: number): RankTier | null {
  for (const tier of RANK_TIERS) {
    if (points < tier.minPoints) return tier;
  }
  return null;
}

export function getProgressToNextRank(points: number): number {
  const current = getRank(points);
  const next = getNextRank(points);
  if (!next) return 100;
  const range = next.minPoints - current.minPoints;
  const progress = points - current.minPoints;
  return Math.min(100, Math.round((progress / range) * 100));
}
