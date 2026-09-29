#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';

const [outputDirectory] = process.argv.slice(2);
if (!outputDirectory) {
  throw new Error('Usage: node capture-selected-state.mjs output-directory');
}

const require = createRequire(import.meta.url);
const playwright = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const collector = await fs.readFile('/Users/miad/Documents/Projects/skill-atlas/skills/design-system-reverse-engineer/scripts/collect.js', 'utf8');
const output = path.resolve(outputDirectory);
await fs.mkdir(output, { recursive: true });

const browser = await playwright.chromium.launch({
  headless: true,
  ...(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {})
});

try {
  const viewport = { width: 390, height: 844 };
  const context = await browser.newContext({ viewport, colorScheme: 'light' });
  const page = await context.newPage();
  await page.goto('https://catalyst.app/', { waitUntil: 'domcontentloaded', timeout: 35000 });
  await Promise.race([
    page.evaluate(() => document.fonts.ready.then(() => true)),
    new Promise(resolve => setTimeout(resolve, 6000))
  ]);
  await page.locator('.framer-qe1r5r').click();
  await page.waitForTimeout(350);
  const id = 'mobile-performance-simulated-selected';
  const raw = await page.evaluate(collector);
  raw.captureId = id;
  raw.state = 'selected';
  raw.probe = { selector: '.framer-qe1r5r', action: 'click' };
  await fs.writeFile(path.join(output, `${id}.json`), JSON.stringify(raw, null, 2));
  await page.screenshot({ path: path.join(output, `${id}.png`), fullPage: true });
  await fs.writeFile(path.join(output, 'capture-index.json'), JSON.stringify({
    schemaVersion: 1,
    capturedAt: new Date().toISOString(),
    browser: 'chromium',
    channel: process.env.PLAYWRIGHT_CHANNEL || 'bundled',
    page: 'https://catalyst.app/',
    records: [{ id, viewport, state: 'selected', status: 'captured' }]
  }, null, 2));
  await context.close();
} finally {
  await browser.close();
}

console.log(JSON.stringify({ captured: 1, output }));
