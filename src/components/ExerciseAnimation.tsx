import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ExerciseAnimationProps {
  exerciseName: string;
  type: 'strength' | 'cardio' | 'rest' | 'flexibility';
  className?: string;
}

const exerciseAnimations: Record<string, { frames: string[]; color: string }> = {
  // Strength exercises
  'push-ups': { frames: ['🧎', '🫃', '🧎'], color: 'from-primary to-primary/60' },
  'squats': { frames: ['🧍', '🧎', '🧍'], color: 'from-primary to-primary/60' },
  'lunges': { frames: ['🧍', '🚶', '🧍'], color: 'from-primary to-primary/60' },
  'plank': { frames: ['🫃', '🫃', '🫃'], color: 'from-yellow-500 to-orange-500' },
  'burpees': { frames: ['🧍', '🧎', '🫃', '🧎', '🧍'], color: 'from-red-500 to-orange-500' },
  'dips': { frames: ['🧍', '🧎', '🧍'], color: 'from-primary to-primary/60' },
  'crunches': { frames: ['🧎', '🫃', '🧎'], color: 'from-purple-500 to-pink-500' },
  'bridges': { frames: ['🫃', '🧎', '🫃'], color: 'from-primary to-primary/60' },
  'default-strength': { frames: ['🏋️', '💪', '🏋️'], color: 'from-primary to-primary/60' },

  // Cardio exercises
  'running': { frames: ['🏃', '🏃‍♂️', '🏃'], color: 'from-red-500 to-rose-500' },
  'walking': { frames: ['🚶', '🚶‍♂️', '🚶'], color: 'from-blue-400 to-cyan-400' },
  'jumping': { frames: ['🧍', '🤸', '🧍'], color: 'from-orange-500 to-amber-500' },
  'mountain-climbers': { frames: ['🫃', '🏃', '🫃'], color: 'from-red-500 to-orange-500' },
  'high-knees': { frames: ['🏃', '🧍', '🏃'], color: 'from-red-400 to-rose-400' },
  'default-cardio': { frames: ['🏃', '💨', '🏃'], color: 'from-red-500 to-rose-500' },

  // Flexibility
  'yoga': { frames: ['🧘', '🙆', '🧘'], color: 'from-purple-500 to-violet-500' },
  'stretching': { frames: ['🙆', '🧘', '🙆'], color: 'from-purple-400 to-pink-400' },
  'default-flexibility': { frames: ['🧘', '🙆', '🧘'], color: 'from-purple-500 to-violet-500' },

  // Rest
  'rest': { frames: ['😴', '💤', '😴'], color: 'from-blue-400 to-indigo-400' },
  'default-rest': { frames: ['😴', '💤', '😴'], color: 'from-blue-400 to-indigo-400' },
};

function getAnimationData(name: string, type: string) {
  const lower = name.toLowerCase();
  
  for (const key of Object.keys(exerciseAnimations)) {
    if (lower.includes(key)) return exerciseAnimations[key];
  }

  // Keyword matching
  if (lower.includes('push')) return exerciseAnimations['push-ups'];
  if (lower.includes('squat')) return exerciseAnimations['squats'];
  if (lower.includes('lunge')) return exerciseAnimations['lunges'];
  if (lower.includes('plank')) return exerciseAnimations['plank'];
  if (lower.includes('burpee')) return exerciseAnimations['burpees'];
  if (lower.includes('dip')) return exerciseAnimations['dips'];
  if (lower.includes('crunch') || lower.includes('v-up') || lower.includes('leg raise')) return exerciseAnimations['crunches'];
  if (lower.includes('bridge') || lower.includes('glute')) return exerciseAnimations['bridges'];
  if (lower.includes('run') || lower.includes('jog') || lower.includes('sprint')) return exerciseAnimations['running'];
  if (lower.includes('walk') || lower.includes('march')) return exerciseAnimations['walking'];
  if (lower.includes('jump') || lower.includes('jack')) return exerciseAnimations['jumping'];
  if (lower.includes('mountain') || lower.includes('climber')) return exerciseAnimations['mountain-climbers'];
  if (lower.includes('knee') || lower.includes('butt kick')) return exerciseAnimations['high-knees'];
  if (lower.includes('yoga') || lower.includes('flow')) return exerciseAnimations['yoga'];
  if (lower.includes('stretch') || lower.includes('foam') || lower.includes('roll')) return exerciseAnimations['stretching'];

  return exerciseAnimations[`default-${type}`] || exerciseAnimations['default-strength'];
}

// Simple beep sound using Web Audio API
function playExerciseSound(type: string) {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'strength') {
      osc.frequency.value = 220;
      osc.type = 'sine';
    } else if (type === 'cardio') {
      osc.frequency.value = 330;
      osc.type = 'triangle';
    } else if (type === 'flexibility') {
      osc.frequency.value = 440;
      osc.type = 'sine';
    } else {
      osc.frequency.value = 180;
      osc.type = 'sine';
    }

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  } catch {}
}

export function ExerciseAnimation({ exerciseName, type, className }: ExerciseAnimationProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();
  const animData = getAnimationData(exerciseName, type);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentFrame(prev => {
          const next = (prev + 1) % animData.frames.length;
          if (next === 0 && soundEnabled) playExerciseSound(type);
          return next;
        });
      }, 600);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, animData.frames.length, soundEnabled, type]);

  const togglePlay = () => {
    if (!isPlaying && soundEnabled) playExerciseSound(type);
    setIsPlaying(!isPlaying);
    if (!isPlaying) setCurrentFrame(0);
  };

  return (
    <div className={`relative ${className || ''}`}>
      <motion.div
        className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${animData.color} flex items-center justify-center cursor-pointer overflow-hidden`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={togglePlay}
      >
        {/* Animated ring when playing */}
        {isPlaying && (
          <motion.div
            className="absolute inset-0 rounded-2xl border-2 border-white/40"
            animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
        )}

        <AnimatePresence mode="wait">
          <motion.span
            key={currentFrame}
            className="text-2xl select-none"
            initial={{ scale: 0.5, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {animData.frames[currentFrame]}
          </motion.span>
        </AnimatePresence>

        {/* Play/Pause overlay */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-2xl"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 text-white" />
          ) : (
            <Play className="w-5 h-5 text-white ml-0.5" />
          )}
        </motion.div>
      </motion.div>

      {/* Sound toggle */}
      <motion.button
        className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-card border border-border flex items-center justify-center"
        onClick={(e) => { e.stopPropagation(); setSoundEnabled(!soundEnabled); }}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.8 }}
      >
        {soundEnabled ? (
          <Volume2 className="w-3 h-3 text-primary" />
        ) : (
          <VolumeX className="w-3 h-3 text-muted-foreground" />
        )}
      </motion.button>
    </div>
  );
}