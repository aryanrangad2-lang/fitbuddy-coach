import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Workout } from '@/types/workout';
import { TrendingUp, Flame, Dumbbell, Calendar } from 'lucide-react';
import { format, subDays, startOfDay, eachDayOfInterval } from 'date-fns';

interface ProgressChartsProps {
  workouts: Workout[];
}

export const ProgressCharts = ({ workouts }: ProgressChartsProps) => {
  const weeklyData = useMemo(() => {
    const today = startOfDay(new Date());
    const sevenDaysAgo = subDays(today, 6);
    
    const days = eachDayOfInterval({ start: sevenDaysAgo, end: today });
    
    return days.map(day => {
      const dayWorkouts = workouts.filter(w => {
        const workoutDate = startOfDay(new Date(w.date));
        return workoutDate.getTime() === day.getTime();
      });
      
      return {
        date: format(day, 'EEE'),
        fullDate: format(day, 'MMM d'),
        workouts: dayWorkouts.length,
        calories: dayWorkouts.reduce((sum, w) => sum + (w.calories || 0), 0),
        minutes: dayWorkouts.reduce((sum, w) => sum + w.duration, 0),
      };
    });
  }, [workouts]);

  const totalWeekWorkouts = weeklyData.reduce((sum, d) => sum + d.workouts, 0);
  const totalWeekCalories = weeklyData.reduce((sum, d) => sum + d.calories, 0);
  const totalWeekMinutes = weeklyData.reduce((sum, d) => sum + d.minutes, 0);
  const avgDailyCalories = Math.round(totalWeekCalories / 7);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground">{payload[0]?.payload?.fullDate}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm text-muted-foreground">
              <span className="font-medium" style={{ color: entry.color }}>
                {entry.name}: 
              </span>{' '}
              {entry.value} {entry.name === 'Calories' ? 'kcal' : entry.name === 'Minutes' ? 'min' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="w-full"
    >
      <Card className="border-border/50 shadow-card overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Weekly Progress
            </CardTitle>
            <span className="text-xs text-muted-foreground">Last 7 days</span>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <motion.div 
              className="bg-primary/10 rounded-xl p-3 text-center"
              whileHover={{ scale: 1.02 }}
            >
              <Dumbbell className="h-5 w-5 mx-auto mb-1 text-primary" />
              <p className="text-xl font-bold text-foreground">{totalWeekWorkouts}</p>
              <p className="text-xs text-muted-foreground">Workouts</p>
            </motion.div>
            <motion.div 
              className="bg-orange-500/10 rounded-xl p-3 text-center"
              whileHover={{ scale: 1.02 }}
            >
              <Flame className="h-5 w-5 mx-auto mb-1 text-orange-500" />
              <p className="text-xl font-bold text-foreground">{totalWeekCalories}</p>
              <p className="text-xs text-muted-foreground">Calories</p>
            </motion.div>
            <motion.div 
              className="bg-blue-500/10 rounded-xl p-3 text-center"
              whileHover={{ scale: 1.02 }}
            >
              <Calendar className="h-5 w-5 mx-auto mb-1 text-blue-500" />
              <p className="text-xl font-bold text-foreground">{totalWeekMinutes}</p>
              <p className="text-xs text-muted-foreground">Minutes</p>
            </motion.div>
          </div>

          <Tabs defaultValue="calories" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="calories" className="text-xs sm:text-sm">
                Calories Burned
              </TabsTrigger>
              <TabsTrigger value="workouts" className="text-xs sm:text-sm">
                Workouts
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="calories" className="mt-0">
              <div className="h-48 sm:h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="caloriesGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                    <XAxis 
                      dataKey="date" 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="calories"
                      name="Calories"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      fill="url(#caloriesGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-center text-muted-foreground mt-2">
                Avg: <span className="font-medium text-foreground">{avgDailyCalories} kcal</span> per day
              </p>
            </TabsContent>
            
            <TabsContent value="workouts" className="mt-0">
              <div className="h-48 sm:h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={1}/>
                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.6}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                    <XAxis 
                      dataKey="date" 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="workouts"
                      name="Workouts"
                      fill="url(#barGradient)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-center text-muted-foreground mt-2">
                Total: <span className="font-medium text-foreground">{totalWeekWorkouts} workouts</span> this week
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
};
