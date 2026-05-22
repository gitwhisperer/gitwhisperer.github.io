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
const scrollHint = document.getElementById('scroll-hint');
const backToTop = document.getElementById('back-to-top');
const mainFooter = document.querySelector('.main-footer');

function updateDimensions() {
  handleScroll();
}

updateDimensions();
window.addEventListener('resize', updateDimensions);

function handleScroll() {
  const scrollY = window.scrollY;
  const useVerticalParallax = shouldUseVerticalParallax();

  if (horizontalWrapper && horizontalTrack) {
    const rect = horizontalWrapper.getBoundingClientRect();
    const wrapperTop = rect.top;
    const isDesktop = window.innerWidth > 900;
    
    if (isDesktop) {
      if (wrapperTop <= 0 && rect.bottom >= window.innerHeight) {
        const scrollableHeight = rect.height - window.innerHeight;
        const scrolled = -wrapperTop;
        const progress = Math.min(Math.max(scrolled / scrollableHeight, 0), 1);
        const maxTranslate = horizontalTrack.scrollWidth - window.innerWidth;
        horizontalTrack.style.transform = `translate3d(-${progress * maxTranslate}px, 0, 0)`;
        
        if (progress > 0.05 && scrollHint) {
          scrollHint.classList.add('hidden');
        }
      } else if (wrapperTop > 0) {
        horizontalTrack.style.transform = `translate3d(0, 0, 0)`;
        if (scrollHint) scrollHint.classList.remove('hidden');
      } else {
        const maxTranslate = horizontalTrack.scrollWidth - window.innerWidth;
        horizontalTrack.style.transform = `translate3d(-${maxTranslate}px, 0, 0)`;
      }
    } else {
      horizontalTrack.style.transform = 'none';
    }
  }

  parallaxElements.forEach(el => {
    const parentSection = el.closest('.vertical-section, .resume-main');
    if(!parentSection) return;

    if (!useVerticalParallax) {
      el.style.transform = 'translateZ(0)';
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

  if (backToTop && mainFooter) {
    const footerRect = mainFooter.getBoundingClientRect();
    const footerVisible = footerRect.top < window.innerHeight;
    
    if (scrollY > 600 && !footerVisible) {
      backToTop.classList.add('visible');
      backToTop.classList.remove('hidden-footer');
    } else {
      backToTop.classList.remove('visible');
      if (footerVisible) {
        backToTop.classList.add('hidden-footer');
      }
    }
  }

  ticking = false;
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(handleScroll);
    ticking = true;
  }
}, { passive: true });

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

if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

const cursor = document.getElementById('custom-cursor');
const cursorDefault = cursor?.querySelector('.cursor-default');
const cursorPointer = cursor?.querySelector('.cursor-pointer');
const cursorInput = cursor?.querySelector('.cursor-input');
let mouseX = 0, mouseY = 0;

function setCursorSVG(type) {
  if (!cursor) return;
  if (cursorDefault) cursorDefault.style.display = type === 'default' ? 'block' : 'none';
  if (cursorPointer) cursorPointer.style.display = type === 'pointer' ? 'block' : 'none';
  if (cursorInput) cursorInput.style.display = type === 'input' ? 'block' : 'none';
}

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (cursor) {
    cursor.style.left = mouseX - 8 + 'px';
    cursor.style.top = mouseY - 8 + 'px';
  }
});

const linkElements = document.querySelectorAll('a, .nb-btn, .tag, .icon-btn, .site-nav-link, .site-nav-cta, .arrow-up-btn');
linkElements.forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor && cursor.classList.add('hover-link');
    setCursorSVG('pointer');
  });
  el.addEventListener('mouseleave', () => {
    cursor && cursor.classList.remove('hover-link');
    setCursorSVG('default');
  });
});

const textElements = document.querySelectorAll('p, span, h1, h2, h3, h4, h5, h6, li, label, .project-desc, .who-text, .subtitle, .service-description');
textElements.forEach(el => {
  el.addEventListener('mouseenter', () => cursor && cursor.classList.add('hover-text'));
  el.addEventListener('mouseleave', () => cursor && cursor.classList.remove('hover-text'));
});

const btnElements = document.querySelectorAll('.nb-btn, .site-nav-cta, .submit-btn, .icon-btn, .arrow-up-btn, button');
btnElements.forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor && cursor.classList.add('hover-btn');
    setCursorSVG('pointer');
  });
  el.addEventListener('mouseleave', () => {
    cursor && cursor.classList.remove('hover-btn');
    setCursorSVG('default');
  });
});

