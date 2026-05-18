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
  
  const metrics = await page.evaluate(() => {
    const el = document.querySelector('.about-sidebar');
    const grid = document.querySelector('.about-grid');
    return {
      sidebarRect: el.getBoundingClientRect(),
      gridRect: grid.getBoundingClientRect(),
      containerWidth: document.querySelector('.container').clientWidth,
      windowWidth: window.innerWidth
    };
  });
  
  console.log('Metrics:', metrics);
  
  await browser.close();
})();