import { motion } from "framer-motion";
import { getRank, getNextRank, getProgressToNextRank, calculatePoints, RANK_TIERS } from "@/lib/ranking";
import { cn } from "@/lib/utils";

interface RankBadgeProps {
  totalWorkouts: number;
  totalMinutes: number;
  streak: number;
  showProgress?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function RankBadge({
  totalWorkouts,
  totalMinutes,
  streak,
  showProgress = true,
  size = "md",
  className,
}: RankBadgeProps) {
  const points = calculatePoints(totalWorkouts, totalMinutes, streak);
  const rank = getRank(points);
  const nextRank = getNextRank(points);
  const progress = getProgressToNextRank(points);

  const sizeMap = {
    sm: { badge: "w-10 h-10", icon: "text-lg", text: "text-xs" },
    md: { badge: "w-14 h-14", icon: "text-2xl", text: "text-sm" },
    lg: { badge: "w-20 h-20", icon: "text-4xl", text: "text-base" },
  };

  const s = sizeMap[size];

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      {/* Badge */}
      <motion.div
        className={cn(
          "relative rounded-full flex items-center justify-center bg-gradient-to-br border-2",
          rank.gradient,
          s.badge
        )}
        style={{
          borderColor: rank.color,
          boxShadow: `0 0 20px ${rank.glowColor}, inset 0 0 12px ${rank.glowColor}`,
        }}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        whileHover={{
          scale: 1.15,
          boxShadow: `0 0 35px ${rank.glowColor}, inset 0 0 20px ${rank.glowColor}`,
        }}
      >
        <motion.span
          className={s.icon}
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          {rank.icon}
        </motion.span>

        {/* Rotating ring */}
        <motion.div
          className="absolute inset-[-3px] rounded-full border border-dashed"
          style={{ borderColor: rank.color }}
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>

      {/* Rank Name & Points */}
      <div className="text-center">
        <motion.p
          className={cn("font-bold", s.text)}
          style={{ color: rank.color }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {rank.name}
        </motion.p>
        <p className="text-xs text-muted-foreground">{points} pts</p>
      </div>

      {/* Progress bar to next rank */}
      {showProgress && nextRank && (
        <motion.div
          className="w-full max-w-[160px]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
            <span>{rank.icon} {rank.name}</span>
            <span>{nextRank.icon} {nextRank.name}</span>
          </div>
          <div className="h-2 rounded-full bg-secondary overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${rank.color}, ${nextRank.color})` }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            />
          </div>
          <p className="text-[10px] text-muted-foreground text-center mt-1">
            {nextRank.minPoints - points} pts to {nextRank.name}
          </p>
        </motion.div>
      )}
    </div>
  );
}

export function RankTierList() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {RANK_TIERS.map((tier, i) => (
        <motion.div
          key={tier.name}
          className={cn(
            "rounded-2xl p-4 text-center border bg-gradient-to-br",
            tier.gradient
          )}
          style={{ borderColor: tier.color }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.06 }}
          whileHover={{ scale: 1.05, boxShadow: `0 0 25px ${tier.glowColor}` }}
        >
          <span className="text-2xl">{tier.icon}</span>
          <p className="text-xs font-bold mt-1" style={{ color: tier.color }}>
            {tier.name}
          </p>
          <p className="text-[10px] text-muted-foreground">{tier.minPoints}+ pts</p>
        </motion.div>
      ))}
    </div>
  );
}
