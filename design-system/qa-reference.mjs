#!/usr/bin/env node
import fs from 'node:fs/promises';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const playwright = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await playwright.chromium.launch({
  headless: true,
  ...(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {})
});
const checks = [];

try {
  await fs.mkdir('qa', { recursive: true });
  for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:8765/index.html', { waitUntil: 'load', timeout: 30000 });
    await page.evaluate(async () => {
      const images = Array.from(document.images);
      for (const image of images) image.loading = 'eager';
      await Promise.all(images.map(image => image.complete
        ? Promise.resolve()
        : new Promise(resolve => {
            image.addEventListener('load', resolve, { once: true });
            image.addEventListener('error', resolve, { once: true });
          })));
    });
    const label = viewport.width === 390 ? 'mobile' : 'desktop';
    const metrics = await page.evaluate(() => ({
      title: document.title,
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      sections: ['tokens', 'typography', 'components', 'coverage', 'agent-rules', 'evidence', 'qa'].map(id => Boolean(document.getElementById(id))),
      brokenImages: Array.from(document.images).filter(image => !image.complete || image.naturalWidth === 0).length,
      details: document.querySelectorAll('details').length
    }));
    checks.push({
      name: `${label} reference shell`,
      status: metrics.title.includes('Catalyst public launch site') && metrics.sections.every(Boolean) && metrics.brokenImages === 0 && metrics.scrollWidth === metrics.clientWidth ? 'pass' : 'fail',
      detail: { viewport, ...metrics }
    });
    await page.screenshot({ path: `qa/reference-${label}.png`, fullPage: false });

    const summary = page.locator('details summary').first();
    await summary.click();
    const open = await summary.evaluate(element => element.parentElement?.hasAttribute('open'));
    await page.locator('body').click({ position: { x: 1, y: 1 } });
    await page.keyboard.press('Tab');
    const focus = await page.evaluate(() => {
      const element = document.activeElement;
      const styles = getComputedStyle(element);
      return { tag: element?.tagName, className: element?.className, outline: styles.outline, outlineOffset: styles.outlineOffset };
    });
    checks.push({
      name: `${label} disclosure and focus`,
      status: open && focus.outline.includes('solid') && focus.outlineOffset === '4px' ? 'pass' : 'fail',
      detail: { open, focus }
    });
    await page.screenshot({ path: `qa/reference-${label}-focus.png`, fullPage: false });
    await context.close();
  }
} finally {
  await browser.close();
}

const receipt = {
  schemaVersion: 1,
  testedAt: new Date().toISOString(),
  route: 'local-http',
  url: 'http://127.0.0.1:8765/index.html',
  checks,
  result: checks.every(check => check.status === 'pass') ? 'pass' : 'fail'
};
await fs.writeFile('qa/reference-checks.json', JSON.stringify(receipt, null, 2));
console.log(JSON.stringify(receipt));
if (receipt.result !== 'pass') process.exitCode = 1;
