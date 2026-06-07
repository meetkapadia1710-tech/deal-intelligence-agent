import React from "react";
import { motion } from "framer-motion";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ width = "100%", height = 20, borderRadius = 8, className = "", style = {} }: SkeletonProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0.5, backgroundColor: "#e2e8f0" }}
      animate={{ opacity: [0.5, 0.8, 0.5], backgroundColor: ["#e2e8f0", "#cbd5e1", "#e2e8f0"] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      style={{
        width,
        height,
        borderRadius,
        ...style
      }}
    />
  );
}
