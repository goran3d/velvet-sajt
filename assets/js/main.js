/**
 * Textile Shop - Main JavaScript
 * Handles navigation, animations, and interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all modules
  initNavigation();
  initParallax();
  initScrollAnimations();
  initPageTransitions();
  initGoToTop();
});

/* ============================================
   NAVIGATION - Hide on scroll down, show on scroll up
   ============================================ */

function initNavigation() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const menuOverlay = document.querySelector('.menu-overlay');
  
  let lastScrollY = window.scrollY;
  let ticking = false;
  
  // Scroll hide/show behavior
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
  
  function handleScroll() {
    const currentScrollY = window.scrollY;
    
    // Remove compact class if at top of page
    if (currentScrollY < 100) {
      navbar.classList.remove('compact');
      lastScrollY = currentScrollY;
      return;
    }
    
    // Add compact when scrolling down, remove when scrolling up
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      // Scrolling down - make navbar smaller
      navbar.classList.add('compact');
    } else {
      // Scrolling up - restore full size
      navbar.classList.remove('compact');
    }
    
    lastScrollY = currentScrollY;
  }
  
  // Mobile menu toggle
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      const isActive = hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      menuOverlay.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
      
      // Update ARIA attributes
      hamburger.setAttribute('aria-expanded', isActive);
      mobileMenu.setAttribute('aria-hidden', !isActive);
    });
  }
  
  // Close mobile menu when clicking overlay or link
  if (menuOverlay) {
    menuOverlay.addEventListener('click', closeMobileMenu);
  }
  
  const mobileLinks = document.querySelectorAll('.mobile-menu .nav-link');
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });
  
  function closeMobileMenu() {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('active');
    menuOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  // Set active nav link based on current page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || 
        (currentPage === '' && href === 'index.html') ||
        (currentPage === 'index.html' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* ============================================
   PARALLAX EFFECT FOR HERO IMAGE
   ============================================ */

function initParallax() {
  const heroImage = document.querySelector('.hero-image img');
  
  if (!heroImage) return;
  
  let ticking = false;
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrolled = window.scrollY;
        const rate = scrolled * 0.4;
        
        // Limit the parallax to prevent image from moving too far
        const maxTranslate = 150;
        const translateY = Math.min(rate, maxTranslate);
        
        heroImage.style.transform = `translateY(${translateY}px) scale(1.1)`;
        
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ============================================
   SCROLL ANIMATIONS (Intersection Observer)
   ============================================ */

function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  
  if (animatedElements.length === 0) return;
  
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Optionally unobserve after animation
        // observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  animatedElements.forEach(element => {
    observer.observe(element);
  });
}

/* ============================================
   PAGE TRANSITIONS
   ============================================ */

function initPageTransitions() {
  // Add page-enter animation class to main content
  const main = document.querySelector('main') || document.querySelector('.page-content');
  if (main) {
    main.classList.add('page-transition');
  }
  
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

/* ============================================
   CONTACT FORM HANDLING
   ============================================ */

const contactForm = document.getElementById('contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    // Simple validation
    const name = data.name?.trim();
    const email = data.email?.trim();
    const message = data.message?.trim();
    
    if (!name || !email || !message) {
      alert('Please fill in all fields.');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }
    
    // Success - form would be submitted to server in production
    alert('Thank you for your message! We will get back to you soon.');
    contactForm.reset();
  });
}

/* ============================================
   BUTTON RIPPLE EFFECT
   ============================================ */

document.addEventListener('click', function(e) {
  const button = e.target.closest('.btn-textile, .btn-accent');
  if (button) {
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    button.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 500);
  }
});

/* ============================================
   LAZY LOADING FOR IMAGES
   ============================================ */

if ('IntersectionObserver' in window) {
  const lazyImages = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  });
  
  lazyImages.forEach(img => imageObserver.observe(img));
}

/* ============================================
   SMOOTH REVEAL FOR HERO CONTENT
   ============================================ */

// Re-trigger hero animations when page loads
window.addEventListener('load', () => {
  const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-cta');
  heroElements.forEach(el => {
    el.style.animation = 'none';
    el.offsetHeight; // Trigger reflow
    el.style.animation = null;
  });
});

/* ============================================
   GO TO TOP BUTTON
   ============================================ */

function initGoToTop() {
  const goToTopButton = document.getElementById('goToTop');
  
  if (!goToTopButton) return;
  
  // Show/hide button based on scroll position
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      goToTopButton.classList.add('visible');
    } else {
      goToTopButton.classList.remove('visible');
    }
  }, { passive: true });
  
  // Scroll to top when clicked
  goToTopButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */

// Debounce function for performance
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

// Throttle function for scroll events
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
