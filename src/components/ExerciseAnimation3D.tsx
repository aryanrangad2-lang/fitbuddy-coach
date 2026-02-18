import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MuscleGroup {
  name: string;
  color: string;
}

interface ExerciseData {
  emoji: string[];
  primaryMuscles: MuscleGroup[];
  secondaryMuscles: MuscleGroup[];
  bodyRegion: 'upper' | 'lower' | 'core' | 'full' | 'rest';
  movementType: 'push' | 'pull' | 'squat' | 'hinge' | 'carry' | 'rotate' | 'run' | 'rest';
  gradientFrom: string;
  gradientTo: string;
}

const muscleDatabase: Record<string, ExerciseData> = {
  'push': {
    emoji: ['🫃', '💪', '🧎'],
    primaryMuscles: [{ name: 'Chest', color: '#22c55e' }, { name: 'Triceps', color: '#22c55e' }],
    secondaryMuscles: [{ name: 'Shoulders', color: '#86efac' }, { name: 'Core', color: '#86efac' }],
    bodyRegion: 'upper', movementType: 'push',
    gradientFrom: 'hsl(150 80% 40%)', gradientTo: 'hsl(170 75% 35%)',
  },
  'squat': {
    emoji: ['🧍', '🧎', '🧍'],
    primaryMuscles: [{ name: 'Quads', color: '#22c55e' }, { name: 'Glutes', color: '#22c55e' }],
    secondaryMuscles: [{ name: 'Hamstrings', color: '#86efac' }, { name: 'Core', color: '#86efac' }],
    bodyRegion: 'lower', movementType: 'squat',
    gradientFrom: 'hsl(262 83% 58%)', gradientTo: 'hsl(280 80% 50%)',
  },
  'lunge': {
    emoji: ['🧍', '🚶', '🧍'],
    primaryMuscles: [{ name: 'Quads', color: '#22c55e' }, { name: 'Glutes', color: '#22c55e' }],
    secondaryMuscles: [{ name: 'Hamstrings', color: '#86efac' }, { name: 'Balance', color: '#86efac' }],
    bodyRegion: 'lower', movementType: 'squat',
    gradientFrom: 'hsl(262 83% 58%)', gradientTo: 'hsl(280 80% 50%)',
  },
  'plank': {
    emoji: ['🫃', '🏋️', '🫃'],
    primaryMuscles: [{ name: 'Core', color: '#22c55e' }, { name: 'Abs', color: '#22c55e' }],
    secondaryMuscles: [{ name: 'Shoulders', color: '#86efac' }, { name: 'Back', color: '#86efac' }],
    bodyRegion: 'core', movementType: 'carry',
    gradientFrom: 'hsl(38 92% 50%)', gradientTo: 'hsl(20 90% 48%)',
  },
  'burpee': {
    emoji: ['🧍', '🧎', '🫃', '🏃', '🧍'],
    primaryMuscles: [{ name: 'Full Body', color: '#22c55e' }],
    secondaryMuscles: [{ name: 'Cardio', color: '#86efac' }, { name: 'Core', color: '#86efac' }],
    bodyRegion: 'full', movementType: 'run',
    gradientFrom: 'hsl(0 72% 51%)', gradientTo: 'hsl(20 90% 48%)',
  },
  'dip': {
    emoji: ['🧍', '🧎', '🧍'],
    primaryMuscles: [{ name: 'Triceps', color: '#22c55e' }, { name: 'Chest', color: '#22c55e' }],
    secondaryMuscles: [{ name: 'Shoulders', color: '#86efac' }],
    bodyRegion: 'upper', movementType: 'push',
    gradientFrom: 'hsl(150 80% 40%)', gradientTo: 'hsl(170 75% 35%)',
  },
  'crunch': {
    emoji: ['🫃', '🧎', '🫃'],
    primaryMuscles: [{ name: 'Abs', color: '#22c55e' }, { name: 'Core', color: '#22c55e' }],
    secondaryMuscles: [{ name: 'Hip Flexors', color: '#86efac' }],
    bodyRegion: 'core', movementType: 'rotate',
    gradientFrom: 'hsl(270 76% 53%)', gradientTo: 'hsl(290 70% 48%)',
  },
  'bridge': {
    emoji: ['🫃', '🧎', '🫃'],
    primaryMuscles: [{ name: 'Glutes', color: '#22c55e' }, { name: 'Hamstrings', color: '#22c55e' }],
    secondaryMuscles: [{ name: 'Core', color: '#86efac' }, { name: 'Back', color: '#86efac' }],
    bodyRegion: 'lower', movementType: 'hinge',
    gradientFrom: 'hsl(262 83% 58%)', gradientTo: 'hsl(280 80% 50%)',
  },
  'run': {
    emoji: ['🏃', '🏃‍♂️', '🏃'],
    primaryMuscles: [{ name: 'Legs', color: '#22c55e' }, { name: 'Cardio', color: '#22c55e' }],
    secondaryMuscles: [{ name: 'Core', color: '#86efac' }, { name: 'Arms', color: '#86efac' }],
    bodyRegion: 'full', movementType: 'run',
    gradientFrom: 'hsl(0 72% 51%)', gradientTo: 'hsl(0 85% 60%)',
  },
  'walk': {
    emoji: ['🚶', '🚶‍♂️', '🚶'],
    primaryMuscles: [{ name: 'Legs', color: '#22c55e' }, { name: 'Cardio', color: '#22c55e' }],
    secondaryMuscles: [{ name: 'Core', color: '#86efac' }],
    bodyRegion: 'full', movementType: 'run',
    gradientFrom: 'hsl(200 80% 50%)', gradientTo: 'hsl(220 75% 45%)',
  },
  'jump': {
    emoji: ['🧍', '🤸', '🧍'],
    primaryMuscles: [{ name: 'Legs', color: '#22c55e' }, { name: 'Calves', color: '#22c55e' }],
    secondaryMuscles: [{ name: 'Cardio', color: '#86efac' }],
    bodyRegion: 'full', movementType: 'run',
    gradientFrom: 'hsl(30 90% 55%)', gradientTo: 'hsl(38 92% 50%)',
  },
  'mountain': {
    emoji: ['🫃', '🏃', '🫃'],
    primaryMuscles: [{ name: 'Core', color: '#22c55e' }, { name: 'Shoulders', color: '#22c55e' }],
    secondaryMuscles: [{ name: 'Legs', color: '#86efac' }, { name: 'Cardio', color: '#86efac' }],
    bodyRegion: 'core', movementType: 'run',
    gradientFrom: 'hsl(0 72% 51%)', gradientTo: 'hsl(20 90% 48%)',
  },
  'high': {
    emoji: ['🏃', '🧍', '🏃'],
    primaryMuscles: [{ name: 'Hip Flexors', color: '#22c55e' }, { name: 'Quads', color: '#22c55e' }],
    secondaryMuscles: [{ name: 'Cardio', color: '#86efac' }, { name: 'Core', color: '#86efac' }],
    bodyRegion: 'lower', movementType: 'run',
    gradientFrom: 'hsl(0 72% 51%)', gradientTo: 'hsl(0 85% 60%)',
  },
  'yoga': {
    emoji: ['🧘', '🙆', '🧘'],
    primaryMuscles: [{ name: 'Flexibility', color: '#22c55e' }],
    secondaryMuscles: [{ name: 'Balance', color: '#86efac' }, { name: 'Core', color: '#86efac' }],
    bodyRegion: 'full', movementType: 'rest',
    gradientFrom: 'hsl(270 76% 53%)', gradientTo: 'hsl(300 70% 50%)',
  },
  'stretch': {
    emoji: ['🙆', '🧘', '🙆'],
    primaryMuscles: [{ name: 'Flexibility', color: '#22c55e' }],
    secondaryMuscles: [{ name: 'Recovery', color: '#86efac' }],
    bodyRegion: 'full', movementType: 'rest',
    gradientFrom: 'hsl(270 76% 53%)', gradientTo: 'hsl(300 70% 50%)',
  },
  'rest': {
    emoji: ['😴', '💤', '😴'],
    primaryMuscles: [{ name: 'Recovery', color: '#60a5fa' }],
    secondaryMuscles: [{ name: 'Full Body', color: '#93c5fd' }],
    bodyRegion: 'rest', movementType: 'rest',
    gradientFrom: 'hsl(220 80% 60%)', gradientTo: 'hsl(240 75% 55%)',
  },
  'default': {
    emoji: ['🏋️', '💪', '🏋️'],
    primaryMuscles: [{ name: 'Full Body', color: '#22c55e' }],
    secondaryMuscles: [{ name: 'Core', color: '#86efac' }],
    bodyRegion: 'full', movementType: 'carry',
    gradientFrom: 'hsl(150 80% 40%)', gradientTo: 'hsl(170 75% 35%)',
  },
};

