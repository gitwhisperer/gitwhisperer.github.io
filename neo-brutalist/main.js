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

const hoverPalette = {
  'nav-hover-red': {
    background: getComputedStyle(document.documentElement).getPropertyValue('--red').trim(),
    color: getComputedStyle(document.documentElement).getPropertyValue('--white').trim(),
  },
  'nav-hover-yellow': {
    background: getComputedStyle(document.documentElement).getPropertyValue('--yellow').trim(),
    color: getComputedStyle(document.documentElement).getPropertyValue('--black').trim(),
  },
  'nav-hover-green': {
    background: getComputedStyle(document.documentElement).getPropertyValue('--green').trim(),
    color: getComputedStyle(document.documentElement).getPropertyValue('--white').trim(),
  },
  'nav-hover-blue': {
    background: getComputedStyle(document.documentElement).getPropertyValue('--blue').trim(),
    color: getComputedStyle(document.documentElement).getPropertyValue('--white').trim(),
  },
  'nav-hover-orange': {
    background: getComputedStyle(document.documentElement).getPropertyValue('--orange').trim(),
    color: getComputedStyle(document.documentElement).getPropertyValue('--white').trim(),
  },
};

function initHoverPalette() {
  document.querySelectorAll('.site-nav-link, .site-nav-cta').forEach((el) => {
    const hoverClass = Array.from(el.classList).find((className) => className.startsWith('nav-hover-'));
    const palette = hoverClass ? hoverPalette[hoverClass] : null;

    if (!palette) return;

    const applyHoverTint = () => {
      el.style.setProperty('background-color', palette.background, 'important');
      el.style.setProperty('color', palette.color, 'important');
    };

    const clearHoverTint = () => {
      el.style.removeProperty('background-color');
      el.style.removeProperty('color');
    };

    el.addEventListener('mouseenter', applyHoverTint);
    el.addEventListener('mouseleave', clearHoverTint);
    el.addEventListener('pointerenter', applyHoverTint);
    el.addEventListener('pointerleave', clearHoverTint);
    el.addEventListener('focus', applyHoverTint);
    el.addEventListener('blur', clearHoverTint);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHoverPalette, { once: true });
} else {
  initHoverPalette();
}

let ticking = false;

function shouldUseVerticalParallax() {
  return !prefersReducedMotion;
}

const horizontalWrapper = document.getElementById('horizontal-wrapper');
const horizontalTrack = document.getElementById('horizontal-track');

function updateDimensions() {
  handleScroll();
}

updateDimensions();
window.addEventListener('resize', updateDimensions);

function handleScroll() {
  const scrollY = window.scrollY;
  const useVerticalParallax = shouldUseVerticalParallax();

  // Horizontal Scroll Logic
  if (horizontalWrapper && horizontalTrack) {
    const rect = horizontalWrapper.getBoundingClientRect();
    const wrapperTop = rect.top;
    
    // Check if we are in desktop layout (assuming max-width 900px breakpoint)
    const isDesktop = window.innerWidth > 900;
    
    if (isDesktop) {
      if (wrapperTop <= 0 && rect.bottom >= window.innerHeight) {
        const scrollableHeight = rect.height - window.innerHeight;
        const scrolled = -wrapperTop;
        const progress = Math.min(Math.max(scrolled / scrollableHeight, 0), 1);
        const maxTranslate = horizontalTrack.scrollWidth - window.innerWidth;
        horizontalTrack.style.transform = `translate3d(-${progress * maxTranslate}px, 0, 0)`;
      } else if (wrapperTop > 0) {
        horizontalTrack.style.transform = `translate3d(0, 0, 0)`;
      } else {
        const maxTranslate = horizontalTrack.scrollWidth - window.innerWidth;
        horizontalTrack.style.transform = `translate3d(-${maxTranslate}px, 0, 0)`;
      }
    } else {
      horizontalTrack.style.transform = 'none';
    }
  }

  // Vertical Parallax Logic
  parallaxElements.forEach(el => {
    const parentSection = el.closest('.vertical-section, .resume-main');
    if(!parentSection) return;

    if (!useVerticalParallax) {
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
