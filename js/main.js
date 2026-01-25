/* ============================================
   AL HAMIDIYAH GEN TR LLC (HAMI) - Main JavaScript
   Corporate Engineering & Marine Solutions
   ============================================ */

/**
 * TABLE OF CONTENTS
 * 1. DOM Content Loaded
 * 2. Preloader
 * 3. Navbar Scroll Effects
 * 4. Back to Top Button
 * 5. Scroll Animations
 * 6. Counter Animation
 * 7. Form Validation
 * 8. Mobile Navigation
 * 9. Smooth Scroll
 * 10. Active Navigation Link
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ============================================
    // 2. Preloader
    // ============================================
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        window.addEventListener('load', function() {
            setTimeout(function() {
                preloader.classList.add('hidden');
            }, 500);
        });
    }

    // ============================================
    // 3. Navbar Scroll Effects
    // ============================================
    const navbar = document.querySelector('.navbar');
    const navbarHeight = navbar ? navbar.offsetHeight : 80;

    function handleNavbarScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    if (navbar) {
        window.addEventListener('scroll', handleNavbarScroll);
        handleNavbarScroll(); // Initial check
    }

    // ============================================
    // 4. Back to Top Button
    // ============================================
    const backToTopBtn = document.querySelector('.back-to-top');

    function handleBackToTop() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }

    if (backToTopBtn) {
        window.addEventListener('scroll', handleBackToTop);
        handleBackToTop(); // Initial check

        backToTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ============================================
    // 5. Scroll Animations
    // ============================================
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    function checkAnimations() {
        const triggerBottom = window.innerHeight * 0.85;

        animatedElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;

            if (elementTop < triggerBottom) {
                element.classList.add('animated');
            }
        });
    }

    if (animatedElements.length > 0) {
        window.addEventListener('scroll', checkAnimations);
        checkAnimations(); // Initial check
    }

    // ============================================
    // 6. Counter Animation
    // ============================================
    const counters = document.querySelectorAll('.counter');
    let countersAnimated = false;

    function animateCounters() {
        if (countersAnimated) return;

        const statsSection = document.querySelector('.stats-section');
        if (!statsSection) return;

        const statsSectionTop = statsSection.getBoundingClientRect().top;
        const triggerBottom = window.innerHeight * 0.8;

        if (statsSectionTop < triggerBottom) {
            countersAnimated = true;

            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = 2000; // 2 seconds
                const step = target / (duration / 16); // 60fps
                let current = 0;

                const updateCounter = () => {
                    current += step;
                    if (current < target) {
                        counter.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                        // Add suffix if exists
                        const suffix = counter.getAttribute('data-suffix') || '';
                        counter.textContent = target + suffix;
                    }
                };

                updateCounter();
            });
        }
    }

    if (counters.length > 0) {
        window.addEventListener('scroll', animateCounters);
        animateCounters(); // Initial check
    }

    // ============================================
    // 7. Form Validation
    // ============================================
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form fields
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const phone = document.getElementById('phone');
            const subject = document.getElementById('subject');
            const message = document.getElementById('message');

            // Clear previous errors
            clearErrors();

            // Validation flags
            let isValid = true;

            // Name validation
            if (!name.value.trim()) {
                showError(name, 'Please enter your name');
                isValid = false;
            } else if (name.value.trim().length < 2) {
                showError(name, 'Name must be at least 2 characters');
                isValid = false;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email.value.trim()) {
                showError(email, 'Please enter your email address');
                isValid = false;
            } else if (!emailRegex.test(email.value.trim())) {
                showError(email, 'Please enter a valid email address');
                isValid = false;
            }

            // Phone validation (optional but if provided, must be valid)
            const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
            if (phone.value.trim() && !phoneRegex.test(phone.value.trim())) {
                showError(phone, 'Please enter a valid phone number');
                isValid = false;
            }

            // Subject validation
            if (subject && !subject.value.trim()) {
                showError(subject, 'Please enter a subject');
                isValid = false;
            }

            // Message validation
            if (!message.value.trim()) {
                showError(message, 'Please enter your message');
                isValid = false;
            } else if (message.value.trim().length < 10) {
                showError(message, 'Message must be at least 10 characters');
                isValid = false;
            }

            // If valid, submit form
            if (isValid) {
                // Show loading state
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitBtn.disabled = true;

                // Simulate form submission (replace with actual AJAX call)
                setTimeout(function() {
                    // Reset button
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;

                    // Show success message
                    showSuccessMessage('Thank you for your message! We will get back to you soon.');

                    // Reset form
                    contactForm.reset();
                }, 1500);
            }
        });

        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });

            input.addEventListener('input', function() {
                // Remove error on input
                const errorElement = this.parentElement.querySelector('.invalid-feedback');
                if (errorElement) {
                    errorElement.remove();
                }
                this.classList.remove('is-invalid');
            });
        });
    }

    /**
     * Show error message for a field
     * @param {HTMLElement} field - The input field
     * @param {string} message - Error message
     */
    function showError(field, message) {
        field.classList.add('is-invalid');
        
        // Remove existing error if any
        const existingError = field.parentElement.querySelector('.invalid-feedback');
        if (existingError) {
            existingError.remove();
        }

        const errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback';
        errorDiv.textContent = message;
        field.parentElement.appendChild(errorDiv);
    }

    /**
     * Clear all error messages
     */
    function clearErrors() {
        const errors = document.querySelectorAll('.invalid-feedback');
        errors.forEach(error => error.remove());

        const invalidFields = document.querySelectorAll('.is-invalid');
        invalidFields.forEach(field => field.classList.remove('is-invalid'));
    }

    /**
     * Validate individual field
     * @param {HTMLElement} field - The input field
     */
    function validateField(field) {
        const value = field.value.trim();
        const fieldType = field.getAttribute('type') || field.tagName.toLowerCase();
        const fieldId = field.id;

        // Remove existing error
        const existingError = field.parentElement.querySelector('.invalid-feedback');
        if (existingError) {
            existingError.remove();
        }
        field.classList.remove('is-invalid');

        switch (fieldId) {
            case 'name':
                if (!value) {
                    showError(field, 'Please enter your name');
                } else if (value.length < 2) {
                    showError(field, 'Name must be at least 2 characters');
                }
                break;

            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value) {
                    showError(field, 'Please enter your email address');
                } else if (!emailRegex.test(value)) {
                    showError(field, 'Please enter a valid email address');
                }
                break;

            case 'message':
                if (!value) {
                    showError(field, 'Please enter your message');
                } else if (value.length < 10) {
                    showError(field, 'Message must be at least 10 characters');
                }
                break;
        }
    }

    /**
     * Show success message
     * @param {string} message - Success message
     */
    function showSuccessMessage(message) {
        // Remove existing messages
        const existingMessage = document.querySelector('.alert-success-custom');
        if (existingMessage) {
            existingMessage.remove();
        }

        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert-success-custom';
        alertDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        
        contactForm.insertBefore(alertDiv, contactForm.firstChild);

        // Auto remove after 5 seconds
        setTimeout(function() {
            alertDiv.remove();
        }, 5000);
    }

    // ============================================
    // 8. Mobile Navigation
    // ============================================
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
            if (!navbarCollapse.contains(e.target) && !navbarToggler.contains(e.target)) {
                const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                if (bsCollapse) {
                    bsCollapse.hide();
                }
            }
        }
    });

    // Close mobile menu when clicking on a nav link
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                if (bsCollapse) {
                    bsCollapse.hide();
                }
            }
        });
    });

    // ============================================
    // 9. Smooth Scroll for Anchor Links
    // ============================================
    const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');

    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const offsetTop = targetElement.offsetTop - navbarHeight;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // 10. Active Navigation Link
    // ============================================
    function setActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            
            if (linkHref === currentPage || 
                (currentPage === '' && linkHref === 'index.html') ||
                (currentPage === 'index.html' && linkHref === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    setActiveNavLink();

    // ============================================
    // Additional Utility Functions
    // ============================================

    /**
     * Debounce function for performance optimization
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Throttle function for scroll events
     * @param {Function} func - Function to throttle
     * @param {number} limit - Time limit in milliseconds
     */
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Apply throttle to scroll events for better performance
    const throttledScrollHandler = throttle(function() {
        handleNavbarScroll();
        handleBackToTop();
        checkAnimations();
        animateCounters();
    }, 100);

    window.addEventListener('scroll', throttledScrollHandler);

    // ============================================
    // Intersection Observer for Animations
    // ============================================
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    // ============================================
    // Initialize Tooltips (if Bootstrap is loaded)
    // ============================================
    if (typeof bootstrap !== 'undefined') {
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        tooltipTriggerList.forEach(tooltipTriggerEl => {
            new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }

    // ============================================
    // Console Message
    // ============================================
    console.log('%c🚢 AL HAMIDIYAH GEN TR LLC (HAMI)', 'color: #0a2647; font-size: 20px; font-weight: bold;');
    console.log('%cGlobal Engineering & Marine Solutions Partner', 'color: #e85d04; font-size: 14px;');
    console.log('%cwww.hamillc.com', 'color: #5c6574; font-size: 12px;');

});

// ============================================
// Quote Request Modal (if needed)
// ============================================
function openQuoteModal(service = '') {
    const modal = document.getElementById('quoteModal');
    if (modal && typeof bootstrap !== 'undefined') {
        const bsModal = new bootstrap.Modal(modal);
        
        // Pre-fill service if provided
        const serviceField = modal.querySelector('#quoteService');
        if (serviceField && service) {
            serviceField.value = service;
        }
        
        bsModal.show();
    }
}

// ============================================
// Service Worker Registration (for PWA support)
// ============================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment the following lines if you want to add PWA support
        // navigator.serviceWorker.register('/sw.js')
        //     .then(function(registration) {
        //         console.log('ServiceWorker registration successful');
        //     })
        //     .catch(function(err) {
        //         console.log('ServiceWorker registration failed: ', err);
        //     });
    });
}
