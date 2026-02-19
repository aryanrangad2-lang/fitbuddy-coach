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
  const isPrimary = variant === 'primary' || variant === 'accent';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 24, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.07,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={{ 
        y: -5, 
        scale: 1.03,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        "relative overflow-hidden rounded-2xl p-4 cursor-pointer group",
        isPrimary
          ? "gradient-primary shadow-soft"
          : "bg-card border border-border/40 shadow-card hover:neon-border",
        className
      )}
    >
      {/* Background glow for default */}
      {!isPrimary && (
        <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-primary/5 blur-xl group-hover:bg-primary/15 transition-colors duration-500" />
      )}

      {/* Icon */}
      <motion.div 
        className={cn(
          "inline-flex items-center justify-center w-9 h-9 rounded-xl mb-3",
          isPrimary ? "bg-black/20" : "bg-primary/10"
        )}
        whileHover={{ rotate: [0, -8, 8, 0] }}
        transition={{ duration: 0.35 }}
      >
        <Icon className={cn(
          "w-4.5 h-4.5",
          isPrimary ? "text-primary-foreground" : "text-primary"
        )} style={{ width: '18px', height: '18px' }} />
      </motion.div>

      <p className={cn(
        "text-xs font-medium mb-1 uppercase tracking-wider",
        isPrimary ? "text-primary-foreground/70" : "text-muted-foreground"
      )}>
        {label}
      </p>
      <motion.p 
        className={cn(
          "text-2xl font-black leading-none",
          isPrimary ? "text-primary-foreground" : "text-foreground"
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 + index * 0.07 }}
      >
        {value}
        {suffix && (
          <span className={cn(
            "text-sm font-semibold ml-1",
            isPrimary ? "text-primary-foreground/70" : "text-muted-foreground"
          )}>
            {suffix}
          </span>
        )}
      </motion.p>
    </motion.div>
  );
}
