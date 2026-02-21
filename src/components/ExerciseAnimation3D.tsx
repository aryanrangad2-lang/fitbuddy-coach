import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

// Import all exercise images for offline use
import benchPressImg from '@/assets/exercises/bench-press.png';
import pushupImg from '@/assets/exercises/pushup.png';
import crunchImg from '@/assets/exercises/crunch.png';
import squatImg from '@/assets/exercises/squat.png';
import deadliftImg from '@/assets/exercises/deadlift.png';
import plankImg from '@/assets/exercises/plank.png';
import lungeImg from '@/assets/exercises/lunge.png';
import dipsImg from '@/assets/exercises/dips.png';
import burpeeImg from '@/assets/exercises/burpee.png';
import runningImg from '@/assets/exercises/running.png';
import bridgeImg from '@/assets/exercises/bridge.png';
import mountainClimberImg from '@/assets/exercises/mountain-climber.png';
import stretchImg from '@/assets/exercises/stretch.png';
import jumpingImg from '@/assets/exercises/jumping.png';

interface MuscleGroup {
  name: string;
  color: string;
}

interface ExerciseData {
  image: string;
  primaryMuscles: MuscleGroup[];
  secondaryMuscles: MuscleGroup[];
  gradientFrom: string;
  gradientTo: string;
}

const exerciseImageMap: Record<string, ExerciseData> = {
  'push': {
    image: pushupImg,
    primaryMuscles: [{ name: 'Chest', color: '#22c55e' }, { name: 'Triceps', color: '#22c55e' }],
    secondaryMuscles: [{ name: 'Shoulders', color: '#86efac' }, { name: 'Core', color: '#86efac' }],
    gradientFrom: '#22c55e', gradientTo: '#16a34a',
  },
  'bench': {
    image: benchPressImg,
    primaryMuscles: [{ name: 'Chest', color: '#22c55e' }, { name: 'Triceps', color: '#22c55e' }],
    secondaryMuscles: [{ name: 'Shoulders', color: '#86efac' }],
    gradientFrom: '#22c55e', gradientTo: '#16a34a',
  },
  'squat': {
    image: squatImg,
    primaryMuscles: [{ name: 'Quads', color: '#22c55e' }, { name: 'Glutes', color: '#22c55e' }],
    secondaryMuscles: [{ name: 'Hamstrings', color: '#86efac' }, { name: 'Core', color: '#86efac' }],
    gradientFrom: '#a855f7', gradientTo: '#7c3aed',
  },
  'lunge': {
    image: lungeImg,
    primaryMuscles: [{ name: 'Quads', color: '#22c55e' }, { name: 'Glutes', color: '#22c55e' }],
    secondaryMuscles: [{ name: 'Hamstrings', color: '#86efac' }],
    gradientFrom: '#a855f7', gradientTo: '#7c3aed',
  },
  'plank': {
    image: plankImg,
    primaryMuscles: [{ name: 'Core', color: '#22c55e' }, { name: 'Abs', color: '#22c55e' }],
    secondaryMuscles: [{ name: 'Shoulders', color: '#86efac' }, { name: 'Back', color: '#86efac' }],
    gradientFrom: '#f59e0b', gradientTo: '#d97706',
  },
  'burpee': {
    image: burpeeImg,
    primaryMuscles: [{ name: 'Full Body', color: '#22c55e' }],
    secondaryMuscles: [{ name: 'Cardio', color: '#86efac' }, { name: 'Core', color: '#86efac' }],
    gradientFrom: '#ef4444', gradientTo: '#dc2626',
  },
  'dip': {
    image: dipsImg,
    primaryMuscles: [{ name: 'Triceps', color: '#22c55e' }, { name: 'Chest', color: '#22c55e' }],
    secondaryMuscles: [{ name: 'Shoulders', color: '#86efac' }],
    gradientFrom: '#22c55e', gradientTo: '#16a34a',
  },
  'crunch': {
    image: crunchImg,
    primaryMuscles: [{ name: 'Abs', color: '#22c55e' }, { name: 'Core', color: '#22c55e' }],
    secondaryMuscles: [{ name: 'Hip Flexors', color: '#86efac' }],
    gradientFrom: '#a855f7', gradientTo: '#7c3aed',
  },
  'bridge': {
    image: bridgeImg,
    primaryMuscles: [{ name: 'Glutes', color: '#22c55e' }, { name: 'Hamstrings', color: '#22c55e' }],
    secondaryMuscles: [{ name: 'Core', color: '#86efac' }],
    gradientFrom: '#a855f7', gradientTo: '#7c3aed',
  },
  'dead': {
    image: deadliftImg,
    primaryMuscles: [{ name: 'Back', color: '#22c55e' }, { name: 'Hamstrings', color: '#22c55e' }],
    secondaryMuscles: [{ name: 'Glutes', color: '#86efac' }, { name: 'Core', color: '#86efac' }],
    gradientFrom: '#22c55e', gradientTo: '#16a34a',
  },
  'run': {
    image: runningImg,
    primaryMuscles: [{ name: 'Legs', color: '#22c55e' }, { name: 'Cardio', color: '#22c55e' }],
    secondaryMuscles: [{ name: 'Core', color: '#86efac' }],
    gradientFrom: '#ef4444', gradientTo: '#dc2626',
  },
  'walk': {
    image: runningImg,
    primaryMuscles: [{ name: 'Legs', color: '#22c55e' }],
    secondaryMuscles: [{ name: 'Cardio', color: '#86efac' }],
    gradientFrom: '#3b82f6', gradientTo: '#2563eb',
  },
  'jump': {
    image: jumpingImg,
    primaryMuscles: [{ name: 'Legs', color: '#22c55e' }, { name: 'Calves', color: '#22c55e' }],
    secondaryMuscles: [{ name: 'Cardio', color: '#86efac' }],
    gradientFrom: '#f59e0b', gradientTo: '#d97706',
  },
  'mountain': {
    image: mountainClimberImg,
    primaryMuscles: [{ name: 'Core', color: '#22c55e' }, { name: 'Shoulders', color: '#22c55e' }],
    secondaryMuscles: [{ name: 'Legs', color: '#86efac' }, { name: 'Cardio', color: '#86efac' }],
    gradientFrom: '#ef4444', gradientTo: '#dc2626',
  },
  'high': {
    image: runningImg,
    primaryMuscles: [{ name: 'Hip Flexors', color: '#22c55e' }, { name: 'Quads', color: '#22c55e' }],
    secondaryMuscles: [{ name: 'Cardio', color: '#86efac' }],
    gradientFrom: '#ef4444', gradientTo: '#dc2626',
  },
  'yoga': {
    image: stretchImg,
    primaryMuscles: [{ name: 'Flexibility', color: '#22c55e' }],
    secondaryMuscles: [{ name: 'Balance', color: '#86efac' }],
    gradientFrom: '#a855f7', gradientTo: '#7c3aed',
  },
  'stretch': {
    image: stretchImg,
    primaryMuscles: [{ name: 'Flexibility', color: '#22c55e' }],
    secondaryMuscles: [{ name: 'Recovery', color: '#86efac' }],
    gradientFrom: '#a855f7', gradientTo: '#7c3aed',
  },
  'rest': {
    image: stretchImg,
    primaryMuscles: [{ name: 'Recovery', color: '#60a5fa' }],
    secondaryMuscles: [{ name: 'Full Body', color: '#93c5fd' }],
    gradientFrom: '#3b82f6', gradientTo: '#2563eb',
  },
  'default': {
    image: pushupImg,
    primaryMuscles: [{ name: 'Full Body', color: '#22c55e' }],
    secondaryMuscles: [{ name: 'Core', color: '#86efac' }],
    gradientFrom: '#22c55e', gradientTo: '#16a34a',
  },
};

