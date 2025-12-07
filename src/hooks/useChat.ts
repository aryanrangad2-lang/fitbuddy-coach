import { useState, useCallback } from "react";
import { Message, Workout, UserProfile } from "@/types/workout";

const generateId = () => Math.random().toString(36).substring(7);

const getMotivationalResponse = (
  input: string, 
  profile: UserProfile, 
  workouts: Workout[]
): string => {
  const lowerInput = input.toLowerCase();
  const recentWorkout = workouts[0];
  const totalThisWeek = workouts.filter(w => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return w.date >= weekAgo;
  }).length;

  // Motivational responses
  if (lowerInput.includes('motivate') || lowerInput.includes('motivation')) {
    const motivations = [
      `${profile.name}, you've got this! Remember, every rep counts, every step matters. You're ${profile.streak} days into your streak – that's incredible dedication! 🔥`,
      `Hey ${profile.name}! The only bad workout is the one that didn't happen. You've already crushed ${profile.totalWorkouts} workouts – what's one more? Let's go! 💪`,
      `${profile.name}, your future self is cheering you on right now. ${totalThisWeek} workouts this week already – you're building something amazing!`,
    ];
    return motivations[Math.floor(Math.random() * motivations.length)];
  }

  // Progress check
  if (lowerInput.includes('how am i') || lowerInput.includes('progress') || lowerInput.includes('doing')) {
    if (profile.totalWorkouts === 0) {
      return `Hey ${profile.name}! Looks like you're just getting started – and that's the best part! Every champion was once a beginner. Ready to log your first workout? 🌟`;
    }
    return `${profile.name}, you're doing amazing! 🎉\n\n📊 Your Stats:\n• ${profile.streak} day streak (keep it going!)\n• ${profile.totalWorkouts} total workouts\n• ${profile.totalMinutes} minutes of pure dedication\n\nYou've worked out ${totalThisWeek} times this week. ${totalThisWeek >= 3 ? "You're crushing it!" : "Let's aim for 3+ this week!"} What's your next move?`;
  }

  // Quick workout request
  if (lowerInput.includes('quick workout') || lowerInput.includes('short workout')) {
    const quickWorkouts = [
      "Here's a quick 15-min burner for you:\n\n🔥 Quick HIIT Circuit:\n• 30 sec jumping jacks\n• 30 sec squats\n• 30 sec push-ups\n• 30 sec rest\n\nRepeat 4 times! You'll feel amazing after. 💪",
      "Got 10 minutes? Try this:\n\n⚡ Express Cardio:\n• 1 min high knees\n• 1 min burpees\n• 1 min mountain climbers\n• 30 sec rest\n\nRepeat twice! Short but powerful – just like you! 🚀",
      "Perfect! Here's a quick strength circuit:\n\n💪 5-Minute Power:\n• 15 squats\n• 10 push-ups\n• 20 lunges\n• 30 sec plank\n\nNo rest between exercises! You've got this, ${profile.name}! 🔥",
    ];
    return quickWorkouts[Math.floor(Math.random() * quickWorkouts.length)];
  }

  // Haven't exercised
  if (lowerInput.includes("haven't") || lowerInput.includes('been lazy') || lowerInput.includes('skip')) {
    return `Hey ${profile.name}, no guilt here – life happens! 🤗 The important thing is you're thinking about it now. That shows you care about your health.\n\nHow about we start small? Even a 10-minute walk counts. What sounds doable for you today?`;
  }

  // Default encouraging response
  const defaults = [
    `Great to hear from you, ${profile.name}! What can I help you with today? Whether it's a workout suggestion, motivation, or checking your progress – I'm here for you! 💪`,
    `Hey ${profile.name}! Ready to make today count? Tell me what's on your mind – need a workout idea, some motivation, or just want to chat about your fitness journey? 🌟`,
    `${profile.name}! Every conversation is a step toward your goals. What would help you most right now – a quick workout, some motivation, or a progress check? 🎯`,
  ];
  return defaults[Math.floor(Math.random() * defaults.length)];
};

export function useChat(profile: UserProfile, workouts: Workout[]) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback((content: string) => {
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI response delay
    setTimeout(() => {
      const response = getMotivationalResponse(content, profile, workouts);
      
      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 800 + Math.random() * 700);
  }, [profile, workouts]);

  return { messages, sendMessage, isLoading };
}
