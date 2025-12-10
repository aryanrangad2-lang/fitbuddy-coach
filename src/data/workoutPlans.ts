export type ExerciseType = 'strength' | 'cardio' | 'rest' | 'flexibility';

export interface Exercise {
  name: string;
  sets?: number;
  reps?: number | string;
  duration?: string;
  tips?: string;
  type: ExerciseType;
}

export interface DayPlan {
  day: number;
  title: string;
  description: string;
  exercises: Exercise[];
  isRestDay: boolean;
}

export interface WorkoutPlan {
  level: 'beginner' | 'intermediate' | 'advanced';
  name: string;
  description: string;
  days: DayPlan[];
}

const beginnerPlan: DayPlan[] = [
  { day: 1, title: "Full Body Foundation", description: "Build your base with fundamental movements", isRestDay: false, exercises: [
    { name: "Push-Ups (Knee)", sets: 3, reps: 10, tips: "Keep core tight, lower slowly", type: "strength" },
    { name: "Bodyweight Squats", sets: 3, reps: 12, tips: "Knees over toes, chest up", type: "strength" },
    { name: "Plank Hold", sets: 3, reps: "30 sec", tips: "Straight line from head to heels", type: "strength" },
    { name: "Glute Bridges", sets: 3, reps: 15, tips: "Squeeze glutes at top", type: "strength" },
  ]},
  { day: 2, title: "Cardio Intro", description: "Get your heart pumping with low-impact cardio", isRestDay: false, exercises: [
    { name: "Brisk Walking", duration: "20 min", tips: "Maintain steady pace, swing arms", type: "cardio" },
    { name: "Jumping Jacks", sets: 3, reps: 20, tips: "Land softly, keep rhythm", type: "cardio" },
    { name: "Marching in Place", duration: "5 min", tips: "High knees, pump arms", type: "cardio" },
  ]},
  { day: 3, title: "Upper Body Light", description: "Focus on arms and shoulders", isRestDay: false, exercises: [
    { name: "Wall Push-Ups", sets: 3, reps: 12, tips: "Full range of motion", type: "strength" },
    { name: "Arm Circles", sets: 3, reps: "30 sec each direction", tips: "Keep arms straight", type: "strength" },
    { name: "Tricep Dips (Chair)", sets: 3, reps: 8, tips: "Elbows point back", type: "strength" },
    { name: "Superman Hold", sets: 3, reps: "20 sec", tips: "Lift chest and legs together", type: "strength" },
  ]},
  { day: 4, title: "Lower Body Focus", description: "Strengthen your legs and glutes", isRestDay: false, exercises: [
    { name: "Lunges", sets: 3, reps: "10 each leg", tips: "Keep front knee at 90°", type: "strength" },
    { name: "Calf Raises", sets: 3, reps: 15, tips: "Pause at top", type: "strength" },
    { name: "Wall Sit", sets: 3, reps: "30 sec", tips: "Thighs parallel to floor", type: "strength" },
    { name: "Side Leg Raises", sets: 3, reps: "12 each leg", tips: "Control the movement", type: "strength" },
  ]},
  { day: 5, title: "Active Rest", description: "Light movement to promote recovery", isRestDay: true, exercises: [
    { name: "Gentle Stretching", duration: "15 min", tips: "Hold each stretch 30 sec", type: "flexibility" },
    { name: "Light Walk", duration: "10 min", tips: "Relaxed pace, enjoy nature", type: "cardio" },
  ]},
  { day: 6, title: "Core & Cardio Mix", description: "Build core strength with cardio bursts", isRestDay: false, exercises: [
    { name: "Bicycle Crunches", sets: 3, reps: 15, tips: "Slow and controlled", type: "strength" },
    { name: "Mountain Climbers", sets: 3, reps: 20, tips: "Keep hips level", type: "cardio" },
    { name: "Dead Bug", sets: 3, reps: 10, tips: "Lower back pressed to floor", type: "strength" },
    { name: "High Knees", sets: 3, reps: "30 sec", tips: "Drive knees up fast", type: "cardio" },
  ]},
  { day: 7, title: "Complete Rest", description: "Full recovery day - you earned it!", isRestDay: true, exercises: [
    { name: "Rest & Hydrate", duration: "All day", tips: "Drink plenty of water, eat well", type: "rest" },
  ]},
  { day: 8, title: "Full Body Power", description: "Progressive overload begins", isRestDay: false, exercises: [
    { name: "Push-Ups (Knee)", sets: 3, reps: 12, tips: "Add 2 reps from Day 1", type: "strength" },
    { name: "Squats with Pause", sets: 3, reps: 12, tips: "3 sec pause at bottom", type: "strength" },
    { name: "Plank Hold", sets: 3, reps: "40 sec", tips: "10 sec longer than before", type: "strength" },
    { name: "Glute Bridges", sets: 3, reps: 18, tips: "Add 3 reps for progression", type: "strength" },
  ]},
  { day: 9, title: "Cardio Challenge", description: "Push your cardio endurance", isRestDay: false, exercises: [
    { name: "Brisk Walking", duration: "25 min", tips: "Increase pace slightly", type: "cardio" },
    { name: "Jumping Jacks", sets: 4, reps: 20, tips: "One more set this week", type: "cardio" },
    { name: "Butt Kicks", sets: 3, reps: "30 sec", tips: "Quick feet, heels to glutes", type: "cardio" },
  ]},
  { day: 10, title: "Upper Body Build", description: "Increase upper body strength", isRestDay: false, exercises: [
    { name: "Incline Push-Ups", sets: 3, reps: 12, tips: "Use a sturdy surface", type: "strength" },
    { name: "Arm Circles", sets: 3, reps: "45 sec each direction", tips: "Longer duration", type: "strength" },
    { name: "Tricep Dips", sets: 3, reps: 10, tips: "2 more reps", type: "strength" },
    { name: "Shoulder Taps", sets: 3, reps: 20, tips: "Minimize hip sway", type: "strength" },
  ]},
  { day: 11, title: "Leg Day", description: "Build lower body power", isRestDay: false, exercises: [
    { name: "Jump Squats", sets: 3, reps: 10, tips: "Land softly", type: "strength" },
    { name: "Walking Lunges", sets: 3, reps: "12 each leg", tips: "Take long strides", type: "strength" },
    { name: "Single Leg Glute Bridge", sets: 3, reps: "10 each leg", tips: "Keep hips level", type: "strength" },
    { name: "Calf Raises", sets: 3, reps: 20, tips: "Add 5 reps", type: "strength" },
  ]},
  { day: 12, title: "Active Recovery", description: "Light movement and mobility", isRestDay: true, exercises: [
    { name: "Yoga Flow", duration: "20 min", tips: "Focus on breathing", type: "flexibility" },
    { name: "Foam Rolling", duration: "10 min", tips: "Target tight areas", type: "flexibility" },
  ]},
  { day: 13, title: "HIIT Intro", description: "Your first taste of interval training", isRestDay: false, exercises: [
    { name: "Squat Jumps", sets: 3, reps: 8, tips: "Explosive up, soft landing", type: "cardio" },
    { name: "Push-Ups", sets: 3, reps: 10, tips: "Try full push-ups", type: "strength" },
    { name: "Burpees (Modified)", sets: 3, reps: 5, tips: "Step instead of jump if needed", type: "cardio" },
    { name: "Plank Jacks", sets: 3, reps: 15, tips: "Keep core engaged", type: "cardio" },
  ]},
  { day: 14, title: "Rest & Reflect", description: "Celebrate 2 weeks of progress!", isRestDay: true, exercises: [
    { name: "Rest & Hydrate", duration: "All day", tips: "Review your progress, you're doing great!", type: "rest" },
  ]},
  { day: 15, title: "Full Body Strength", description: "Week 3 - Time to level up", isRestDay: false, exercises: [
    { name: "Push-Ups (Full)", sets: 3, reps: 10, tips: "Try full push-ups now", type: "strength" },
    { name: "Squat Pulses", sets: 3, reps: 15, tips: "Small bounces at bottom", type: "strength" },
    { name: "Plank Hold", sets: 3, reps: "45 sec", tips: "Building endurance", type: "strength" },
    { name: "Reverse Lunges", sets: 3, reps: "10 each leg", tips: "Step back, not forward", type: "strength" },
  ]},
  { day: 16, title: "Cardio Endurance", description: "Build stamina", isRestDay: false, exercises: [
    { name: "Jogging", duration: "15 min", tips: "Find your comfortable pace", type: "cardio" },
    { name: "Jump Rope (or mimics)", duration: "5 min", tips: "Light on feet", type: "cardio" },
    { name: "Cool Down Walk", duration: "5 min", tips: "Slow pace, catch breath", type: "cardio" },
  ]},
  { day: 17, title: "Push Day", description: "Focus on pushing movements", isRestDay: false, exercises: [
    { name: "Diamond Push-Ups", sets: 3, reps: 8, tips: "Hands close together", type: "strength" },
    { name: "Pike Push-Ups", sets: 3, reps: 8, tips: "Shoulders over hands", type: "strength" },
    { name: "Tricep Dips", sets: 3, reps: 12, tips: "Full range of motion", type: "strength" },
    { name: "Shoulder Taps", sets: 3, reps: 24, tips: "Faster pace", type: "strength" },
  ]},
  { day: 18, title: "Pull & Core", description: "Back and core focus", isRestDay: false, exercises: [
    { name: "Superman Raises", sets: 3, reps: 12, tips: "Lift and hold 2 sec", type: "strength" },
    { name: "Lying Leg Raises", sets: 3, reps: 12, tips: "Lower back pressed down", type: "strength" },
    { name: "Bird Dog", sets: 3, reps: "10 each side", tips: "Slow and controlled", type: "strength" },
    { name: "Plank Shoulder Taps", sets: 3, reps: 20, tips: "Alternate hands", type: "strength" },
  ]},
  { day: 19, title: "Active Recovery", description: "Stretch and restore", isRestDay: true, exercises: [
    { name: "Dynamic Stretching", duration: "15 min", tips: "Move through stretches", type: "flexibility" },
    { name: "Light Walk", duration: "15 min", tips: "Enjoy the movement", type: "cardio" },
  ]},
  { day: 20, title: "HIIT Circuit", description: "High intensity intervals", isRestDay: false, exercises: [
    { name: "Burpees", sets: 4, reps: 8, tips: "Full range, power up", type: "cardio" },
    { name: "Mountain Climbers", sets: 4, reps: 20, tips: "Fast feet", type: "cardio" },
    { name: "Squat Jumps", sets: 4, reps: 10, tips: "Explode upward", type: "cardio" },
    { name: "High Knees", sets: 4, reps: "30 sec", tips: "Maximum effort", type: "cardio" },
  ]},
  { day: 21, title: "Rest Day", description: "Complete rest - recharge for final week", isRestDay: true, exercises: [
    { name: "Rest & Nutrition", duration: "All day", tips: "Focus on protein and sleep", type: "rest" },
  ]},
  { day: 22, title: "Full Body Blast", description: "Week 4 - Final push!", isRestDay: false, exercises: [
    { name: "Push-Ups", sets: 4, reps: 12, tips: "4 sets now!", type: "strength" },
    { name: "Jump Squats", sets: 4, reps: 12, tips: "Maximum height", type: "strength" },
    { name: "Plank Hold", sets: 3, reps: "60 sec", tips: "Full minute!", type: "strength" },
    { name: "Burpees", sets: 3, reps: 10, tips: "Push through", type: "cardio" },
  ]},
  { day: 23, title: "Cardio Peak", description: "Maximum cardio effort", isRestDay: false, exercises: [
    { name: "Jogging", duration: "20 min", tips: "Push your pace", type: "cardio" },
    { name: "Sprint Intervals", sets: 5, reps: "20 sec sprint, 40 sec walk", tips: "All out effort", type: "cardio" },
    { name: "Cool Down", duration: "5 min", tips: "Slow walk", type: "cardio" },
  ]},
  { day: 24, title: "Upper Body Max", description: "Peak upper body workout", isRestDay: false, exercises: [
    { name: "Push-Up Variations", sets: 4, reps: 10, tips: "Mix wide, narrow, regular", type: "strength" },
    { name: "Pike Push-Ups", sets: 4, reps: 10, tips: "Shoulders on fire", type: "strength" },
    { name: "Diamond Push-Ups", sets: 3, reps: 10, tips: "Tricep focus", type: "strength" },
    { name: "Plank Up-Downs", sets: 3, reps: 10, tips: "Forearm to hand", type: "strength" },
  ]},
  { day: 25, title: "Lower Body Max", description: "Peak leg workout", isRestDay: false, exercises: [
    { name: "Squat Hold", sets: 4, reps: "45 sec", tips: "Deep squat position", type: "strength" },
    { name: "Jump Lunges", sets: 3, reps: "10 each leg", tips: "Switch legs mid-air", type: "strength" },
    { name: "Single Leg Deadlift", sets: 3, reps: "10 each leg", tips: "Balance challenge", type: "strength" },
    { name: "Calf Raises", sets: 4, reps: 25, tips: "Burn it out", type: "strength" },
  ]},
  { day: 26, title: "Active Recovery", description: "Prepare for final days", isRestDay: true, exercises: [
    { name: "Yoga", duration: "25 min", tips: "Focus on tight muscles", type: "flexibility" },
    { name: "Light Stretching", duration: "10 min", tips: "Be gentle", type: "flexibility" },
  ]},
  { day: 27, title: "HIIT Finale", description: "Ultimate interval challenge", isRestDay: false, exercises: [
    { name: "Burpees", sets: 5, reps: 10, tips: "Everything you've got", type: "cardio" },
    { name: "Mountain Climbers", sets: 5, reps: 30, tips: "Speed and power", type: "cardio" },
    { name: "Squat Jumps", sets: 5, reps: 15, tips: "Maximum reps", type: "cardio" },
    { name: "Plank Jacks", sets: 5, reps: 20, tips: "Finish strong", type: "cardio" },
  ]},
  { day: 28, title: "Rest Day", description: "Recovery before final test", isRestDay: true, exercises: [
    { name: "Complete Rest", duration: "All day", tips: "Hydrate and sleep well", type: "rest" },
  ]},
  { day: 29, title: "Final Test", description: "See how far you've come!", isRestDay: false, exercises: [
    { name: "Max Push-Ups", sets: 1, reps: "AMRAP", tips: "As many as possible!", type: "strength" },
    { name: "Max Squats", sets: 1, reps: "AMRAP", tips: "Count your total", type: "strength" },
    { name: "Max Plank Hold", sets: 1, reps: "Max time", tips: "Beat your record", type: "strength" },
    { name: "1 Mile Run/Walk", duration: "Time yourself", tips: "Your personal best", type: "cardio" },
  ]},
  { day: 30, title: "Celebration!", description: "You completed the beginner program!", isRestDay: true, exercises: [
    { name: "Victory Lap Walk", duration: "20 min", tips: "Celebrate your achievement!", type: "cardio" },
    { name: "Full Body Stretch", duration: "15 min", tips: "You earned this", type: "flexibility" },
  ]},
];

