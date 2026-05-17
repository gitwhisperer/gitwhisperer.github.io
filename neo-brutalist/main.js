const horizontalWrapper = document.getElementById('horizontal-wrapper');
const horizontalTrack = document.getElementById('horizontal-track');
const parallaxElements = document.querySelectorAll('.parallax-element');

// Set Current Year
const yearSpan = document.getElementById('year');
if(yearSpan) yearSpan.textContent = new Date().getFullYear();

// Loader Logic (Paper Unfold)
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('brutal-loader');
    if(loader) {
      loader.style.opacity = '0';
      setTimeout(() => loader.remove(), 500);
    }
  }, 1200);
  updateDimensions();
  initTechStackConvergence();
});

let trackWidth = 0;
let viewportWidth = 0;

function updateDimensions() {
  viewportWidth = window.innerWidth;
  const panels = document.querySelectorAll('.h-panel');
  if(panels.length > 0 && horizontalWrapper) {
    trackWidth = 0;
    panels.forEach(panel => {
      trackWidth += panel.offsetWidth;
    });

    const scrollDistance = trackWidth - viewportWidth;
    if (scrollDistance > 0) {
      horizontalWrapper.style.height = `${scrollDistance + window.innerHeight}px`;
    } else {
      horizontalWrapper.style.height = 'auto';
    }
  }
}

window.addEventListener('resize', updateDimensions);

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  // Horizontal Scroll Logic
  if (horizontalWrapper && horizontalTrack) {
    const wrapperTop = horizontalWrapper.offsetTop;
    const stickyPoint = wrapperTop;
    
    let translateX = 0;

    if (scrollY >= stickyPoint) {
      const scrollInsideWrapper = scrollY - stickyPoint;
      const maxTranslate = trackWidth - viewportWidth;
      translateX = Math.min(scrollInsideWrapper, maxTranslate);
      
      if(scrollInsideWrapper > maxTranslate) {
        translateX = maxTranslate;
      }
    }

    horizontalTrack.style.transform = `translate3d(-${translateX}px, 0, 0)`;
  }

  // Vertical Parallax Logic with unique directions
  parallaxElements.forEach(el => {
    const parentSection = el.closest('.vertical-section');
    if(!parentSection) return;
    
    const rect = parentSection.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const speed = parseFloat(el.getAttribute('data-speed')) || 0.2;
      const direction = el.getAttribute('data-dir') || 'y';
      const offset = (scrollY - parentSection.offsetTop) * speed;
      
      if (direction === 'x') {
        el.style.transform = `translate3d(${offset}px, 0, 0)`;
      } else {
        el.style.transform = `translate3d(0, ${offset}px, 0)`;
      }
    }
  });
});

// Dynamic Hero Role Cycler
const roles = ["SOFTWARE ENGINEER", "PROBLEM SOLVER", "SYSTEMS ARCHITECT", "FULL-STACK DEV"];
const dynamicRoleEl = document.getElementById('dynamic-role');
let roleIndex = 0;

if (dynamicRoleEl) {
  setInterval(() => {
    dynamicRoleEl.style.opacity = '0';
    setTimeout(() => {
      roleIndex = (roleIndex + 1) % roles.length;
      dynamicRoleEl.textContent = roles[roleIndex];
      dynamicRoleEl.style.opacity = '1';
    }, 300);
  }, 3000);
}

// Tech Stack Convergence Animation
function initTechStackConvergence() {
  const convergeItems = document.querySelectorAll('.converge-item');
  
  // Set initial scattered positions
  convergeItems.forEach(item => {
    const startX = item.getAttribute('data-x') || 0;
    const startY = item.getAttribute('data-y') || 0;
    item.style.transform = `translate(${startX}px, ${startY}px)`;
  });

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.2
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  convergeItems.forEach(item => observer.observe(item));
}

// Navigation Links Smooth Scroll
document.querySelectorAll('.nav-link, .nav-cta').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    // Only intercept anchor links on the same page
    const href = this.getAttribute('href');
    if(href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.substring(1);
      const targetEl = document.getElementById(targetId);
      if(targetEl) {
        window.scrollTo({
          top: targetEl.offsetTop,
          behavior: 'smooth'
        });
      }
    }
  });
});

// Specific Buttons
const viewWorkBtn = document.getElementById('view-work-btn');
if (viewWorkBtn && horizontalWrapper) {
  viewWorkBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: horizontalWrapper.offsetTop,
      behavior: 'smooth'
    });
  });
}

const contactBtn = document.getElementById('contact-me-btn');
const contactSection = document.getElementById('contact');
if(contactBtn && contactSection) {
  contactBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: contactSection.offsetTop,
      behavior: 'smooth'
    });
  });
}

const scrollTopBtn = document.getElementById('scroll-top-btn');
if (scrollTopBtn) {
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Form Logic
const form = document.getElementById('neo-contact');
const formContainer = document.getElementById('form-container');
const successBox = document.getElementById('form-success');
const resetBtn = document.getElementById('reset-form-btn');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault(); 
    let isValid = true;
    
    const nameInput = document.getElementById('name');
    const nameError = document.getElementById('error-name');
    if (!nameInput.value.trim()) {
      isValid = false;
      nameError.classList.add('active');
    } else {
      nameError.classList.remove('active');
    }

    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('error-email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim() || !emailRegex.test(emailInput.value)) {
      isValid = false;
      emailError.classList.add('active');
    } else {
      emailError.classList.remove('active');
    }

    const messageInput = document.getElementById('message');
    const messageError = document.getElementById('error-message');
    if (!messageInput.value.trim()) {
      isValid = false;
      messageError.classList.add('active');
    } else {
      messageError.classList.remove('active');
    }

    if (!isValid) {
      setTimeout(() => {
        if(nameError.classList.contains('active')) {
          nameError.classList.remove('active'); void nameError.offsetWidth; nameError.classList.add('active');
        }
        if(emailError.classList.contains('active')) {
          emailError.classList.remove('active'); void emailError.offsetWidth; emailError.classList.add('active');
        }
        if(messageError.classList.contains('active')) {
          messageError.classList.remove('active'); void messageError.offsetWidth; messageError.classList.add('active');
        }
      }, 10);
      return;
    }

    const submitBtn = document.getElementById('submit-btn');
    const originalText = submitBtn.innerText;
    submitBtn.innerText = 'SENDING...';
    
    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    }).then(response => {
      if (response.ok) {
        formContainer.style.display = 'none';
        successBox.style.display = 'block';
        submitBtn.innerText = originalText;
      } else {
        submitBtn.innerText = 'ERROR! TRY AGAIN.';
        setTimeout(() => submitBtn.innerText = originalText, 3000);
      }
    }).catch(() => {
      submitBtn.innerText = 'ERROR! TRY AGAIN.';
      setTimeout(() => submitBtn.innerText = originalText, 3000);
    });
  });

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

if (resetBtn) {
  resetBtn.addEventListener('click', () => {
    if (form) form.reset();
    if (successBox) successBox.style.display = 'none';
    if (formContainer) formContainer.style.display = 'block';
  });
}
