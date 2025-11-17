"use client";

import * as React from "react";
import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  fadeIn,
  slideUp,
  staggerContainer,
  staggerItem,
} from "@/lib/animations";

export interface AnimatedContainerProps {
  children: React.ReactNode;
  variant?: "fade" | "slide" | "stagger";
  className?: string;
  delay?: number;
  /**
   * When true, renders motion.div for stagger children
   * When false (default), renders regular div
   */
  asChild?: boolean;
}

/**
 * Animated Container Component
 * Wraps content with entrance animations following PRD performance standards
 *
 * Variants:
 * - fade: Simple opacity fade-in (300ms)
 * - slide: Slide up with fade (300ms)
 * - stagger: Container for staggered children animations (50ms between children)
 *
 * Usage:
 * ```tsx
 * <AnimatedContainer variant="slide">
 *   <h1>Content</h1>
 * </AnimatedContainer>
 *
 * // For staggered children:
 * <AnimatedContainer variant="stagger">
 *   <AnimatedItem>Child 1</AnimatedItem>
 *   <AnimatedItem>Child 2</AnimatedItem>
 * </AnimatedContainer>
 * ```
 */
export function AnimatedContainer({
  children,
  variant = "fade",
  className,
  delay = 0,
  asChild = false,
}: AnimatedContainerProps) {
  const variants: Variants = React.useMemo(() => {
    switch (variant) {
      case "slide":
        return slideUp;
      case "stagger":
        return staggerContainer;
      case "fade":
      default:
        return fadeIn;
    }
  }, [variant]);

  const transition = React.useMemo(
    () => ({
      delay,
    }),
    [delay]
  );

  if (asChild) {
    return <>{children}</>;
  }

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={transition}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

/**
 * Animated Item Component
 * Child component for staggered animations
 * Must be used within AnimatedContainer with variant="stagger"
 */
export function AnimatedItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={staggerItem} className={cn(className)}>
      {children}
    </motion.div>
  );
}

/**
 * Animated List Component
 * Convenience wrapper for lists with staggered children
 *
 * Usage:
 * ```tsx
 * <AnimatedList>
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 *   <div>Item 3</div>
 * </AnimatedList>
 * ```
 */
export function AnimatedList({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <AnimatedContainer variant="stagger" className={className}>
      {React.Children.map(children, (child) => (
        <AnimatedItem>{child}</AnimatedItem>
      ))}
    </AnimatedContainer>
  );
}
