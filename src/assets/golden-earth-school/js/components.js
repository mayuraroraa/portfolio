/* ============================================================
   GOLDEN EARTH CONVENT SCHOOL — COMPONENTS JS
   Testimonial carousel, FAQ accordion, leadership tabs, timeline
   ============================================================ */

(function() {
  'use strict';

  // ============================================
  // 1. TESTIMONIALS CAROUSEL
  // ============================================
  function initTestimonials() {
    const wrapper = document.querySelector('.testimonials-wrapper');
    if (!wrapper) return;

    const slides = wrapper.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.carousel-dot');
    let current = 0;
    let autoTimer = null;

    function showSlide(index) {
      slides.forEach((slide, i) => {
        slide.classList.remove('active');
        slide.style.opacity = '0';
        slide.style.transform = 'translateX(60px)';
        slide.style.position = 'absolute';
      });

      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });

      const activeSlide = slides[index];
      if (activeSlide) {
        activeSlide.style.position = 'relative';
        activeSlide.classList.add('active');
        // Trigger reflow
        activeSlide.offsetHeight;
        activeSlide.style.transition = 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        activeSlide.style.opacity = '1';
        activeSlide.style.transform = 'translateX(0)';
      }

      current = index;
    }

    function nextSlide() {
      const next = (current + 1) % slides.length;
      showSlide(next);
    }

    // Dot click handlers
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        showSlide(i);
        resetAutoPlay();
      });
    });

    // Auto-play
    function startAutoPlay() {
      autoTimer = setInterval(nextSlide, 5000);
    }

    function resetAutoPlay() {
      clearInterval(autoTimer);
      startAutoPlay();
    }

    // Initialize
    if (slides.length > 0) {
      showSlide(0);
      startAutoPlay();

      // Pause on hover
      wrapper.addEventListener('mouseenter', () => clearInterval(autoTimer));
      wrapper.addEventListener('mouseleave', startAutoPlay);
    }
  }

  // ============================================
  // 2. FAQ ACCORDION
  // ============================================
  function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach(item => {
      const header = item.querySelector('.faq-item__header');
      if (!header) return;

      header.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');

        // Close all others
        faqItems.forEach(other => {
          if (other !== item) {
            other.classList.remove('open');
          }
        });

        // Toggle current
        item.classList.toggle('open', !isOpen);
      });
    });

    // Open first FAQ by default
    if (faqItems[0]) {
      faqItems[0].classList.add('open');
    }
  }

  // ============================================
  // 3. LEADERSHIP TABS
  // ============================================
  function initLeadershipTabs() {
    const tabs = document.querySelectorAll('.leader-tab');
    const panels = document.querySelectorAll('.leadership-panel');

    if (!tabs.length || !panels.length) return;

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.getAttribute('data-leader');

        // Update active tab
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Switch panel
        panels.forEach(panel => {
          const isTarget = panel.getAttribute('data-leader') === target;

          if (isTarget) {
            panel.style.display = 'block';
            panel.style.opacity = '0';
            panel.style.transform = 'translateY(15px)';

            requestAnimationFrame(() => {
              panel.style.transition = 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
              panel.style.opacity = '1';
              panel.style.transform = 'translateY(0)';
            });
          } else {
            panel.style.display = 'none';
          }
        });
      });
    });
  }

  // ============================================
  // 4. WHY GOLDEN EARTH — Interactive points
  // ============================================
  function initWhyPoints() {
    const points = document.querySelectorAll('.feature-point');
    const whyImage = document.querySelector('.why-image img');
    const whyCaption = document.querySelector('.why-image__caption');

    if (!points.length) return;

    points.forEach(point => {
      point.addEventListener('mouseenter', () => {
        // Update active state
        points.forEach(p => p.classList.remove('active'));
        point.classList.add('active');

        // Update image if data attributes exist
        const img = point.getAttribute('data-image');
        const caption = point.getAttribute('data-caption');

        if (whyImage && img) {
          whyImage.style.transform = 'scale(1.05)';
          setTimeout(() => {
            whyImage.src = img;
            whyImage.style.transform = 'scale(1)';
          }, 200);
        }

        if (whyCaption && caption) {
          whyCaption.textContent = caption;
        }
      });
    });
  }

  // ============================================
  // 5. HORIZONTAL SCROLL DRAG
  // ============================================
  function initDragScroll() {
    const scrollContainers = document.querySelectorAll('.campus-scroll, .student-life-strip, .philosophy-scroll');

    scrollContainers.forEach(container => {
      let isDown = false;
      let startX;
      let scrollLeft;

      container.addEventListener('mousedown', (e) => {
        isDown = true;
        container.style.cursor = 'grabbing';
        startX = e.pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
      });

      container.addEventListener('mouseleave', () => {
        isDown = false;
        container.style.cursor = 'grab';
      });

      container.addEventListener('mouseup', () => {
        isDown = false;
        container.style.cursor = 'grab';
      });

      container.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 2;
        container.scrollLeft = scrollLeft - walk;
      });

      container.style.cursor = 'grab';
    });
  }

  // ============================================
  // INIT ALL
  // ============================================
  function init() {
    initTestimonials();
    initFAQ();
    initLeadershipTabs();
    initWhyPoints();
    initDragScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
