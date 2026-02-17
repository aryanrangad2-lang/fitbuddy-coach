import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Dumbbell, 
  Heart, 
  Timer, 
  Flame, 
  ChevronLeft, 
  ChevronRight,
  Trophy,
  Calendar,
  CheckCircle2,
  Play,
  RotateCcw,
  Sparkles,
  Zap,
  Target,
  ArrowLeft,
  Lightbulb,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { workoutPlans, DayPlan, Exercise, ExerciseType } from '@/data/workoutPlans';
import { ExerciseAnimation } from '@/components/ExerciseAnimation';

type Level = 'beginner' | 'intermediate' | 'advanced';

const STORAGE_KEYS = {
  selectedLevel: 'workout_selectedLevel',
  currentDay: 'workout_currentDay',
  completedDays: 'workout_completedDays',
};

const getExerciseIcon = (type: ExerciseType) => {
  switch (type) {
    case 'strength': return Dumbbell;
    case 'cardio': return Heart;
    case 'rest': return Timer;
    case 'flexibility': return Sparkles;
    default: return Dumbbell;
  }
};

const getExerciseColor = (type: ExerciseType) => {
  switch (type) {
    case 'strength': return 'text-primary';
    case 'cardio': return 'text-red-400';
    case 'rest': return 'text-blue-400';
    case 'flexibility': return 'text-purple-400';
    default: return 'text-primary';
  }
};

