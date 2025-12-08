import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { age, weight, height, goal, dietType, budget, meals = 3, prefs = "" } = await req.json();
    
    const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
    if (!GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is not configured");
    }

    const prompt = `
You are a helpful registered-dietitian style assistant. Produce a ${meals}-meal diet plan for ${goal} for a ${age}yr, ${height}cm, ${weight}kg person.
Diet type: ${dietType || "balanced"}. Budget: ${budget || "medium"}.
${prefs ? `Additional preferences: ${prefs}` : ''}
Respond in JSON exactly with keys: daily_calories, meals: [{name, time, ingredients, recipe, calories, protein_g}], shopping_list:[items].
Keep answers concise. Include a short "notes" field with helpful tips based on the goal.
`;

    console.log("Calling Groq API for diet plan:", { age, weight, height, goal, dietType, budget });

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "You are a professional dietitian. Always respond with valid JSON only, no markdown or extra text." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
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

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content ?? "";

    console.log("Groq response:", reply);

    // Try to parse JSON response
    try {
      // Clean the response - remove markdown code blocks if present
      let cleanReply = reply.trim();
      if (cleanReply.startsWith("```json")) {
        cleanReply = cleanReply.slice(7);
      } else if (cleanReply.startsWith("```")) {
        cleanReply = cleanReply.slice(3);
      }
      if (cleanReply.endsWith("```")) {
        cleanReply = cleanReply.slice(0, -3);
      }
      
      const plan = JSON.parse(cleanReply.trim());
      return new Response(JSON.stringify({ ok: true, plan }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      return new Response(JSON.stringify({ ok: true, raw: reply }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error("Error in diet-plan function:", error);
    return new Response(JSON.stringify({ 
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
