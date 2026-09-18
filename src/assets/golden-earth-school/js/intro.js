/* ============================================================
   GOLDEN EARTH CONVENT SCHOOL — CINEMATIC LOGO INTRO
   Premium opening animation sequence with golden glow phase
   ============================================================ */

(function() {
  'use strict';

  var INTRO_DURATION = 5200; /* Total intro ms */
  var SKIP_KEY = 'gecs_intro_seen';

  /* Check if intro was recently seen (within 30 minutes) */
  function hasSeenRecently() {
    var last = sessionStorage.getItem(SKIP_KEY);
    if (!last) return false;
    var elapsed = Date.now() - parseInt(last, 10);
    return elapsed < 30 * 60 * 1000; /* 30 minutes */
  }

  function createParticles(container, count) {
    for (var i = 0; i < count; i++) {
      var particle = document.createElement('div');
      particle.className = 'intro__particle';
      particle.style.left   = Math.random() * 100 + '%';
      particle.style.top    = (40 + Math.random() * 60) + '%';
      particle.style.width  = (1 + Math.random() * 2) + 'px';
      particle.style.height = particle.style.width;
      particle.style.animationDelay    = (Math.random() * 8) + 's';
      particle.style.animationDuration = (6 + Math.random() * 6) + 's';
      particle.style.opacity = 0;
      container.appendChild(particle);
    }
  }

  function runIntro() {
    var overlay = document.getElementById('intro-overlay');
    if (!overlay) return;

    /* If seen recently, skip immediately */
    if (hasSeenRecently()) {
      overlay.style.display = 'none';
      overlay.classList.add('hidden');
      document.body.classList.remove('intro-active');
      return;
    }

    document.body.classList.add('intro-active');

    var logo          = overlay.querySelector('.intro__logo');
    var ring          = overlay.querySelector('.intro__ring circle');
    var schoolName    = overlay.querySelector('.intro__school-name');
    var location      = overlay.querySelector('.intro__location');
    var tagline       = overlay.querySelector('.intro__tagline');
    var glow          = overlay.querySelector('.intro__glow');
    var particleContainer = overlay.querySelector('.intro__particles');

    /* Create golden particles */
    if (particleContainer) {
      createParticles(particleContainer, 28);
    }

    /* ── Initial states ─────────────────────────────────────── */
    if (logo) {
      logo.style.opacity   = '0';
      logo.style.filter    = 'blur(12px)';
      logo.style.transform = 'scale(0.82)';
    }
    if (schoolName) {
      schoolName.style.opacity   = '0';
      schoolName.style.transform = 'translateY(24px)';
    }
    if (location) {
      location.style.opacity   = '0';
      location.style.transform = 'translateY(16px)';
    }
    if (tagline) {
      tagline.style.opacity = '0';
    }
    if (glow) {
      glow.style.opacity   = '0';
      glow.style.transform = 'translate(-50%, -55%) scale(0.5)';
    }

    /* ── Timeline ───────────────────────────────────────────── */
    var timeline = [

      /* Phase 1: Dark navy screen — nothing happens (0–400ms) */

      /* Phase 2: Golden light appears BEHIND the logo (400ms) */
      {
        delay: 400,
        action: function() {
          if (!glow) return;
          glow.style.transition =
            'opacity 1000ms cubic-bezier(0.25, 1, 0.5, 1), ' +
            'transform 1000ms cubic-bezier(0.25, 1, 0.5, 1)';
          glow.style.opacity   = '1';
          glow.style.transform = 'translate(-50%, -55%) scale(1)';
        }
      },

      /* Phase 3: Logo fades in and scales into position (900ms) */
      {
        delay: 900,
        action: function() {
          if (!logo) return;
          logo.style.transition =
            'opacity 1000ms cubic-bezier(0.16, 1, 0.3, 1), ' +
            'filter 1000ms cubic-bezier(0.16, 1, 0.3, 1), ' +
            'transform 1000ms cubic-bezier(0.16, 1, 0.3, 1)';
          logo.style.opacity   = '1';
          logo.style.filter    = 'blur(0) drop-shadow(0 8px 24px rgba(0,0,0,0.35))';
          logo.style.transform = 'scale(1)';
        }
      },

      /* Phase 3b: Glow dims as logo appears */
      {
        delay: 1500,
        action: function() {
          if (!glow) return;
          glow.style.transition = 'opacity 800ms ease';
          glow.style.opacity    = '0.35';
        }
      },

      /* Phase 4: Golden ring draws around the logo (1800ms) */
      {
        delay: 1800,
        action: function() {
          if (!ring) return;
          ring.style.transition = 'stroke-dashoffset 1400ms cubic-bezier(0.16, 1, 0.3, 1)';
          ring.style.strokeDashoffset = '0';
          ring.style.strokeDasharray  = '679'; /* ensure it matches HTML circle r=108 */
        }
      },

      /* Phase 4b: Glow fades fully as ring appears */
      {
        delay: 2200,
        action: function() {
          if (!glow) return;
          glow.style.transition = 'opacity 600ms ease';
          glow.style.opacity    = '0';
        }
      },

      /* Phase 5: School name appears (2900ms) */
      {
        delay: 2900,
        action: function() {
          if (!schoolName) return;
          schoolName.style.transition =
            'opacity 800ms cubic-bezier(0.16, 1, 0.3, 1), ' +
            'transform 800ms cubic-bezier(0.16, 1, 0.3, 1)';
          schoolName.style.opacity   = '1';
          schoolName.style.transform = 'translateY(0)';
        }
      },

      /* Phase 5b: Location appears (3700ms) */
      {
        delay: 3700,
        action: function() {
          if (!location) return;
          location.style.transition =
            'opacity 700ms cubic-bezier(0.16, 1, 0.3, 1), ' +
            'transform 700ms cubic-bezier(0.16, 1, 0.3, 1)';
          location.style.opacity   = '1';
          location.style.transform = 'translateY(0)';
        }
      },

      /* Phase 5c: Tagline appears (4300ms) */
      {
        delay: 4300,
        action: function() {
          if (!tagline) return;
          tagline.style.transition = 'opacity 700ms cubic-bezier(0.16, 1, 0.3, 1)';
          tagline.style.opacity    = '0.9';
        }
      },

      /* Phase 6 & 7: Overlay fades out and transitions to hero (5200ms) */
      {
        delay: 5200,
        action: function() {
          overlay.style.transition =
            'opacity 900ms cubic-bezier(0.16, 1, 0.3, 1), ' +
            'transform 900ms cubic-bezier(0.16, 1, 0.3, 1)';
          overlay.style.opacity   = '0';
          overlay.style.transform = 'scale(1.03)';

          setTimeout(function() {
            overlay.style.display = 'none';
            overlay.classList.add('hidden');
            document.body.classList.remove('intro-active');
            sessionStorage.setItem(SKIP_KEY, Date.now().toString());
            /* Trigger hero animations */
            document.dispatchEvent(new CustomEvent('introComplete'));
          }, 900);
        }
      }
    ];

    /* Execute timeline */
    timeline.forEach(function(step) {
      setTimeout(step.action, step.delay);
    });

    /* Allow skip on click */
    overlay.addEventListener('click', function() {
      overlay.style.transition = 'opacity 350ms ease';
      overlay.style.opacity    = '0';
      setTimeout(function() {
        overlay.style.display = 'none';
        overlay.classList.add('hidden');
        document.body.classList.remove('intro-active');
        sessionStorage.setItem(SKIP_KEY, Date.now().toString());
        document.dispatchEvent(new CustomEvent('introComplete'));
      }, 350);
    });
  }

  /* Initialize */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runIntro);
  } else {
    runIntro();
  }
})();
