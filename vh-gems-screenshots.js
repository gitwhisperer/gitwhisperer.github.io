const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const url = 'https://vijayhandajewllers.com';
  
  // Desktop screenshot
  console.log('Taking desktop screenshot...');
  const desktopContext = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  });
  const desktopPage = await desktopContext.newPage();
  
  try {
    await desktopPage.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
  } catch (e) {
    console.log('Page load issue, continuing...');
  }
  
  // Wait up to 10 seconds for page to fully load
  await desktopPage.waitForTimeout(10000);
  
  const screenshotPath = path.join(__dirname, 'assets', 'vh-gems.png');
  await desktopPage.screenshot({ path: screenshotPath, fullPage: false, timeout: 60000 });
  
  console.log('Desktop screenshot saved:', screenshotPath);
  
  await desktopContext.close();
  
  // Mobile screenshot
  console.log('Taking mobile screenshot...');
  const mobileContext = await browser.newContext({
    viewport: { width: 375, height: 812 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
    isMobile: true
  });
  const mobilePage = await mobileContext.newPage();
  
  try {
    await mobilePage.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
  } catch (e) {
    console.log('Page load issue, continuing...');
  }
  
  // Wait up to 10 seconds for page to fully load
  await mobilePage.waitForTimeout(10000);
  
  const mobileScreenshotPath = path.join(__dirname, 'assets', 'vh-gems-mobile.png');
  await mobilePage.screenshot({ path: mobileScreenshotPath, fullPage: false, timeout: 60000 });
  
  console.log('Mobile screenshot saved:', mobileScreenshotPath);
  
  await mobileContext.close();
  await browser.close();
  
  console.log('All screenshots completed!');
})();
