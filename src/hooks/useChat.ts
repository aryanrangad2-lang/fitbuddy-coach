import { useState, useCallback } from "react";
import { Message, Workout, UserProfile } from "@/types/workout";
import { useToast } from "@/hooks/use-toast";

const generateId = () => Math.random().toString(36).substring(7);

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/fitness-coach`;

export function useChat(profile: UserProfile, workouts: Workout[]) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    let assistantContent = "";

    const updateAssistantMessage = (chunk: string) => {
      assistantContent += chunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === 'assistant') {
          return prev.map((m, i) => 
            i === prev.length - 1 
              ? { ...m, content: assistantContent } 
              : m
          );
        }
        return [...prev, {
          id: generateId(),
          role: 'assistant' as const,
          content: assistantContent,
          timestamp: new Date(),
        }];
      });
    };

    try {
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          message: content,
          userProfile: profile,
          workoutHistory: workouts.slice(0, 10), // Send last 10 workouts for context
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 429) {
          toast({
            title: "Slow down! 😅",
            description: "Too many requests. Wait a moment and try again.",
            variant: "destructive",
          });
          throw new Error("Rate limited");
        }
        if (response.status === 402) {
          toast({
            title: "Credits needed",
            description: "AI credits depleted. Add credits to continue chatting.",
            variant: "destructive",
          });
          throw new Error("Credits depleted");
        }
        throw new Error(errorData.error || "Failed to get response");
      }

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Process SSE lines
        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const deltaContent = parsed.choices?.[0]?.delta?.content;
            if (deltaContent) {
              updateAssistantMessage(deltaContent);
            }
          } catch {
            // Incomplete JSON, will be handled in next chunk
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }

      // Handle any remaining buffer content
      if (buffer.trim()) {
        for (const raw of buffer.split("\n")) {
          if (!raw || raw.startsWith(":") || !raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const deltaContent = parsed.choices?.[0]?.delta?.content;
            if (deltaContent) updateAssistantMessage(deltaContent);
          } catch { /* ignore partial leftovers */ }
        }
      }

    } catch (error) {
      console.error("Chat error:", error);
      
      // Add a fallback message if we didn't get any AI response
      if (!assistantContent) {
        setMessages(prev => [...prev, {
          id: generateId(),
          role: 'assistant',
          content: `Hey ${profile.name}! I'm having a quick technical hiccup, but I'm still here for you! 💪 Try asking again in a moment.`,
          timestamp: new Date(),
        }]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [profile, workouts, toast]);

  return { messages, sendMessage, isLoading };
}
