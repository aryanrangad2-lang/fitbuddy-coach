import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Workout, UserProfile } from "@/types/workout";
import { StatsCard } from "@/components/StatsCard";
import { WorkoutCard } from "@/components/WorkoutCard";
import { WorkoutForm } from "@/components/WorkoutForm";
import { ChatInterface } from "@/components/ChatInterface";
import { useChat } from "@/hooks/useChat";
import { Button } from "@/components/ui/button";
import { 
  Flame, 
  Target, 
  Timer, 
  TrendingUp, 
  Plus,
  Dumbbell,
  MessageCircle,
  X,
  Utensils
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data for initial state
const initialWorkouts: Workout[] = [
  {
    id: '1',
    type: 'running',
    duration: 35,
    intensity: 'medium',
    calories: 320,
    notes: 'Morning run in the park. Felt great!',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
  {
    id: '2',
    type: 'strength',
    duration: 45,
    intensity: 'high',
    calories: 280,
    notes: 'Upper body focus. New PR on bench press!',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
  },
  {
    id: '3',
    type: 'yoga',
    duration: 30,
    intensity: 'low',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
  },
];

const Index = () => {
  const [workouts, setWorkouts] = useState<Workout[]>(initialWorkouts);
  const [showForm, setShowForm] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const { toast } = useToast();

  const profile: UserProfile = useMemo(() => ({
    name: 'Champion',
    streak: workouts.length > 0 ? Math.min(workouts.length, 7) : 0,
    totalWorkouts: workouts.length,
    totalMinutes: workouts.reduce((acc, w) => acc + w.duration, 0),
  }), [workouts]);

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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen gradient-warm overflow-y-auto">
      {/* Header */}
      <header className="px-4 pt-6 pb-4 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center shadow-soft">
              <Dumbbell className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">FitBuddy</h1>
              <p className="text-sm text-muted-foreground">Your AI Coach</p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Link to="/diet-plan" className="flex-1 sm:flex-initial">
              <Button variant="outline" size="lg" className="shadow-card w-full sm:w-auto">
                <Utensils className="w-5 h-5" />
                <span className="hidden sm:inline">Diet Plan</span>
                <span className="sm:hidden">Diet</span>
              </Button>
            </Link>
            <Button 
              variant="gradient" 
              size="lg"
              onClick={() => setShowForm(true)}
              className="shadow-soft flex-1 sm:flex-initial"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Log Workout</span>
              <span className="sm:hidden">Log</span>
            </Button>
          </div>
        </div>

        {/* Greeting */}
        <div className="bg-card rounded-3xl p-6 shadow-card mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-1">
            {getGreeting()}, {profile.name}! 👋
          </h2>
          <p className="text-muted-foreground">
            {profile.streak > 0 
              ? `You're on a ${profile.streak}-day streak! Keep the momentum going.`
              : "Ready to start your fitness journey today?"
            }
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 pb-28 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Stats & Workouts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full">
              <StatsCard 
                icon={Flame} 
                label="Day Streak" 
                value={profile.streak}
                suffix="days"
                variant="primary"
              />
              <StatsCard 
                icon={Target} 
                label="Workouts" 
                value={profile.totalWorkouts}
              />
              <StatsCard 
                icon={Timer} 
                label="Total Time" 
                value={profile.totalMinutes}
                suffix="min"
              />
              <StatsCard 
                icon={TrendingUp} 
                label="Calories" 
                value={totalCalories}
                suffix="kcal"
              />
            </div>

            {/* Recent Workouts */}
            <section className="w-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">Recent Workouts</h2>
                <span className="text-sm text-muted-foreground">
                  {workouts.length} total
                </span>
              </div>
              
              {workouts.length > 0 ? (
                <div className="flex flex-col gap-3 w-full">
                  {workouts.slice(0, 5).map((workout, index) => (
                    <div 
                      key={workout.id} 
                      className="w-full"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <WorkoutCard workout={workout} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-card rounded-2xl p-8 text-center shadow-card border border-border/50 w-full">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-primary flex items-center justify-center shadow-soft">
                    <Dumbbell className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">No workouts yet</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Log your first workout to start tracking your progress!
                  </p>
                  <Button variant="gradient" onClick={() => setShowForm(true)}>
                    <Plus className="w-4 h-4" />
                    Log First Workout
                  </Button>
                </div>
              )}
            </section>
          </div>

          {/* Right Column - Chat */}
          <div className="hidden lg:block">
            <div className="sticky top-6 h-[calc(100vh-6rem)] min-h-[500px]">
              <ChatInterface 
                messages={messages} 
                onSendMessage={sendMessage}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Chat FAB */}
      <button
        onClick={() => setShowChat(true)}
        className="lg:hidden fixed bottom-6 right-6 w-14 h-14 rounded-full gradient-primary shadow-glow flex items-center justify-center z-40 animate-float"
      >
        <MessageCircle className="w-6 h-6 text-primary-foreground" />
      </button>

      {/* Mobile Chat Modal */}
      {showChat && (
        <div className="lg:hidden fixed inset-0 z-50 bg-background animate-fade-in">
          <div className="h-[100dvh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
              <h2 className="text-lg font-semibold text-foreground">Chat with FitBuddy</h2>
              <button 
                onClick={() => setShowChat(false)}
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="flex-1 min-h-0 overflow-hidden">
              <ChatInterface 
                messages={messages} 
                onSendMessage={sendMessage}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      )}

      {/* Workout Form Modal */}
      {showForm && (
        <WorkoutForm 
          onSubmit={handleAddWorkout} 
          onClose={() => setShowForm(false)} 
        />
      )}
    </div>
  );
};

export default Index;
