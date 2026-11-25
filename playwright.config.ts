import { defineConfig, devices } from '@playwright/test';

/**
 * 집몽 E2E — 데스크톱(1440×900)과 모바일(390×844) 두 화면을 함께 확인합니다.
 * `npm run test:e2e` 로 실행하며, 개발 서버를 자동으로 띄웁니다.
 */
const PORT = 4173;
const BASE_URL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: 'e2e',
  timeout: 90_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 1,
  retries: process.env.PW_NO_RETRY === '1' ? 0 : 1,
  reporter: [['list']],
  use: {
    baseURL: BASE_URL,
    trace: 'off',
    launchOptions: { args: ['--no-sandbox', '--disable-dev-shm-usage'] },
  },
  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'mobile',
      use: {
        ...devices['Pixel 7'],
        viewport: { width: 390, height: 844 },
      },
    },
  ],
  webServer: {
    command: `node node_modules/vite/bin/vite.js --host 127.0.0.1 --port ${PORT} --strictPort`,
    url: BASE_URL,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
