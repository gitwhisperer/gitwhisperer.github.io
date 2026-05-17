const horizontalWrapper = document.getElementById('horizontal-wrapper');
const horizontalTrack = document.getElementById('horizontal-track');
const parallaxElements = document.querySelectorAll('.parallax-element');

// Set Current Year
document.getElementById('year').textContent = new Date().getFullYear();

// Remove Loader
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('brutal-loader');
    if(loader) loader.remove();
  }, 1200); // Wait for the 1s slideUp animation
  updateDimensions();
});

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

window.addEventListener('resize', updateDimensions);

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  // Horizontal Scroll Logic
  if (horizontalWrapper && horizontalTrack) {
    const wrapperTop = horizontalWrapper.offsetTop;
    // We don't subtract header height because sticky container is top: 0
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
      
      // Relative offset
      const offset = (scrollY - parentSection.offsetTop) * speed;
      
      if (direction === 'x') {
        el.style.transform = `translate3d(${offset}px, 0, 0)`;
      } else {
        el.style.transform = `translate3d(0, ${offset}px, 0)`;
      }
    }
  });
});

// Navigation Links Smooth Scroll
document.querySelectorAll('.nav-link, .nav-cta').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href').substring(1);
    const targetEl = document.getElementById(targetId);
    if(targetEl) {
      window.scrollTo({
        top: targetEl.offsetTop,
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
    window.scrollTo({
      top: horizontalWrapper.offsetTop,
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
      top: contactSection.offsetTop,
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

// Custom Brutalist Form Validation & AJAX Submission
const form = document.getElementById('neo-contact');
const formContainer = document.getElementById('form-container');
const successBox = document.getElementById('form-success');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault(); // Stop native submission
    
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

    if (!isValid) {
      // Re-trigger shake
      setTimeout(() => {
        if(nameError.classList.contains('active')) {
          nameError.classList.remove('active');
          void nameError.offsetWidth;
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
      return;
    }

    // If valid, submit via AJAX
    const submitBtn = document.getElementById('submit-btn');
    const originalText = submitBtn.innerText;
    submitBtn.innerText = 'SENDING...';
    
    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: {
        'Accept': 'application/json'
      }
    }).then(response => {
      if (response.ok) {
        formContainer.style.display = 'none';
        successBox.style.display = 'block';
      } else {
        submitBtn.innerText = 'ERROR! TRY AGAIN.';
        setTimeout(() => submitBtn.innerText = originalText, 3000);
      }
    }).catch(error => {
      submitBtn.innerText = 'ERROR! TRY AGAIN.';
      setTimeout(() => submitBtn.innerText = originalText, 3000);
    });

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
