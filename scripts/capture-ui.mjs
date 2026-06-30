import { chromium } from 'playwright';
import { mkdirSync } from 'fs';
import { join } from 'path';

const OUT = join(process.cwd(), 'ui-screenshots');
const BASE = 'http://localhost:5173';

async function main() {
  mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto(`${BASE}/coach/login`);
  await page.fill('#email', 'alex@coachtek.app');
  await page.fill('#password', 'coach123');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/coach/dashboard');

  const routes = [
    'dashboard',
    'today',
    'calendar',
    'clients',
    'messages',
    'payouts',
    'programs',
    'invites',
    'profile',
    'feedback',
  ];

  for (const route of routes) {
    await page.goto(`${BASE}/coach/${route}`);
    await page.waitForTimeout(600);
    if (route === 'messages') {
      await page.waitForSelector('text=Morning! Ready for lower body.', { timeout: 5000 }).catch(() => {});
    }
    await page.screenshot({ path: join(OUT, `${route}.png`), fullPage: true });
  }

  await page.goto(`${BASE}/coach/clients/c1`);
  await page.waitForSelector('.ct-activity-bar', { timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(300);
  await page.screenshot({ path: join(OUT, 'client-detail.png'), fullPage: true });

  await browser.close();
  console.log('Screenshots saved to', OUT);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