const intermediatePlan: DayPlan[] = [
  { day: 1, title: "Push Power", description: "Chest, shoulders, and triceps focus", isRestDay: false, exercises: [
    { name: "Push-Ups", sets: 4, reps: 15, tips: "Full depth, explosive up", type: "strength" },
    { name: "Pike Push-Ups", sets: 4, reps: 12, tips: "Shoulders vertical", type: "strength" },
    { name: "Diamond Push-Ups", sets: 3, reps: 12, tips: "Elbows close to body", type: "strength" },
    { name: "Tricep Dips", sets: 4, reps: 15, tips: "Deep range of motion", type: "strength" },
    { name: "Plank to Push-Up", sets: 3, reps: 12, tips: "Alternate leading arm", type: "strength" },
  ]},
  { day: 2, title: "Pull & Core", description: "Back, biceps, and core", isRestDay: false, exercises: [
    { name: "Superman Raises", sets: 4, reps: 15, tips: "3 sec hold at top", type: "strength" },
    { name: "Inverted Rows (Table)", sets: 4, reps: 12, tips: "Squeeze shoulder blades", type: "strength" },
    { name: "Bicycle Crunches", sets: 4, reps: 20, tips: "Slow and controlled", type: "strength" },
    { name: "Leg Raises", sets: 4, reps: 15, tips: "Lower with control", type: "strength" },
    { name: "Plank Hold", sets: 3, reps: "60 sec", tips: "Engage glutes", type: "strength" },
  ]},
  { day: 3, title: "Leg Day", description: "Build powerful legs", isRestDay: false, exercises: [
    { name: "Jump Squats", sets: 4, reps: 15, tips: "Explode and land soft", type: "strength" },
    { name: "Bulgarian Split Squats", sets: 3, reps: "12 each leg", tips: "Rear foot elevated", type: "strength" },
    { name: "Glute Bridges", sets: 4, reps: 20, tips: "Pause at top", type: "strength" },
    { name: "Calf Raises", sets: 4, reps: 25, tips: "Full range", type: "strength" },
    { name: "Wall Sit", sets: 3, reps: "60 sec", tips: "Thighs parallel", type: "strength" },
  ]},
  { day: 4, title: "HIIT Cardio", description: "High intensity intervals", isRestDay: false, exercises: [
    { name: "Burpees", sets: 5, reps: 10, tips: "Full speed", type: "cardio" },
    { name: "Mountain Climbers", sets: 5, reps: 30, tips: "Fast feet", type: "cardio" },
    { name: "High Knees", sets: 5, reps: "30 sec", tips: "Drive knees high", type: "cardio" },
    { name: "Jump Lunges", sets: 4, reps: "12 each leg", tips: "Switch mid-air", type: "cardio" },
  ]},
  { day: 5, title: "Active Recovery", description: "Mobility and light movement", isRestDay: true, exercises: [
    { name: "Yoga Flow", duration: "30 min", tips: "Focus on hip openers", type: "flexibility" },
    { name: "Foam Rolling", duration: "15 min", tips: "Target legs and back", type: "flexibility" },
  ]},
  { day: 6, title: "Full Body Circuit", description: "Total body conditioning", isRestDay: false, exercises: [
    { name: "Push-Ups", sets: 3, reps: 15, tips: "Part of circuit", type: "strength" },
    { name: "Squats", sets: 3, reps: 20, tips: "No rest between", type: "strength" },
    { name: "Plank", sets: 3, reps: "45 sec", tips: "Keep moving", type: "strength" },
    { name: "Lunges", sets: 3, reps: "15 each leg", tips: "Continuous flow", type: "strength" },
    { name: "Burpees", sets: 3, reps: 10, tips: "Finish strong", type: "cardio" },
  ]},
  { day: 7, title: "Complete Rest", description: "Full recovery", isRestDay: true, exercises: [
    { name: "Rest & Recover", duration: "All day", tips: "Sleep 8+ hours", type: "rest" },
  ]},
  { day: 8, title: "Push Progressive", description: "Increased volume", isRestDay: false, exercises: [
    { name: "Decline Push-Ups", sets: 4, reps: 15, tips: "Feet elevated", type: "strength" },
    { name: "Pike Push-Ups", sets: 4, reps: 15, tips: "3 more reps", type: "strength" },
    { name: "Diamond Push-Ups", sets: 4, reps: 15, tips: "Extra set", type: "strength" },
    { name: "Tricep Dips", sets: 4, reps: 18, tips: "Deep dips", type: "strength" },
  ]},
  { day: 9, title: "Pull Progression", description: "Build that back", isRestDay: false, exercises: [
    { name: "Wide Grip Rows", sets: 4, reps: 15, tips: "Use table or bar", type: "strength" },
    { name: "Superman Hold", sets: 4, reps: "45 sec", tips: "Static hold", type: "strength" },
    { name: "Reverse Snow Angels", sets: 4, reps: 15, tips: "Face down", type: "strength" },
    { name: "V-Ups", sets: 4, reps: 15, tips: "Touch toes", type: "strength" },
  ]},
  { day: 10, title: "Leg Power", description: "Explosive legs", isRestDay: false, exercises: [
    { name: "Box Jumps (or Step)", sets: 4, reps: 12, tips: "Land softly", type: "strength" },
    { name: "Pistol Squat Prep", sets: 3, reps: "8 each leg", tips: "Use support if needed", type: "strength" },
    { name: "Walking Lunges", sets: 4, reps: "15 each leg", tips: "Long strides", type: "strength" },
    { name: "Calf Raises (Single Leg)", sets: 3, reps: "15 each leg", tips: "Full range", type: "strength" },
  ]},
  { day: 11, title: "Cardio Endurance", description: "Build stamina", isRestDay: false, exercises: [
    { name: "Running", duration: "25 min", tips: "Moderate pace", type: "cardio" },
    { name: "Sprint Intervals", sets: 8, reps: "20 sec on, 40 sec off", tips: "All out", type: "cardio" },
  ]},
  { day: 12, title: "Active Recovery", description: "Stretch and restore", isRestDay: true, exercises: [
    { name: "Stretching Routine", duration: "30 min", tips: "Full body focus", type: "flexibility" },
    { name: "Light Walk", duration: "20 min", tips: "Easy pace", type: "cardio" },
  ]},
  { day: 13, title: "Upper Body Blast", description: "Push and pull combo", isRestDay: false, exercises: [
    { name: "Push-Ups", sets: 5, reps: 15, tips: "5 sets now", type: "strength" },
    { name: "Rows", sets: 5, reps: 15, tips: "Match push volume", type: "strength" },
    { name: "Pike Push-Ups", sets: 4, reps: 15, tips: "Shoulders on fire", type: "strength" },
    { name: "Superman Raises", sets: 4, reps: 15, tips: "Strong back", type: "strength" },
  ]},
  { day: 14, title: "Rest Day", description: "Mid-program recovery", isRestDay: true, exercises: [
    { name: "Complete Rest", duration: "All day", tips: "Reflect on progress", type: "rest" },
  ]},
  { day: 15, title: "Full Body Power", description: "Week 3 intensity increase", isRestDay: false, exercises: [
    { name: "Clap Push-Ups", sets: 4, reps: 10, tips: "Explosive power", type: "strength" },
    { name: "Jump Squats", sets: 4, reps: 20, tips: "Max height", type: "strength" },
    { name: "Burpees", sets: 4, reps: 15, tips: "Full speed", type: "cardio" },
    { name: "Plank Hold", sets: 3, reps: "90 sec", tips: "Mental toughness", type: "strength" },
  ]},
  { day: 16, title: "HIIT Challenge", description: "Push your limits", isRestDay: false, exercises: [
    { name: "Burpee Box Jumps", sets: 5, reps: 10, tips: "Combine movements", type: "cardio" },
    { name: "Mountain Climber Sprints", sets: 5, reps: "45 sec", tips: "Maximum speed", type: "cardio" },
    { name: "Squat Jumps", sets: 5, reps: 20, tips: "No rest", type: "cardio" },
    { name: "Plank Jacks", sets: 5, reps: 25, tips: "Core engaged", type: "cardio" },
  ]},
  { day: 17, title: "Push Max", description: "Maximum push effort", isRestDay: false, exercises: [
    { name: "Archer Push-Ups", sets: 4, reps: "8 each side", tips: "Unilateral power", type: "strength" },
    { name: "Decline Pike Push-Ups", sets: 4, reps: 12, tips: "Feet elevated", type: "strength" },
    { name: "Diamond Push-Ups", sets: 4, reps: 15, tips: "Tricep burn", type: "strength" },
    { name: "Tricep Dips", sets: 4, reps: 20, tips: "Maximum depth", type: "strength" },
  ]},
  { day: 18, title: "Pull Max", description: "Maximum pull effort", isRestDay: false, exercises: [
    { name: "Wide Rows", sets: 5, reps: 15, tips: "Squeeze at top", type: "strength" },
    { name: "Narrow Rows", sets: 5, reps: 15, tips: "Bicep focus", type: "strength" },
    { name: "Hollow Body Hold", sets: 4, reps: "45 sec", tips: "Core tight", type: "strength" },
    { name: "V-Ups", sets: 4, reps: 20, tips: "Full range", type: "strength" },
  ]},
  { day: 19, title: "Active Recovery", description: "Restore and prepare", isRestDay: true, exercises: [
    { name: "Yoga", duration: "35 min", tips: "Deep stretches", type: "flexibility" },
    { name: "Self Massage", duration: "15 min", tips: "Focus on sore spots", type: "flexibility" },
  ]},
  { day: 20, title: "Leg Day Max", description: "Ultimate leg workout", isRestDay: false, exercises: [
    { name: "Pistol Squat Progression", sets: 4, reps: "8 each leg", tips: "Use support", type: "strength" },
    { name: "Jump Lunges", sets: 4, reps: "15 each leg", tips: "Explosive", type: "strength" },
    { name: "Single Leg Deadlift", sets: 4, reps: "12 each leg", tips: "Balance focus", type: "strength" },
    { name: "Calf Raise Hold", sets: 4, reps: "45 sec", tips: "Top position", type: "strength" },
  ]},
  { day: 21, title: "Complete Rest", description: "Prepare for final week", isRestDay: true, exercises: [
    { name: "Full Rest", duration: "All day", tips: "Sleep and nutrition focus", type: "rest" },
  ]},
  { day: 22, title: "Week 4 Kickoff", description: "Final week begins", isRestDay: false, exercises: [
    { name: "Push-Up Complex", sets: 5, reps: "10 each variation", tips: "Regular, diamond, wide", type: "strength" },
    { name: "Squat Complex", sets: 5, reps: "10 each variation", tips: "Regular, jump, pulse", type: "strength" },
    { name: "Core Circuit", sets: 3, reps: "All exercises", tips: "Plank, crunch, leg raise", type: "strength" },
  ]},
  { day: 23, title: "Cardio Peak", description: "Maximum cardio output", isRestDay: false, exercises: [
    { name: "Running", duration: "30 min", tips: "Fastest sustainable pace", type: "cardio" },
    { name: "Sprint Intervals", sets: 10, reps: "30 sec on, 30 sec off", tips: "All out effort", type: "cardio" },
  ]},
  { day: 24, title: "Upper Body Finale", description: "Peak upper body", isRestDay: false, exercises: [
    { name: "Push-Up Burnout", sets: 1, reps: "AMRAP", tips: "Maximum reps", type: "strength" },
    { name: "Row Burnout", sets: 1, reps: "AMRAP", tips: "Match push-ups", type: "strength" },
    { name: "Pike Push-Ups", sets: 5, reps: 15, tips: "Shoulder focus", type: "strength" },
    { name: "Plank Variations", sets: 4, reps: "60 sec each", tips: "Front, side, side", type: "strength" },
  ]},
  { day: 25, title: "Lower Body Finale", description: "Peak leg power", isRestDay: false, exercises: [
    { name: "Squat Burnout", sets: 1, reps: "AMRAP", tips: "Maximum reps", type: "strength" },
    { name: "Lunge Burnout", sets: 1, reps: "AMRAP each leg", tips: "Keep counting", type: "strength" },
    { name: "Jump Squats", sets: 5, reps: 20, tips: "Explosive", type: "strength" },
    { name: "Wall Sit", sets: 3, reps: "90 sec", tips: "Mental test", type: "strength" },
  ]},
  { day: 26, title: "Active Recovery", description: "Prepare for tests", isRestDay: true, exercises: [
    { name: "Light Yoga", duration: "30 min", tips: "Gentle movements", type: "flexibility" },
    { name: "Walking", duration: "20 min", tips: "Easy pace", type: "cardio" },
  ]},
  { day: 27, title: "HIIT Final", description: "Ultimate HIIT session", isRestDay: false, exercises: [
    { name: "Tabata Burpees", sets: 8, reps: "20 sec work, 10 sec rest", tips: "Classic Tabata", type: "cardio" },
    { name: "Tabata Squats", sets: 8, reps: "20 sec work, 10 sec rest", tips: "Keep moving", type: "cardio" },
    { name: "Tabata Mountain Climbers", sets: 8, reps: "20 sec work, 10 sec rest", tips: "Fast feet", type: "cardio" },
  ]},
  { day: 28, title: "Rest Before Test", description: "Recovery day", isRestDay: true, exercises: [
    { name: "Complete Rest", duration: "All day", tips: "Prepare mentally", type: "rest" },
  ]},
  { day: 29, title: "Fitness Test", description: "Measure your progress", isRestDay: false, exercises: [
    { name: "Max Push-Ups", sets: 1, reps: "AMRAP in 2 min", tips: "Count total", type: "strength" },
    { name: "Max Squats", sets: 1, reps: "AMRAP in 2 min", tips: "Track your best", type: "strength" },
    { name: "Max Plank", sets: 1, reps: "Max time", tips: "Personal record", type: "strength" },
    { name: "1.5 Mile Run", duration: "Time yourself", tips: "Beat your time", type: "cardio" },
  ]},
  { day: 30, title: "Graduation Day!", description: "You've completed intermediate!", isRestDay: true, exercises: [
    { name: "Celebration Walk", duration: "30 min", tips: "Reflect on journey", type: "cardio" },
    { name: "Full Body Stretch", duration: "20 min", tips: "You earned this", type: "flexibility" },
  ]},
];

