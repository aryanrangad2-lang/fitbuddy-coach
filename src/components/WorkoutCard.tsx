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
  MoreHorizontal 
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
  strength: 'Strength',
  yoga: 'Yoga',
  hiit: 'HIIT',
  walking: 'Walking',
  other: 'Other',
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
      initial={{ opacity: 0, x: -20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ 
        duration: 0.3, 
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={{ 
        x: 4,
        scale: 1.01,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "w-full bg-card rounded-2xl p-4 shadow-card border border-border/50 cursor-pointer",
        "hover:shadow-glow hover:border-primary/30",
        className
      )}
    >
      <div className="flex items-start gap-4">
        <motion.div 
          className="flex-shrink-0 w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-soft"
          whileHover={{ rotate: 5 }}
          whileTap={{ scale: 0.9 }}
        >
          <Icon className="w-6 h-6 text-primary-foreground" />
        </motion.div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-foreground">
              {workoutLabels[workout.type]}
            </h3>
            <span className="text-sm text-muted-foreground">
              {format(workout.date, 'MMM d')}
            </span>
          </div>
          
          <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1">
              <span className="font-medium text-foreground">{workout.duration}</span> min
            </span>
            <motion.span 
              className={cn(
                "px-2 py-0.5 rounded-full text-xs font-medium capitalize",
                workout.intensity === 'low' && "bg-accent/20 text-accent",
                workout.intensity === 'medium' && "bg-primary/20 text-primary",
                workout.intensity === 'high' && "bg-destructive/20 text-destructive"
              )}
              whileHover={{ scale: 1.1 }}
            >
              {workout.intensity}
            </motion.span>
            {workout.calories && (
              <span className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-primary" />
                <span className="font-medium text-foreground">{workout.calories}</span> kcal
              </span>
            )}
          </div>
          
          {workout.notes && (
            <motion.p 
              className="mt-2 text-sm text-muted-foreground line-clamp-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {workout.notes}
            </motion.p>
          )}
        </div>
      </div>
    </motion.div>
  );
}