function getExerciseData(name: string, type: string): ExerciseData {
  const lower = name.toLowerCase();
  const keywords = Object.keys(exerciseImageMap).filter(k => k !== 'default');
  for (const key of keywords) {
    if (lower.includes(key)) return exerciseImageMap[key];
  }
  if (type === 'rest') return exerciseImageMap['rest'];
  if (type === 'flexibility') return exerciseImageMap['stretch'];
  if (type === 'cardio') return exerciseImageMap['run'];
  return exerciseImageMap['default'];
}

function playExerciseSound(type: string) {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    if (type === 'strength') { osc.frequency.value = 220; osc.type = 'sine'; }
    else if (type === 'cardio') { osc.frequency.value = 330; osc.type = 'triangle'; }
    else if (type === 'flexibility') { osc.frequency.value = 440; osc.type = 'sine'; }
    else { osc.frequency.value = 180; osc.type = 'sine'; }
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  } catch {}
}

interface ExerciseAnimation3DProps {
  exerciseName: string;
  type: 'strength' | 'cardio' | 'rest' | 'flexibility';
  expanded?: boolean;
  className?: string;
}

export function ExerciseAnimation3D({ exerciseName, type, expanded = false, className }: ExerciseAnimation3DProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();
  const data = getExerciseData(exerciseName, type);

  useEffect(() => {
    if (isPlaying && soundEnabled) {
      intervalRef.current = setInterval(() => playExerciseSound(type), 1800);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, soundEnabled, type]);

  const togglePlay = () => {
    if (!isPlaying && soundEnabled) playExerciseSound(type);
    setIsPlaying(!isPlaying);
  };

  // Compact card view (thumbnail in exercise list)
  if (!expanded) {
    return (
      <motion.div
        className={`relative w-16 h-16 rounded-xl overflow-hidden cursor-pointer ${className || ''}`}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={togglePlay}
      >
        <img
          src={data.image}
          alt={exerciseName}
          className="w-full h-full object-cover"
        />
        {/* Neon glow overlay when playing */}
        {isPlaying && (
          <motion.div
            className="absolute inset-0"
            style={{
              boxShadow: `inset 0 0 20px ${data.gradientFrom}66`,
              border: `1.5px solid ${data.gradientFrom}88`,
            }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
        {/* Play/pause icon */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <motion.div
            animate={isPlaying ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.8, repeat: Infinity }}
          >
            {isPlaying
              ? <Pause className="w-4 h-4 text-white drop-shadow-lg" />
              : <Play className="w-4 h-4 text-white/80 ml-0.5 drop-shadow-lg" />}
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // Expanded view with full image + muscle info
  return (
    <div className={`${className || ''}`}>
      <div className="flex gap-4 items-stretch">
        {/* 3D Exercise Image */}
        <div className="relative w-36 shrink-0">
          <motion.div
            className="w-full h-52 rounded-2xl overflow-hidden relative cursor-pointer"
            style={{
              border: `1.5px solid ${data.gradientFrom}44`,
              boxShadow: `0 0 24px ${data.gradientFrom}22`,
            }}
            onClick={togglePlay}
            whileHover={{ scale: 1.02 }}
          >
            {/* Exercise image */}
            <img
              src={data.image}
              alt={exerciseName}
              className="w-full h-full object-cover"
            />
            
            {/* Animated neon pulse overlay when playing */}
            {isPlaying && (
              <motion.div
                className="absolute inset-0"
                style={{
                  background: `radial-gradient(circle at center, ${data.gradientFrom}33 0%, transparent 70%)`,
                }}
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
            )}

            {/* Play/pause overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm"
                style={{ background: `${data.gradientFrom}44` }}
                animate={isPlaying ? { scale: [1, 1.15, 1], opacity: [0.8, 1, 0.8] } : {}}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {isPlaying
                  ? <Pause className="w-5 h-5 text-white" />
                  : <Play className="w-5 h-5 text-white ml-0.5" />}
              </motion.div>
            </div>

            {/* Neon border glow when playing */}
            {isPlaying && (
              <motion.div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{ border: `2px solid ${data.gradientFrom}` }}
                animate={{ opacity: [0.4, 0.9, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
          </motion.div>

          {/* Controls */}
          <div className="flex justify-between mt-2 px-1">
            <motion.button
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: `${data.gradientFrom}22` }}
              onClick={togglePlay}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isPlaying
                ? <Pause className="w-3.5 h-3.5" style={{ color: data.gradientFrom }} />
                : <Play className="w-3.5 h-3.5 ml-0.5" style={{ color: data.gradientFrom }} />}
            </motion.button>
            <motion.button
              className="w-8 h-8 rounded-full flex items-center justify-center bg-muted"
              onClick={() => setSoundEnabled(!soundEnabled)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {soundEnabled
                ? <Volume2 className="w-3.5 h-3.5 text-primary" />
                : <VolumeX className="w-3.5 h-3.5 text-muted-foreground" />}
            </motion.button>
          </div>
        </div>

        {/* Muscle Info Panel */}
        <div className="flex-1 space-y-3 py-1">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">Primary Muscles</p>
            <div className="flex flex-wrap gap-1.5">
              {data.primaryMuscles.map(m => (
                <motion.span
                  key={m.name}
                  className="px-2.5 py-1 rounded-full text-xs font-bold"
                  style={{
                    background: `${data.gradientFrom}18`,
                    color: data.gradientFrom,
                    border: `1px solid ${data.gradientFrom}33`,
                  }}
                  animate={isPlaying ? { opacity: [1, 0.6, 1], scale: [1, 1.05, 1] } : {}}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >
                  🎯 {m.name}
                </motion.span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">Secondary Muscles</p>
            <div className="flex flex-wrap gap-1.5">
              {data.secondaryMuscles.map(m => (
                <span
                  key={m.name}
                  className="px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground"
                >
                  {m.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
