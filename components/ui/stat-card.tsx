"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { liftOnHover } from "@/lib/animations";
import type { LucideIcon } from "lucide-react";

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  className?: string;
  valueClassName?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  className,
  valueClassName,
}: StatCardProps) {
  return (
    <motion.div
      variants={liftOnHover}
      initial="initial"
      whileHover="hover"
      className={cn("group", className)}
    >
      <Card className="h-full transition-shadow duration-200 hover:shadow-md">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                {title}
              </p>
              <p
                className={cn(
                  "text-2xl font-bold tabular-nums",
                  valueClassName
                )}
              >
                {value}
              </p>
              {subtitle && (
                <p className="text-xs text-muted-foreground">{subtitle}</p>
              )}
            </div>
            {Icon && (
              <div className="rounded-lg bg-primary/10 p-2 text-primary transition-colors group-hover:bg-primary/20">
                <Icon className="h-4 w-4" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
