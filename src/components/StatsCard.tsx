import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  suffix?: string;
  variant?: 'default' | 'primary' | 'accent';
  className?: string;
}

export function StatsCard({ 
  icon: Icon, 
  label, 
  value, 
  suffix,
  variant = 'default',
  className 
}: StatsCardProps) {
  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-2xl p-5 shadow-card transition-all duration-300 hover:shadow-soft hover:-translate-y-1",
        variant === 'default' && "bg-card",
        variant === 'primary' && "gradient-primary text-primary-foreground",
        variant === 'accent' && "gradient-accent text-accent-foreground",
        className
      )}
    >
      <div className={cn(
        "inline-flex items-center justify-center w-10 h-10 rounded-xl mb-3",
        variant === 'default' && "bg-secondary",
        variant !== 'default' && "bg-white/20"
      )}>
        <Icon className={cn(
          "w-5 h-5",
          variant === 'default' && "text-primary"
        )} />
      </div>
      <p className={cn(
        "text-sm font-medium mb-1",
        variant === 'default' && "text-muted-foreground"
      )}>
        {label}
      </p>
      <p className="text-2xl font-bold">
        {value}
        {suffix && <span className="text-lg font-medium ml-1">{suffix}</span>}
      </p>
    </div>
  );
}
