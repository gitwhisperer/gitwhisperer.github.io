/**
 * Harshit Tinker Portfolio — Main JavaScript
 * Premium interactions, animations, and form handling
 */

(function() {
  'use strict';

  // Utility selectors
  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];

  // ============================================
  // INITIALIZATION
  // ============================================
  
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initLoader();
    initYear();
    initNavigation();
    initScrollEffects();
    initRevealAnimations();
    initContactForm();
    initSmoothScroll();
    initBackToTop();
    initTypingAnimation();
    initTiltEffect();
    initEmailProtection();
  }

  // ============================================
  // LOADING SCREEN
  // ============================================
  
  function initLoader() {
    const loader = $('#loader');
    if (!loader) return;
    
    const hideLoader = () => {
      setTimeout(() => {
        loader.classList.add('loaded');
      }, 1600); // Match the CSS animation duration
    };
    
    // Check if page is already loaded
    if (document.readyState === 'complete') {
      hideLoader();
    } else {
      // Wait for load event
      window.addEventListener('load', hideLoader);
    }
  }

  // ============================================
  // YEAR UPDATE
  // ============================================
  
  function initYear() {
    const yearEl = $('#year');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  }

  // ============================================
  // NAVIGATION
  // ============================================
  
  function initNavigation() {
    const nav = $('#nav');
    const toggle = $('.nav-toggle');
    const links = $('#nav-links');
    const navLinks = $$('.nav-link');

    if (!nav || !toggle || !links) return;

    // Mobile menu toggle
    toggle.addEventListener('click', () => {
      const isOpen = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (links.classList.contains('open') && 
          !toggle.contains(e.target) && 
          !links.contains(e.target)) {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && links.classList.contains('open')) {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  // ============================================
  // SCROLL EFFECTS
  // ============================================
  
  function initScrollEffects() {
    const nav = $('#nav');
    const sections = $$('section[id]');
    const navLinks = $$('.nav-link[data-section]');
    
    let scrollTicking = false;
    
    const onScroll = () => {
      if (!scrollTicking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          
          // Nav background on scroll
          if (nav) {
            nav.classList.toggle('scrolled', scrollY > 50);
          }
          
          // Active section highlighting
          let currentSection = '';
          sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.offsetHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
              currentSection = section.getAttribute('id');
            }
          });
          
          navLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.section === currentSection);
          });
          
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    };
    
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // Initial call
  }

  // ============================================
  // EMAIL PROTECTION (Anti-Spam)
  // ============================================
  
  function initEmailProtection() {
    const emailLinks = $$('.email-link');
    
    emailLinks.forEach(link => {
      const user = link.dataset.user;
      const domain = link.dataset.domain;
      
      if (!user || !domain) return;
      
      // Construct email only when needed
      const constructEmail = () => user + '@' + domain;
      
      // Update display text if present
      const emailText = link.querySelector('.email-text');
      if (emailText) {
        emailText.textContent = constructEmail();
      }
      
      // Handle click - open mail client
      link.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'mailto:' + constructEmail();
      });
      
      // Set href for right-click copy
      link.href = 'mailto:' + constructEmail();
    });
  }

  // ============================================
  // REVEAL ANIMATIONS
  // ============================================
  
  function initRevealAnimations() {
    const revealElements = $$('[data-reveal], [data-reveal-stagger]');
    
    if (!revealElements.length) return;
    
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    revealElements.forEach(el => observer.observe(el));
  }

  // ============================================
  // SMOOTH SCROLL
  // ============================================
  
  function initSmoothScroll() {
    $$('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;
        
        const target = $(targetId);
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

  // ============================================
  // CONTACT FORM (Formspree Integration)
  // ============================================
  
  function initContactForm() {
    const form = $('#contact-form');
    const status = $('#form-status');
    
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(form);
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      
      // Honeypot check
      if (formData.get('_gotcha')) {
        return;
      }
      
      // Show loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span>Sending...</span>
        <svg class="spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" opacity="0.25"/>
          <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round">
            <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite"/>
          </path>
        </svg>
      `;
      
      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (response.ok) {
          showStatus('success', 'Thanks! Your message has been sent. I\'ll get back to you soon.');
          form.reset();
        } else {
          const data = await response.json();
          if (data.errors) {
            showStatus('error', data.errors.map(e => e.message).join(', '));
          } else {
            showStatus('error', 'Something went wrong. Please try again or email me directly.');
          }
        }
      } catch (error) {
        showStatus('error', 'Network error. Please check your connection and try again.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
    });
    
    function showStatus(type, message) {
      if (!status) return;
      
      status.hidden = false;
      status.className = `form-status ${type}`;
      status.textContent = message;
      
      // Auto-hide success message after 5 seconds
      if (type === 'success') {
        setTimeout(() => {
          status.hidden = true;
        }, 5000);
      }
    }
  }

  // ============================================
  // MAGNETIC BUTTON EFFECT (Optional Enhancement)
  // ============================================
  
  function initMagneticButtons() {
    const magneticBtns = $$('.btn-primary, .nav-cta');
    
    magneticBtns.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
      });
      
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  // ============================================
  // CURSOR FOLLOWER (Optional Enhancement)
  // ============================================
  
  function initCursorFollower() {
    // Skip on touch devices
    if ('ontouchstart' in window) return;
    
    const cursor = document.createElement('div');
    cursor.className = 'cursor-follower';
    cursor.style.cssText = `
      position: fixed;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: rgba(0, 245, 212, 0.3);
      pointer-events: none;
      z-index: 9999;
      transition: transform 0.1s ease-out, opacity 0.3s;
      opacity: 0;
    `;
    document.body.appendChild(cursor);
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.opacity = '1';
    });
    
    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
    });
    
    function animateCursor() {
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;
      cursor.style.left = cursorX - 10 + 'px';
      cursor.style.top = cursorY - 10 + 'px';
      requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Grow on interactive elements
    const interactives = $$('a, button, .bento-card');
    interactives.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(2)';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
      });
    });
  }

  // ============================================
  // SERVICE WORKER (PWA)
  // ============================================
  
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    });
  }

  // ============================================
  // BACK TO TOP BUTTON
  // ============================================
  
  function initBackToTop() {
    const backToTop = $('#back-to-top');
    if (!backToTop) return;
    
    const showThreshold = 400;
    
    // Remove hidden attribute and use class-based visibility
    backToTop.removeAttribute('hidden');
    
    const updateVisibility = () => {
      const shouldShow = window.scrollY > showThreshold;
      backToTop.classList.toggle('visible', shouldShow);
    };
    
    window.addEventListener('scroll', updateVisibility, { passive: true });
    
    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
    
    updateVisibility();
  }

  // ============================================
  // TYPING ANIMATION
  // ============================================
  
  function initTypingAnimation() {
    const typedElement = $('#typed-role');
    if (!typedElement) return;
    
    const roles = [
      'websites that convert',
      'scalable REST APIs',
      'e-commerce platforms',
      'automation pipelines',
      'full-stack solutions',
      'apps that scale'
    ];
    
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function typeRole() {
      const currentRole = roles[roleIndex];
      
      if (isDeleting) {
        typedElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
      } else {
        typedElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
      }
      
      if (!isDeleting && charIndex === currentRole.length) {
        typingSpeed = 2000; // Pause at end
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 500; // Pause before next word
      }
      
      setTimeout(typeRole, typingSpeed);
    }
    
    setTimeout(typeRole, 1000); // Initial delay
  }

  // ============================================
  // SMOOTH HOVER GLOW ON PROJECT CARDS
  // ============================================
  
  function initTiltEffect() {
    const cards = $$('.bento-card');
    if (!cards.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mouse-x', x + '%');
        card.style.setProperty('--mouse-y', y + '%');
      });
    });
  }

})();
