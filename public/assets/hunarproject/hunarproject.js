document.addEventListener('DOMContentLoaded', () => {

    // ========================================================================
    // CONFIGURATION — Easy to edit
    // ========================================================================
    // Set the offer deadline here (YYYY-MM-DDTHH:MM:SS+05:30 for IST)
    const OFFER_DEADLINE = new Date('2026-09-05T23:59:59+05:30');

    // ========================================================================
    // 1. Countdown Timer
    // ========================================================================
    const countdownTimer = document.getElementById('countdown-timer');
    const countdownExpired = document.getElementById('countdown-expired');
    const daysEl = document.getElementById('countdown-days');
    const hoursEl = document.getElementById('countdown-hours');
    const minutesEl = document.getElementById('countdown-minutes');
    const secondsEl = document.getElementById('countdown-seconds');

    function padZero(num) {
        return num.toString().padStart(2, '0');
    }

    function updateCountdown() {
        const now = new Date();
        const diff = OFFER_DEADLINE - now;

        if (diff <= 0) {
            // Offer expired
            if (countdownTimer) countdownTimer.style.display = 'none';
            if (countdownExpired) countdownExpired.style.display = 'block';
            return false; // Stop the interval
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        if (daysEl) daysEl.textContent = padZero(days);
        if (hoursEl) hoursEl.textContent = padZero(hours);
        if (minutesEl) minutesEl.textContent = padZero(minutes);
        if (secondsEl) secondsEl.textContent = padZero(seconds);

        return true; // Continue
    }

    // Initial update
    if (updateCountdown()) {
        // Update every second
        const countdownInterval = setInterval(() => {
            if (!updateCountdown()) {
                clearInterval(countdownInterval);
            }
        }, 1000);
    }

    // ========================================================================
    // 2. Navbar Scroll Effect (adjusted for countdown bar)
    // ========================================================================
    const navbar = document.querySelector('.navbar');
    const countdownBar = document.getElementById('countdown-bar');

    function getCountdownHeight() {
        return countdownBar ? countdownBar.offsetHeight : 0;
    }

    // Set initial navbar top position
    function updateNavbarPosition() {
        const height = getCountdownHeight();
        if (navbar) {
            document.documentElement.style.setProperty('--countdown-height', height + 'px');
        }
    }

    updateNavbarPosition();
    window.addEventListener('resize', updateNavbarPosition);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(249, 237, 206, 0.98)';
            navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
            navbar.style.padding = '0.5rem 0';
        } else {
            navbar.style.background = 'rgba(249, 237, 206, 0.95)';
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
            navbar.style.padding = '1rem 0';
        }
    });

    // ========================================================================
    // 3. Scroll Reveal Animations using Intersection Observer
    // ========================================================================
    const revealElements = document.querySelectorAll('.fade-in-up, .scale-in');

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // If it's the stats section, trigger counters
                if (entry.target.querySelector('.counter') || entry.target.classList.contains('counter')) {
                    startCounters(entry.target);
                }
            }
        });
    };

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // ========================================================================
    // 4. Offer Card Viewport Animation
    // ========================================================================
    const offerCard = document.querySelector('.offer-card');
    const currentPriceEl = document.querySelector('.current-price');

    if (offerCard) {
        const offerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('offer-revealed');

                    // Animate the price with a slight delay
                    if (currentPriceEl) {
                        setTimeout(() => {
                            currentPriceEl.classList.add('price-revealed');
                        }, 400);
                    }

                    offerObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        offerObserver.observe(offerCard);
    }

    // ========================================================================
    // 5. Animated Counters
    // ========================================================================
    let countersStarted = false;

    function startCounters(container) {
        if (countersStarted) return;

        // Find all counters within the container or page if container not specific enough
        const counters = container.querySelectorAll('.counter').length > 0
                         ? container.querySelectorAll('.counter')
                         : document.querySelectorAll('.counter');

        if(counters.length === 0) return;

        countersStarted = true;

        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 2000; // ms
            const step = target / (duration / 16); // 60fps

            let current = 0;

            const updateCounter = () => {
                current += step;
                if (current < target) {
                    counter.innerText = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.innerText = target;
                }
            };

            updateCounter();
        });
    }

    // ========================================================================
    // 6. Smooth Scrolling for Anchor Links (with countdown bar offset)
    // ========================================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = getCountdownHeight() + 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========================================================================
    // 7. Mobile Menu Toggle
    // ========================================================================
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if(mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            if (navLinks.style.display === 'flex') {
                navLinks.style.display = 'none';
            } else {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.backgroundColor = '#F9EDCE';
                navLinks.style.padding = '1rem';
                navLinks.style.boxShadow = '0 10px 10px rgba(0,0,0,0.1)';
                navLinks.style.borderBottom = '2px solid #D6C09C';
            }
        });
    }

    // ========================================================================
    // 8. Krishna Artwork Parallax Effect
    // ========================================================================
    const krishnaArtwork = document.getElementById('krishna-artwork');

    if (krishnaArtwork) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const heroSection = document.querySelector('.hero');
            if (!heroSection) return;

            const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;

            // Only apply parallax when hero is in view
            if (scrollY < heroBottom) {
                const translateY = scrollY * 0.08;
                krishnaArtwork.style.transform = `translateY(${-translateY}px)`;
            }
        }, { passive: true });
    }

});
