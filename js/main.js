/* ============================================
   AL HAMIDIYAH GEN TR LLC (HAMI) - Main JavaScript
   General site logic: Preloader, Navbar, Back-to-Top,
   Form Validation, Mobile Nav, Smooth Scroll, Active Link
   
   UI effects  -> ui.js
   Chat bot    -> chat.js
   Shop / Cart -> shop.js
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    // ============================================
    // Preloader
    // ============================================
    var preloader = document.querySelector('.preloader');
    if (preloader) {
        window.addEventListener('load', function () {
            setTimeout(function () {
                preloader.classList.add('hidden');
            }, 500);
        });
    }

    // ============================================
    // Navbar Scroll Effects
    // ============================================
    var navbar = document.querySelector('.navbar');
    var navbarHeight = navbar ? navbar.offsetHeight : 80;

    function handleNavbarScroll() {
        if (!navbar) return;
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    if (navbar) {
        window.addEventListener('scroll', handleNavbarScroll);
        handleNavbarScroll();
    }

    // ============================================
    // Back to Top Button
    // ============================================
    var backToTopBtn = document.querySelector('.back-to-top');

    function handleBackToTop() {
        if (!backToTopBtn) return;
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }

    if (backToTopBtn) {
        window.addEventListener('scroll', handleBackToTop);
        handleBackToTop();

        backToTopBtn.addEventListener('click', function (e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ============================================
    // Form Validation (Contact Page)
    // ============================================
    var contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            var name = document.getElementById('name');
            var email = document.getElementById('email');
            var phone = document.getElementById('phone');
            var subject = document.getElementById('subject');
            var message = document.getElementById('message');

            clearErrors();

            var isValid = true;
            var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            var phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

            if (!name.value.trim()) { showError(name, 'Please enter your name'); isValid = false; }
            else if (name.value.trim().length < 2) { showError(name, 'Name must be at least 2 characters'); isValid = false; }

            if (!email.value.trim()) { showError(email, 'Please enter your email address'); isValid = false; }
            else if (!emailRegex.test(email.value.trim())) { showError(email, 'Please enter a valid email address'); isValid = false; }

            if (phone && phone.value.trim() && !phoneRegex.test(phone.value.trim())) {
                showError(phone, 'Please enter a valid phone number'); isValid = false;
            }

            if (subject && !subject.value.trim()) { showError(subject, 'Please enter a subject'); isValid = false; }

            if (!message.value.trim()) { showError(message, 'Please enter your message'); isValid = false; }
            else if (message.value.trim().length < 10) { showError(message, 'Message must be at least 10 characters'); isValid = false; }

            var privacy = document.getElementById('privacy');
            if (privacy && !privacy.checked) { showError(privacy, 'You must agree to continue'); isValid = false; }

            if (isValid) {
                var submitBtn = contactForm.querySelector('button[type="submit"]');
                var originalBtnText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitBtn.disabled = true;

                setTimeout(function () {
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                    showSuccessMessage('Thank you for your message! We will get back to you soon.');
                    contactForm.reset();
                }, 1500);
            }
        });

        // Real-time validation on blur
        var inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(function (input) {
            input.addEventListener('blur', function () { validateField(this); });
            input.addEventListener('input', function () {
                var err = this.parentElement.querySelector('.invalid-feedback');
                if (err) err.remove();
                this.classList.remove('is-invalid');
            });
        });
    }

    function showError(field, message) {
        field.classList.add('is-invalid');
        var existing = field.parentElement.querySelector('.invalid-feedback');
        if (existing) existing.remove();
        var div = document.createElement('div');
        div.className = 'invalid-feedback';
        div.textContent = message;
        field.parentElement.appendChild(div);
    }

    function clearErrors() {
        document.querySelectorAll('.invalid-feedback').forEach(function (e) { e.remove(); });
        document.querySelectorAll('.is-invalid').forEach(function (f) { f.classList.remove('is-invalid'); });
    }

    function validateField(field) {
        var value = field.value.trim();
        var id = field.id;
        var existing = field.parentElement.querySelector('.invalid-feedback');
        if (existing) existing.remove();
        field.classList.remove('is-invalid');

        if (id === 'name') {
            if (!value) showError(field, 'Please enter your name');
            else if (value.length < 2) showError(field, 'Name must be at least 2 characters');
        } else if (id === 'email') {
            var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value) showError(field, 'Please enter your email address');
            else if (!emailRegex.test(value)) showError(field, 'Please enter a valid email address');
        } else if (id === 'message') {
            if (!value) showError(field, 'Please enter your message');
            else if (value.length < 10) showError(field, 'Message must be at least 10 characters');
        }
    }

    function showSuccessMessage(message) {
        var existing = document.querySelector('.alert-success-custom');
        if (existing) existing.remove();
        var div = document.createElement('div');
        div.className = 'alert-success-custom';
        div.innerHTML = '<i class="fas fa-check-circle"></i> ' + message;
        contactForm.insertBefore(div, contactForm.firstChild);
        setTimeout(function () { div.remove(); }, 5000);
    }

    // ============================================
    // Mobile Navigation
    // ============================================
    var navbarToggler = document.querySelector('.navbar-toggler');
    var navbarCollapse = document.querySelector('.navbar-collapse');

    document.addEventListener('click', function (e) {
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
            if (!navbarCollapse.contains(e.target) && !navbarToggler.contains(e.target)) {
                var bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                if (bsCollapse) bsCollapse.hide();
            }
        }
    });

    var navLinks = document.querySelectorAll('.navbar-nav .nav-link:not(.nav-more-toggle)');
    navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                var bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                if (bsCollapse) bsCollapse.hide();
            }
        });
    });

    // ============================================
    // "More" Dropdown — Desktop Hover + Mobile Accordion
    // ============================================
    var moreDropdown = document.querySelector('.nav-more-dropdown');
    var moreToggle = document.querySelector('.nav-more-toggle');
    var moreMenu = document.querySelector('.nav-more-menu');

    if (moreToggle && moreDropdown) {
        // Prevent default anchor behavior
        moreToggle.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            // Mobile accordion toggle
            if (window.innerWidth < 992) {
                moreDropdown.classList.toggle('open');
            }
        });

        // Close dropdown when clicking a submenu link (mobile)
        if (moreMenu) {
            var subLinks = moreMenu.querySelectorAll('a');
            subLinks.forEach(function (link) {
                link.addEventListener('click', function () {
                    moreDropdown.classList.remove('open');
                    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                        var bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                        if (bsCollapse) bsCollapse.hide();
                    }
                });
            });
        }

        // Close dropdown when clicking outside (desktop)
        document.addEventListener('click', function (e) {
            if (!moreDropdown.contains(e.target)) {
                moreDropdown.classList.remove('open');
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                moreDropdown.classList.remove('open');
            }
        });

        // Update aria-expanded
        var observer = new MutationObserver(function () {
            var isOpen = moreDropdown.classList.contains('open');
            moreToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
        observer.observe(moreDropdown, { attributes: true, attributeFilter: ['class'] });
    }

    // ============================================
    // Smooth Scroll for Anchor Links
    // ============================================
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({ top: target.offsetTop - navbarHeight, behavior: 'smooth' });
            }
        });
    });

    // ============================================
    // Active Navigation Link
    // ============================================
    function setActiveNavLink() {
        var currentPage = window.location.pathname.split('/').pop() || 'index.html';
        var allNavLinks = document.querySelectorAll('.navbar-nav .nav-link:not(.nav-more-toggle)');
        allNavLinks.forEach(function (link) {
            var href = link.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Handle "More" dropdown children — highlight More toggle if a child is active
        var moreToggleEl = document.querySelector('.nav-more-toggle');
        var moreMenuLinks = document.querySelectorAll('.nav-more-menu a');
        var moreChildActive = false;
        moreMenuLinks.forEach(function (link) {
            var href = link.getAttribute('href');
            if (href === currentPage) {
                link.classList.add('active');
                moreChildActive = true;
            } else {
                link.classList.remove('active');
            }
        });
        if (moreToggleEl) {
            if (moreChildActive) {
                moreToggleEl.classList.add('active');
            } else {
                moreToggleEl.classList.remove('active');
            }
        }
    }

    setActiveNavLink();

    // ============================================
    // Partnership Page — Floating Particles
    // ============================================
    var particleContainer = document.getElementById('partnershipParticles');
    if (particleContainer) {
        for (var i = 0; i < 30; i++) {
            var particle = document.createElement('span');
            particle.classList.add('partnership-particle');
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = (6 + Math.random() * 10) + 's';
            particle.style.animationDelay = (Math.random() * 8) + 's';
            particle.style.width = (2 + Math.random() * 4) + 'px';
            particle.style.height = particle.style.width;
            particleContainer.appendChild(particle);
        }
    }

});
