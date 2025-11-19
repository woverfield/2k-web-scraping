"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getRatingClasses } from "@/lib/rating-colors";
import { User } from "lucide-react";

export interface PlayerCardProps {
  player: {
    _id?: string;
    name: string;
    slug?: string;
    team: string;
    teamType?: string;
    overall: number;
    positions?: string[];
    playerImage?: string;
  };
  href?: string;
  animate?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function PlayerCard({
  player,
  href,
  animate = false,
  className,
  size = "md",
}: PlayerCardProps) {
  const sizeClasses = {
    sm: {
      card: "p-3",
      image: "h-16 w-16",
      name: "text-sm",
      team: "text-xs",
      rating: "text-lg",
      badge: "text-xs",
    },
    md: {
      card: "p-4",
      image: "h-20 w-20",
      name: "text-base font-semibold",
      team: "text-sm",
      rating: "text-xl",
      badge: "text-xs",
    },
    lg: {
      card: "p-5",
      image: "h-24 w-24",
      name: "text-lg font-semibold",
      team: "text-sm",
      rating: "text-2xl",
      badge: "text-xs",
    },
  };

  const styles = sizeClasses[size];

  const cardContent = (
    <Card
      className={cn(
        "h-full transition-all hover:shadow-lg hover:border-primary/50",
        href && "cursor-pointer",
        className
      )}
    >
      <CardContent className={styles.card}>
        <div className="flex items-start gap-3">
          {/* Player Image */}
          <div
            className={cn(
              "relative shrink-0 rounded-lg overflow-hidden bg-muted",
              styles.image
            )}
          >
            {player.playerImage ? (
              <Image
                src={player.playerImage}
                alt={player.name}
                fill
                sizes={size === "lg" ? "96px" : size === "md" ? "80px" : "64px"}
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <User
                  className={cn(
                    "text-muted-foreground",
                    size === "lg" ? "h-14 w-14" : size === "md" ? "h-12 w-12" : "h-10 w-10"
                  )}
                />
              </div>
            )}
          </div>

          {/* Player Info */}
          <div className="flex-1 min-w-0">
            <p className={cn("truncate", styles.name)}>{player.name}</p>
            <p className={cn("text-muted-foreground truncate", styles.team)}>
              {player.team}
            </p>

            {/* Positions */}
            {player.positions && player.positions.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {player.positions.slice(0, 2).map((pos, idx) => (
                  <Badge
                    key={`${pos}-${idx}`}
                    variant="secondary"
                    className={styles.badge}
                  >
                    {pos}
                  </Badge>
                ))}
              </div>
            )}

            {/* Overall Rating */}
            <div className="mt-2">
              <div
                className={cn(
                  "inline-flex items-center gap-1 px-2 py-0.5 rounded-sm",
                  getRatingClasses(player.overall).bg,
                  getRatingClasses(player.overall).shadow
                )}
              >
                <span
                  className={cn(
                    "font-bold tabular-nums text-white",
                    styles.rating
                  )}
                >
                  {player.overall}
                </span>
              </div>
              <span className="text-xs text-muted-foreground ml-2">OVR</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Wrap with animation if needed
  const content = animate ? (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {cardContent}
    </motion.div>
  ) : (
    cardContent
  );

  // Wrap with link if href provided
  if (href) {
    return (
      <Link href={href} prefetch={true}>
        {content}
      </Link>
    );
  }

  return content;
}

// Animated version for popover effect
export function AnimatedPlayerCard({
  player,
  onAnimationComplete,
  className,
}: PlayerCardProps & { onAnimationComplete?: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -10 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
      }}
      onAnimationComplete={onAnimationComplete}
      className={className}
    >
      <PlayerCard player={player} size="lg" />
    </motion.div>
  );
}
