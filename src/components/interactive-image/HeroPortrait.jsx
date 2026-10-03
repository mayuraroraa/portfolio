'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import heroImage from '@/assets/9fa1e3b5-358d-4b14-92bb-e1ac5b273116.png';
import heroImage1 from '@/assets/e5223ac6-4414-49d1-9800-86e76b355108.png';

const HeroPortrait = () => {
  const portraitRef = useRef(null);
  const trailRef = useRef([]);
  const animationRef = useRef(null);
  const isPointerActiveRef = useRef(false);

  // Render the reveal mask gradient trail onto the CSS variable
  const updateReveal = useCallback(() => {
    if (!portraitRef.current) return;

    const now = performance.now();

    // Filter points older than 700ms
    trailRef.current = trailRef.current.filter(
      (point) => now - point.time < 700
    );

    if (trailRef.current.length > 0) {
      const gradients = trailRef.current.map((point) => {
        const age = now - point.time;
        const progress = age / 700;
        const opacity = Math.max(0, 1 - progress);

        return `
          radial-gradient(
            ellipse 42px 95px at ${point.x}% ${point.y}%,
            rgba(0,0,0,${opacity}) 0%,
            rgba(0,0,0,${opacity * 0.85}) 30%,
            rgba(0,0,0,${opacity * 0.45}) 60%,
            rgba(0,0,0,${opacity * 0.15}) 82%,
            transparent 100%
          )
        `;
      });

      portraitRef.current.style.setProperty(
        '--reveal-mask',
        gradients.join(', ')
      );

      // Continue animation loop as long as points exist or pointer is active
      animationRef.current = requestAnimationFrame(updateReveal);
    } else {
      portraitRef.current.style.setProperty('--reveal-mask', 'none');
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    }
  }, []);

  const addPointFromEvent = useCallback((e) => {
    if (!portraitRef.current) return;

    const rect = portraitRef.current.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const rawX = ((e.clientX - rect.left) / rect.width) * 100;
    const rawY = ((e.clientY - rect.top) / rect.height) * 100;

    // Responsive coordinate clamping
    const x = Math.max(0, Math.min(100, rawX));
    const y = Math.max(0, Math.min(100, rawY));

    const now = performance.now();
    const lastPoint = trailRef.current[trailRef.current.length - 1];

    if (
      !lastPoint ||
      Math.abs(x - lastPoint.x) > 0.8 ||
      Math.abs(y - lastPoint.y) > 0.8
    ) {
      trailRef.current.push({ x, y, time: now });
    }

    if (trailRef.current.length > 25) {
      trailRef.current.shift();
    }

    if (!animationRef.current) {
      animationRef.current = requestAnimationFrame(updateReveal);
    }
  }, [updateReveal]);

  // Unified Pointer Event Handlers
  const handlePointerEnter = useCallback((e) => {
    if (!portraitRef.current) return;
    portraitRef.current.classList.add('is-hovering');
    isPointerActiveRef.current = true;
    addPointFromEvent(e);
  }, [addPointFromEvent]);

  const handlePointerDown = useCallback((e) => {
    if (!portraitRef.current) return;
    portraitRef.current.classList.add('is-hovering');
    isPointerActiveRef.current = true;
    addPointFromEvent(e);
  }, [addPointFromEvent]);

  const handlePointerMove = useCallback((e) => {
    if (!portraitRef.current) return;
    // Activate hovering state if pointer moves across the element
    if (!portraitRef.current.classList.contains('is-hovering')) {
      portraitRef.current.classList.add('is-hovering');
    }
    isPointerActiveRef.current = true;
    addPointFromEvent(e);
  }, [addPointFromEvent]);

  const handlePointerUp = useCallback(() => {
    if (!portraitRef.current) return;
    isPointerActiveRef.current = false;
    portraitRef.current.classList.remove('is-hovering');
  }, []);

  const handlePointerLeave = useCallback(() => {
    if (!portraitRef.current) return;
    isPointerActiveRef.current = false;
    portraitRef.current.classList.remove('is-hovering');
  }, []);

  const handlePointerCancel = useCallback(() => {
    if (!portraitRef.current) return;
    isPointerActiveRef.current = false;
    portraitRef.current.classList.remove('is-hovering');
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <motion.div
      ref={portraitRef}
      className="hero-portrait-wrapper"
      initial={{
        opacity: 0,
        scale: 0.95,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      transition={{
        duration: 1,
        delay: 0.4,
      }}
      onPointerEnter={handlePointerEnter}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onPointerCancel={handlePointerCancel}
      style={{ touchAction: 'pan-y' }}
    >
      <div className="hero-portrait-placeholder">
        {/* GRAYSCALE BASE */}
        <img
          src={heroImage1.src || heroImage1}
          alt="Mayur Arora"
          className="hero-image hero-image-base"
          draggable="false"
        />

        {/* COLOR REVEAL */}
        <img
          src={heroImage.src || heroImage}
          alt=""
          aria-hidden="true"
          className="hero-image hero-image-reveal"
          draggable="false"
        />
      </div>
    </motion.div>
  );
};

export default HeroPortrait;
