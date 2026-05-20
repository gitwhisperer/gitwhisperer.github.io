const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const assetsDir = path.resolve(__dirname, '..', 'assets');
  
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }

  // Screenshot 1: Terra Pravah (desktop)
  console.log('Capturing Terra Pravah...');
  const page1 = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  try {
    await page1.goto('https://terrapravah.vercel.app', { waitUntil: 'networkidle', timeout: 30000 });
    await page1.waitForTimeout(2000);
    await page1.screenshot({ path: path.join(assetsDir, 'terra-pravah.png'), fullPage: false });
    console.log('Terra Pravah captured.');
  } catch (e) {
    console.log('Terra Pravah failed, using placeholder:', e.message);
  }
  await page1.close();

  // Screenshot 2: VH Gems (desktop)
  console.log('Capturing VH Gems and Jewels...');
  const page2 = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  try {
    await page2.goto('https://vijayhandajewllers.com', { waitUntil: 'networkidle', timeout: 30000 });
    await page2.waitForTimeout(2000);
    await page2.screenshot({ path: path.join(assetsDir, 'vh-gems.png'), fullPage: false });
    console.log('VH Gems captured.');
  } catch (e) {
    console.log('VH Gems failed, using placeholder:', e.message);
  }
  await page2.close();

  // Screenshot 3: VH Gems (mobile)
  console.log('Capturing VH Gems mobile...');
  const page3 = await browser.newPage({ viewport: { width: 375, height: 812 } });
  try {
    await page3.goto('https://vijayhandajewllers.com', { waitUntil: 'networkidle', timeout: 30000 });
    await page3.waitForTimeout(2000);
    await page3.screenshot({ path: path.join(assetsDir, 'vh-gems-mobile.png'), fullPage: false });
    console.log('VH Gems mobile captured.');
  } catch (e) {
    console.log('VH Gems mobile failed:', e.message);
  }
  await page3.close();

  await browser.close();
  console.log('All screenshots done.');
})();
