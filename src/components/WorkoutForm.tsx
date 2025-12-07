import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { WorkoutType, Intensity, Workout } from "@/types/workout";
import { cn } from "@/lib/utils";
import { 
  Bike, 
  Dumbbell, 
  Footprints, 
  Heart, 
  Waves, 
  Zap,
  Plus,
  X
} from "lucide-react";

const workoutTypes: { type: WorkoutType; icon: React.ElementType; label: string }[] = [
  { type: 'running', icon: Footprints, label: 'Run' },
  { type: 'cycling', icon: Bike, label: 'Cycle' },
  { type: 'swimming', icon: Waves, label: 'Swim' },
  { type: 'strength', icon: Dumbbell, label: 'Strength' },
  { type: 'yoga', icon: Heart, label: 'Yoga' },
  { type: 'hiit', icon: Zap, label: 'HIIT' },
];

const intensities: { value: Intensity; label: string }[] = [
  { value: 'low', label: 'Easy' },
  { value: 'medium', label: 'Moderate' },
  { value: 'high', label: 'Intense' },
];

interface WorkoutFormProps {
  onSubmit: (workout: Omit<Workout, 'id' | 'date'>) => void;
  onClose: () => void;
}

export function WorkoutForm({ onSubmit, onClose }: WorkoutFormProps) {
  const [type, setType] = useState<WorkoutType>('running');
  const [duration, setDuration] = useState('30');
  const [intensity, setIntensity] = useState<Intensity>('medium');
  const [calories, setCalories] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      type,
      duration: parseInt(duration) || 0,
      intensity,
      calories: calories ? parseInt(calories) : undefined,
      notes: notes || undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-card rounded-3xl p-6 w-full max-w-md shadow-soft animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Log Workout</h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Workout Type */}
          <div>
            <Label className="text-sm font-medium text-foreground mb-3 block">
              What did you do?
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {workoutTypes.map(({ type: t, icon: Icon, label }) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200",
                    type === t 
                      ? "gradient-primary text-primary-foreground shadow-soft" 
                      : "bg-secondary text-secondary-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div>
            <Label htmlFor="duration" className="text-sm font-medium text-foreground mb-2 block">
              Duration (minutes)
            </Label>
            <Input
              id="duration"
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="bg-secondary border-0 rounded-xl h-12"
              placeholder="30"
              min="1"
              required
            />
          </div>

          {/* Intensity */}
          <div>
            <Label className="text-sm font-medium text-foreground mb-3 block">
              How hard was it?
            </Label>
            <div className="flex gap-2">
              {intensities.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setIntensity(value)}
                  className={cn(
                    "flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-200",
                    intensity === value 
                      ? value === 'low' ? "bg-accent text-accent-foreground"
                        : value === 'medium' ? "gradient-primary text-primary-foreground"
                        : "bg-destructive text-destructive-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-muted"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Calories (optional) */}
          <div>
            <Label htmlFor="calories" className="text-sm font-medium text-foreground mb-2 block">
              Calories burned (optional)
            </Label>
            <Input
              id="calories"
              type="number"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              className="bg-secondary border-0 rounded-xl h-12"
              placeholder="250"
              min="0"
            />
          </div>

          {/* Notes (optional) */}
          <div>
            <Label htmlFor="notes" className="text-sm font-medium text-foreground mb-2 block">
              Notes (optional)
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-secondary border-0 rounded-xl resize-none"
              placeholder="How did it feel? Any achievements?"
              rows={3}
            />
          </div>

          <Button type="submit" variant="gradient" size="lg" className="w-full">
            <Plus className="w-5 h-5" />
            Log Workout
          </Button>
        </form>
      </div>
    </div>
  );
}
