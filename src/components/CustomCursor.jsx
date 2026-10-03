'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CustomCursor = () => {
  const [mounted, setMounted] = useState(false);
  const [isCoarse, setIsCoarse] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    setMounted(true);
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    setIsCoarse(coarse);
    if (coarse) return;

    const updatePosition = (e) => {
      cursorX.set(e.clientX - 10);
      cursorY.set(e.clientY - 10);
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target?.tagName?.toLowerCase() === 'button' ||
        target?.tagName?.toLowerCase() === 'a' ||
        target?.closest?.('button') ||
        target?.closest?.('a')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updatePosition, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY]);

  if (!mounted || isCoarse) {
    return null;
  }

  return (
    <motion.div
      className="cursor-dot"
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        backgroundColor: 'var(--text-primary)',
        pointerEvents: 'none',
        zIndex: 9999,
        x: cursorXSpring,
        y: cursorYSpring,
      }}
      animate={{
        scale: isHovering ? 2.5 : 1,
        opacity: isHovering ? 0.3 : 0.8,
      }}
      transition={{
        scale: { type: 'spring', stiffness: 300, damping: 20 },
      }}
    />
  );
};

export default CustomCursor;
