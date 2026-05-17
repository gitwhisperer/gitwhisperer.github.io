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
    // Only calculate if element's parent section is somewhat in viewport
    const parentSection = el.closest('.vertical-section');
    if(!parentSection) return;
    
    const rect = parentSection.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const speed = parseFloat(el.getAttribute('data-speed')) || 0.2;
      // Calculate offset based on scroll position relative to the section
      const yOffset = (scrollY - parentSection.offsetTop) * speed;
      el.style.transform = `translate3d(0, ${yOffset}px, 0)`;
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
