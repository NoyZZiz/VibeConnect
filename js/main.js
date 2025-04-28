/**
 * VibeConnect - Main JavaScript File
 * Enhanced with accessibility, performance optimizations, and better UX
 */

document.addEventListener('DOMContentLoaded', function() {
    const currentPage = document.body.dataset.page; 
    // ===== MOBILE NAVIGATION TOGGLE =====
    const menuToggle = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        // Set initial ARIA attributes
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Toggle navigation menu');
        navMenu.setAttribute('aria-hidden', 'true');

        menuToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            this.setAttribute('aria-expanded', !isExpanded);
            navMenu.setAttribute('aria-hidden', isExpanded);
        });
        
        // Close mobile menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                navMenu.setAttribute('aria-hidden', 'true');
            });
        });
    }
    
    function handleScroll() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    }
    window.addEventListener('scroll', debounce(handleScroll));

    // ===== ABOUT PAGE SPECIFIC CODE =====
    if (currentPage === 'about') {
        // Team member interaction
        document.querySelectorAll('.team-member').forEach(member => {
            member.addEventListener('click', function() {
                this.querySelector('.team-member-details').classList.toggle('active');
            });
        });

        // Mission statement animation
        const missionSection = document.querySelector('.mission-statement');
        if (missionSection) {
            missionSection.classList.add('fade-in-up');
        }
    }

    // ===== CONTACT PAGE SPECIFIC CODE =====
    if (currentPage === 'contact') {
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Get form data
                const formData = new FormData(contactForm);
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                
                // Disable button during submission
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';
                
                // Simulate form submission
                setTimeout(() => {
                    contactForm.reset();
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Send Message';
                    
                    // Show success message
                    const successMsg = document.createElement('div');
                    successMsg.className = 'alert success';
                    successMsg.textContent = 'Your message has been sent successfully!';
                    contactForm.parentNode.insertBefore(successMsg, contactForm.nextSibling);
                    
                    // Remove message after 5 seconds
                    setTimeout(() => successMsg.remove(), 5000);
                }, 1500);
            });
        }

        // Map initialization
        if (document.getElementById('contact-map')) {
            initContactMap();
        }
    }

    // ===== BECOME A HOST PAGE SPECIFIC CODE =====
    if (currentPage === 'host') {
        const hostForm = document.getElementById('host-application');
        if (hostForm) {
            // Form step navigation
            const nextButtons = hostForm.querySelectorAll('.next-step');
            const prevButtons = hostForm.querySelectorAll('.prev-step');
            
            nextButtons.forEach(button => {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    const currentStep = this.closest('.form-step');
                    const nextStep = currentStep.nextElementSibling;
                    
                    if (validateStep(currentStep)) {
                        currentStep.classList.remove('active');
                        nextStep.classList.add('active');
                        updateStepProgress(nextStep.dataset.step);
                    }
                });
            });
            
            prevButtons.forEach(button => {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    const currentStep = this.closest('.form-step');
                    const prevStep = currentStep.previousElementSibling;
                    
                    currentStep.classList.remove('active');
                    prevStep.classList.add('active');
                    updateStepProgress(prevStep.dataset.step);
                });
            });
            
            // Form submission
            hostForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const submitBtn = hostForm.querySelector('button[type="submit"]');
                
                submitBtn.disabled = true;
                submitBtn.textContent = 'Submitting...';
                
                // Simulate API call
                setTimeout(() => {
                    // Show success message
                    const successSection = document.getElementById('application-success');
                    successSection.classList.remove('hidden');
                    hostForm.classList.add('hidden');
                }, 2000);
            });
            
            function validateStep(step) {
                let isValid = true;
                const requiredFields = step.querySelectorAll('[required]');
                
                requiredFields.forEach(field => {
                    if (!field.value.trim()) {
                        isValid = false;
                        field.classList.add('error');
                        const errorMsg = field.nextElementSibling || document.createElement('div');
                        errorMsg.className = 'error-message';
                        errorMsg.textContent = 'This field is required';
                        field.parentNode.insertBefore(errorMsg, field.nextSibling);
                    }
                });
                
                return isValid;
            }
            
            function updateStepProgress(stepNumber) {
                const progressBar = document.querySelector('.progress-bar');
                const steps = hostForm.querySelectorAll('.form-step');
                const progress = (stepNumber / steps.length) * 100;
                
                if (progressBar) {
                    progressBar.style.width = `${progress}%`;
                }
                
                // Update step indicators
                document.querySelectorAll('.step-indicator').forEach(indicator => {
                    if (indicator.dataset.step <= stepNumber) {
                        indicator.classList.add('completed');
                    } else {
                        indicator.classList.remove('completed');
                    }
                });
            }
        }
    }

    // ===== LOGIN MODAL FUNCTIONALITY =====
    const loginButtons = document.querySelectorAll('.login-btn, [href="#login"]');
    const loginModal = document.getElementById('login-modal');
    
    if (loginModal) {
        // Open modal
        loginButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                loginModal.classList.add('active');
                document.body.classList.add('modal-open');
                loginModal.querySelector('input[type="email"]').focus();
            });
        });
        
        // Close modal
        loginModal.querySelector('.close-modal').addEventListener('click', function() {
            loginModal.classList.remove('active');
            document.body.classList.remove('modal-open');
        });
        
        // Close when clicking outside
        loginModal.addEventListener('click', function(e) {
            if (e.target === loginModal) {
                loginModal.classList.remove('active');
                document.body.classList.remove('modal-open');
            }
        });
        
        // Login form submission
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const submitBtn = loginForm.querySelector('button[type="submit"]');
                
                submitBtn.disabled = true;
                submitBtn.textContent = 'Logging in...';
                
                // Simulate login
                setTimeout(() => {
                    // In a real app, you would handle the API response here
                    window.location.reload(); // Refresh to show logged-in state
                }, 1500);
            });
        }
    }


    function debounce(func, wait = 20, immediate = true) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    window.addEventListener('scroll', debounce(handleScroll));
    
    // ===== ENHANCED TESTIMONIAL SLIDER =====
    const testimonials = document.querySelectorAll('.testimonial');
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');
    
    if (testimonials.length > 0 && prevBtn && nextBtn) {
        let currentTestimonial = 0;
        let autoSlideInterval;
        
        function showTestimonial(index) {
            testimonials.forEach(testimonial => {
                testimonial.classList.remove('active');
                testimonial.setAttribute('aria-hidden', 'true');
            });
            testimonials[index].classList.add('active');
            testimonials[index].setAttribute('aria-hidden', 'false');
            
            // Update ARIA live region for screen readers
            const liveRegion = document.getElementById('testimonial-live-region') || 
                (() => {
                    const region = document.createElement('div');
                    region.id = 'testimonial-live-region';
                    region.className = 'sr-only';
                    region.setAttribute('aria-live', 'polite');
                    document.body.appendChild(region);
                    return region;
                })();
            liveRegion.textContent = `Showing testimonial ${index + 1} of ${testimonials.length}`;
        }
        
        function nextTestimonial() {
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            showTestimonial(currentTestimonial);
        }
        
        function prevTestimonial() {
            currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
            showTestimonial(currentTestimonial);
        }
        
        nextBtn.addEventListener('click', nextTestimonial);
        prevBtn.addEventListener('click', prevTestimonial);
        
        // Keyboard navigation
        nextBtn.addEventListener('keydown', (e) => e.key === 'Enter' && nextTestimonial());
        prevBtn.addEventListener('keydown', (e) => e.key === 'Enter' && prevTestimonial());
        
        // Auto-rotation if multiple testimonials
        if (testimonials.length > 1) {
            function startAutoSlide() {
                autoSlideInterval = setInterval(nextTestimonial, 5000);
            }
            
            startAutoSlide();
            
            const sliderContainer = document.querySelector('.testimonial-slider');
            if (sliderContainer) {
                sliderContainer.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
                sliderContainer.addEventListener('mouseleave', startAutoSlide);
                sliderContainer.addEventListener('focusin', () => clearInterval(autoSlideInterval));
                sliderContainer.addEventListener('focusout', startAutoSlide);
            }
        }
        
        // Initialize first testimonial
        showTestimonial(0);
    }
    
    // ===== ENHANCED SEARCH FUNCTIONALITY =====
    const searchBtn = document.querySelector('.search-btn');
    const cityFilter = document.getElementById('city-filter');
    const categoryFilter = document.getElementById('category-filter');
    
    if (searchBtn && cityFilter && categoryFilter) {
        function handleSearch() {
            const city = cityFilter.value;
            const category = categoryFilter.value;
            
            if (city || category) {
                const queryParams = new URLSearchParams();
                if (city) queryParams.set('city', city);
                if (category) queryParams.set('category', category);
                window.location.href = `experiences.html?${queryParams.toString()}`;
            } else {
                window.location.href = 'experiences.html';
            }
        }
        
        searchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleSearch();
        });
        
        // Allow search on Enter key in filters
        [cityFilter, categoryFilter].forEach(filter => {
            filter.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSearch();
                }
            });
        });
    }
    
    // ===== SMOOTH SCROLLING FOR ANCHOR LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Focus the target element for accessibility
                targetElement.setAttribute('tabindex', '-1');
                targetElement.focus();
                
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Remove tabindex after focus
                setTimeout(() => targetElement.removeAttribute('tabindex'), 1000);
            }
        });
    });
    
    // ===== IMPROVED ANIMATIONS WITH INTERSECTION OBSERVER =====
    function initAnimations() {
        if ('IntersectionObserver' in window) {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -100px 0px'
            };
            
            const animationObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('fade-in-up');
                        animationObserver.unobserve(entry.target);
                    }
                });
            }, observerOptions);
            
            document.querySelectorAll('.category-card, .experience-card, .step, .city-card')
                .forEach(el => animationObserver.observe(el));
        } else {
            // Fallback for browsers without IntersectionObserver
            function animateOnScroll() {
                const elements = document.querySelectorAll('.category-card, .experience-card, .step, .city-card');
                const screenPosition = window.innerHeight / 1.2;
                
                elements.forEach(element => {
                    if (element.getBoundingClientRect().top < screenPosition) {
                        element.classList.add('fade-in-up');
                    }
                });
            }
            
            window.addEventListener('scroll', debounce(animateOnScroll));
            animateOnScroll();
        }
    }
    initAnimations();
    
    // ===== ENHANCED FORM VALIDATION =====
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const showError = (field, message) => {
            let errorElement = field.nextElementSibling;
            if (!errorElement || !errorElement.classList.contains('error-message')) {
                errorElement = document.createElement('div');
                errorElement.className = 'error-message';
                errorElement.setAttribute('role', 'alert');
                field.parentNode.insertBefore(errorElement, field.nextSibling);
            }
            errorElement.textContent = message;
            field.classList.add('error');
            field.setAttribute('aria-invalid', 'true');
        };

        const clearError = (field) => {
            field.classList.remove('error');
            field.removeAttribute('aria-invalid');
            const errorElement = field.nextElementSibling;
            if (errorElement?.classList.contains('error-message')) {
                errorElement.remove();
            }
        };

        const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        form.addEventListener('submit', function(e) {
            let isValid = true;
            const requiredFields = form.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    showError(field, 'This field is required');
                } else if (field.type === 'email' && !isValidEmail(field.value)) {
                    isValid = false;
                    showError(field, 'Please enter a valid email');
                }
            });

            if (!isValid) {
                e.preventDefault();
                // Focus first invalid field
                const firstInvalid = form.querySelector('.error');
                if (firstInvalid) {
                    firstInvalid.focus();
                }
            }
        });

        // Live validation
        form.querySelectorAll('[required]').forEach(field => {
            field.addEventListener('input', () => {
                if (field.value.trim()) {
                    if (field.type === 'email' && !isValidEmail(field.value)) {
                        showError(field, 'Please enter a valid email');
                    } else {
                        clearError(field);
                    }
                }
            });
            
            field.addEventListener('blur', () => {
                if (!field.value.trim()) {
                    showError(field, 'This field is required');
                }
            });
        });
    });

    // ===== ENHANCE ALL BUTTONS AND INTERACTIVE ELEMENTS =====
    document.querySelectorAll('button, a, input, select').forEach(element => {
        // Add focus styles for keyboard navigation
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid var(--primary)';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = '';
            this.style.outlineOffset = '';
        });
    });
});

// Initialize any global functionality that doesn't need DOM ready
(function() {
    // Add class to body for JavaScript-enabled browsers
    document.body.classList.add('js-enabled');
    
    // Prevent focus outline when clicking, but keep for keyboard
    document.body.addEventListener('mousedown', function() {
        document.body.classList.add('using-mouse');
    });
    
    document.body.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.remove('using-mouse');
        }
    });
})();