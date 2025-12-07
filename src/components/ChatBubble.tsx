import { Message } from "@/types/workout";
import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";
import { format } from "date-fns";

interface ChatBubbleProps {
  message: Message;
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isAssistant = message.role === 'assistant';
  
  return (
    <div 
      className={cn(
        "flex gap-3 animate-slide-up",
        !isAssistant && "flex-row-reverse"
      )}
    >
      <div className={cn(
        "flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center",
        isAssistant ? "gradient-primary" : "bg-secondary"
      )}>
        {isAssistant ? (
          <Bot className="w-5 h-5 text-primary-foreground" />
        ) : (
          <User className="w-5 h-5 text-muted-foreground" />
        )}
      </div>
      
      <div className={cn(
        "max-w-[80%] rounded-2xl px-4 py-3",
        isAssistant 
          ? "bg-card shadow-card rounded-tl-sm" 
          : "gradient-primary text-primary-foreground rounded-tr-sm"
      )}>
        <p className={cn(
          "text-sm leading-relaxed",
          !isAssistant && "text-primary-foreground"
        )}>
          {message.content}
        </p>
        <p className={cn(
          "text-xs mt-1.5",
          isAssistant ? "text-muted-foreground" : "text-primary-foreground/70"
        )}>
          {format(message.timestamp, 'h:mm a')}
        </p>
      </div>
    </div>
  );
}
