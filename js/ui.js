/* ============================================
   HAMI LLC - UI Effects Module
   Scroll animations, counters, tooltips,
   IntersectionObserver utilities
   ============================================ */

(function () {
    'use strict';

    // ─── Scroll Animation Observer ───
    function initScrollAnimations() {
        var elements = document.querySelectorAll('.animate-on-scroll');
        if (!elements.length) return;

        if ('IntersectionObserver' in window) {
            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated');
                        observer.unobserve(entry.target);
                    }
                });
            }, { root: null, rootMargin: '0px', threshold: 0.1 });

            elements.forEach(function (el) { observer.observe(el); });
        } else {
            // Fallback for older browsers
            function checkAnimations() {
                var triggerBottom = window.innerHeight * 0.85;
                elements.forEach(function (el) {
                    if (el.getBoundingClientRect().top < triggerBottom) {
                        el.classList.add('animated');
                    }
                });
            }
            window.addEventListener('scroll', checkAnimations);
            checkAnimations();
        }
    }

    // ─── Counter Animation ───
    function initCounterAnimation() {
        var counters = document.querySelectorAll('.counter');
        if (!counters.length) return;

        var animated = false;

        function animateCounters() {
            if (animated) return;
            var section = document.querySelector('.stats-section');
            if (!section) return;

            if (section.getBoundingClientRect().top < window.innerHeight * 0.8) {
                animated = true;
                window.removeEventListener('scroll', animateCounters);

                counters.forEach(function (counter) {
                    var target = parseInt(counter.getAttribute('data-target'), 10);
                    var duration = 2000;
                    var step = target / (duration / 16);
                    var current = 0;

                    (function update() {
                        current += step;
                        if (current < target) {
                            counter.textContent = Math.floor(current);
                            requestAnimationFrame(update);
                        } else {
                            var suffix = counter.getAttribute('data-suffix') || '';
                            counter.textContent = target + suffix;
                        }
                    })();
                });
            }
        }

        window.addEventListener('scroll', animateCounters);
        animateCounters();
    }

    // ─── Bootstrap Tooltip Init ───
    function initTooltips() {
        if (typeof bootstrap !== 'undefined') {
            var tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
            tooltips.forEach(function (el) { new bootstrap.Tooltip(el); });
        }
    }

    // ─── Dynamic Copyright Year ───
    function initCopyrightYear() {
        var yearEl = document.getElementById('currentYear');
        if (yearEl) {
            yearEl.textContent = new Date().getFullYear();
        }
    }

    // ─── Initialize All UI Effects ───
    function init() {
        initScrollAnimations();
        initCounterAnimation();
        initTooltips();
        initCopyrightYear();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
