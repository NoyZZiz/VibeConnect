/**
 * VibeConnect - Main JavaScript File
 * Core functionality for all pages
 * Features:
 * - Mobile navigation
 * - Smooth scrolling
 * - Form validation
 * - Dynamic UI interactions
 * - Accessibility enhancements
 */

document.addEventListener('DOMContentLoaded', function() {
    // =====================
    // 1. MOBILE NAVIGATION
    // =====================
    const mobileMenuToggle = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle && navMenu) {
      mobileMenuToggle.addEventListener('click', function() {
        // Toggle menu visibility
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Accessibility updates
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
        navMenu.setAttribute('aria-hidden', isExpanded);
        
        // Lock body scroll when menu is open
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
      });
  
      // Close menu when clicking on links
      document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
          mobileMenuToggle.classList.remove('active');
          navMenu.classList.remove('active');
          document.body.style.overflow = '';
        });
      });
    }
  
    // =====================
    // 2. SMOOTH SCROLLING
    // =====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
  
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          // Accessibility focus management
          targetElement.setAttribute('tabindex', '-1');
          targetElement.focus({ preventScroll: true });
          
          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: 'smooth'
          });
  
          // Remove tabindex after scrolling
          setTimeout(() => targetElement.removeAttribute('tabindex'), 1000);
        }
      });
    });
  
    // =====================
    // 3. FORM VALIDATION
    // =====================
    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  
    document.querySelectorAll('form').forEach(form => {
      form.addEventListener('submit', function(e) {
        let isValid = true;
        const requiredFields = this.querySelectorAll('[required]');
  
        requiredFields.forEach(field => {
          field.classList.remove('error');
          const errorElement = field.nextElementSibling?.classList.contains('error-message') 
            ? field.nextElementSibling 
            : null;
  
          // Field-specific validation
          if (!field.value.trim()) {
            showError(field, 'This field is required');
            isValid = false;
          } else if (field.type === 'email' && !validateEmail(field.value)) {
            showError(field, 'Please enter a valid email');
            isValid = false;
          }
  
          // Remove validations on input
          field.addEventListener('input', () => {
            if (field.value.trim()) {
              field.classList.remove('error');
              if (errorElement) errorElement.remove();
            }
          });
        });
  
        if (!isValid) {
          e.preventDefault();
          this.querySelector('.error')?.focus();
        }
      });
    });
  
    function showError(field, message) {
      field.classList.add('error');
      const errorElement = document.createElement('div');
      errorElement.className = 'error-message';
      errorElement.textContent = message;
      field.parentNode.insertBefore(errorElement, field.nextSibling);
    }
  
    // =====================
    // 4. UI ENHANCEMENTS
    // =====================
    // Animate elements when they come into view
    const animateOnScroll = () => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      const windowHeight = window.innerHeight;
      const triggerPoint = windowHeight * 0.8;
  
      elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        
        if (elementPosition < triggerPoint) {
          element.classList.add('fade-in-up');
        }
      });
    };
  
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Initial check
  
    // =====================
    // 5. ACCESSIBILITY
    // =====================
    // Track input method (mouse vs keyboard)
    document.body.addEventListener('mousedown', () => {
      document.body.classList.add('using-mouse');
    });
  
    document.body.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.remove('using-mouse');
      }
    });
  
    // Better focus styles for keyboard users
    document.querySelectorAll('button, a, input, select').forEach(el => {
      el.addEventListener('focus', () => {
        if (!document.body.classList.contains('using-mouse')) {
          el.style.outline = '2px solid var(--primary)';
          el.style.outlineOffset = '2px';
        }
      });
      
      el.addEventListener('blur', () => {
        el.style.outline = '';
        el.style.outlineOffset = '';
      });
    });
  });
  
  // =====================
  // GLOBAL FUNCTIONS
  // =====================
  function debounce(func, wait = 100) {
    let timeout;
    return function() {
      const context = this, args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }