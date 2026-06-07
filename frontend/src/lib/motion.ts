export const motionTokens = {
  instant: 0.15,
  fast: 0.25,
  normal: 0.4,
  slow: 0.6,

  springFast: {
    type: "spring" as const,
    stiffness: 450,
    damping: 30
  },

  springSmooth: {
    type: "spring" as const,
    stiffness: 250,
    damping: 25
  },

  springLuxury: {
    type: "spring" as const,
    stiffness: 180,
    damping: 20
  }
};

export const pageTransition = {
  initial: { opacity: 0, y: 15, filter: "blur(8px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -10, filter: "blur(4px)", transition: { duration: 0.2 } },
  transition: { ...motionTokens.springSmooth, mass: 0.8 }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

export const itemReveal = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: motionTokens.springSmooth }
};

export const cardHover = {
  scale: 1.02,
  y: -4,
  boxShadow: "0 12px 24px -10px rgba(0, 0, 0, 0.15)",
  transition: motionTokens.springFast
};
