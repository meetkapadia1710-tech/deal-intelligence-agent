// Motion System Tokens & Variants (Material Design 3 & SaaS Inspired)

// Durations (in seconds for Framer Motion)
export const DURATIONS = {
  fast: 0.15,
  medium: 0.25,
  slow: 0.40,
};

// Physics
export const SPRING = {
  stiffness: 300,
  damping: 30,
  mass: 1,
};

export const SPRING_SMOOTH = {
  stiffness: 200,
  damping: 24,
  mass: 1,
};

// --- Framer Motion Variants ---

// 1. Container Transform (Page changes)
export const pageVariants = {
  initial: { opacity: 0, y: 10, scale: 0.98 },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: DURATIONS.slow, ease: [0.25, 1, 0.5, 1] }
  },
  exit: { 
    opacity: 0, 
    scale: 0.98,
    transition: { duration: DURATIONS.medium, ease: [0.5, 0, 0.75, 0] }
  }
};

// 2. Fade Through (Tab changes, list updates)
export const fadeThroughVariants = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: DURATIONS.medium, ease: 'easeOut' }
  },
  exit: { 
    opacity: 0, 
    scale: 0.96,
    transition: { duration: DURATIONS.fast, ease: 'easeIn' }
  }
};

// 3. Staggered Container (Dashboards, Lists)
export const staggerContainer = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    }
  }
};

// Child item for staggered container (Slide up & fade)
export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring', ...SPRING }
  }
};

// Chat Message Variants
export const chatMsgUserVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: { duration: DURATIONS.medium, ease: 'easeOut' }
  }
};

export const chatMsgAgentVariants = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: 'spring', ...SPRING_SMOOTH }
  }
};

// Dialog Variants
export const dialogVariants = {
  initial: { opacity: 0, scale: 0.95, y: 10 },
  animate: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { duration: DURATIONS.medium, ease: [0.16, 1, 0.3, 1] } // Material easing
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    y: 10,
    transition: { duration: DURATIONS.fast, ease: [0.4, 0, 1, 1] } 
  }
};

// Backdrop variants
export const backdropVariants = {
  initial: { opacity: 0, backdropFilter: 'blur(0px)' },
  animate: { opacity: 1, backdropFilter: 'blur(8px)', transition: { duration: DURATIONS.medium } },
  exit: { opacity: 0, backdropFilter: 'blur(0px)', transition: { duration: DURATIONS.fast } }
};
