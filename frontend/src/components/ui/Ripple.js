import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Ripple = ({ color = 'rgba(255, 255, 255, 0.3)' }) => {
  const [ripples, setRipples] = useState([]);

  useEffect(() => {
    // Cleanup old ripples automatically
    if (ripples.length > 0) {
      const timeout = setTimeout(() => {
        setRipples([]);
      }, 1000); // Wait long enough for animation to finish
      return () => clearTimeout(timeout);
    }
  }, [ripples]);

  const addRipple = (event) => {
    const trigger = event.currentTarget;
    const rect = trigger.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    
    // Calculate click position relative to the container
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const newRipple = {
      x,
      y,
      size,
      id: Date.now(),
    };

    setRipples((prev) => [...prev, newRipple]);
  };

  return (
    <div 
      className="ripple-container" 
      onMouseDown={addRipple}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        borderRadius: 'inherit',
        pointerEvents: 'none',
        zIndex: 0
      }}
    >
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            initial={{ 
              top: ripple.y, 
              left: ripple.x, 
              width: ripple.size, 
              height: ripple.size,
              scale: 0,
              opacity: 0.5 
            }}
            animate={{ 
              scale: 1, 
              opacity: 0 
            }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              backgroundColor: color,
              borderRadius: '50%',
              pointerEvents: 'none'
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