const advancedPlan: DayPlan[] = [
  { day: 1, title: "Explosive Power", description: "High intensity from day 1", isRestDay: false, exercises: [
    { name: "Clap Push-Ups", sets: 5, reps: 15, tips: "Maximum explosion", type: "strength" },
    { name: "Plyometric Lunges", sets: 5, reps: "15 each leg", tips: "Switch mid-air", type: "strength" },
    { name: "Burpee Box Jumps", sets: 5, reps: 12, tips: "Continuous movement", type: "cardio" },
    { name: "Plank to Pike", sets: 4, reps: 15, tips: "Core control", type: "strength" },
    { name: "Diamond Clap Push-Ups", sets: 4, reps: 10, tips: "Advanced combo", type: "strength" },
  ]},
  { day: 2, title: "Strength Endurance", description: "Build lasting power", isRestDay: false, exercises: [
    { name: "Archer Push-Ups", sets: 5, reps: "12 each side", tips: "Control the descent", type: "strength" },
    { name: "Single Leg Squats", sets: 4, reps: "10 each leg", tips: "Full pistol or assisted", type: "strength" },
    { name: "L-Sit Hold", sets: 5, reps: "30 sec", tips: "Legs straight", type: "strength" },
    { name: "Dragon Flags (Progression)", sets: 4, reps: 8, tips: "Lower slowly", type: "strength" },
  ]},
  { day: 3, title: "HIIT Extreme", description: "Push your limits", isRestDay: false, exercises: [
    { name: "Burpee Devil Press", sets: 6, reps: 10, tips: "Add weight if possible", type: "cardio" },
    { name: "Squat Jump Tucks", sets: 6, reps: 15, tips: "Knees to chest", type: "cardio" },
    { name: "Mountain Climber Sprints", sets: 6, reps: "45 sec", tips: "Maximum speed", type: "cardio" },
    { name: "Plyo Push-Ups", sets: 5, reps: 15, tips: "Hands leave ground", type: "cardio" },
  ]},
  { day: 4, title: "Core Destruction", description: "Ultimate core workout", isRestDay: false, exercises: [
    { name: "Dragon Flags", sets: 5, reps: 10, tips: "Full range", type: "strength" },
    { name: "Hanging Leg Raises", sets: 5, reps: 12, tips: "Toes to bar", type: "strength" },
    { name: "Ab Wheel Rollouts", sets: 5, reps: 12, tips: "Full extension", type: "strength" },
    { name: "Plank Complex", sets: 3, reps: "60 sec each", tips: "Front, left, right, front", type: "strength" },
  ]},
  { day: 5, title: "Active Recovery", description: "Strategic recovery", isRestDay: true, exercises: [
    { name: "Mobility Work", duration: "40 min", tips: "Every joint", type: "flexibility" },
    { name: "Light Cardio", duration: "20 min", tips: "Heart rate 120-130", type: "cardio" },
  ]},
  { day: 6, title: "Full Body Circuit", description: "No rest challenge", isRestDay: false, exercises: [
    { name: "Burpees", sets: 1, reps: 20, tips: "Start the circuit", type: "cardio" },
    { name: "Push-Ups", sets: 1, reps: 30, tips: "No rest", type: "strength" },
    { name: "Squats", sets: 1, reps: 40, tips: "Keep moving", type: "strength" },
    { name: "Lunges", sets: 1, reps: "20 each leg", tips: "Continuous", type: "strength" },
    { name: "Plank", sets: 1, reps: "90 sec", tips: "Finish strong", type: "strength" },
  ]},
  { day: 7, title: "Complete Rest", description: "Full recovery", isRestDay: true, exercises: [
    { name: "Sleep & Nutrition", duration: "All day", tips: "Optimize recovery", type: "rest" },
  ]},
  { day: 8, title: "Upper Power", description: "Push your upper limits", isRestDay: false, exercises: [
    { name: "Handstand Push-Up Progression", sets: 5, reps: 10, tips: "Wall supported OK", type: "strength" },
    { name: "Muscle-Up Progression", sets: 5, reps: 8, tips: "Use band if needed", type: "strength" },
    { name: "Decline Clap Push-Ups", sets: 5, reps: 12, tips: "Feet elevated", type: "strength" },
    { name: "Tricep Extension (Bodyweight)", sets: 4, reps: 15, tips: "Control movement", type: "strength" },
  ]},
  { day: 9, title: "Lower Power", description: "Explosive legs", isRestDay: false, exercises: [
    { name: "Pistol Squats", sets: 5, reps: "10 each leg", tips: "Full depth", type: "strength" },
    { name: "Box Jump Max Height", sets: 6, reps: 8, tips: "Land softly", type: "strength" },
    { name: "Nordic Curl Progression", sets: 4, reps: 8, tips: "Hamstring power", type: "strength" },
    { name: "Calf Raise Explosions", sets: 5, reps: 20, tips: "Jump at top", type: "strength" },
  ]},
  { day: 10, title: "Cardio Crusher", description: "Maximum cardio output", isRestDay: false, exercises: [
    { name: "Sprint Intervals", sets: 12, reps: "30 sec sprint, 30 sec jog", tips: "No walking", type: "cardio" },
    { name: "Burpee Complex", sets: 5, reps: 15, tips: "Add variations", type: "cardio" },
    { name: "Mountain Climber Marathon", duration: "5 min continuous", tips: "Mental toughness", type: "cardio" },
  ]},
  { day: 11, title: "Skill Day", description: "Work on advanced moves", isRestDay: false, exercises: [
    { name: "Handstand Practice", duration: "20 min", tips: "Balance work", type: "strength" },
    { name: "L-Sit to V-Sit", sets: 5, reps: 10, tips: "Transition smoothly", type: "strength" },
    { name: "One Arm Push-Up Progression", sets: 5, reps: "8 each arm", tips: "Use progression", type: "strength" },
    { name: "Front Lever Progression", sets: 5, reps: "20 sec hold", tips: "Work your level", type: "strength" },
  ]},
  { day: 12, title: "Active Recovery", description: "Strategic recovery", isRestDay: true, exercises: [
    { name: "Yoga Flow", duration: "45 min", tips: "Advanced poses", type: "flexibility" },
    { name: "Foam Rolling", duration: "20 min", tips: "Deep tissue", type: "flexibility" },
  ]},
  { day: 13, title: "Total Body Blitz", description: "Everything in one session", isRestDay: false, exercises: [
    { name: "Muscle-Up Progression", sets: 4, reps: 8, tips: "Start strong", type: "strength" },
    { name: "Pistol Squats", sets: 4, reps: "10 each leg", tips: "Full depth", type: "strength" },
    { name: "Handstand Push-Ups", sets: 4, reps: 10, tips: "Control", type: "strength" },
    { name: "Dragon Flags", sets: 4, reps: 10, tips: "Core power", type: "strength" },
    { name: "Burpee Finisher", sets: 3, reps: 20, tips: "Everything left", type: "cardio" },
  ]},
  { day: 14, title: "Rest Day", description: "Mid-program recovery", isRestDay: true, exercises: [
    { name: "Complete Rest", duration: "All day", tips: "Mental and physical recovery", type: "rest" },
  ]},
  { day: 15, title: "Strength Test 1", description: "Benchmark your progress", isRestDay: false, exercises: [
    { name: "Max Push-Ups", sets: 1, reps: "3 min AMRAP", tips: "Beat your record", type: "strength" },
    { name: "Max Pistol Squats", sets: 1, reps: "AMRAP each leg", tips: "Count total", type: "strength" },
    { name: "Max Plank", sets: 1, reps: "Max time", tips: "Beat 3 minutes", type: "strength" },
  ]},
  { day: 16, title: "HIIT Massacre", description: "Ultimate HIIT", isRestDay: false, exercises: [
    { name: "Tabata Burpees", sets: 8, reps: "20 sec work, 10 sec rest", tips: "Classic Tabata", type: "cardio" },
    { name: "Tabata Jump Squats", sets: 8, reps: "20 sec work, 10 sec rest", tips: "Maximum reps", type: "cardio" },
    { name: "Tabata Mountain Climbers", sets: 8, reps: "20 sec work, 10 sec rest", tips: "Fast feet", type: "cardio" },
    { name: "Tabata Plyo Push-Ups", sets: 8, reps: "20 sec work, 10 sec rest", tips: "Finish strong", type: "cardio" },
  ]},
  { day: 17, title: "Push Mastery", description: "Advanced pushing", isRestDay: false, exercises: [
    { name: "One Arm Push-Up Progression", sets: 6, reps: "8 each arm", tips: "Work your level", type: "strength" },
    { name: "Handstand Push-Ups", sets: 6, reps: 12, tips: "Full range", type: "strength" },
    { name: "Planche Lean", sets: 6, reps: "30 sec", tips: "Lean forward", type: "strength" },
    { name: "Diamond Clap Push-Ups", sets: 5, reps: 12, tips: "Explosive", type: "strength" },
  ]},
  { day: 18, title: "Pull Mastery", description: "Advanced pulling", isRestDay: false, exercises: [
    { name: "Muscle-Ups", sets: 6, reps: 8, tips: "Clean reps", type: "strength" },
    { name: "Front Lever Progression", sets: 6, reps: "20 sec hold", tips: "Core tight", type: "strength" },
    { name: "Archer Rows", sets: 5, reps: "10 each side", tips: "Unilateral power", type: "strength" },
    { name: "L-Sit Holds", sets: 5, reps: "45 sec", tips: "Legs straight", type: "strength" },
  ]},
  { day: 19, title: "Active Recovery", description: "Strategic recovery", isRestDay: true, exercises: [
    { name: "Mobility Routine", duration: "45 min", tips: "Every muscle group", type: "flexibility" },
    { name: "Light Swimming/Walking", duration: "30 min", tips: "Low impact", type: "cardio" },
  ]},
  { day: 20, title: "Leg Mastery", description: "Advanced legs", isRestDay: false, exercises: [
    { name: "Shrimp Squats", sets: 5, reps: "10 each leg", tips: "Advanced pistol", type: "strength" },
    { name: "Nordic Curls", sets: 5, reps: 10, tips: "Full range", type: "strength" },
    { name: "Jump Squat Complex", sets: 5, reps: 20, tips: "Max height", type: "strength" },
    { name: "Single Leg Box Jumps", sets: 4, reps: "8 each leg", tips: "Land softly", type: "strength" },
  ]},
  { day: 21, title: "Complete Rest", description: "Prepare for final week", isRestDay: true, exercises: [
    { name: "Full Rest", duration: "All day", tips: "Final week preparation", type: "rest" },
  ]},
  { day: 22, title: "Week 4 - Total War", description: "Everything combined", isRestDay: false, exercises: [
    { name: "Muscle-Ups", sets: 5, reps: 10, tips: "Clean and controlled", type: "strength" },
    { name: "Handstand Push-Ups", sets: 5, reps: 12, tips: "Full depth", type: "strength" },
    { name: "Pistol Squats", sets: 5, reps: "12 each leg", tips: "No assistance", type: "strength" },
    { name: "Dragon Flags", sets: 5, reps: 12, tips: "Full range", type: "strength" },
    { name: "Burpee Muscle-Ups", sets: 3, reps: 8, tips: "Ultimate combo", type: "cardio" },
  ]},
  { day: 23, title: "Cardio Ultimate", description: "Peak cardio performance", isRestDay: false, exercises: [
    { name: "5K Run", duration: "Best time", tips: "Personal record attempt", type: "cardio" },
    { name: "Recovery Jog", duration: "10 min", tips: "Easy pace", type: "cardio" },
    { name: "Sprint Finisher", sets: 5, reps: "100m sprints", tips: "All out", type: "cardio" },
  ]},
  { day: 24, title: "Skill Showcase", description: "Advanced skills", isRestDay: false, exercises: [
    { name: "Free Handstand", sets: 1, reps: "Max time", tips: "No wall", type: "strength" },
    { name: "One Arm Push-Ups", sets: 1, reps: "Max each arm", tips: "Clean form", type: "strength" },
    { name: "Pistol Squat Complex", sets: 3, reps: "10 each leg + jump", tips: "Add jump at top", type: "strength" },
    { name: "Human Flag Practice", duration: "15 min", tips: "Work your level", type: "strength" },
  ]},
  { day: 25, title: "Endurance Challenge", description: "Mental and physical test", isRestDay: false, exercises: [
    { name: "100 Burpees", sets: 1, reps: "100 total", tips: "For time", type: "cardio" },
    { name: "200 Squats", sets: 1, reps: "200 total", tips: "Break as needed", type: "strength" },
    { name: "3 Min Plank", sets: 1, reps: "180 sec", tips: "Mental toughness", type: "strength" },
  ]},
  { day: 26, title: "Active Recovery", description: "Prepare for finals", isRestDay: true, exercises: [
    { name: "Light Yoga", duration: "40 min", tips: "Gentle stretches", type: "flexibility" },
    { name: "Walking", duration: "30 min", tips: "Easy pace", type: "cardio" },
  ]},
  { day: 27, title: "Final HIIT", description: "Ultimate HIIT session", isRestDay: false, exercises: [
    { name: "EMOM Burpees", sets: 20, reps: "10 per minute", tips: "Every minute on the minute", type: "cardio" },
    { name: "EMOM Push-Ups", sets: 10, reps: "15 per minute", tips: "Maximum effort", type: "strength" },
    { name: "EMOM Squats", sets: 10, reps: "20 per minute", tips: "Finish strong", type: "strength" },
  ]},
  { day: 28, title: "Rest Before Final", description: "Recovery day", isRestDay: true, exercises: [
    { name: "Complete Rest", duration: "All day", tips: "Prepare for final test", type: "rest" },
  ]},
  { day: 29, title: "Ultimate Fitness Test", description: "Prove your transformation", isRestDay: false, exercises: [
    { name: "Max Push-Ups (5 min)", sets: 1, reps: "AMRAP", tips: "Beat all records", type: "strength" },
    { name: "Max Squats (5 min)", sets: 1, reps: "AMRAP", tips: "Maximum effort", type: "strength" },
    { name: "Max Plank", sets: 1, reps: "Max time", tips: "Beat 5 minutes", type: "strength" },
    { name: "Max Burpees (5 min)", sets: 1, reps: "AMRAP", tips: "Everything left", type: "cardio" },
    { name: "2 Mile Run", duration: "Time yourself", tips: "Personal best", type: "cardio" },
  ]},
  { day: 30, title: "Champion!", description: "You've conquered the advanced program!", isRestDay: true, exercises: [
    { name: "Victory Celebration", duration: "Your choice", tips: "You're a champion!", type: "cardio" },
    { name: "Full Body Stretch", duration: "30 min", tips: "Well deserved", type: "flexibility" },
    { name: "Reflect & Plan Next", duration: "Take notes", tips: "What's next for you?", type: "rest" },
  ]},
];

export const workoutPlans: Record<string, WorkoutPlan> = {
  beginner: {
    level: 'beginner',
    name: 'Beginner Program',
    description: 'Perfect for those new to fitness. Build a solid foundation with fundamental movements.',
    days: beginnerPlan,
  },
  intermediate: {
    level: 'intermediate',
    name: 'Intermediate Program',
    description: 'Ready for more? Increase intensity and learn new challenging exercises.',
    days: intermediatePlan,
  },
  advanced: {
    level: 'advanced',
    name: 'Advanced Program',
    description: 'Elite level training. Master advanced calisthenics and push your limits.',
    days: advancedPlan,
  },
};
