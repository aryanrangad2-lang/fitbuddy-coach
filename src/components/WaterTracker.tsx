import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplets, Plus, Minus, Bell, BellOff, Settings, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';

const WATER_STORAGE_KEY = 'fitbuddy_water';
const WATER_SETTINGS_KEY = 'fitbuddy_water_settings';

interface WaterData {
  date: string;
  glasses: number;
}

interface WaterSettings {
  goalGlasses: number;
  reminderInterval: number; // in minutes
  notificationsEnabled: boolean;
  glassSize: number; // ml
}

const defaultSettings: WaterSettings = {
  goalGlasses: 8,
  reminderInterval: 60,
  notificationsEnabled: false,
  glassSize: 250,
};

const getTodayKey = () => new Date().toISOString().split('T')[0];

export function WaterTracker() {
  const [glasses, setGlasses] = useState(0);
  const [settings, setSettings] = useState<WaterSettings>(defaultSettings);
  const [showSettings, setShowSettings] = useState(false);
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>('default');
  const intervalRef = useRef<ReturnType<typeof setInterval>>();
  const { toast } = useToast();

  // Load saved data
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(WATER_STORAGE_KEY);
      if (savedData) {
        const parsed: WaterData = JSON.parse(savedData);
        if (parsed.date === getTodayKey()) setGlasses(parsed.glasses);
      }
      const savedSettings = localStorage.getItem(WATER_SETTINGS_KEY);
      if (savedSettings) setSettings(JSON.parse(savedSettings));
    } catch {}
    if ('Notification' in window) setNotifPermission(Notification.permission);
  }, []);

  // Save on change
  useEffect(() => {
    localStorage.setItem(WATER_STORAGE_KEY, JSON.stringify({ date: getTodayKey(), glasses }));
  }, [glasses]);

  useEffect(() => {
    localStorage.setItem(WATER_SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  // Notification timer
  const showReminder = useCallback(() => {
    // In-app toast
    toast({
      title: "💧 Time to drink water!",
      description: `You've had ${glasses} of ${settings.goalGlasses} glasses today.`,
    });

    // Browser notification
    if (notifPermission === 'granted' && settings.notificationsEnabled) {
      try {
        new Notification("💧 Hydration Reminder", {
          body: `Time to drink water! ${glasses}/${settings.goalGlasses} glasses today.`,
          icon: '/favicon.ico',
        });
      } catch {}
    }
  }, [glasses, settings.goalGlasses, settings.notificationsEnabled, notifPermission, toast]);

  useEffect(() => {
    clearInterval(intervalRef.current);
    if (settings.notificationsEnabled && settings.reminderInterval > 0) {
      intervalRef.current = setInterval(showReminder, settings.reminderInterval * 60 * 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [settings.notificationsEnabled, settings.reminderInterval, showReminder]);

  const requestNotifPermission = async () => {
    if (!('Notification' in window)) {
      toast({ title: "Not supported", description: "Your browser doesn't support notifications.", variant: "destructive" });
      return;
    }
    const perm = await Notification.requestPermission();
    setNotifPermission(perm);
    if (perm === 'granted') {
      setSettings(s => ({ ...s, notificationsEnabled: true }));
      toast({ title: "Notifications enabled! 🔔", description: "You'll get water reminders." });
    }
  };

  const toggleNotifications = () => {
    if (!settings.notificationsEnabled) {
      if (notifPermission !== 'granted') {
        requestNotifPermission();
      } else {
        setSettings(s => ({ ...s, notificationsEnabled: true }));
      }
    } else {
      setSettings(s => ({ ...s, notificationsEnabled: false }));
    }
  };

  const addGlass = () => setGlasses(g => g + 1);
  const removeGlass = () => setGlasses(g => Math.max(0, g - 1));

  const progress = Math.min((glasses / settings.goalGlasses) * 100, 100);
  const totalMl = glasses * settings.glassSize;

  return (
    <Card className="overflow-hidden border border-border/50 shadow-card">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <motion.div
              animate={glasses > 0 ? { y: [0, -3, 0] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Droplets className="w-5 h-5 text-blue-400" />
            </motion.div>
            <h3 className="font-semibold text-foreground">Water Intake</h3>
          </div>
          <div className="flex items-center gap-1">
            <motion.button
              onClick={toggleNotifications}
              className="p-1.5 rounded-full hover:bg-secondary transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {settings.notificationsEnabled ? (
                <Bell className="w-4 h-4 text-blue-400" />
              ) : (
                <BellOff className="w-4 h-4 text-muted-foreground" />
              )}
            </motion.button>
            <motion.button
              onClick={() => setShowSettings(!showSettings)}
              className="p-1.5 rounded-full hover:bg-secondary transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Settings className="w-4 h-4 text-muted-foreground" />
            </motion.button>
          </div>
        </div>

        {/* Water visual */}
        <div className="flex items-center gap-4 mb-4">
          <motion.div
            className="relative w-16 h-20 rounded-xl border-2 border-blue-400/30 overflow-hidden bg-secondary/50"
          >
            <motion.div
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-500 to-blue-400/80"
              animate={{ height: `${progress}%` }}
              transition={{ type: 'spring', stiffness: 100, damping: 15 }}
            />
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={progress >= 100 ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <span className="text-lg font-bold text-white drop-shadow-md">
                {Math.round(progress)}%
              </span>
            </motion.div>
          </motion.div>

          <div className="flex-1">
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-2xl font-bold text-foreground">{glasses}</span>
              <span className="text-muted-foreground text-sm">/ {settings.goalGlasses} glasses</span>
            </div>
            <p className="text-xs text-muted-foreground mb-2">{totalMl} ml today</p>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex-1">
            <Button variant="outline" size="sm" className="w-full gap-1" onClick={removeGlass} disabled={glasses === 0}>
              <Minus className="w-4 h-4" />
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex-1">
            <Button size="sm" className="w-full gap-1 bg-blue-500 hover:bg-blue-600 text-white" onClick={addGlass}>
              <Plus className="w-4 h-4" />
              <Droplets className="w-3 h-3" />
            </Button>
          </motion.div>
        </div>

        {/* Settings panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-border space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Daily Goal (glasses)</Label>
                  <Input
                    type="number"
                    value={settings.goalGlasses}
                    onChange={(e) => setSettings(s => ({ ...s, goalGlasses: parseInt(e.target.value) || 8 }))}
                    className="w-20 h-8 bg-secondary border-0 text-center"
                    min={1}
                    max={20}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Glass Size (ml)</Label>
                  <Input
                    type="number"
                    value={settings.glassSize}
                    onChange={(e) => setSettings(s => ({ ...s, glassSize: parseInt(e.target.value) || 250 }))}
                    className="w-20 h-8 bg-secondary border-0 text-center"
                    min={100}
                    max={500}
                    step={50}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Reminder every (min)</Label>
                  <Input
                    type="number"
                    value={settings.reminderInterval}
                    onChange={(e) => setSettings(s => ({ ...s, reminderInterval: parseInt(e.target.value) || 60 }))}
                    className="w-20 h-8 bg-secondary border-0 text-center"
                    min={5}
                    max={180}
                    step={5}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {progress >= 100 && (
          <motion.p
            className="mt-3 text-center text-sm text-blue-400 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            🎉 Daily water goal reached! Great job staying hydrated!
          </motion.p>
        )}
      </CardContent>
    </Card>
  );
}