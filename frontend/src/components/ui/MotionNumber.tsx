import React, { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { motionTokens } from "lib/motion";

interface MotionNumberProps {
  value: number;
  format?: (val: number) => string;
  className?: string;
  style?: React.CSSProperties;
}

export function MotionNumber({ value, format = (val) => Math.round(val).toString(), className = "", style = {} }: MotionNumberProps) {
  const springValue = useSpring(value, { ...motionTokens.springSmooth });
  const displayValue = useTransform(springValue, (current) => format(current));
  
  // React to external value changes
  useEffect(() => {
    springValue.set(value);
  }, [value, springValue]);

  return (
    <motion.span className={className} style={style}>
      {displayValue}
    </motion.span>
  );
}
