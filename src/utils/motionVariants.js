/**
 * Motion Design Utilities for HABS
 * Calm, healthcare-focused animation variants for Framer Motion
 */

// ========================================
// ANIMATION CONSTANTS - LOCKED
// ========================================

export const DURATIONS = {
  instant: 0.15,
  fast: 0.2,
  normal: 0.25,
};

export const EASING = {
  out: [0.4, 0, 0.2, 1], // cubic-bezier(0.4, 0, 0.2, 1)
  inOut: [0.4, 0, 0.6, 1],
};

// ========================================
// CORE VARIANTS - CALM & PROFESSIONAL
// ========================================

/**
 * Fade + Gentle Slide (Most Common)
 * Use for: Cards, Modals, Page Sections
 */
export const fadeSlide = {
  hidden: {
    opacity: 0,
    y: 8,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATIONS.normal,
      ease: EASING.out,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: DURATIONS.fast,
      ease: EASING.out,
    },
  },
};

/**
 * Stagger Container
 * Use for: Lists, Card Grids
 */
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

/**
 * Stagger Item
 * Use with: staggerContainer
 */
export const staggerItem = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATIONS.normal,
      ease: EASING.out,
    },
  },
};

/**
 * Scale Fade (Subtle)
 * Use for: Buttons, Pills, Small Elements
 */
export const scaleFade = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: DURATIONS.fast,
      ease: EASING.out,
    },
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: DURATIONS.instant,
    },
  },
};

/**
 * Modal Variants
 * Use for: Modals, Dialogs
 */
export const modalBackdrop = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: DURATIONS.normal,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: DURATIONS.fast,
    },
  },
};

export const modalContent = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: DURATIONS.normal,
      ease: EASING.out,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: {
      duration: DURATIONS.fast,
    },
  },
};

/**
 * Success Indicator
 * Use for: Checkmarks, Confirmation States
 */
export const successPulse = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: DURATIONS.normal,
      ease: EASING.out,
    },
  },
};

/**
 * Slide In from Right
 * Use for: Toasts, Notifications
 */
export const slideRight = {
  hidden: {
    opacity: 0,
    x: 100,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: DURATIONS.normal,
      ease: EASING.out,
    },
  },
  exit: {
    opacity: 0,
    x: 100,
    transition: {
      duration: DURATIONS.fast,
    },
  },
};

/**
 * Progressive Form Section
 * Use for: Multi-step Forms
 */
export const formSection = {
  hidden: {
    opacity: 0,
    height: 0,
  },
  visible: {
    opacity: 1,
    height: 'auto',
    transition: {
      height: {
        duration: DURATIONS.normal,
        ease: EASING.inOut,
      },
      opacity: {
        duration: DURATIONS.fast,
        delay: 0.1,
      },
    },
  },
};

/**
 * Hover Lift (Buttons, Cards)
 * Use with whileHover prop
 */
export const hoverLift = {
  y: -2,
  transition: {
    duration: DURATIONS.fast,
    ease: EASING.out,
  },
};

/**
 * Active Press (Buttons)
 * Use with whileTap prop
 */
export const activePress = {
  scale: 0.98,
  transition: {
    duration: DURATIONS.instant,
  },
};

// ========================================
// PAGE TRANSITION VARIANTS
// ========================================

export const pageTransition = {
  initial: {
    opacity: 0,
    y: 12,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATIONS.normal,
      ease: EASING.out,
    },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: {
      duration: DURATIONS.fast,
    },
  },
};

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Creates a stagger delay for list items
 * @param {number} index - Item index
 * @param {number} baseDelay - Base delay in seconds
 * @returns {number} - Calculated delay
 */
export const staggerDelay = (index, baseDelay = 0.05) => {
  return index * baseDelay;
};

/**
 * Respects user's reduced motion preference
 * @param {object} variants - Motion variants
 * @returns {object} - Variants or static state
 */
export const respectReducedMotion = (variants) => {
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return {
      hidden: { opacity: 1 },
      visible: { opacity: 1 },
    };
  }
  return variants;
};

// ========================================
// EXPORT ALL
// ========================================

export default {
  fadeSlide,
  staggerContainer,
  staggerItem,
  scaleFade,
  modalBackdrop,
  modalContent,
  successPulse,
  slideRight,
  formSection,
  hoverLift,
  activePress,
  pageTransition,
  staggerDelay,
  respectReducedMotion,
  DURATIONS,
  EASING,
};
