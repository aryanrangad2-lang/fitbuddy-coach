import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Zap, Star, ChevronRight, X, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

interface WorkoutCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  dayNumber: number;
  tomorrowTitle?: string;
  isLastDay?: boolean;
}

const motivations = [
  "Every rep is a step closer to the best version of you! 🔥",
  "You showed up when it was hard. That's what champions do. 💪",
  "Consistency beats perfection. You're building a habit! ⚡",
  "Your future self is proud of what you just did. 🌟",
  "Rest, recover, and come back stronger tomorrow! 💎",
  "You didn't quit. That's the whole point. 🏆",
  "Small daily wins compound into life-changing results! ✨",
];

const Confetti = () => {
  const pieces = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 1.5,
    color: ['#22c55e', '#86efac', '#fbbf24', '#60a5fa', '#f472b6', '#a78bfa'][Math.floor(Math.random() * 6)],
    size: 6 + Math.random() * 8,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
      {pieces.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-sm"
          style={{ left: `${p.x}%`, top: '-5%', width: p.size, height: p.size, background: p.color }}
          animate={{
            y: ['0%', '110%'],
            rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: 2.5 + Math.random(),
            delay: p.delay,
            ease: 'easeIn',
            repeat: Infinity,
            repeatDelay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
};

export function WorkoutCompletionModal({ isOpen, onClose, dayNumber, tomorrowTitle, isLastDay }: WorkoutCompletionModalProps) {
  const [motivation] = useState(() => motivations[Math.floor(Math.random() * motivations.length)]);
  const [showStars, setShowStars] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => setShowStars(true), 600);
      return () => clearTimeout(t);
    } else {
      setShowStars(false);
    }
  }, [isOpen]);

  // Play success sound
  useEffect(() => {
    if (!isOpen) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const notes = [261, 329, 392, 523];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.12, ctx.currentTime + i * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.15 + 0.4);
        osc.start(ctx.currentTime + i * 0.15);
        osc.stop(ctx.currentTime + i * 0.15 + 0.4);
      });
    } catch {}
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl"
            style={{ background: 'linear-gradient(135deg, hsl(0 0% 10%), hsl(0 0% 8%))' }}
            initial={{ scale: 0.5, opacity: 0, y: 100 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <Confetti />

            {/* Top glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 rounded-full opacity-30"
              style={{ background: 'radial-gradient(circle, hsl(150 80% 50%), transparent 70%)' }} />

            <div className="relative z-10 p-8 text-center">
              {/* Close button */}
              <button className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted flex items-center justify-center" onClick={onClose}>
                <X className="w-4 h-4 text-muted-foreground" />
              </button>

              {/* Trophy animation */}
              <motion.div
                className="mx-auto mb-4 w-24 h-24 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, hsl(150 80% 40%), hsl(170 75% 35%))' }}
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {isLastDay ? (
                  <Trophy className="w-12 h-12 text-white" />
                ) : (
                  <motion.span className="text-5xl"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  >🎉</motion.span>
                )}
              </motion.div>

              {/* Stars */}
              <AnimatePresence>
                {showStars && (
                  <motion.div className="flex justify-center gap-1 mb-3">
                    {[0, 1, 2, 3, 4].map(i => (
                      <motion.div key={i}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: i * 0.1, type: 'spring', stiffness: 400 }}
                      >
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.h2
                className="text-2xl font-bold text-foreground mb-1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {isLastDay ? '🏆 Program Complete!' : `Day ${dayNumber} Done!`}
              </motion.h2>

              <motion.p
                className="text-primary font-semibold text-sm mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {isLastDay ? 'You completed the entire 30-day program!' : 'Workout crushed! Amazing work! 💪'}
              </motion.p>

              {/* Motivation quote */}
              <motion.div
                className="bg-muted/50 rounded-2xl p-4 mb-5 border border-border/50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <p className="text-sm text-foreground leading-relaxed italic">{motivation}</p>
              </motion.div>

              {/* Tomorrow preview */}
              {!isLastDay && tomorrowTitle && (
                <motion.div
                  className="flex items-center gap-3 bg-primary/10 rounded-2xl p-3 mb-5 border border-primary/20"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <Flame className="w-4 h-4 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-muted-foreground">Tomorrow: Day {dayNumber + 1}</p>
                    <p className="text-sm font-semibold text-foreground">{tomorrowTitle}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
                </motion.div>
              )}

              {/* Stats row */}
              <motion.div
                className="flex justify-center gap-4 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <div className="text-center">
                  <p className="text-lg font-bold text-primary">{dayNumber}</p>
                  <p className="text-xs text-muted-foreground">Days Done</p>
                </div>
                <div className="w-px bg-border" />
                <div className="text-center">
                  <p className="text-lg font-bold text-primary">{30 - dayNumber}</p>
                  <p className="text-xs text-muted-foreground">Days Left</p>
                </div>
                <div className="w-px bg-border" />
                <div className="text-center">
                  <p className="text-lg font-bold text-primary">{Math.round((dayNumber / 30) * 100)}%</p>
                  <p className="text-xs text-muted-foreground">Complete</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <Button
                  onClick={onClose}
                  className="w-full gap-2"
                  size="lg"
                  style={{ background: 'linear-gradient(135deg, hsl(150 80% 40%), hsl(170 75% 35%))' }}
                >
                  <Zap className="w-4 h-4" />
                  {isLastDay ? 'Start New Challenge' : 'Keep Going!'}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
