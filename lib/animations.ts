import type { Variants } from "framer-motion";

/**
 * Animation Constants
 * Following PRD principles: 60fps, ease-out/spring, < 100ms interactions
 */

export const ANIMATION_DURATION = {
  INSTANT: 0.1, // 100ms - for instant interactions
  QUICK: 0.15, // 150ms - color transitions
  NORMAL: 0.2, // 200ms - hover states
  SLOW: 0.3, // 300ms - page transitions, fades
} as const;

export const EASING = {
  EASE_OUT: [0.16, 1, 0.3, 1], // Smooth ease-out
  SPRING: {
    type: "spring" as const,
    stiffness: 300,
    damping: 25,
  },
} as const;

/**
 * Fade In Animation
 * Used for page/section reveals
 */
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: ANIMATION_DURATION.SLOW,
      ease: EASING.EASE_OUT,
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: ANIMATION_DURATION.QUICK },
  },
};

/**
 * Slide Up Animation
 * Used for content sections
 */
export const slideUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: ANIMATION_DURATION.SLOW,
      ease: EASING.EASE_OUT,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: ANIMATION_DURATION.QUICK },
  },
};

/**
 * Stagger Container
 * Used for lists and grids with staggered children animations
 */
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05, // 50ms delay between children
    },
  },
};

/**
 * Stagger Item
 * Child variant for staggered animations
 */
export const staggerItem: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: ANIMATION_DURATION.NORMAL,
      ease: EASING.EASE_OUT,
    },
  },
};

/**
 * Scale on Hover
 * Used for cards and buttons
 */
export const scaleOnHover: Variants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.02,
    transition: {
      duration: ANIMATION_DURATION.NORMAL,
      ease: EASING.EASE_OUT,
    },
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: ANIMATION_DURATION.INSTANT,
    },
  },
};

/**
 * Lift on Hover
 * Used for cards with elevation
 */
export const liftOnHover: Variants = {
  initial: { y: 0 },
  hover: {
    y: -4,
    transition: {
      duration: ANIMATION_DURATION.NORMAL,
      ease: EASING.EASE_OUT,
    },
  },
};

/**
 * Pop In (Spring)
 * Used for badges and small elements
 */
export const popIn: Variants = {
  initial: { scale: 0, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: EASING.SPRING,
  },
};

/**
 * Progress Fill
 * Used for attribute bars
 */
export const progressFill: Variants = {
  initial: { scaleX: 0 },
  animate: {
    scaleX: 1,
    transition: {
      duration: 0.6,
      ease: EASING.EASE_OUT,
    },
  },
};

/**
 * Shimmer Loading
 * Used for skeleton screens
 */
export const shimmer: Variants = {
  initial: { backgroundPosition: "-200% 0" },
  animate: {
    backgroundPosition: "200% 0",
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "linear",
    },
  },
};
