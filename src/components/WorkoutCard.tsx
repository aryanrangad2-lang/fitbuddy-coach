import { Workout, WorkoutType } from "@/types/workout";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { 
  Bike, 
  Dumbbell, 
  Flame, 
  Footprints, 
  Heart, 
  Waves, 
  Zap,
  MoreHorizontal,
  Clock,
  ChevronRight
} from "lucide-react";
import { format } from "date-fns";

const workoutIcons: Record<WorkoutType, React.ElementType> = {
  running: Footprints,
  cycling: Bike,
  swimming: Waves,
  strength: Dumbbell,
  yoga: Heart,
  hiit: Zap,
  walking: Footprints,
  other: MoreHorizontal,
};

const workoutLabels: Record<WorkoutType, string> = {
  running: 'Running',
  cycling: 'Cycling',
  swimming: 'Swimming',
  strength: 'Strength Training',
  yoga: 'Yoga',
  hiit: 'HIIT',
  walking: 'Walking',
  other: 'Other',
};

const workoutColors: Record<WorkoutType, string> = {
  running: 'from-orange-500/20 to-orange-600/10 border-orange-500/20',
  cycling: 'from-blue-500/20 to-blue-600/10 border-blue-500/20',
  swimming: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/20',
  strength: 'from-primary/20 to-primary/10 border-primary/20',
  yoga: 'from-pink-500/20 to-pink-600/10 border-pink-500/20',
  hiit: 'from-red-500/20 to-red-600/10 border-red-500/20',
  walking: 'from-green-500/20 to-green-600/10 border-green-500/20',
  other: 'from-secondary/50 to-secondary/20 border-border/40',
};

const iconBgColors: Record<WorkoutType, string> = {
  running: 'bg-orange-500/20 text-orange-400',
  cycling: 'bg-blue-500/20 text-blue-400',
  swimming: 'bg-cyan-500/20 text-cyan-400',
  strength: 'bg-primary/20 text-primary',
  yoga: 'bg-pink-500/20 text-pink-400',
  hiit: 'bg-red-500/20 text-red-400',
  walking: 'bg-green-500/20 text-green-400',
  other: 'bg-secondary text-muted-foreground',
};

interface WorkoutCardProps {
  workout: Workout;
  className?: string;
  index?: number;
}

export function WorkoutCard({ workout, className, index = 0 }: WorkoutCardProps) {
  const Icon = workoutIcons[workout.type];
  
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20, scale: 0.97 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ 
        duration: 0.35, 
        delay: index * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={{ 
        x: 4,
        scale: 1.01,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "w-full rounded-2xl p-4 border cursor-pointer group overflow-hidden",
        "bg-gradient-to-r",
        workoutColors[workout.type],
        className
      )}
    >
      <div className="flex items-center gap-4">
        {/* Icon */}
        <motion.div 
          className={cn(
            "flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center",
            iconBgColors[workout.type]
          )}
          whileHover={{ rotate: 8, scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Icon className="w-5 h-5" />
        </motion.div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-bold text-foreground text-sm">
              {workoutLabels[workout.type]}
            </h3>
            <span className="text-xs text-muted-foreground">
              {format(workout.date, 'MMM d')}
            </span>
          </div>
          
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span className="font-semibold text-foreground">{workout.duration}</span> min
            </span>
            <span className={cn(
              "px-2 py-0.5 rounded-full text-xs font-semibold capitalize",
              workout.intensity === 'low' && "bg-green-500/15 text-green-400",
              workout.intensity === 'medium' && "bg-primary/15 text-primary",
              workout.intensity === 'high' && "bg-red-500/15 text-red-400"
            )}>
              {workout.intensity}
            </span>
            {workout.calories && (
              <span className="flex items-center gap-1 text-muted-foreground ml-auto">
                <Flame className="w-3 h-3 text-primary" />
                <span className="font-semibold text-foreground">{workout.calories}</span> kcal
              </span>
            )}
          </div>
          
          {workout.notes && (
            <p className="mt-1.5 text-xs text-muted-foreground line-clamp-1 italic">
              "{workout.notes}"
            </p>
          )}
        </div>

        <ChevronRight className="w-4 h-4 text-muted-foreground/40 flex-shrink-0 group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
      </div>
    </motion.div>
  );
}
