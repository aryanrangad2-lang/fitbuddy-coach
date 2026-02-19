import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Workout, UserProfile } from "@/types/workout";
import { StatsCard } from "@/components/StatsCard";
import { WorkoutCard } from "@/components/WorkoutCard";
import { WorkoutForm } from "@/components/WorkoutForm";
import { ChatInterface } from "@/components/ChatInterface";
import { ProgressCharts } from "@/components/ProgressCharts";
import { useChat } from "@/hooks/useChat";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Flame, 
  Target, 
  Timer, 
  TrendingUp, 
  Plus,
  Dumbbell,
  MessageCircle,
  X,
  Utensils,
  User,
  Users,
  LogIn,
  LogOut,
  Trophy,
  MessageSquare,
  Home,
  Bell,
  ChevronRight,
  Zap,
  Activity,
  Droplets,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RankBadge } from "@/components/RankBadge";
import { WaterTracker } from "@/components/WaterTracker";
import { FoodScanner } from "@/components/FoodScanner";

const WORKOUTS_STORAGE_KEY = 'fitbuddy_workouts';

const loadWorkouts = (): Workout[] => {
  try {
    const saved = localStorage.getItem(WORKOUTS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((w: any) => ({ ...w, date: new Date(w.date) }));
    }
  } catch {}
  return [];
};

const calculateStreak = (workouts: Workout[]): number => {
  if (workouts.length === 0) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const uniqueDays = new Set(
    workouts.map(w => {
      const d = new Date(w.date);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    })
  );
  let streak = 0;
  let checkDate = new Date(today);
  if (!uniqueDays.has(checkDate.getTime())) {
    checkDate.setDate(checkDate.getDate() - 1);
  }
  while (uniqueDays.has(checkDate.getTime())) {
    streak++;
    checkDate.setDate(checkDate.getDate() - 1);
  }
  return streak;
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};

type ActiveTab = 'home' | 'workouts' | 'nutrition' | 'community' | 'messages';

