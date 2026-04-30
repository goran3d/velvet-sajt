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
  initProtectedLinks();
  initFAQ();
  initTypewriter();
});

/* ============================================
   NAVIGATION - Hide on scroll down, show on scroll up
   ============================================ */

function initNavigation() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const menuOverlay = document.querySelector('.menu-overlay');
  
  // Always add compact class for pill nav immediately (no animation)
  if (navbar) {
    navbar.classList.add('compact');
    // Force reflow to ensure class is applied before any transitions
    void navbar.offsetHeight;
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
    
    // Update ARIA attributes
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
  }
  
  // Set active nav link based on current page
  const pathSegments = window.location.pathname.split('/').filter(Boolean);
  const currentPage = pathSegments.length > 0 ? pathSegments[pathSegments.length - 1] : 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    // Handle subdirectory structure
    if (href === currentPage || 
        (currentPage === '' && href === 'index.html') ||
        (currentPage === 'index.html' && href === 'index.html') ||
        (currentPage === 'index.html' && href === '../index.html') ||
        (pathSegments.length === 1 && href === '../index.html')) {
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
  // Skip page transition animation to prevent navbar zoom effect
  // const main = document.querySelector('main') || document.querySelector('.page-content');
  // if (main) {
  //   main.classList.add('page-transition');
  // }
  
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

/* ============================================
   PROTECTED LINKS - Email/Phone Obfuscation
   ============================================ */

function initProtectedLinks() {
  const protectedLinks = document.querySelectorAll('.protected-link');
  
  protectedLinks.forEach(link => {
    const type = link.dataset.type;
    const encoded = link.dataset.encoded;
    
    if (!type || !encoded) return;
    
    // Decode base64
    const decoded = atob(encoded);
    
    // Set proper href based on type
    if (type === 'email') {
      link.href = `mailto:${decoded}`;
    } else if (type === 'phone') {
      // Remove slashes for tel: link
      const cleanPhone = decoded.replace(/\//g, '');
      link.href = `tel:${cleanPhone}`;
    } else if (type === 'instagram') {
      link.href = decoded;
    }
  });
}

/* ============================================
   FAQ ACCORDION
   ============================================ */

function initFAQ() {
  const faqCards = document.querySelectorAll('[data-faq]');
  
  faqCards.forEach(card => {
    const question = card.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
      // Close all other cards
      faqCards.forEach(otherCard => {
        if (otherCard !== card) {
          otherCard.classList.remove('active');
        }
      });
      
      // Toggle current card
      card.classList.toggle('active');
    });
  });
}

/* ============================================
   TYPEWRITER ANIMATION
   ============================================ */

function initTypewriter() {
  const typewriterElement = document.querySelector('.typewriter');
  const cursorElement = document.querySelector('.cursor');
  const subtitleElement = document.querySelector('.subtitle-animate');
  
  if (!typewriterElement || !cursorElement) return;
  
  const text = typewriterElement.getAttribute('data-text');
  if (!text) return;
  
  let index = 0;
  const typingSpeed = 100; // ms per character
  
  function typeCharacter() {
    if (index < text.length) {
      typewriterElement.textContent += text.charAt(index);
      index++;
      setTimeout(typeCharacter, typingSpeed);
    } else {
      // Hide cursor when typing is complete
      cursorElement.classList.add('hidden');
      
      // Trigger subtitle animation after 100ms delay
      if (subtitleElement) {
        setTimeout(() => {
          subtitleElement.classList.add('active');
        }, 100);
      }
    }
  }
  
  // Start typing after a short delay
  setTimeout(typeCharacter, 500);
}
