import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are FitBuddy, a friendly and supportive AI fitness coach.

Your goals:
1. Motivate the user every day with personalized, uplifting messages.
2. Give advice tailored to their goals, mood, and progress.
3. Praise effort, celebrate small wins, reduce negative self-talk.
4. Encourage consistency without guilt or aggression.

Guidelines:
- Always be warm, human-like, and encouraging.
- Use the user's name and workout history to personalize responses.
- Keep messages short (2-4 sentences) unless asked for more detail.
- Offer 1 actionable tip in each motivational message.
- If the user hasn't exercised in a while, gently guide them back without shaming.
- Never judge or shame. Always inspire.
- Use emojis sparingly but effectively (1-2 per message).
- For workout suggestions, give specific, actionable routines with sets/reps.

IMPORTANT: You have access to the user's workout history in the context. Reference it to make your responses personal and relevant.`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userProfile, workoutHistory } = await req.json();
    
    const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
    if (!GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is not configured");
    }

    // Build context from workout history
    const workoutContext = workoutHistory && workoutHistory.length > 0 
      ? `\n\nUser's Recent Workout History:\n${workoutHistory.map((w: any) => 
          `- ${w.type} for ${w.duration} min (${w.intensity} intensity)${w.calories ? `, ${w.calories} kcal` : ''} - ${new Date(w.date).toLocaleDateString()}`
        ).join('\n')}`
      : '\n\nThe user has not logged any workouts yet.';

    const profileContext = userProfile 
      ? `\n\nUser Profile:\n- Name: ${userProfile.name}\n- Current streak: ${userProfile.streak} days\n- Total workouts: ${userProfile.totalWorkouts}\n- Total active minutes: ${userProfile.totalMinutes}`
      : '';

    console.log("Calling Groq API with message:", message);
    console.log("Context:", profileContext + workoutContext);

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { 
            role: "system", 
            content: SYSTEM_PROMPT + profileContext + workoutContext 
          },
          { role: "user", content: message }
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq API error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`Groq API error: ${response.status}`);
    }

    // Stream the response back
    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });

  } catch (error) {
    console.error("Error in fitness-coach function:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
