import * as React from "react"
import { cn } from "@/lib/utils"

interface GameCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  variant?: "default" | "glass" | "hollow"
  noPadding?: boolean
  showCorners?: boolean
  hoverEffect?: boolean
}

export function GameCard({ 
  className, 
  variant = "default", 
  noPadding = false,
  showCorners = true,
  hoverEffect = true,
  children, 
  ...props 
}: GameCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-white/10 transition-all duration-300 group",
        // Variants
        variant === "default" && "bg-white/70 dark:bg-card/60 backdrop-blur-md shadow-lg dark:shadow-none",
        variant === "glass" && "bg-white/40 dark:bg-white/5 backdrop-blur-xl border-white/20",
        variant === "hollow" && "bg-transparent border-dashed border-border/40",
        
        // Hover Effects
        hoverEffect && "hover:border-primary/50 hover:shadow-[0_0_25px_-10px_var(--color-primary)]",
        
        className
      )}
      {...props}
    >
      {/* Background Gradient Shine */}
      {hoverEffect && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      )}
      
      {/* Content */}
      <div className={cn("relative z-10", !noPadding && "p-6")}>
        {children}
      </div>
      
      {/* Decorative Tech Accents - Subtle & Refined */}
      {showCorners && (
        <div className="pointer-events-none absolute inset-0 z-50 rounded-xl">
          <div className="absolute top-0 left-0 h-4 w-4 rounded-tl-xl border-l-2 border-t-2 border-primary/30 transition-colors group-hover:border-primary/80" />
          <div className="absolute top-0 right-0 h-4 w-4 rounded-tr-xl border-r-2 border-t-2 border-primary/30 transition-colors group-hover:border-primary/80" />
          <div className="absolute bottom-0 left-0 h-4 w-4 rounded-bl-xl border-b-2 border-l-2 border-primary/30 transition-colors group-hover:border-primary/80" />
          <div className="absolute bottom-0 right-0 h-4 w-4 rounded-br-xl border-b-2 border-r-2 border-primary/30 transition-colors group-hover:border-primary/80" />
        </div>
      )}
    </div>
  )
}

