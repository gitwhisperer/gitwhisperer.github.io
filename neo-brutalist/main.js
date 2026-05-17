const horizontalWrapper = document.getElementById('horizontal-wrapper');
const horizontalTrack = document.getElementById('horizontal-track');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');

let trackWidth = 0;
let viewportWidth = 0;

function updateDimensions() {
  viewportWidth = window.innerWidth;
  // Calculate total width of all horizontal panels
  const panels = document.querySelectorAll('.h-panel');
  trackWidth = 0;
  panels.forEach(panel => {
    trackWidth += panel.offsetWidth;
  });

  // Set the wrapper height so we have exactly enough scroll distance
  // scroll distance = trackWidth - viewportWidth
  // total height = scroll distance + viewport height (for the sticky container)
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
    // The point at which the sticky container becomes sticky
    // The top of the wrapper minus 80px (header height)
    const stickyPoint = wrapperTop - 80;
    
    let translateX = 0;

    if (scrollY >= stickyPoint) {
      // We are inside the sticky area
      const scrollInsideWrapper = scrollY - stickyPoint;
      const maxTranslate = trackWidth - viewportWidth;
      
      translateX = Math.min(scrollInsideWrapper, maxTranslate);
    }

    horizontalTrack.style.transform = `translate3d(-${translateX}px, 0, 0)`;
  }
});

// View Work Button Scroll
const viewWorkBtn = document.getElementById('view-work-btn');
if (viewWorkBtn && horizontalWrapper) {
  viewWorkBtn.addEventListener('click', () => {
    // Scroll to exactly where the horizontal wrapper begins to stick
    const wrapperTop = horizontalWrapper.offsetTop - 80;
    window.scrollTo({
      top: wrapperTop,
      behavior: 'smooth'
    });
  });
}