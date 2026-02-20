import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { image } = await req.json();
    if (!image) {
      return new Response(JSON.stringify({ error: "No image provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const systemPrompt = `You are a professional lookmaxxing & facial aesthetics analyst. Analyze the uploaded face photo and provide a detailed, honest, and constructive assessment.

Return ONLY valid JSON in this exact format (no markdown, no code fences):
{
  "overall_rating": <number 1-10, be honest but kind>,
  "category": "<one of: Below Average | Average | Above Average | Attractive | Very Attractive | Model Tier>",
  "breakdown": {
    "facial_symmetry": { "score": <1-10>, "notes": "<brief note>" },
    "jawline": { "score": <1-10>, "notes": "<brief note>" },
    "skin_quality": { "score": <1-10>, "notes": "<brief note>" },
    "eye_area": { "score": <1-10>, "notes": "<brief note>" },
    "hair": { "score": <1-10>, "notes": "<brief note>" },
    "overall_harmony": { "score": <1-10>, "notes": "<brief note>" }
  },
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "improvement_tips": [
    { "area": "<area name>", "tip": "<actionable specific advice>", "impact": "<high|medium|low>", "timeframe": "<e.g. 2-4 weeks, 3-6 months>" },
    { "area": "<area name>", "tip": "<actionable specific advice>", "impact": "<high|medium|low>", "timeframe": "<e.g. 2-4 weeks, 3-6 months>" },
    { "area": "<area name>", "tip": "<actionable specific advice>", "impact": "<high|medium|low>", "timeframe": "<e.g. 2-4 weeks, 3-6 months>" },
    { "area": "<area name>", "tip": "<actionable specific advice>", "impact": "<high|medium|low>", "timeframe": "<e.g. 2-4 weeks, 3-6 months>" },
    { "area": "<area name>", "tip": "<actionable specific advice>", "impact": "<high|medium|low>", "timeframe": "<e.g. 2-4 weeks, 3-6 months>" }
  ],
  "mewing_advice": "<specific mewing/posture advice>",
  "style_recommendation": "<grooming and style tips>"
}

Be specific with tips - reference skincare routines, exercises, grooming habits, mewing, posture. Be encouraging but honest. Focus on actionable improvements.`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: systemPrompt },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Analyze this face photo for lookmaxxing. Be detailed and actionable.",
                },
                {
                  type: "image_url",
                  image_url: { url: image },
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limited. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits depleted. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      throw new Error("AI analysis failed");
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content || "";
    
    // Strip markdown fences
    content = content.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim();

    try {
      const analysis = JSON.parse(content);
      return new Response(JSON.stringify({ analysis }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch {
      console.error("Failed to parse AI response:", content);
      return new Response(
        JSON.stringify({ error: "Failed to parse analysis. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (e) {
    console.error("lookmaxx error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
