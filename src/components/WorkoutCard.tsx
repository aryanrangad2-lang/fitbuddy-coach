import { Workout, WorkoutType } from "@/types/workout";
import { cn } from "@/lib/utils";
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
}

export function WorkoutCard({ workout, className }: WorkoutCardProps) {
  const Icon = workoutIcons[workout.type];
  
  return (
    <div 
      className={cn(
        "bg-card rounded-2xl p-4 shadow-card transition-all duration-300 hover:shadow-soft hover:-translate-y-0.5 animate-scale-in",
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-foreground">
              {workoutLabels[workout.type]}
            </h3>
            <span className="text-sm text-muted-foreground">
              {format(workout.date, 'MMM d')}
            </span>
          </div>
          
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="font-medium text-foreground">{workout.duration}</span> min
            </span>
            <span className={cn(
              "px-2 py-0.5 rounded-full text-xs font-medium capitalize",
              workout.intensity === 'low' && "bg-accent/20 text-accent",
              workout.intensity === 'medium' && "bg-primary/20 text-primary",
              workout.intensity === 'high' && "bg-destructive/20 text-destructive"
            )}>
              {workout.intensity}
            </span>
            {workout.calories && (
              <span className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-primary" />
                <span className="font-medium text-foreground">{workout.calories}</span> kcal
              </span>
            )}
          </div>
          
          {workout.notes && (
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
              {workout.notes}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
