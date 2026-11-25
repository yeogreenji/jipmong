import { test, expect, type Page } from '@playwright/test';

/** 데스크톱·모바일 어느 쪽이든 보이는 탭 버튼을 누릅니다. */
async function openTab(page: Page, id: 'dream' | 'daily' | 'project' | 'complex') {
  await page.locator(`[data-tab="${id}"]:visible`).first().click();
}

test('기본 렌더링 · 샘플 배너 · 네 개 탭이 보인다', async ({ page }, testInfo) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1 })).toContainText('꿈의 집을 먼저 그려 볼까요');
  await expect(page.getByText('지금 보고 있는 단지·시세는 모두 샘플 데이터입니다')).toBeVisible();
  if (testInfo.project.name === 'desktop') {
    await expect(page.getByText('v0.1 뼈대')).toBeVisible();
  }

  const visibleTabs = page.locator('[data-tab]:visible');
  await expect(visibleTabs).toHaveCount(4);

  // 꿈의 집 기본값이 화면에 반영되는지
  await expect(page.locator('#dream-budget')).toHaveValue('90000');
  await expect(page.locator('#dream-area')).toHaveValue('59.9');
});

test('탭 전환이 각 화면을 연다', async ({ page }) => {
  await page.goto('/');

  await openTab(page, 'daily');
  await expect(page.getByRole('heading', { name: '이 집에 산다면, 나의 하루는' })).toBeVisible();
  await expect(page.getByText('월 주거비 시나리오')).toBeVisible();
  await expect(page.getByText('아침', { exact: true }).first()).toBeVisible();

  await openTab(page, 'project');
  await expect(page.getByRole('heading', { name: '내 집 마련 프로젝트' })).toBeVisible();
  await expect(page.getByTestId('progress-value')).toBeVisible();

  await openTab(page, 'complex');
  await expect(page.getByRole('heading', { name: '단지 정보와 임장 도구' })).toBeVisible();
  await expect(page.getByText('개인 임장 체크리스트')).toBeVisible();
  await expect(page.getByText('안전 검증 후 열려요')).toBeVisible();

  await openTab(page, 'dream');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('꿈의 집을 먼저 그려 볼까요');
});

test('내 집 마련 진행률·준비 기간이 입력에 따라 실시간 계산된다', async ({ page }) => {
  await page.goto('/#project');

  // 기본값: 목표 9억 · 현재 2억 5,000만 · 대출 5억 · 부대비용 1,350만
  // 필요 자기자금 4억 1,350만 → 진행률 60%
  await expect(page.getByTestId('progress-value')).toHaveText('60%');
  await expect(page.getByTestId('required-cash')).toContainText('4억 1,350만원');
  await expect(page.getByTestId('shortfall')).toContainText('1억 6,350만원');
  // 1억 6,350만 / 월 200만 = 82개월 = 6년 10개월
  await expect(page.getByTestId('months-to-go')).toContainText('6년 10개월');
  // 대출 5억 · 4.2% · 30년 원리금균등 ≈ 월 245만원
  await expect(page.getByTestId('monthly-payment')).toContainText('245만원');

  // 목표 집값을 12억으로 올리면 진행률이 다시 계산된다.
  await page.locator('#fin-target').fill('120000');
  await expect(page.getByTestId('progress-value')).toHaveText('35%');
  await expect(page.getByTestId('required-cash')).toContainText('7억 1,350만원');
  await expect(page.getByTestId('shortfall')).toContainText('4억 6,350만원');
  await expect(page.getByTestId('months-to-go')).toContainText('19년 4개월');

  // 저축 기록을 더하면 현재 자기자금과 진행률이 함께 올라간다.
  await page.locator('#saving-amount').fill('1000');
  await page.getByRole('button', { name: '저축 기록 추가' }).click();
  await expect(page.locator('#fin-current')).toHaveValue('26000');
  await expect(page.getByTestId('progress-value')).toHaveText('36%');
});

test('후보 단지와 하루 타임라인 · 임장 확인 토글이 동작한다', async ({ page }) => {
  await page.goto('/#dream');
  await expect(page.getByRole('heading', { name: '조건에 가까운 후보 단지' })).toBeVisible();
  await expect(page.locator('aside li').filter({ hasText: '몽글마을 1단지' }).first()).toBeVisible();

  await openTab(page, 'daily');
  await expect(page.getByText('철산구름 아파트').first()).toBeVisible();
  await expect(page.getByText('도보 7분')).toBeVisible();
  await expect(page.getByText('샘플', { exact: true }).first()).toBeVisible();

  const onsiteButton = page.locator('button[aria-pressed]', { hasText: '임장 확인' }).first();
  await expect(onsiteButton).toHaveAttribute('aria-pressed', 'false');
  await onsiteButton.click();
  await expect(onsiteButton).toHaveAttribute('aria-pressed', 'true');
});

test('모바일 하단 탭이 보이고 화면을 전환한다', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', '모바일 전용 확인');
  await page.goto('/');
  const mobileTabs = page.locator('[data-nav="mobile"]:visible');
  await expect(mobileTabs).toHaveCount(4);
  await mobileTabs.nth(2).click();
  await expect(page.getByRole('heading', { name: '내 집 마련 프로젝트' })).toBeVisible();
});