const inputElements = document.querySelectorAll('input, textarea');
inputElements.forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor && cursor.classList.add('hover-input');
    setCursorSVG('input');
  });
  el.addEventListener('mouseleave', () => {
    cursor && cursor.classList.remove('hover-input');
    setCursorSVG('default');
  });
});

document.addEventListener('mousedown', () => cursor && cursor.classList.add('clicking'));
document.addEventListener('mouseup', () => cursor && cursor.classList.remove('clicking'));

const easterFlash = document.getElementById('easter-flash');
const easterMessage = document.getElementById('easter-message');
let konamiIndex = 0;
const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
const easterMessages = [
  "YOU FOUND ME!",
  "HACKER MODE ACTIVATED",
  "WELL DONE, TINKER",
  "SECRET UNLOCKED",
  "YOU ARE A TRUE TINKERER"
];

function showEasterEgg(msg) {
  if (easterFlash) {
    easterFlash.classList.add('active');
    setTimeout(() => easterFlash.classList.remove('active'), 500);
  }
  if (easterMessage) {
    easterMessage.textContent = msg || easterMessages[Math.floor(Math.random() * easterMessages.length)];
    easterMessage.classList.add('active');
    setTimeout(() => easterMessage.classList.remove('active'), 2000);
  }
}

document.addEventListener('keydown', (e) => {
  if (e.keyCode === konamiCode[konamiIndex]) {
    konamiIndex++;
    if (konamiIndex === konamiCode.length) {
      showEasterEgg("KONAMI CODE ACTIVATED!");
      document.body.style.filter = 'hue-rotate(180deg)';
      setTimeout(() => { document.body.style.filter = ''; }, 3000);
      konamiIndex = 0;
    }
  } else {
    konamiIndex = 0;
  }
  
  if (e.key === 'h' && e.ctrlKey) {
    e.preventDefault();
    showEasterEgg("HELLO TINKER!");
  }
});

let clickCount = 0;
document.addEventListener('click', (e) => {
  clickCount++;
  if (clickCount === 10) {
    showEasterEgg("10 CLICKS! YOU ARE PERSISTENT");
    clickCount = 0;
  }
});

let scrollDistance = 0;
let lastScroll = 0;
window.addEventListener('scroll', () => {
  scrollDistance += Math.abs(window.scrollY - lastScroll);
  lastScroll = window.scrollY;
  if (scrollDistance > 50000) {
    showEasterEgg("SCROLL MASTER!");
    scrollDistance = 0;
  }
}, { passive: true });

const whoSection = document.getElementById('who');
if (whoSection) {
  let whoClicks = 0;
  whoSection.addEventListener('click', () => {
    whoClicks++;
    if (whoClicks === 5) {
      showEasterEgg("WHO ARE YOU? I AM HARSHIT!");
      whoClicks = 0;
    }
  });
}

const logo = document.querySelector('.site-nav-mark');
if (logo) {
  let logoClicks = 0;
  logo.addEventListener('click', (e) => {
    e.preventDefault();
    logoClicks++;
    if (logoClicks === 7) {
      showEasterEgg("HT FOREVER!");
      logoClicks = 0;
    }
  });
}

// Additional Easter Eggs

// 1. Type "tinker" anywhere
let tinkerSequence = '';
document.addEventListener('keydown', (e) => {
  if (!e.ctrlKey && !e.metaKey && e.key.length === 1) {
    tinkerSequence += e.key.toLowerCase();
    if (tinkerSequence.length > 6) {
      tinkerSequence = tinkerSequence.slice(-6);
    }
    if (tinkerSequence === 'tinker') {
      showEasterEgg("YOU CAN SPELL TINKER!");
      tinkerSequence = '';
    }
  }
});

// 2. Double-tap the HT logo
let logoLastClick = 0;
if (logo) {
  logo.addEventListener('click', (e) => {
    const now = Date.now();
    if (now - logoLastClick < 400) {
      showEasterEgg("DOUBLE TAP DETECTED!");
    }
    logoLastClick = now;
  });
}

// 3. Idle detection - if user doesn't interact for 30 seconds
let idleTimer;
function resetIdleTimer() {
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    showEasterEgg("ARE YOU STILL THERE?");
  }, 30000);
}
['mousemove', 'keydown', 'click', 'scroll', 'touchstart'].forEach(event => {
  document.addEventListener(event, resetIdleTimer, { passive: true });
});
resetIdleTimer();

// 5. Right-click easter egg
let rightClickCount = 0;
document.addEventListener('contextmenu', (e) => {
  rightClickCount++;
  if (rightClickCount === 5) {
    showEasterEgg("INSPECTING THE CODE?");
    rightClickCount = 0;
  }
});
