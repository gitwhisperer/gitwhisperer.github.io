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
  await page.screenshot({ path: 'mobile-screenshot-top.png' });
  await page.evaluate(() => window.scrollBy(0, window.innerHeight));
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'mobile-screenshot-mid.png' });
  
  // Test navbar jerking
  await page.evaluate(() => window.scrollBy(0, 100));
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'mobile-screenshot-scroll.png' });
  
  await browser.close();
  console.log('Screenshots taken successfully.');
})();