function getExerciseData(name: string, type: string): ExerciseData {
  const lower = name.toLowerCase();
  const keywords = Object.keys(muscleDatabase).filter(k => k !== 'default');
  for (const key of keywords) {
    if (lower.includes(key)) return muscleDatabase[key];
  }
  if (type === 'rest') return muscleDatabase['rest'];
  if (type === 'flexibility') return muscleDatabase['stretch'];
  if (type === 'cardio') return muscleDatabase['run'];
  return muscleDatabase['default'];
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

// 3D Human body SVG with highlighted muscle groups
const BodySVG = ({ region, movementType, isPlaying }: { region: string; movementType: string; isPlaying: boolean }) => {
  const headColor = 'hsl(var(--muted-foreground))';
  const bodyColor = 'hsl(var(--muted))';
  const activeColor = 'hsl(150 80% 50%)';
  const secondaryColor = 'hsl(150 80% 70% / 0.6)';

  const isUpper = region === 'upper' || region === 'full';
  const isLower = region === 'lower' || region === 'full';
  const isCore = region === 'core' || region === 'full';

  return (
    <svg viewBox="0 0 80 140" className="w-full h-full" style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))' }}>
      {/* Head */}
      <motion.ellipse cx="40" cy="14" rx="10" ry="12" fill={headColor} opacity="0.9"
        animate={isPlaying ? { scaleY: [1, 0.95, 1] } : {}}
        transition={{ duration: 0.8, repeat: Infinity }}
      />
      {/* Neck */}
      <rect x="36" y="25" width="8" height="7" rx="2" fill={headColor} opacity="0.8" />

      {/* Torso */}
      <motion.rect x="24" y="31" width="32" height="38" rx="6"
        fill={isCore ? activeColor : bodyColor} opacity={isCore ? 0.9 : 0.7}
        animate={isPlaying && isCore ? { scaleX: [1, 1.05, 1], opacity: [0.9, 1, 0.9] } : {}}
        transition={{ duration: 0.6, repeat: Infinity }}
      />
      {/* Chest detail */}
      <motion.ellipse cx="33" cy="40" rx="6" ry="4"
        fill={isUpper ? activeColor : 'transparent'} opacity={isUpper ? 0.7 : 0}
        animate={isPlaying && isUpper ? { opacity: [0.7, 1, 0.7] } : {}}
        transition={{ duration: 0.5, repeat: Infinity }}
      />
      <motion.ellipse cx="47" cy="40" rx="6" ry="4"
        fill={isUpper ? activeColor : 'transparent'} opacity={isUpper ? 0.7 : 0}
        animate={isPlaying && isUpper ? { opacity: [0.7, 1, 0.7] } : {}}
        transition={{ duration: 0.5, repeat: Infinity }}
      />
      {/* Abs detail */}
      {[0, 1, 2].map(i => (
        <motion.rect key={i} x="33" y={44 + i * 8} width="14" height="5" rx="2"
          fill={isCore ? secondaryColor : 'transparent'} opacity={isCore ? 0.8 : 0}
          animate={isPlaying && isCore ? { opacity: [0.6, 1, 0.6] } : {}}
          transition={{ duration: 0.7, delay: i * 0.1, repeat: Infinity }}
        />
      ))}

      {/* Left Arm */}
      <motion.g
        animate={isPlaying && (isUpper || region === 'full') ? {
          rotate: movementType === 'push' ? [-15, 15, -15] : movementType === 'run' ? [-25, 25, -25] : [-10, 10, -10]
        } : {}}
        style={{ originX: '22px', originY: '35px' }}
        transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <rect x="13" y="32" width="11" height="24" rx="5"
          fill={isUpper ? activeColor : bodyColor} opacity={isUpper ? 0.85 : 0.65} />
        {/* Bicep highlight */}
        <ellipse cx="18" cy="40" rx="4" ry="6" fill={isUpper ? secondaryColor : 'transparent'} opacity={isUpper ? 0.9 : 0} />
        {/* Forearm */}
        <rect x="10" y="55" width="10" height="20" rx="4"
          fill={isUpper ? activeColor : bodyColor} opacity={isUpper ? 0.7 : 0.55} />
      </motion.g>

      {/* Right Arm */}
      <motion.g
        animate={isPlaying && (isUpper || region === 'full') ? {
          rotate: movementType === 'push' ? [15, -15, 15] : movementType === 'run' ? [25, -25, 25] : [10, -10, 10]
        } : {}}
        style={{ originX: '58px', originY: '35px' }}
        transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <rect x="56" y="32" width="11" height="24" rx="5"
          fill={isUpper ? activeColor : bodyColor} opacity={isUpper ? 0.85 : 0.65} />
        <ellipse cx="62" cy="40" rx="4" ry="6" fill={isUpper ? secondaryColor : 'transparent'} opacity={isUpper ? 0.9 : 0} />
        <rect x="60" y="55" width="10" height="20" rx="4"
          fill={isUpper ? activeColor : bodyColor} opacity={isUpper ? 0.7 : 0.55} />
      </motion.g>

      {/* Hips */}
      <rect x="22" y="67" width="36" height="14" rx="5"
        fill={isLower || isCore ? activeColor : bodyColor} opacity={isLower || isCore ? 0.8 : 0.65} />

      {/* Left Leg */}
      <motion.g
        animate={isPlaying && isLower ? {
          rotate: movementType === 'squat' ? [0, 30, 0] : movementType === 'run' ? [-20, 20, -20] : [-10, 10, -10]
        } : {}}
        style={{ originX: '30px', originY: '75px' }}
        transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <rect x="24" y="79" width="13" height="32" rx="6"
          fill={isLower ? activeColor : bodyColor} opacity={isLower ? 0.85 : 0.65} />
        {/* Quad detail */}
        <ellipse cx="30" cy="90" rx="5" ry="10" fill={isLower ? secondaryColor : 'transparent'} opacity={isLower ? 0.7 : 0} />
        {/* Calf */}
        <rect x="25" y="109" width="11" height="22" rx="5"
          fill={isLower ? activeColor : bodyColor} opacity={isLower ? 0.75 : 0.55} />
      </motion.g>

      {/* Right Leg */}
      <motion.g
        animate={isPlaying && isLower ? {
          rotate: movementType === 'squat' ? [0, 30, 0] : movementType === 'run' ? [20, -20, 20] : [10, -10, 10]
        } : {}}
        style={{ originX: '50px', originY: '75px' }}
        transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <rect x="43" y="79" width="13" height="32" rx="6"
          fill={isLower ? activeColor : bodyColor} opacity={isLower ? 0.85 : 0.65} />
        <ellipse cx="50" cy="90" rx="5" ry="10" fill={isLower ? secondaryColor : 'transparent'} opacity={isLower ? 0.7 : 0} />
        <rect x="44" y="109" width="11" height="22" rx="5"
          fill={isLower ? activeColor : bodyColor} opacity={isLower ? 0.75 : 0.55} />
      </motion.g>

      {/* Feet */}
      <ellipse cx="31" cy="133" rx="8" ry="4" fill={bodyColor} opacity="0.7" />
      <ellipse cx="49" cy="133" rx="8" ry="4" fill={bodyColor} opacity="0.7" />

      {/* Glow ring when playing */}
      {isPlaying && (
        <motion.ellipse cx="40" cy="70" rx="35" ry="60"
          fill="none" stroke={activeColor} strokeWidth="2" opacity="0.3"
          animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
    </svg>
  );
};

interface ExerciseAnimation3DProps {
  exerciseName: string;
  type: 'strength' | 'cardio' | 'rest' | 'flexibility';
  expanded?: boolean;
  className?: string;
}

export function ExerciseAnimation3D({ exerciseName, type, expanded = false, className }: ExerciseAnimation3DProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
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

  if (expanded) {
    return (
      <div className={`${className || ''}`}>
        <div className="flex gap-4 items-stretch">
          {/* 3D Body Display */}
          <div className="relative w-28 shrink-0">
            <div
              className="w-full h-48 rounded-2xl flex items-center justify-center p-2 relative overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${data.gradientFrom}22, ${data.gradientTo}33)`, border: `1px solid ${data.gradientFrom}44` }}
            >
              {/* Ambient glow */}
              <div className="absolute inset-0 opacity-20 rounded-2xl"
                style={{ background: `radial-gradient(circle at center, ${data.gradientFrom}, transparent 70%)` }} />
              <BodySVG region={data.bodyRegion} movementType={data.movementType} isPlaying={isPlaying} />
            </div>

            {/* Controls */}
            <div className="flex justify-between mt-2 px-1">
              <motion.button
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: `${data.gradientFrom}33` }}
                onClick={togglePlay}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isPlaying
                  ? <Pause className="w-3.5 h-3.5" style={{ color: data.gradientFrom }} />
                  : <Play className="w-3.5 h-3.5 ml-0.5" style={{ color: data.gradientFrom }} />}
              </motion.button>
              <motion.button
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: 'hsl(var(--muted))' }}
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
                    className="px-2 py-0.5 rounded-full text-xs font-semibold"
                    style={{ background: 'hsl(150 80% 50% / 0.15)', color: 'hsl(150 80% 50%)', border: '1px solid hsl(150 80% 50% / 0.3)' }}
                    animate={isPlaying ? { opacity: [1, 0.6, 1] } : {}}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  >
                    🎯 {m.name}
                  </motion.span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">Secondary</p>
              <div className="flex flex-wrap gap-1.5">
                {data.secondaryMuscles.map(m => (
                  <span
                    key={m.name}
                    className="px-2 py-0.5 rounded-full text-xs text-muted-foreground"
                    style={{ background: 'hsl(var(--muted))', border: '1px solid hsl(var(--border))' }}
                  >
                    {m.name}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: data.gradientFrom }} />
              <span className="text-xs text-muted-foreground capitalize">{data.bodyRegion} body · {data.movementType}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Compact version (used in exercise card)
  return (
    <div className={`relative ${className || ''}`}>
      <motion.div
        className="relative w-16 h-16 rounded-2xl flex items-center justify-center cursor-pointer overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${data.gradientFrom}33, ${data.gradientTo}44)`, border: `1px solid ${data.gradientFrom}55` }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={togglePlay}
      >
        {isPlaying && (
          <motion.div
            className="absolute inset-0 rounded-2xl border-2"
            style={{ borderColor: data.gradientFrom }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
        )}
        <div className="w-10 h-10">
          <BodySVG region={data.bodyRegion} movementType={data.movementType} isPlaying={isPlaying} />
        </div>
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
        >
          {isPlaying ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white ml-0.5" />}
        </motion.div>
      </motion.div>

      {/* Sound toggle */}
      <motion.button
        className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-card border border-border flex items-center justify-center"
        onClick={(e) => { e.stopPropagation(); setSoundEnabled(!soundEnabled); }}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.8 }}
      >
        {soundEnabled ? <Volume2 className="w-3 h-3 text-primary" /> : <VolumeX className="w-3 h-3 text-muted-foreground" />}
      </motion.button>
    </div>
  );
}
