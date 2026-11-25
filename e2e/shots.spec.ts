import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

/**
 * 결과 보고용 스크린샷.
 *  · desktop : 1440×900 — 꿈의 집 설정, 내 집 마련 프로젝트
 *  · mobile  : 390×844 — 이 집에 산다면 나의 하루
 * 실행: npm run test:e2e
 */
test('docs/screenshots 캡처', async ({ page }, testInfo) => {
  await mkdir('docs/screenshots', { recursive: true });

  if (testInfo.project.name === 'desktop') {
    await page.goto('/#dream');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('꿈의 집을 먼저 그려 볼까요');
    await page.screenshot({ path: 'docs/screenshots/desktop-1440-dream.png' });

    await page.locator('[data-tab="project"]:visible').first().click();
    await expect(page.getByTestId('progress-value')).toBeVisible();
    await page.screenshot({ path: 'docs/screenshots/desktop-1440-project.png' });
    return;
  }

  await page.goto('/#daily');
  await expect(page.getByRole('heading', { name: '이 집에 산다면, 나의 하루는' })).toBeVisible();
  await page.screenshot({ path: 'docs/screenshots/mobile-390-daily.png' });
});
