import { Message } from "@/types/workout";
import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

interface ChatBubbleProps {
  message: Message;
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isAssistant = message.role === 'assistant';
  
  return (
    <motion.div 
      className={cn(
        "flex gap-3",
        !isAssistant && "flex-row-reverse"
      )}
      initial={{ 
        opacity: 0, 
        x: isAssistant ? -20 : 20,
        y: 10
      }}
      animate={{ 
        opacity: 1, 
        x: 0,
        y: 0
      }}
      transition={{ 
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
    >
      <motion.div 
        className={cn(
          "flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center",
          isAssistant ? "gradient-primary" : "bg-secondary border border-border/50"
        )}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
      >
        {isAssistant ? (
          <Bot className="w-5 h-5 text-primary-foreground" />
        ) : (
          <User className="w-5 h-5 text-muted-foreground" />
        )}
      </motion.div>
      
      <motion.div 
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3",
          isAssistant 
            ? "bg-card shadow-card rounded-tl-sm border border-border/50" 
            : "gradient-primary text-primary-foreground rounded-tr-sm shadow-soft"
        )}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.05, duration: 0.2 }}
      >
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
      </motion.div>
    </motion.div>
  );
}