/* ============================================================
   GOLDEN EARTH CONVENT SCHOOL — INTERACTIONS
   Parallax, scroll reveals, counters, custom cursor,
   3D card tilt, card lighting, scroll progress, hero particles
   ============================================================ */

(function() {
  'use strict';

  /* Check for reduced motion preference — disable 3D effects if set */
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  var isDesktop = window.innerWidth >= 1024;

  // ============================================
  // 1. SCROLL REVEAL (Intersection Observer)
  // ============================================
  function initScrollReveal() {
    var reveals = document.querySelectorAll(
      '.reveal, .reveal-left, .reveal-right, .reveal-scale, .gold-line-animated'
    );
    if (!reveals.length) return;

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(function(el) { observer.observe(el); });
  }

  // ============================================
  // 2. ANIMATED COUNTERS
  // ============================================
  function animateCounter(element) {
    var target = parseInt(element.getAttribute('data-target'), 10);
    var suffix = element.getAttribute('data-suffix') || '';
    var duration = 2000;
    var startTime = performance.now();

    function easeOutExpo(t) {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function update(currentTime) {
      var elapsed = currentTime - startTime;
      var progress = Math.min(elapsed / duration, 1);
      var easedProgress = easeOutExpo(progress);
      var current = Math.round(easedProgress * target);
      element.textContent = current + suffix;
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  function initCounters() {
    var counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function(el) { observer.observe(el); });
  }

  // ============================================
  // 3. HERO PARALLAX (mouse movement)
  // ============================================
  function initHeroParallax() {
    var hero = document.querySelector('.hero');
    if (!hero || !isDesktop || prefersReducedMotion) return;

    var bg = hero.querySelector('.hero__bg');
    var content = hero.querySelector('.hero__content');
    var particles = hero.querySelector('.hero__particles');

    var rafId = null;
    var targetX = 0, targetY = 0;
    var currentX = 0, currentY = 0;

    hero.addEventListener('mousemove', function(e) {
      var rect = hero.getBoundingClientRect();
      /* Normalize to -0.5 … +0.5 range */
      targetX = (e.clientX - rect.left) / rect.width - 0.5;
      targetY = (e.clientY - rect.top)  / rect.height - 0.5;

      if (!rafId) {
        rafId = requestAnimationFrame(updateParallax);
      }
    });

    hero.addEventListener('mouseleave', function() {
      targetX = 0;
      targetY = 0;
    });

    function updateParallax() {
      /* Ease toward target for smooth feel */
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      if (bg) {
        /* Background moves least — 2px max */
        bg.style.transform = 'translate(' + (currentX * -18) + 'px, ' + (currentY * -12) + 'px) scale(1.06)';
      }
      if (particles) {
        /* Particles mid-layer — 5px max */
        particles.style.transform = 'translate(' + (currentX * -30) + 'px, ' + (currentY * -20) + 'px)';
      }
      if (content) {
        /* Content moves subtly — 8px max */
        content.style.transform = 'translate(' + (currentX * 10) + 'px, ' + (currentY * 7) + 'px)';
      }

      rafId = null;
      /* Keep animating while there's movement */
      var diff = Math.abs(targetX - currentX) + Math.abs(targetY - currentY);
      if (diff > 0.0005) {
        rafId = requestAnimationFrame(updateParallax);
      }
    }
  }

  // ============================================
  // 4. SCROLL PARALLAX (for images)
  // ============================================
  function initScrollParallax() {
    if (prefersReducedMotion) return;
    var parallaxElements = document.querySelectorAll('[data-parallax]');
    if (!parallaxElements.length) return;

    var parallaxTicking = false;

    function updateParallax() {
      parallaxElements.forEach(function(el) {
        var speed = parseFloat(el.getAttribute('data-parallax')) || 0.3;
        var rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          var offset = (rect.top - window.innerHeight / 2) * speed;
          el.style.transform = 'translateY(' + offset + 'px)';
        }
      });
      parallaxTicking = false;
    }

    window.addEventListener('scroll', function() {
      if (!parallaxTicking) {
        requestAnimationFrame(updateParallax);
        parallaxTicking = true;
      }
    }, { passive: true });
  }

  // ============================================
  // 5. CUSTOM CURSOR
  // ============================================
  function initCustomCursor() {
    if (isTouchDevice || !isDesktop) return;

    var cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    var mouseX = 0, mouseY = 0;
    var cursorX = 0, cursorY = 0;
    var cursorRafId = null;

    document.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!cursor.classList.contains('visible')) {
        cursor.classList.add('visible');
      }
      if (!cursorRafId) {
        cursorRafId = requestAnimationFrame(updateCursor);
      }
    });

    function updateCursor() {
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;
      cursor.style.left = cursorX + 'px';
      cursor.style.top  = cursorY + 'px';
      cursorRafId = null;
      var diff = Math.abs(mouseX - cursorX) + Math.abs(mouseY - cursorY);
      if (diff > 0.1) {
        cursorRafId = requestAnimationFrame(updateCursor);
      }
    }

    /* Interactive elements — expand cursor */
    var interactives = document.querySelectorAll(
      'a, button, .btn, .gallery-filter, .leader-tab, .faq-item__header, .speciality-card'
    );
    interactives.forEach(function(el) {
      el.addEventListener('mouseenter', function() {
        cursor.classList.add('expanded');
        cursor.classList.remove('view-mode');
      });
      el.addEventListener('mouseleave', function() {
        cursor.classList.remove('expanded');
      });
    });

    /* Images — VIEW mode */
    var viewElements = document.querySelectorAll(
      '.gallery-card, .campus-card, .student-life-card, .about__img-main, .about__img-secondary'
    );
    viewElements.forEach(function(el) {
      el.addEventListener('mouseenter', function() {
        cursor.classList.add('view-mode');
        cursor.classList.remove('expanded');
      });
      el.addEventListener('mouseleave', function() {
        cursor.classList.remove('view-mode');
      });
    });

    document.addEventListener('mouseleave', function() {
      cursor.classList.remove('visible');
    });
    document.addEventListener('mouseenter', function() {
      cursor.classList.add('visible');
    });
  }

  // ============================================
  // 6. IMAGE LAZY LOADING
  // ============================================
  function initLazyImages() {
    var images = document.querySelectorAll('img[data-src]');
    if (!images.length) return;

    var imageObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          img.addEventListener('load', function() { img.classList.add('loaded'); });
          imageObserver.unobserve(img);
        }
      });
    }, { rootMargin: '200px' });

    images.forEach(function(img) { imageObserver.observe(img); });
  }

  // ============================================
  // 7. SCROLL PROGRESS BAR
  // ============================================
  function initScrollProgress() {
    var bar = document.getElementById('scroll-progress');
    if (!bar) return;

    var ticking = false;

    function update() {
      var scrollTop  = window.scrollY || document.documentElement.scrollTop;
      var docHeight  = document.documentElement.scrollHeight - window.innerHeight;
      var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = pct + '%';
      ticking = false;
    }

    window.addEventListener('scroll', function() {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
  }

  // ============================================
  // 8. 3D CARD TILT
  // Uses perspective + rotateX/rotateY for realistic tilt
  // Max tilt: ~5 degrees. Disabled on mobile/touch.
  // ============================================
  function initCardTilt() {
    if (isTouchDevice || !isDesktop || prefersReducedMotion) return;

    var cards = document.querySelectorAll('.speciality-card');
    var MAX_TILT = 5; /* degrees */
    var PERSPECTIVE = 700; /* px */

    cards.forEach(function(card) {
      card.addEventListener('mousemove', function(e) {
        var rect = card.getBoundingClientRect();
        /* Normalized position: -0.5 … +0.5 */
        var nx = (e.clientX - rect.left) / rect.width  - 0.5;
        var ny = (e.clientY - rect.top)  / rect.height - 0.5;

        /* rotateY = tilt left/right, rotateX = tilt up/down */
        var rotX = -ny * MAX_TILT;
        var rotY =  nx * MAX_TILT;

        card.style.transform =
          'perspective(' + PERSPECTIVE + 'px) ' +
          'rotateX(' + rotX + 'deg) ' +
          'rotateY(' + rotY + 'deg) ' +
          'translateZ(0)';
      });

      card.addEventListener('mouseleave', function() {
        card.style.transform =
          'perspective(' + PERSPECTIVE + 'px) rotateX(0deg) rotateY(0deg) translateZ(0)';
        card.style.transition =
          'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s';
        /* Reset transition after snap-back */
        setTimeout(function() {
          card.style.transition = '';
        }, 500);
      });

      card.addEventListener('mouseenter', function() {
        /* Remove transition so tilt follows cursor immediately */
        card.style.transition = 'box-shadow 0.3s, border-color 0.3s';
      });
    });
  }

  // ============================================
  // 9. CARD CURSOR LIGHTING
  // Sets --mouse-x and --mouse-y CSS custom props
  // The CSS uses these in a radial-gradient to create a
  // soft light that follows the cursor across each card.
  // ============================================
  function initCardLighting() {
    if (isTouchDevice || prefersReducedMotion) return;

    var cards = document.querySelectorAll('.speciality-card');

    cards.forEach(function(card) {
      card.addEventListener('mousemove', function(e) {
        var rect = card.getBoundingClientRect();
        var x = ((e.clientX - rect.left) / rect.width)  * 100;
        var y = ((e.clientY - rect.top)  / rect.height) * 100;
        card.style.setProperty('--mouse-x', x + '%');
        card.style.setProperty('--mouse-y', y + '%');
      });

      card.addEventListener('mouseleave', function() {
        card.style.setProperty('--mouse-x', '50%');
        card.style.setProperty('--mouse-y', '50%');
      });
    });
  }

  // ============================================
  // 10. HERO PARTICLES
  // Subtle floating gold particles in the hero section.
  // Only on desktop, only a few particles.
  // ============================================
  function initHeroParticles() {
    if (!isDesktop || prefersReducedMotion) return;

    var container = document.querySelector('.hero__particles');
    if (!container) return;

    var COUNT = 14; /* Keep it subtle */

    for (var i = 0; i < COUNT; i++) {
      var p = document.createElement('div');
      p.className = 'hero__particle';

      /* Random position across hero width, mostly lower half */
      var left = 5 + Math.random() * 90;
      var bottom = 10 + Math.random() * 60;

      /* Vary size for depth illusion */
      var size = 1 + Math.random() * 1.5;

      /* Random duration and delay */
      var duration = 10 + Math.random() * 14;
      var delay    = Math.random() * 10;

      p.style.cssText =
        'left:' + left + '%;' +
        'bottom:' + bottom + '%;' +
        'width:' + size + 'px;' +
        'height:' + size + 'px;' +
        'animation-duration:' + duration + 's;' +
        'animation-delay:' + delay + 's;' +
        'opacity:0;';

      container.appendChild(p);
    }
  }

  // ============================================
  // 11. LEADERSHIP DEPTH — subtle portrait interaction
  // Already handled by CSS :hover, but we add a
  // mouse-tracking shift on the portrait accent frame.
  // ============================================
  function initLeadershipDepth() {
    if (isTouchDevice || !isDesktop || prefersReducedMotion) return;

    var portrait = document.querySelector('.leadership__portrait');
    if (!portrait) return;

    portrait.addEventListener('mousemove', function(e) {
      var rect = portrait.getBoundingClientRect();
      var nx = (e.clientX - rect.left) / rect.width  - 0.5;
      var ny = (e.clientY - rect.top)  / rect.height - 0.5;

      /* Very subtle tilt on portrait — max 2 degrees */
      var rotX = -ny * 2;
      var rotY =  nx * 2;

      var img = portrait.querySelector('img');
      if (img) {
        img.style.transform =
          'perspective(800px) rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg) scale(1.02) translateY(-4px)';
      }
    });

    portrait.addEventListener('mouseleave', function() {
      var img = portrait.querySelector('img');
      if (img) {
        img.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        img.style.transform = '';
        setTimeout(function() {
          if (img) img.style.transition = '';
        }, 600);
      }
    });
  }

  // ============================================
  // INITIALIZE ALL
  // ============================================
  function init() {
    initScrollReveal();
    initCounters();
    initHeroParallax();
    initScrollParallax();
    initCustomCursor();
    initLazyImages();
    initScrollProgress();
    initCardTilt();
    initCardLighting();
    initHeroParticles();
    initLeadershipDepth();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
