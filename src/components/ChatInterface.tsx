import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Message, Workout } from "@/types/workout";
import { ChatBubble } from "./ChatBubble";
import { Send, Sparkles } from "lucide-react";

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  isLoading?: boolean;
}

export function ChatInterface({ messages, onSendMessage, isLoading }: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const quickPrompts = [
    "Give me a quick workout",
    "How am I doing?",
    "Motivate me!",
  ];

return (
    <div className="flex flex-col h-full min-h-0 bg-secondary/50 rounded-3xl overflow-hidden">
      {/* Header */}
      <div className="p-4 gradient-primary text-primary-foreground">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold">FitBuddy</h3>
            <p className="text-sm text-primary-foreground/80">Your AI fitness coach</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6">
            <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mb-4 animate-float">
              <Sparkles className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Hey there, champion! 💪
            </h3>
            <p className="text-muted-foreground text-sm mb-6">
              I'm FitBuddy, your personal fitness coach. Ask me anything about workouts, motivation, or your progress!
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => onSendMessage(prompt)}
                  className="px-4 py-2 rounded-full bg-card shadow-card text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <ChatBubble key={message.id} message={message} />
          ))
        )}
        
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground animate-pulse-soft" />
            </div>
            <div className="bg-card shadow-card rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 bg-card border-t border-border">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your coach..."
            className="flex-1 bg-secondary border-0 rounded-xl h-12"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            variant="gradient" 
            size="icon" 
            className="h-12 w-12 rounded-xl"
            disabled={!input.trim() || isLoading}
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </form>
    </div>
  );
}
