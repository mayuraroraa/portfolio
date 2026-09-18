import React, { useRef } from 'react';
import './Home.css';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroImage from '../assets/9fa1e3b5-358d-4b14-92bb-e1ac5b273116.png';
import heroImage1 from '../assets/e5223ac6-4414-49d1-9800-86e76b355108.png';

const Home = () => {
  const portraitRef = useRef(null);
  const trailRef = useRef([]);
  const animationRef = useRef(null);

  const updateReveal = () => {
    if (!portraitRef.current) return;

    const now = performance.now();

    // Remove old points
    trailRef.current = trailRef.current.filter(
      (point) => now - point.time < 700
    );

    const gradients = trailRef.current.map((point) => {
      const age = now - point.time;

      // 0 → 1 as point gets older
      const progress = age / 700;

      // Smooth fade
      const opacity = Math.max(
        0,
        1 - progress
      );

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

    if (gradients.length > 0) {
      portraitRef.current.style.setProperty(
        '--reveal-mask',
        gradients.join(', ')
      );
    } else {
      portraitRef.current.style.setProperty(
        '--reveal-mask',
        'none'
      );
    }

    animationRef.current =
      requestAnimationFrame(updateReveal);
  };


  const handleMouseMove = (e) => {
    if (!portraitRef.current) return;

    const rect =
      portraitRef.current.getBoundingClientRect();

    const x =
      ((e.clientX - rect.left) / rect.width) * 100;

    const y =
      ((e.clientY - rect.top) / rect.height) * 100;

    const now = performance.now();

    /*
      Add a new brush point.
      The distance check prevents
      hundreds of unnecessary points.
    */

    const lastPoint =
      trailRef.current[
        trailRef.current.length - 1
      ];

    if (
      !lastPoint ||
      Math.abs(x - lastPoint.x) > 1 ||
      Math.abs(y - lastPoint.y) > 1
    ) {
      trailRef.current.push({
        x,
        y,
        time: now
      });
    }

    /*
      Keep trail short.
    */

    if (trailRef.current.length > 25) {
      trailRef.current.shift();
    }

    /*
      Start animation loop.
    */

    if (!animationRef.current) {
      animationRef.current =
        requestAnimationFrame(updateReveal);
    }
  };


  const handleMouseEnter = () => {
    if (!portraitRef.current) return;

    portraitRef.current.classList.add(
      'is-hovering'
    );

    if (!animationRef.current) {
      animationRef.current =
        requestAnimationFrame(updateReveal);
    }
  };


  const handleMouseLeave = () => {
    if (!portraitRef.current) return;

    portraitRef.current.classList.remove(
      'is-hovering'
    );

    /*
      Don't immediately remove the trail.
      Let it naturally fade out.
    */
  };


  return (
    <div
      id="home"
      className="home-container container"
    >

      <div className="hero-section">

        {/* HERO TITLE */}

        <motion.h1
          className="display-huge hero-title"
          initial={{
            opacity: 0,
            y: 50
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            duration: 0.8,
            delay: 0.2
          }}
        >
          <span className="text-outlined">
            MAYUR
          </span>{' '}
          ARORA
        </motion.h1>


        {/* HERO PORTRAIT */}

        <motion.div
          ref={portraitRef}
          className="hero-portrait-wrapper"
          initial={{
            opacity: 0,
            scale: 0.95
          }}
          animate={{
            opacity: 1,
            scale: 1
          }}
          transition={{
            duration: 1,
            delay: 0.4
          }}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >

          <div className="hero-portrait-placeholder">

            {/* GRAYSCALE BASE */}

            <img
              src={heroImage1}
              alt="Mayur Arora"
              className="
                hero-image
                hero-image-base
              "
            />


            {/* COLOR REVEAL */}

            <img
              src={heroImage}
              alt=""
              aria-hidden="true"
              className="
                hero-image
                hero-image-reveal
              "
            />

          </div>

        </motion.div>


        {/* HERO META */}

        <motion.div
          className="hero-meta"
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          transition={{
            duration: 0.8,
            delay: 0.8
          }}
        >

          <div className="hero-role">

            <h2>
              Full-Stack Developer
            </h2>

            <p className="text-secondary">
              17-year-old developer building digital products and AI
              experiences that are clear, robust,
              and highly functional.
            </p>

            <Link
              to="/contact"
              className="
                pill-btn
                pill-btn-dark
                mt-4
              "
            >
              Contact Us
              <ArrowUpRight size={16} />
            </Link>

          </div>


          <div className="hero-socials">

            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="
                pill-btn
                pill-btn-outline
              "
            >
              GitHub
            </a>

            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="
                pill-btn
                pill-btn-outline
              "
            >
             Instagram
            </a>

            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="
                pill-btn
                pill-btn-outline
              "
            >
              LinkedIn
            </a>

            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              className="
                pill-btn
                pill-btn-outline
              "
            >
            Snapchat
            </a>

          </div>

        </motion.div>

      </div>

    </div>
  );
};

export default Home;