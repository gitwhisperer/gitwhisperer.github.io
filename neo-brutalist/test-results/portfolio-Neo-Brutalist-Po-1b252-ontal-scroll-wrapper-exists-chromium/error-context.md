# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: portfolio.spec.js >> Neo-Brutalist Portfolio >> horizontal scroll wrapper exists
- Location: tests\portfolio.spec.js:16:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.goto: Test timeout of 30000ms exceeded.
Call log:
  - navigating to "http://127.0.0.1:8080/", waiting until "load"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - generic [ref=e3]: HT.
    - navigation [ref=e4]:
      - link "Work" [ref=e5] [cursor=pointer]:
        - /url: "#project-wrapper"
      - link "Stack" [ref=e6] [cursor=pointer]:
        - /url: "#tech-stack"
      - link "About" [ref=e7] [cursor=pointer]:
        - /url: "#who"
      - link "Contact" [ref=e8] [cursor=pointer]:
        - /url: "#contact"
    - generic [ref=e10]: 0%
  - main [ref=e13]:
    - generic [ref=e14]:
      - generic [ref=e15]:
        - generic [ref=e16]:
          - heading "HARSHIT TINKER" [level=1] [ref=e17]:
            - text: HARSHIT
            - text: TINKER
          - paragraph [ref=e18]: Turning complex problems into elegant, high-performance web solutions. Code that works hard, designs that hit harder.
          - generic [ref=e19]:
            - button "VIEW WORK" [ref=e20] [cursor=pointer]
            - button "CONTACT ME" [ref=e21] [cursor=pointer]
            - link "RESUME" [ref=e22] [cursor=pointer]:
              - /url: ../assets/resume.pdf
        - img "Harshit Tinker" [ref=e25]
      - generic [ref=e27]: REACT ✧ NODE.JS ✧ PYTHON ✧ MONGODB ✧ TYPESCRIPT ✧ POSTGRESQL ✧ NEXT.JS ✧ DOCKER ✧ AWS ✧ REACT ✧ NODE.JS ✧ PYTHON ✧ MONGODB ✧ TYPESCRIPT ✧ POSTGRESQL ✧ NEXT.JS ✧ DOCKER ✧ AWS ✧
    - generic [ref=e30]:
      - generic [ref=e32]:
        - img "Marwari Basket" [ref=e34]
        - generic [ref=e35]:
          - heading "SELECTED WORKS" [level=2] [ref=e36]
          - heading "PROJECT ALPHA" [level=3] [ref=e37]:
            - text: PROJECT
            - text: ALPHA
          - heading "E-COMMERCE PLATFORM" [level=4] [ref=e38]
          - generic [ref=e39]:
            - generic [ref=e40]: NODE.JS
            - generic [ref=e41]: REACT
            - generic [ref=e42]: SCALABLE
          - paragraph [ref=e43]: A scalable, microservices-based architecture using Node.js and React. 0.2s load time.
      - generic [ref=e45]:
        - img "Data Dashboard" [ref=e47]
        - generic [ref=e48]:
          - heading "SELECTED WORKS" [level=2] [ref=e49]
          - heading "PROJECT BETA" [level=3] [ref=e50]:
            - text: PROJECT
            - text: BETA
          - heading "DATA DASHBOARD" [level=4] [ref=e51]
          - generic [ref=e52]:
            - generic [ref=e53]: D3.JS
            - generic [ref=e54]: PYTHON
          - paragraph [ref=e55]: Real-time data processing using D3.js and Python. Optimized for big data visualization.
    - generic [ref=e56]:
      - heading "TECH STACK" [level=1] [ref=e57]
      - generic [ref=e58]:
        - generic [ref=e59]: REACT
        - generic [ref=e60]: PYTHON
        - generic [ref=e61]: AWS
        - generic [ref=e62]: GRAPHQL
        - generic [ref=e63]: NODE.JS
        - generic [ref=e64]: DOCKER
        - generic [ref=e65]: NEXT.JS
        - generic [ref=e66]: TAILWIND CSS
        - generic [ref=e67]: MONGODB
        - generic [ref=e68]: TYPESCRIPT
        - generic [ref=e69]: POSTGRESQL
        - generic [ref=e70]: GIT
    - generic [ref=e72]:
      - heading "WHO" [level=1] [ref=e74]
      - generic [ref=e75]:
        - heading "HARSHIT TINKER." [level=2] [ref=e76]
        - paragraph [ref=e77]:
          - text: My philosophy is
          - strong [ref=e78]: performance-first
          - text: engineering. I build robust,
          - strong [ref=e79]: scalable digital experiences
          - text: that prioritize
          - strong [ref=e80]: efficiency
          - text: ", and user impact. No bloat, just functional"
          - strong [ref=e81]: design
          - text: and code.
    - generic [ref=e83]:
      - heading "LET'S BUILD SOMETHING" [level=1] [ref=e84]:
        - text: LET'S BUILD
        - text: SOMETHING
      - generic [ref=e86]:
        - generic [ref=e87]:
          - textbox "YOUR NAME" [ref=e89]
          - textbox "YOUR EMAIL" [ref=e91]
        - textbox "YOUR MESSAGE" [ref=e93]
        - generic [ref=e94]:
          - link "GITHUB" [ref=e95] [cursor=pointer]:
            - /url: https://github.com/gitwhisperer
          - link "LINKEDIN" [ref=e96] [cursor=pointer]:
            - /url: https://linkedin.com/in/harshit-tinker/
        - button "SUBMIT" [ref=e97] [cursor=pointer]
  - contentinfo [ref=e98]:
    - generic [ref=e99]:
      - heading "GET IN TOUCH" [level=3] [ref=e100]
      - generic [ref=e101]:
        - link "harshittinker1979@gmail.com" [ref=e102] [cursor=pointer]:
          - /url: mailto:harshittinker1979@gmail.com
        - link "GITHUB" [ref=e103] [cursor=pointer]:
          - /url: https://github.com/gitwhisperer
        - link "LINKEDIN" [ref=e104] [cursor=pointer]:
          - /url: https://linkedin.com/in/harshit-tinker/
      - paragraph [ref=e105]: © 2026 HARSHIT TINKER. ALL RIGHTS RESERVED.
    - button "Scroll to top" [ref=e107] [cursor=pointer]:
      - img [ref=e108]
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
> 17 |     await page.goto('/');
     |                ^ Error: page.goto: Test timeout of 30000ms exceeded.
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
  33 |     await expect(page).toHaveURL(/.*#projects/);
  34 |   });
  35 | });
```