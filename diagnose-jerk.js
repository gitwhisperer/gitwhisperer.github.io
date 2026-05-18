const { chromium, devices } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    ...devices['iPhone 13']
  });
  const page = await context.newPage();
  const fileUrl = 'file://' + path.resolve(__dirname, 'index.html');
  await page.goto(fileUrl);
  
  console.log('--- NAVBAR STABILITY TEST ---');
  
  // Record navbar dimensions during scroll
  const measurements = await page.evaluate(async () => {
    const nav = document.getElementById('nav');
    const logs = [];
    
    // Set up an observer to catch any style changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const rect = nav.getBoundingClientRect();
          logs.push({
            event: 'class_change',
            class: nav.className,
            height: rect.height,
            top: rect.top,
            scrollY: window.scrollY
          });
        }
      });
    });
    
    observer.observe(nav, { attributes: true });
    
    // Perform a smooth scroll across the trigger point (50px)
    for (let i = 0; i <= 100; i += 2) {
      window.scrollTo(0, i);
      const rect = nav.getBoundingClientRect();
      logs.push({
        event: 'scrolling',
        y: i,
        height: rect.height,
        top: rect.top
      });
      await new Promise(r => setTimeout(r, 10));
    }
    
    return logs;
  });
  
  let baselineHeight = measurements[0].height;
  let jumps = measurements.filter(m => Math.abs(m.height - baselineHeight) > 0.1);
  
  if (jumps.length > 0) {
    console.log('Jerk Detected!');
    jumps.forEach(j => {
      console.log(`Scroll Y: ${j.y || j.scrollY}, Event: ${j.event}, Height: ${j.height} (Diff: ${j.height - baselineHeight}px)`);
    });
  } else {
    console.log('No vertical height jerk detected during class toggle.');
  }

  // Check for padding changes
  const paddingCheck = await page.evaluate(() => {
    const nav = document.getElementById('nav');
    const style = window.getComputedStyle(nav);
    const before = { padding: style.padding };
    
    window.scrollTo(0, 100);
    const styleAfter = window.getComputedStyle(nav);
    return { before, after: { padding: styleAfter.padding } };
  });
  
  console.log('Padding Check:', paddingCheck);

  await browser.close();
})();