const WorkoutPlanner = () => {
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [currentDay, setCurrentDay] = useState<number>(0);
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [planStarted, setPlanStarted] = useState(false);
  const todayRef = useRef<HTMLDivElement>(null);

  // Load from localStorage
  useEffect(() => {
    const savedLevel = localStorage.getItem(STORAGE_KEYS.selectedLevel) as Level | null;
    const savedDay = localStorage.getItem(STORAGE_KEYS.currentDay);
    const savedCompleted = localStorage.getItem(STORAGE_KEYS.completedDays);

    if (savedLevel) {
      setSelectedLevel(savedLevel);
      setPlanStarted(true);
    }
    if (savedDay) setCurrentDay(parseInt(savedDay, 10));
    if (savedCompleted) setCompletedDays(JSON.parse(savedCompleted));
  }, []);

  // Auto-scroll to today's workout
  useEffect(() => {
    if (planStarted && todayRef.current) {
      setTimeout(() => {
        todayRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 500);
    }
  }, [planStarted, currentDay]);

  const saveProgress = (level: Level, day: number, completed: number[]) => {
    localStorage.setItem(STORAGE_KEYS.selectedLevel, level);
    localStorage.setItem(STORAGE_KEYS.currentDay, day.toString());
    localStorage.setItem(STORAGE_KEYS.completedDays, JSON.stringify(completed));
  };

  const startPlan = () => {
    if (!selectedLevel) return;
    setCurrentDay(1);
    setCompletedDays([]);
    setPlanStarted(true);
    saveProgress(selectedLevel, 1, []);
  };

  const continuePlan = () => {
    setPlanStarted(true);
  };

  const markAsCompleted = () => {
    if (!selectedLevel) return;
    const newCompleted = [...completedDays, currentDay];
    const nextDay = currentDay + 1;
    
    setCompletedDays(newCompleted);
    setCurrentDay(nextDay > 30 ? 30 : nextDay);
    saveProgress(selectedLevel, nextDay > 30 ? 30 : nextDay, newCompleted);
  };

  const resetProgress = () => {
    setSelectedLevel(null);
    setCurrentDay(0);
    setCompletedDays([]);
    setPlanStarted(false);
    localStorage.removeItem(STORAGE_KEYS.selectedLevel);
    localStorage.removeItem(STORAGE_KEYS.currentDay);
    localStorage.removeItem(STORAGE_KEYS.completedDays);
  };

  const currentPlan = selectedLevel ? workoutPlans[selectedLevel] : null;
  const todayWorkout = currentPlan?.days.find(d => d.day === currentDay);
  const tomorrowWorkout = currentPlan?.days.find(d => d.day === currentDay + 1);
  const progressPercent = (completedDays.length / 30) * 100;
  const isCompleted = currentDay > 30 || completedDays.length >= 30;

  const levelConfig = {
    beginner: { icon: Target, color: 'from-green-500 to-emerald-600', label: 'Beginner' },
    intermediate: { icon: Flame, color: 'from-yellow-500 to-orange-600', label: 'Intermediate' },
    advanced: { icon: Zap, color: 'from-red-500 to-rose-600', label: 'Advanced' },
  };

  return (
    <div className="min-h-screen bg-background overflow-y-auto">
      <div className="max-w-4xl mx-auto p-4 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-6"
        >
          <Link to="/">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </motion.div>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">30-Day Workout Program</h1>
            <p className="text-muted-foreground text-sm">Transform your body in 30 days</p>
          </div>
        </motion.div>

        {/* Level Selection */}
        {!planStarted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(Object.keys(levelConfig) as Level[]).map((level, index) => {
                const config = levelConfig[level];
                const Icon = config.icon;
                const plan = workoutPlans[level];
                const isSelected = selectedLevel === level;

                return (
                  <motion.div
                    key={level}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedLevel(level)}
                    className="cursor-pointer"
                  >
                    <Card className={`relative overflow-hidden transition-all duration-300 ${
                      isSelected 
                        ? 'ring-2 ring-primary shadow-lg shadow-primary/20' 
                        : 'hover:shadow-md'
                    }`}>
                      <div className={`absolute inset-0 bg-gradient-to-br ${config.color} opacity-10`} />
                      <CardHeader className="relative">
                        <motion.div
                          animate={isSelected ? { rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] } : {}}
                          transition={{ duration: 0.5 }}
                        >
                          <Icon className={`h-10 w-10 mb-2 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                        </motion.div>
                        <CardTitle className="text-lg">{config.label}</CardTitle>
                      </CardHeader>
                      <CardContent className="relative">
                        <p className="text-sm text-muted-foreground">{plan.description}</p>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-2 right-2"
                          >
                            <CheckCircle2 className="h-6 w-6 text-primary" />
                          </motion.div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Start/Continue Buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: selectedLevel ? 1 : 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  size="lg"
                  disabled={!selectedLevel}
                  onClick={startPlan}
                  className="gap-2 bg-gradient-to-r from-primary to-primary/80 shadow-lg shadow-primary/30"
                >
                  <Play className="h-5 w-5" />
                  Start Plan
                </Button>
              </motion.div>

              {currentDay > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={continuePlan}
                    className="gap-2"
                  >
                    <ChevronRight className="h-5 w-5" />
                    Continue From Day {currentDay}
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}

        {/* Active Plan View */}
        <AnimatePresence mode="wait">
          {planStarted && currentPlan && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Progress Section */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full bg-gradient-to-br ${levelConfig[selectedLevel!].color}`}>
                          <Calendar className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Current Progress</p>
                          <p className="text-xl font-bold text-foreground">
                            Day {Math.min(currentDay, 30)} / 30
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Completed</p>
                        <p className="text-xl font-bold text-primary">{completedDays.length} days</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="text-primary font-medium">{Math.round(progressPercent)}%</span>
                      </div>
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        style={{ originX: 0 }}
                      >
                        <Progress value={progressPercent} className="h-3" />
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Plan Completed */}
              {isCompleted && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring" }}
                >
                  <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30">
                    <CardContent className="p-8 text-center">
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      >
                        <Trophy className="h-16 w-16 mx-auto mb-4 text-primary" />
                      </motion.div>
                      <h2 className="text-2xl font-bold text-foreground mb-2">
                        🎉 Plan Completed!
                      </h2>
                      <p className="text-muted-foreground mb-6">
                        Congratulations! You've finished the {currentPlan.name}.
                      </p>
                      <Button onClick={resetProgress} variant="outline" className="gap-2">
                        <RotateCcw className="h-4 w-4" />
                        Start a New Plan
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Today's Workout */}
              {!isCompleted && todayWorkout && (
                <motion.div
                  ref={todayRef}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className="border-primary/30 shadow-lg shadow-primary/10 overflow-hidden">
                    <div className="bg-gradient-to-r from-primary/20 to-transparent p-4 border-b border-border/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="p-2 rounded-full bg-primary/20"
                          >
                            <Sparkles className="h-5 w-5 text-primary" />
                          </motion.div>
                          <div>
                            <p className="text-xs text-primary font-medium uppercase tracking-wide">Today's Workout</p>
                            <h3 className="text-xl font-bold text-foreground">Day {todayWorkout.day}: {todayWorkout.title}</h3>
                          </div>
                        </div>
                        {todayWorkout.isRestDay && (
                          <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-medium rounded-full">
                            Rest Day
                          </span>
                        )}
                      </div>
                      <p className="text-muted-foreground mt-2 text-sm">{todayWorkout.description}</p>
                    </div>

                    <CardContent className="p-4 space-y-3">
                      {todayWorkout.exercises.map((exercise, index) => (
                        <ExerciseCard key={index} exercise={exercise} index={index} />
                      ))}

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="pt-4"
                      >
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button 
                            onClick={markAsCompleted} 
                            className="w-full gap-2 bg-gradient-to-r from-primary to-primary/80 shadow-lg"
                            size="lg"
                          >
                            <CheckCircle2 className="h-5 w-5" />
                            Mark As Completed
                          </Button>
                        </motion.div>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Tomorrow's Preview */}
              {!isCompleted && tomorrowWorkout && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Card className="bg-card/50 border-border/50">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        <CardTitle className="text-base text-muted-foreground">Tomorrow's Preview</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">Day {tomorrowWorkout.day}: {tomorrowWorkout.title}</p>
                          <p className="text-sm text-muted-foreground">{tomorrowWorkout.description}</p>
                        </div>
                        {tomorrowWorkout.isRestDay && (
                          <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-medium rounded-full">
                            Rest Day
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Reset Button */}
              {!isCompleted && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex justify-center"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetProgress}
                    className="text-muted-foreground hover:text-foreground gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reset Progress
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const ExerciseCard = ({ exercise, index }: { exercise: Exercise; index: number }) => {
  const Icon = getExerciseIcon(exercise.type);
  const colorClass = getExerciseColor(exercise.type);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 * index }}
      whileHover={{ scale: 1.01, x: 4 }}
    >
      <Card className="bg-card/50 border-border/50 hover:border-primary/30 transition-all duration-300">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <ExerciseAnimation
              exerciseName={exercise.name}
              type={exercise.type}
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-foreground">{exercise.name}</h4>
              <div className="flex flex-wrap items-center gap-2 mt-1 text-sm">
                {exercise.sets && exercise.reps && (
                  <span className="text-primary font-medium">
                    {exercise.sets} × {exercise.reps}
                  </span>
                )}
                {exercise.duration && (
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {exercise.duration}
                  </span>
                )}
              </div>
              {exercise.tips && (
                <div className="flex items-start gap-1.5 mt-2 text-sm text-muted-foreground">
                  <Lightbulb className="h-3.5 w-3.5 mt-0.5 text-yellow-500 shrink-0" />
                  <span>{exercise.tips}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default WorkoutPlanner;
