const { chromium, devices } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    ...devices['iPhone 13']
  });
  const page = await context.newPage();
  
  // Track JSReflows/Long tasks if possible, but simplest is to check console for warnings
  page.on('console', msg => {
    if (msg.type() === 'warning') console.log('BROWSER WARNING:', msg.text());
  });

  const fileUrl = 'file://' + path.resolve(__dirname, 'index.html');
  await page.goto(fileUrl);
  
  console.log('--- SCROLL PERFORMANCE TEST ---');
  
  await page.evaluate(async () => {
    // Force a lot of scrolls
    for (let i = 0; i < 2000; i += 50) {
      window.scrollTo(0, i);
      await new Promise(r => setTimeout(r, 5));
    }
  });
  
  console.log('Scroll finished.');
  await browser.close();
})();