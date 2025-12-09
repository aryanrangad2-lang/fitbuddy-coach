import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  suffix?: string;
  variant?: 'default' | 'primary' | 'accent';
  className?: string;
  index?: number;
}

export function StatsCard({ 
  icon: Icon, 
  label, 
  value, 
  suffix,
  variant = 'default',
  className,
  index = 0
}: StatsCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.35, 
        delay: index * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={{ 
        y: -4, 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative overflow-hidden rounded-2xl p-5 shadow-card cursor-pointer",
        variant === 'default' && "bg-card border border-border/50",
        variant === 'primary' && "gradient-primary text-primary-foreground",
        variant === 'accent' && "gradient-accent text-accent-foreground",
        className
      )}
    >
      <motion.div 
        className={cn(
          "inline-flex items-center justify-center w-10 h-10 rounded-xl mb-3",
          variant === 'default' && "bg-secondary",
          variant !== 'default' && "bg-white/20"
        )}
        whileHover={{ rotate: [0, -10, 10, 0] }}
        transition={{ duration: 0.4 }}
      >
        <Icon className={cn(
          "w-5 h-5",
          variant === 'default' && "text-primary"
        )} />
      </motion.div>
      <p className={cn(
        "text-sm font-medium mb-1",
        variant === 'default' && "text-muted-foreground"
      )}>
        {label}
      </p>
      <motion.p 
        className="text-2xl font-bold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 + index * 0.08 }}
      >
        {value}
        {suffix && <span className="text-lg font-medium ml-1">{suffix}</span>}
      </motion.p>
    </motion.div>
  );
}