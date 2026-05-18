const { chromium, devices } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    ...devices['iPhone 13']
  });
  const page = await context.newPage();
  
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));

  const fileUrl = 'file://' + path.resolve(__dirname, 'index.html');
  await page.goto(fileUrl);
  
  console.log('Testing toggle menu...');
  const navLinks = await page.$('#nav-links');
  const toggle = await page.$('.nav-toggle');
  
  const isVisibleBefore = await navLinks.evaluate(el => getComputedStyle(el).transform !== 'matrix(1, 0, 0, 1, 280, 0)');
  console.log('Is open before click?', isVisibleBefore);
  
  await toggle.click();
  await page.waitForTimeout(500);
  
  const isOpenAfter = await page.$eval('#nav-links', el => el.classList.contains('open'));
  console.log('Has class open after click?', isOpenAfter);
  
  const isVisibleAfter = await navLinks.evaluate(el => getComputedStyle(el).transform !== 'matrix(1, 0, 0, 1, 280, 0)');
  console.log('Is visually open after click?', isVisibleAfter);
  
  await browser.close();
})();