export type WorkoutType = 
  | 'running' 
  | 'cycling' 
  | 'swimming' 
  | 'strength' 
  | 'yoga' 
  | 'hiit' 
  | 'walking' 
  | 'other';

export type Intensity = 'low' | 'medium' | 'high';

export interface Workout {
  id: string;
  type: WorkoutType;
  duration: number; // in minutes
  intensity: Intensity;
  calories?: number;
  notes?: string;
  date: Date;
}

export interface UserProfile {
  name: string;
  streak: number;
  totalWorkouts: number;
  totalMinutes: number;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
