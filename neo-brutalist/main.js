const scrollContainer = document.getElementById('scroll-container');
const scrollWrapper = document.getElementById('scroll-wrapper');
let totalWidth = 0;

function setWidths() {
  const panels = document.querySelectorAll('.panel');
  totalWidth = 0;
  panels.forEach(panel => {
    totalWidth += panel.offsetWidth;
  });
  
  if (scrollWrapper) {
    scrollWrapper.style.height = `${totalWidth - window.innerWidth + window.innerHeight}px`;
  }
}

window.addEventListener('load', setWidths);
window.addEventListener('resize', setWidths);

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  if (scrollContainer) {
    scrollContainer.style.transform = `translateX(-${scrollY}px)`;
  }
  
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? Math.min(100, Math.max(0, (scrollY / maxScroll) * 100)) : 0;
  
  const progressFill = document.getElementById('progress-fill');
  const progressText = document.getElementById('progress-text');
  
  if (progressFill) progressFill.style.width = `${progress}%`;
  if (progressText) progressText.innerText = `${Math.round(progress)}%`;
});

// View Work Button Scroll
const viewWorkBtn = document.getElementById('view-work-btn');
if (viewWorkBtn) {
  viewWorkBtn.addEventListener('click', () => {
    const projectAlpha = document.getElementById('project-alpha');
    if(projectAlpha) {
      window.scrollTo({
        top: projectAlpha.offsetLeft,
        behavior: 'smooth'
      });
    }
  });
}