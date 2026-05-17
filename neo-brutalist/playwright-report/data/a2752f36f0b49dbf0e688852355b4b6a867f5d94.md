# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: portfolio.spec.js >> Neo-Brutalist Portfolio >> navigation works
- Location: tests\portfolio.spec.js:26:3

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /.*#projects/
Received string:  "http://127.0.0.1:8080/"
Timeout: 5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    13 × unexpected value "http://127.0.0.1:8080/"

```

```yaml
- navigation:
  - text: HT.
  - link "Start":
    - /url: "#hero"
  - link "About":
    - /url: "#about"
  - link "Work":
    - /url: "#projects"
  - link "Hire Me":
    - /url: "#contact"
- main:
  - text: Available for work
  - heading "Harshit Tinker." [level=1]
  - paragraph: Full-Stack Developer building bold, high-performance web experiences.
  - link "See Projects":
    - /url: "#projects"
  - text: React ✧ Node.js ✧ Python ✧ MongoDB ✧ PostgreSQL ✧ TypeScript ✧ React ✧ Node.js ✧ Python ✧ MongoDB ✧ PostgreSQL ✧ TypeScript ✧ React ✧ Node.js ✧ Python ✧ MongoDB ✧ PostgreSQL ✧ TypeScript ✧
  - heading "About Me" [level=2]
  - paragraph: I don't just write code — I build solutions that make businesses money. With a focus on performance, reliability, and maintainability, every project I deliver is built to last and easy to scale.
  - heading "Selected Work" [level=2]
  - heading "Marwari Basket" [level=3]
  - paragraph: Full-stack e-commerce platform serving 500+ products with real-time inventory.
  - text: React Node.js
  - heading "E-commerce API" [level=3]
  - paragraph: Production-grade REST API with JWT auth, Stripe payments, and rate limiting.
  - text: Express MongoDB
  - heading "Pentest Sim" [level=3]
  - paragraph: Professional-grade Python CLI toolkit for simulating penetration testing workflows.
  - text: Python CLI
  - heading "Super Tic-Tac-Toe" [level=3]
  - paragraph: Strategic twist on the classic game with minimax AI and multiplayer support.
  - text: Python Game
  - heading "Services" [level=2]
  - heading "Web Development" [level=3]
  - paragraph: Lightning-fast, SEO-optimized websites.
  - heading "Backend APIs" [level=3]
  - paragraph: Scalable REST APIs with Node.js.
  - heading "Automation" [level=3]
  - paragraph: Custom Python tooling to save time.
  - heading "Process" [level=2]
  - heading "01. Discovery" [level=3]
  - heading "02. Design" [level=3]
  - heading "03. Build" [level=3]
  - heading "04. Launch" [level=3]
  - heading "Let's Talk." [level=2]
  - textbox "Your Name"
  - textbox "Your Email"
  - textbox "Project Details"
  - button "Send Message"
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | 
  3  | test.describe('Neo-Brutalist Portfolio', () => {
  4  |   test('has title and hero section', async ({ page }) => {
  5  |     await page.goto('/');
  6  |     
  7  |     // Expect a title "to contain" a substring.
  8  |     await expect(page).toHaveTitle(/Neo-Brutalist Portfolio/);
  9  | 
  10 |     // Hero section checks
  11 |     const heroTitle = page.locator('.nb-title');
  12 |     await expect(heroTitle).toBeVisible();
  13 |     await expect(heroTitle).toContainText('Harshit');
  14 |   });
  15 | 
  16 |   test('horizontal scroll wrapper exists', async ({ page }) => {
  17 |     await page.goto('/');
  18 |     
  19 |     const wrapper = page.locator('.horizontal-scroll-wrapper');
  20 |     await expect(wrapper).toBeVisible();
  21 |     
  22 |     const items = page.locator('.horizontal-item');
  23 |     await expect(items).toHaveCount(4); // We added 4 projects
  24 |   });
  25 | 
  26 |   test('navigation works', async ({ page }) => {
  27 |     await page.goto('/');
  28 |     
  29 |     // Click on work
  30 |     await page.click('a[href="#projects"]');
  31 |     
  32 |     // URL should have #projects
> 33 |     await expect(page).toHaveURL(/.*#projects/);
     |                        ^ Error: expect(page).toHaveURL(expected) failed
  34 |   });
  35 | });
```