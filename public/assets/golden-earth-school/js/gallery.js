/* ============================================================
   GOLDEN EARTH CONVENT SCHOOL — GALLERY
   Filtering, masonry layout, lightbox
   ============================================================ */

(function() {
  'use strict';

  // ============================================
  // 1. GALLERY FILTERING
  // ============================================
  function initGalleryFilters() {
    const filters = document.querySelectorAll('.gallery-filter');
    const cards = document.querySelectorAll('.gallery-card');

    if (!filters.length || !cards.length) return;

    filters.forEach(filter => {
      filter.addEventListener('click', () => {
        // Update active state
        filters.forEach(f => f.classList.remove('active'));
        filter.classList.add('active');

        const category = filter.getAttribute('data-filter');

        cards.forEach(card => {
          const cardCategory = card.getAttribute('data-category');

          if (category === 'all' || cardCategory === category) {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.9)';
            card.style.display = '';

            requestAnimationFrame(() => {
              setTimeout(() => {
                card.style.transition = 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
              }, 50);
            });
          } else {
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            card.style.opacity = '0';
            card.style.transform = 'scale(0.9)';

            setTimeout(() => {
              card.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }

  // ============================================
  // 2. LIGHTBOX
  // ============================================
  function initLightbox() {
    const lightbox = document.getElementById('gallery-lightbox');
    if (!lightbox) return;

    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.lightbox__close');
    const cards = document.querySelectorAll('.gallery-card[data-lightbox]');

    cards.forEach(card => {
      card.addEventListener('click', () => {
        const imgSrc = card.getAttribute('data-lightbox');
        if (lightboxImg && imgSrc) {
          lightboxImg.src = imgSrc;
          lightbox.classList.add('open');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    function closeLightbox() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
      setTimeout(() => {
        if (lightboxImg) lightboxImg.src = '';
      }, 300);
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', closeLightbox);
    }

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('open')) {
        closeLightbox();
      }
    });
  }

  // ============================================
  // INIT
  // ============================================
  function init() {
    initGalleryFilters();
    initLightbox();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
