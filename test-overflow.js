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
  
  const overflows = await page.evaluate(() => {
    const ww = window.innerWidth;
    const badElements = [];
    document.querySelectorAll('*').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.right > ww + 1) { // 1px tolerance
        let idClasses = el.tagName;
        if (el.id) idClasses += '#' + el.id;
        if (el.className && typeof el.className === 'string') idClasses += '.' + el.className.split(' ').join('.');
        badElements.push({
          tag: idClasses,
          right: rect.right,
          windowWidth: ww
        });
      }
    });
    return badElements;
  });
  
  console.log('Elements overflowing horizontally:', overflows);
  await browser.close();
})();