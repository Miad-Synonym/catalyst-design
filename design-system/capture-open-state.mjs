#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';

const [outputDirectory] = process.argv.slice(2);
if (!outputDirectory) {
  throw new Error('Usage: node capture-open-state.mjs output-directory');
}

const require = createRequire(import.meta.url);
const playwright = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const collectorPath = '/Users/miad/Documents/Projects/skill-atlas/skills/design-system-reverse-engineer/scripts/collect.js';
const collector = await fs.readFile(collectorPath, 'utf8');
const output = path.resolve(outputDirectory);
await fs.mkdir(output, { recursive: true });

const browser = await playwright.chromium.launch({
  headless: true,
  ...(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {})
});
const records = [];

try {
  for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport, colorScheme: 'light' });
    const page = await context.newPage();
    await page.goto('https://catalyst.app/', { waitUntil: 'domcontentloaded', timeout: 35000 });
    await Promise.race([
      page.evaluate(() => document.fonts.ready.then(() => true)),
      new Promise(resolve => setTimeout(resolve, 6000))
    ]);

    const trigger = page.locator('.framer-hrdnT');
    await trigger.click();
    await page.waitForTimeout(350);

    const prefix = viewport.width < 600 ? 'mobile' : 'desktop';
    const openId = `${prefix}-waitlist-open`;
    const openRaw = await page.evaluate(collector);
    openRaw.captureId = openId;
    openRaw.state = 'open';
    openRaw.probe = { selector: '.framer-hrdnT', action: 'click' };
    await fs.writeFile(path.join(output, `${openId}.json`), JSON.stringify(openRaw, null, 2));
    await page.screenshot({ path: path.join(output, `${openId}.png`), fullPage: true });
    records.push({ id: openId, viewport, state: 'open', status: 'captured' });

    await page.locator('input[name="email address"]').focus();
    await page.waitForTimeout(200);
    const focusId = `${prefix}-waitlist-email-focus`;
    const focusRaw = await page.evaluate(collector);
    focusRaw.captureId = focusId;
    focusRaw.state = 'focus';
    focusRaw.probe = { selector: 'input[name="email address"]', action: 'focus' };
    await fs.writeFile(path.join(output, `${focusId}.json`), JSON.stringify(focusRaw, null, 2));
    await page.screenshot({ path: path.join(output, `${focusId}.png`), fullPage: true });
    records.push({ id: focusId, viewport, state: 'focus', status: 'captured' });
    await context.close();
  }
} finally {
  await browser.close();
}

await fs.writeFile(path.join(output, 'capture-index.json'), JSON.stringify({
  schemaVersion: 1,
  capturedAt: new Date().toISOString(),
  browser: 'chromium',
  channel: process.env.PLAYWRIGHT_CHANNEL || 'bundled',
  page: 'https://catalyst.app/',
  records
}, null, 2));
console.log(JSON.stringify({ captured: records.length, output }));
