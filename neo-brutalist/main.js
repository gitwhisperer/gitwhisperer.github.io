const horizontalWrapper = document.getElementById('horizontal-wrapper');
const horizontalTrack = document.getElementById('horizontal-track');
const parallaxElements = document.querySelectorAll('.parallax-element');
const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
let prefersReducedMotion = reducedMotionQuery.matches;

const syncMotionPreference = (event) => {
  prefersReducedMotion = event.matches;
  updateDimensions();
};

if (typeof reducedMotionQuery.addEventListener === 'function') {
  reducedMotionQuery.addEventListener('change', syncMotionPreference);
} else if (typeof reducedMotionQuery.addListener === 'function') {
  reducedMotionQuery.addListener(syncMotionPreference);
}

// Set Current Year
const yearSpan = document.getElementById('year');
if(yearSpan) yearSpan.textContent = new Date().getFullYear();

let loaderDismissed = false;

function hideLoader() {
  if (loaderDismissed) return;

  const loader = document.getElementById('brutal-loader');
  loaderDismissed = true;

  if (!loader) return;

  loader.classList.add('hidden');
  setTimeout(() => loader.remove(), 600);
}

function revealPage() {
  hideLoader();
  updateDimensions();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', revealPage, { once: true });
} else {
  requestAnimationFrame(revealPage);
}

window.addEventListener('load', revealPage, { once: true });

let trackWidth = 0;
let viewportWidth = 0;
let ticking = false;

function shouldUseParallax() {
  return viewportWidth > 900 && !prefersReducedMotion;
}

function updateDimensions() {
  viewportWidth = window.innerWidth;
  const panels = document.querySelectorAll('.h-panel');
  if(panels.length > 0 && horizontalWrapper) {
    if (!shouldUseParallax()) {
      horizontalWrapper.style.height = 'auto';
      trackWidth = 0;
      if (horizontalTrack) {
        horizontalTrack.style.transform = 'translate3d(0, 0, 0)';
      }
      return;
    }
    
    trackWidth = 0;
    panels.forEach(panel => {
      trackWidth += panel.offsetWidth;
    });

    const scrollDistance = trackWidth - viewportWidth;
    if (scrollDistance > 0) {
      const newHeight = `${scrollDistance + window.innerHeight}px`;
      if (horizontalWrapper.style.height !== newHeight) {
        horizontalWrapper.style.height = newHeight;
      }
    } else {
      horizontalWrapper.style.height = 'auto';
    }
  }

  handleScroll();
}

updateDimensions();
window.addEventListener('resize', updateDimensions);

function handleScroll() {
  const scrollY = window.scrollY;
  const useParallax = shouldUseParallax();

  // Horizontal Scroll Logic
  if (horizontalWrapper && horizontalTrack) {
    if (!useParallax) {
      horizontalTrack.style.transform = 'translate3d(0, 0, 0)';
    } else {
    const stickyPoint = horizontalWrapper.offsetTop;
    const maxTranslate = trackWidth - viewportWidth;
    
    let translateX = 0;
    if (scrollY >= stickyPoint) {
      translateX = Math.min(scrollY - stickyPoint, maxTranslate);
    }
    
    horizontalTrack.style.transform = `translate3d(-${translateX}px, 0, 0)`;
    }
  }

  // Vertical Parallax Logic
  parallaxElements.forEach(el => {
    const parentSection = el.closest('.vertical-section');
    if(!parentSection) return;

    if (!useParallax) {
      el.style.transform = 'none';
      return;
    }
    
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

  ticking = false;
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(handleScroll);
    ticking = true;
  }
}, { passive: true });

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