const Index = () => {
  const [workouts, setWorkouts] = useState<Workout[]>(loadWorkouts);
  const [showForm, setShowForm] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem(WORKOUTS_STORAGE_KEY, JSON.stringify(workouts));
  }, [workouts]);

  const profile: UserProfile = useMemo(() => ({
    name: user?.user_metadata?.full_name || user?.user_metadata?.name || 'Champion',
    streak: calculateStreak(workouts),
    totalWorkouts: workouts.length,
    totalMinutes: workouts.reduce((acc, w) => acc + w.duration, 0),
  }), [workouts, user]);

  const { messages, sendMessage, isLoading } = useChat(profile, workouts);

  const totalCalories = useMemo(() => 
    workouts.reduce((acc, w) => acc + (w.calories || 0), 0),
  [workouts]);

  const handleAddWorkout = (workoutData: Omit<Workout, 'id' | 'date'>) => {
    const newWorkout: Workout = {
      ...workoutData,
      id: Math.random().toString(36).substring(7),
      date: new Date(),
    };
    setWorkouts(prev => [newWorkout, ...prev]);
    setShowForm(false);
    toast({
      title: "Workout logged! 💪",
      description: "Amazing work! Keep crushing it!",
    });
  };

  const statsData = [
    { icon: Flame, label: "Streak", value: profile.streak, suffix: "d", variant: 'primary' as const },
    { icon: Target, label: "Workouts", value: profile.totalWorkouts },
    { icon: Timer, label: "Minutes", value: profile.totalMinutes },
    { icon: TrendingUp, label: "Calories", value: totalCalories },
  ];

  const quickActions = [
    { icon: Dumbbell, label: "30-Day Plan", to: "/workout-planner", color: "text-primary bg-primary/10" },
    { icon: Utensils, label: "Diet Plan", to: "/diet-plan", color: "text-orange-400 bg-orange-400/10" },
    { icon: Users, label: "Community", to: "/community", color: "text-blue-400 bg-blue-400/10" },
    { icon: Trophy, label: "Rankings", to: "/community", color: "text-yellow-400 bg-yellow-400/10" },
  ];

  return (
    <div className="min-h-screen bg-background overflow-y-auto">
      {/* Top Header */}
      <motion.header
        className="sticky top-0 z-30 px-4 pt-5 pb-3 bg-background/80 backdrop-blur-xl border-b border-border/30"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-2.5"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-soft">
              <Dumbbell className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <span className="text-lg font-black text-foreground tracking-tight">FitBuddy</span>
              <span className="text-primary text-lg font-black">.</span>
            </div>
          </motion.div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <motion.button
                  onClick={() => setShowChat(true)}
                  className="relative w-9 h-9 rounded-xl bg-secondary flex items-center justify-center"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                >
                  <Bell className="w-4 h-4 text-muted-foreground" />
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary" />
                </motion.button>
                <Link to="/profile">
                  <motion.div
                    className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-soft"
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                  >
                    <User className="w-4 h-4 text-primary-foreground" />
                  </motion.div>
                </Link>
                <motion.button
                  onClick={signOut}
                  className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                >
                  <LogOut className="w-4 h-4 text-muted-foreground" />
                </motion.button>
              </>
            ) : (
              <Link to="/auth">
                <Button variant="gradient" size="sm" className="shadow-soft">
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 pb-28">
        <div className="lg:grid lg:grid-cols-3 lg:gap-6">
          {/* Left / Main Column */}
          <div className="lg:col-span-2 space-y-6">

            {/* Hero Banner */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="mt-6"
            >
              <div className="relative overflow-hidden rounded-3xl gradient-primary p-6 min-h-[180px] shadow-soft">
                {/* Decorative circles */}
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-black/10" />
                <div className="absolute -bottom-6 -right-4 w-28 h-28 rounded-full bg-black/15" />
                <div className="absolute top-4 right-20 w-16 h-16 rounded-full bg-white/5" />
                
                <div className="relative z-10 flex items-end justify-between h-full">
                  <div className="flex-1">
                    <p className="text-primary-foreground/70 text-sm font-semibold uppercase tracking-widest mb-1">
                      {getGreeting()} 👋
                    </p>
                    <h1 className="text-3xl font-black text-primary-foreground leading-tight mb-1">
                      {profile.name}
                    </h1>
                    <p className="text-primary-foreground/80 text-sm font-medium mb-4">
                      {profile.streak > 0 
                        ? `🔥 ${profile.streak}-day streak — You're on fire!`
                        : "Ready to crush your goals today?"
                      }
                    </p>
                    <motion.button
                      onClick={() => setShowForm(true)}
                      className="inline-flex items-center gap-2 bg-black/25 hover:bg-black/35 text-primary-foreground font-bold text-sm px-4 py-2.5 rounded-xl transition-colors backdrop-blur-sm"
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                    >
                      <Plus className="w-4 h-4" />
                      Log Workout
                    </motion.button>
                  </div>

                  {/* Rank badge area */}
                  <motion.div
                    className="flex-shrink-0 ml-4"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <RankBadge
                      totalWorkouts={profile.totalWorkouts}
                      totalMinutes={profile.totalMinutes}
                      streak={profile.streak}
                      showProgress={false}
                      size="md"
                    />
                  </motion.div>
                </div>
              </div>
            </motion.section>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {statsData.map((stat, index) => (
                <StatsCard
                  key={stat.label}
                  icon={stat.icon}
                  label={stat.label}
                  value={stat.value}
                  suffix={stat.suffix}
                  variant={stat.variant}
                  index={index}
                />
              ))}
            </div>

            {/* Quick Actions */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-bold text-foreground">Quick Actions</h2>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {quickActions.map((action, i) => (
                  <motion.div
                    key={action.label}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.25 + i * 0.06 }}
                    whileHover={{ y: -3, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link to={action.to}>
                      <div className="flex flex-col items-center gap-2 p-3 bg-card rounded-2xl border border-border/40 hover:border-primary/30 hover:shadow-glow-sm transition-all duration-200 cursor-pointer text-center">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${action.color}`}>
                          <action.icon className="w-5 h-5" />
                        </div>
                        <span className="text-[11px] font-semibold text-muted-foreground leading-tight">{action.label}</span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Activity Cards - 2 col */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Weekly Progress mini card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="bg-card rounded-2xl p-4 border border-border/40 shadow-card"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-primary" />
                    <h3 className="text-sm font-bold text-foreground">Activity</h3>
                  </div>
                  <span className="text-xs text-muted-foreground">This week</span>
                </div>
                {/* Mini bar chart */}
                <div className="flex items-end gap-1.5 h-12">
                  {['M','T','W','T','F','S','S'].map((day, i) => {
                    const hasWorkout = workouts.some(w => {
                      const d = new Date(w.date);
                      const dayOfWeek = d.getDay();
                      return dayOfWeek === (i + 1) % 7;
                    });
                    const height = hasWorkout ? 100 : Math.random() * 40 + 15;
                    return (
                      <div key={day} className="flex-1 flex flex-col items-center gap-1">
                        <motion.div
                          className={`w-full rounded-sm ${hasWorkout ? 'gradient-primary' : 'bg-secondary'}`}
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          transition={{ delay: 0.4 + i * 0.04, duration: 0.5 }}
                        />
                        <span className="text-[9px] text-muted-foreground font-medium">{day}</span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Water Tracker compact */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <WaterTracker />
              </motion.div>
            </div>

            {/* Progress Charts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              <ProgressCharts workouts={workouts} />
            </motion.div>

            {/* Food Scanner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <FoodScanner />
            </motion.div>

            {/* Recent Workouts */}
            <motion.section
              className="w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-foreground">Recent Workouts</h2>
                <button className="flex items-center gap-1 text-xs text-primary font-semibold">
                  See all <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              
              <AnimatePresence mode="popLayout">
                {workouts.length > 0 ? (
                  <motion.div className="flex flex-col gap-3 w-full">
                    {workouts.slice(0, 5).map((workout, index) => (
                      <WorkoutCard
                        key={workout.id}
                        workout={workout}
                        index={index}
                      />
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    className="relative overflow-hidden bg-card rounded-3xl p-8 text-center border border-border/40 w-full"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <div className="absolute inset-0 animate-shimmer pointer-events-none" />
                    <motion.div
                      className="w-16 h-16 mx-auto mb-4 rounded-2xl gradient-primary flex items-center justify-center shadow-soft"
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                    >
                      <Dumbbell className="w-8 h-8 text-primary-foreground" />
                    </motion.div>
                    <h3 className="font-black text-foreground mb-2">No workouts yet</h3>
                    <p className="text-muted-foreground text-sm mb-5">
                      Log your first workout to start tracking your progress!
                    </p>
                    <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                      <Button variant="gradient" onClick={() => setShowForm(true)} className="shadow-soft">
                        <Plus className="w-4 h-4" />
                        Log First Workout
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.section>
          </div>

          {/* Right Column - AI Chat (desktop only) */}
          <motion.div
            className="hidden lg:block"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="sticky top-20 h-[calc(100vh-6rem)] min-h-[500px]">
              <ChatInterface
                messages={messages}
                onSendMessage={sendMessage}
                isLoading={isLoading}
              />
            </div>
          </motion.div>
        </div>
      </main>

      {/* Bottom Navigation Bar (mobile) */}
      <motion.nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-xl border-t border-border/50"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 200, damping: 25 }}
      >
        <div className="flex items-center justify-around px-2 py-2 safe-area-bottom">
          {/* Home */}
          <NavTabButton
            icon={Home}
            label="Home"
            active={activeTab === 'home'}
            onClick={() => setActiveTab('home')}
          />
          {/* Workouts */}
          <NavTabButton
            icon={Dumbbell}
            label="Workout"
            active={activeTab === 'workouts'}
            onClick={() => navigate('/workout-planner')}
          />
          {/* Log (center FAB) */}
          <motion.button
            onClick={() => setShowForm(true)}
            className="relative -mt-5 w-14 h-14 rounded-2xl gradient-primary shadow-glow flex items-center justify-center"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.92 }}
          >
            <Plus className="w-7 h-7 text-primary-foreground" strokeWidth={3} />
          </motion.button>
          {/* Community */}
          <NavTabButton
            icon={Users}
            label="Community"
            active={activeTab === 'community'}
            onClick={() => navigate('/community')}
          />
          {/* Messages */}
          <NavTabButton
            icon={MessageSquare}
            label="Messages"
            active={activeTab === 'messages'}
            onClick={() => navigate('/messages')}
          />
        </div>
      </motion.nav>

      {/* Mobile Chat FAB (hidden on mobile since we have bottom nav) */}
      <motion.button
        onClick={() => setShowChat(true)}
        className="lg:hidden fixed bottom-24 right-5 w-12 h-12 rounded-2xl gradient-primary shadow-glow flex items-center justify-center z-40"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <MessageCircle className="w-5 h-5 text-primary-foreground" />
      </motion.button>

      {/* Mobile Chat Modal */}
      <AnimatePresence>
        {showChat && (
          <motion.div
            className="lg:hidden fixed inset-0 z-50 bg-background"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="h-[100dvh] flex flex-col overflow-hidden"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="flex items-center justify-between p-4 border-b border-border/50 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center">
                    <Zap className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <h2 className="text-base font-bold text-foreground">AI Fitness Coach</h2>
                </div>
                <motion.button
                  onClick={() => setShowChat(false)}
                  className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </motion.button>
              </div>
              <div className="flex-1 min-h-0 overflow-hidden">
                <ChatInterface
                  messages={messages}
                  onSendMessage={sendMessage}
                  isLoading={isLoading}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Workout Form Modal */}
      <AnimatePresence>
        {showForm && (
          <WorkoutForm
            onSubmit={handleAddWorkout}
            onClose={() => setShowForm(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Bottom nav button helper
function NavTabButton({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors"
      whileTap={{ scale: 0.9 }}
    >
      <motion.div
        animate={active ? { scale: 1.15 } : { scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Icon className={`w-5 h-5 transition-colors ${active ? 'text-primary' : 'text-muted-foreground'}`} />
      </motion.div>
      <span className={`text-[10px] font-semibold transition-colors ${active ? 'text-primary' : 'text-muted-foreground'}`}>
        {label}
      </span>
      {active && (
        <motion.div
          layoutId="nav-indicator"
          className="w-4 h-0.5 rounded-full bg-primary mt-0.5"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
    </motion.button>
  );
}

export default Index;
