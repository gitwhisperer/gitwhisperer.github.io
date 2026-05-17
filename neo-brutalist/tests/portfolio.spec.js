const { test, expect } = require('@playwright/test');

test.describe('Neo-Brutalist Portfolio', () => {
  test('has title and hero section', async ({ page }) => {
    await page.goto('/');
    
    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Neo-Brutalist Portfolio/);

    // Hero section checks
    const heroTitle = page.locator('.nb-title');
    await expect(heroTitle).toBeVisible();
    await expect(heroTitle).toContainText('Harshit');
  });

  test('horizontal scroll wrapper exists', async ({ page }) => {
    await page.goto('/');
    
    const wrapper = page.locator('.horizontal-scroll-wrapper');
    await expect(wrapper).toBeVisible();
    
    const items = page.locator('.horizontal-item');
    await expect(items).toHaveCount(4); // We added 4 projects
  });

  test('navigation works', async ({ page }) => {
    await page.goto('/');
    
    // Click on work
    await page.click('a[href="#projects"]');
    
    // URL should have #projects
    await expect(page).toHaveURL(/.*#projects/);
  });
});