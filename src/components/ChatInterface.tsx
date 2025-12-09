import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Message } from "@/types/workout";
import { ChatBubble } from "./ChatBubble";
import { Send, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
    <div className="flex flex-col h-full min-h-0 bg-secondary/50 rounded-3xl overflow-hidden border border-border/50">
      {/* Header */}
      <motion.div 
        className="p-4 gradient-primary text-primary-foreground"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-3">
          <motion.div 
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Sparkles className="w-5 h-5" />
          </motion.div>
          <div>
            <h3 className="font-semibold">FitBuddy</h3>
            <p className="text-sm text-primary-foreground/80">Your AI fitness coach</p>
          </div>
        </div>
      </motion.div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0"
      >
        <AnimatePresence mode="popLayout">
          {messages.length === 0 ? (
            <motion.div 
              key="empty"
              className="h-full flex flex-col items-center justify-center text-center p-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mb-4"
                animate={{ 
                  y: [0, -8, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Sparkles className="w-8 h-8 text-primary-foreground" />
              </motion.div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Hey there, champion! 💪
              </h3>
              <p className="text-muted-foreground text-sm mb-6">
                I'm FitBuddy, your personal fitness coach. Ask me anything about workouts, motivation, or your progress!
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {quickPrompts.map((prompt, index) => (
                  <motion.button
                    key={prompt}
                    onClick={() => onSendMessage(prompt)}
                    className="px-4 py-2 rounded-full bg-card shadow-card text-sm font-medium text-foreground hover:bg-muted transition-colors border border-border/50"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {prompt}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.3,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
              >
                <ChatBubble message={message} />
              </motion.div>
            ))
          )}
        </AnimatePresence>
        
        <AnimatePresence>
          {isLoading && (
            <motion.div 
              className="flex gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-5 h-5 text-primary-foreground" />
                </motion.div>
              </div>
              <div className="bg-card shadow-card rounded-2xl rounded-tl-sm px-4 py-3 border border-border/50">
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="w-2 h-2 rounded-full bg-primary"
                      animate={{ 
                        y: [0, -6, 0],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{ 
                        duration: 0.6, 
                        repeat: Infinity,
                        delay: i * 0.15
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <motion.form 
        onSubmit={handleSubmit} 
        className="p-4 bg-card border-t border-border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your coach..."
            className="flex-1 bg-secondary border-0 rounded-xl h-12"
            disabled={isLoading}
          />
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              type="submit" 
              variant="gradient" 
              size="icon" 
              className="h-12 w-12 rounded-xl"
              disabled={!input.trim() || isLoading}
            >
              <Send className="w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </motion.form>
    </div>
  );
}