import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { image } = await req.json();
    
    if (!image) {
      return new Response(JSON.stringify({ error: "No image provided" }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "You are a nutrition expert. Analyze food images and return nutritional information. Always respond with valid JSON only, no markdown."
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: 'Analyze this food image. Return JSON with these exact keys: food_name (string), calories (number), protein_g (number), carbs_g (number), fat_g (number), fiber_g (number), serving_size (string describing visible portion), confidence (string: "high", "medium", or "low"), tips (string with a brief health tip about this food). Be accurate with calorie estimates based on visible portion size.'
              },
              {
                type: "image_url",
                image_url: { url: image }
              }
            ]
          }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content ?? "";

    // Parse JSON
    let cleanReply = reply.trim();
    if (cleanReply.startsWith("```json")) cleanReply = cleanReply.slice(7);
    else if (cleanReply.startsWith("```")) cleanReply = cleanReply.slice(3);
    if (cleanReply.endsWith("```")) cleanReply = cleanReply.slice(0, -3);

    try {
      const nutrition = JSON.parse(cleanReply.trim());
      return new Response(JSON.stringify({ nutrition }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch {
      console.error("Failed to parse nutrition JSON:", cleanReply);
      return new Response(JSON.stringify({ error: "Could not parse food analysis. Try a clearer photo." }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error("Food scanner error:", error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : "Unknown error",
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
