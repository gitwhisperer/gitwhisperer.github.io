const { test, expect } = require('@playwright/test');

test.describe('Neo-Brutalist Portfolio', () => {
  test('has title and hero section', async ({ page }) => {
    await page.goto('/');
    
    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Neo-Brutalist Portfolio/);

    // Hero section checks
    const heroTitle = page.locator('.massive-text').first();
    await expect(heroTitle).toBeVisible();
    await expect(heroTitle).toContainText('HARSHIT');
  });

  test('projects display horizontally', async ({ page }) => {
    await page.goto('/');
    
    const wrapper = page.locator('.horizontal-wrapper');
    await expect(wrapper).toBeVisible();
    
    const track = page.locator('.horizontal-track');
    await expect(track).toHaveCSS('display', 'flex');

    const panels = page.locator('.h-panel');
    await expect(panels).toHaveCount(4); // We have 4 projects in index.html
  });

  test('resume navbar includes the title block inline', async ({ page }) => {
    await page.goto('/resume/');

    await expect(page.locator('.site-nav-copy')).toBeVisible();
    await expect(page.locator('.pdf-toolbar')).toHaveCount(0);
  });

  test('navigation works', async ({ page }) => {
    await page.goto('/');
    
    // Check Work link
    const workLink = page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Work' });
    await expect(workLink).toBeVisible();
    await workLink.click();
    
    // The smooth scroll takes time. We can check if we moved.
    // However, Playwright click() on an anchor usually waits for navigation or does nothing if it's an internal link.
    // Since we have e.preventDefault() and JS scroll, we should verify the scroll position.
    
    await page.waitForTimeout(1000); // Wait for smooth scroll
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThan(100);
  });
});
