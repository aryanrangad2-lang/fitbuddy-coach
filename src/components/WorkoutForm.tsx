import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { WorkoutType, Intensity, Workout } from "@/types/workout";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
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
    <motion.div 
      className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
    >
      <motion.div 
        className="bg-card rounded-3xl p-6 w-full max-w-md shadow-glow border border-border/50"
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 40 }}
        transition={{ 
          duration: 0.3, 
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <motion.h2 
            className="text-xl font-bold text-foreground"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            Log Workout
          </motion.h2>
          <motion.button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-muted transition-colors"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </motion.button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Workout Type */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Label className="text-sm font-medium text-foreground mb-3 block">
              What did you do?
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {workoutTypes.map(({ type: t, icon: Icon, label }, index) => (
                <motion.button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-3 rounded-xl transition-colors",
                    type === t 
                      ? "gradient-primary text-primary-foreground shadow-soft" 
                      : "bg-secondary text-secondary-foreground hover:bg-muted"
                  )}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 + index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Duration */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
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
          </motion.div>

          {/* Intensity */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Label className="text-sm font-medium text-foreground mb-3 block">
              How hard was it?
            </Label>
            <div className="flex gap-2">
              {intensities.map(({ value, label }, index) => (
                <motion.button
                  key={value}
                  type="button"
                  onClick={() => setIntensity(value)}
                  className={cn(
                    "flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-colors",
                    intensity === value 
                      ? value === 'low' ? "bg-accent text-accent-foreground"
                        : value === 'medium' ? "gradient-primary text-primary-foreground"
                        : "bg-destructive text-destructive-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-muted"
                  )}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                >
                  {label}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Calories (optional) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
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
          </motion.div>

          {/* Notes (optional) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            <Button type="submit" variant="gradient" size="lg" className="w-full">
              <Plus className="w-5 h-5" />
              Log Workout
            </Button>
          </motion.div>
        </form>
      </motion.div>
    </motion.div>
  );
}