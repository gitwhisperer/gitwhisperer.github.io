const horizontalWrapper = document.getElementById('horizontal-wrapper');
const horizontalTrack = document.getElementById('horizontal-track');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');
const parallaxElements = document.querySelectorAll('.parallax-element');

// Set Current Year
document.getElementById('year').textContent = new Date().getFullYear();

let trackWidth = 0;
let viewportWidth = 0;

function updateDimensions() {
  viewportWidth = window.innerWidth;
  const panels = document.querySelectorAll('.h-panel');
  trackWidth = 0;
  panels.forEach(panel => {
    trackWidth += panel.offsetWidth;
  });

  const scrollDistance = trackWidth - viewportWidth;
  if (scrollDistance > 0 && horizontalWrapper) {
    horizontalWrapper.style.height = `${scrollDistance + window.innerHeight}px`;
  } else if (horizontalWrapper) {
    horizontalWrapper.style.height = 'auto';
  }
}

window.addEventListener('load', updateDimensions);
window.addEventListener('resize', updateDimensions);

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  
  // Progress Bar
  const progress = maxScroll > 0 ? Math.min(100, Math.max(0, (scrollY / maxScroll) * 100)) : 0;
  if (progressFill) progressFill.style.width = `${progress}%`;
  if (progressText) progressText.innerText = `${Math.round(progress)}%`;

  // Horizontal Scroll Logic
  if (horizontalWrapper && horizontalTrack) {
    const wrapperTop = horizontalWrapper.offsetTop;
    const stickyPoint = wrapperTop - 80; // Header height
    
    let translateX = 0;

    if (scrollY >= stickyPoint) {
      const scrollInsideWrapper = scrollY - stickyPoint;
      const maxTranslate = trackWidth - viewportWidth;
      translateX = Math.min(scrollInsideWrapper, maxTranslate);
      
      // If we scroll past the wrapper, keep it at max translate
      if(scrollInsideWrapper > maxTranslate) {
        translateX = maxTranslate;
      }
    }

    horizontalTrack.style.transform = `translate3d(-${translateX}px, 0, 0)`;
  }

  // Vertical Parallax Logic
  parallaxElements.forEach(el => {
    const parentSection = el.closest('.vertical-section');
    if(!parentSection) return;
    
    const rect = parentSection.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const speed = parseFloat(el.getAttribute('data-speed')) || 0.2;
      const yOffset = (scrollY - parentSection.offsetTop) * speed;
      el.style.transform = `translate3d(0, ${yOffset}px, 0)`;
    }
  });
});

// Navigation Links Smooth Scroll
document.querySelectorAll('.nav-link').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href').substring(1);
    const targetEl = document.getElementById(targetId);
    if(targetEl) {
      const topOffset = targetEl.offsetTop - 80; // adjust for header
      window.scrollTo({
        top: topOffset,
        behavior: 'smooth'
      });
    }
  });
});

// View Work Button
const viewWorkBtn = document.getElementById('view-work-btn');
if (viewWorkBtn && horizontalWrapper) {
  viewWorkBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const wrapperTop = horizontalWrapper.offsetTop - 80;
    window.scrollTo({
      top: wrapperTop,
      behavior: 'smooth'
    });
  });
}

// Contact Me Button
const contactBtn = document.getElementById('contact-me-btn');
const contactSection = document.getElementById('contact');
if(contactBtn && contactSection) {
  contactBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: contactSection.offsetTop - 80,
      behavior: 'smooth'
    });
  });
}

// Scroll to Top Button
const scrollTopBtn = document.getElementById('scroll-top-btn');
if (scrollTopBtn) {
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Custom Brutalist Form Validation
const form = document.getElementById('neo-contact');
if (form) {
  form.addEventListener('submit', (e) => {
    // Basic validation flags
    let isValid = true;
    
    // Name validation
    const nameInput = document.getElementById('name');
    const nameError = document.getElementById('error-name');
    if (!nameInput.value.trim()) {
      isValid = false;
      nameError.classList.add('active');
    } else {
      nameError.classList.remove('active');
    }

    // Email validation
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('error-email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim() || !emailRegex.test(emailInput.value)) {
      isValid = false;
      emailError.classList.add('active');
    } else {
      emailError.classList.remove('active');
    }

    // Message validation
    const messageInput = document.getElementById('message');
    const messageError = document.getElementById('error-message');
    if (!messageInput.value.trim()) {
      isValid = false;
      messageError.classList.add('active');
    } else {
      messageError.classList.remove('active');
    }

    // Stop submission if invalid
    if (!isValid) {
      e.preventDefault();
      // Remove and re-add active class to re-trigger the shake animation
      setTimeout(() => {
        if(nameError.classList.contains('active')) {
          nameError.classList.remove('active');
          void nameError.offsetWidth; // trigger reflow
          nameError.classList.add('active');
        }
        if(emailError.classList.contains('active')) {
          emailError.classList.remove('active');
          void emailError.offsetWidth;
          emailError.classList.add('active');
        }
        if(messageError.classList.contains('active')) {
          messageError.classList.remove('active');
          void messageError.offsetWidth;
          messageError.classList.add('active');
        }
      }, 10);
    }
  });

  // Clear errors on input
  const inputs = form.querySelectorAll('.retro-input');
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      const errorDiv = input.nextElementSibling;
      if (errorDiv && errorDiv.classList.contains('brutal-error')) {
        errorDiv.classList.remove('active');
      }
    });
  });
}
