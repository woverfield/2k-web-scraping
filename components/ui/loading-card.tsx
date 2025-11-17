"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { shimmer } from "@/lib/animations";

export interface LoadingCardProps {
  variant?: "player" | "team" | "stat" | "detail";
  className?: string;
}

export function LoadingCard({
  variant = "player",
  className,
}: LoadingCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-4">
        {variant === "player" && <PlayerCardSkeleton />}
        {variant === "team" && <TeamCardSkeleton />}
        {variant === "stat" && <StatCardSkeleton />}
        {variant === "detail" && <DetailCardSkeleton />}
      </CardContent>
    </Card>
  );
}

function PlayerCardSkeleton() {
  return (
    <div className="space-y-3">
      {/* Header with image and rating */}
      <div className="flex items-start gap-3">
        <Skeleton className="h-16 w-16 rounded-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-8 w-12 rounded-md" />
      </div>

      {/* Attributes */}
      <div className="space-y-2">
        <AttributeBarSkeleton />
        <AttributeBarSkeleton />
        <AttributeBarSkeleton />
      </div>
    </div>
  );
}

function TeamCardSkeleton() {
  return (
    <div className="space-y-3">
      {/* Team header */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>

      {/* Team stats */}
      <div className="grid grid-cols-3 gap-2">
        <Skeleton className="h-16" />
        <Skeleton className="h-16" />
        <Skeleton className="h-16" />
      </div>
    </div>
  );
}

function StatCardSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-3 w-32" />
    </div>
  );
}

function DetailCardSkeleton() {
  return (
    <div className="space-y-4">
      {/* Header section */}
      <div className="flex items-start gap-4">
        <Skeleton className="h-24 w-24 rounded-lg" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-5 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-16" />
          </div>
        </div>
      </div>

      {/* Content sections */}
      <div className="space-y-3">
        <Skeleton className="h-5 w-40" />
        <div className="space-y-2">
          <AttributeBarSkeleton />
          <AttributeBarSkeleton />
          <AttributeBarSkeleton />
          <AttributeBarSkeleton />
          <AttributeBarSkeleton />
        </div>
      </div>
    </div>
  );
}

function AttributeBarSkeleton() {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-8" />
      </div>
      <Skeleton className="h-1.5 w-full rounded-full" />
    </div>
  );
}

/**
 * Shimmer Loading Container
 * Wraps content with animated shimmer effect
 */
export function ShimmerLoading({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-lg bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%]",
        className
      )}
      variants={shimmer}
      initial="initial"
      animate="animate"
    >
      {children}
    </motion.div>
  );
}
