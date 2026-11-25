/**
 * GET /api/health — Vercel Serverless Function 자리
 *
 * 이 파일은 배포 환경이 살아 있는지, 실거래가 키가 설정됐는지 확인하는 최소 엔드포인트입니다.
 *  · 비밀 값은 절대 응답에 담지 않습니다. 설정 여부(boolean)만 돌려줍니다.
 *  · 실거래가 연동(국토교통부)은 이 파일 옆에 `api/trades.ts`로 추가합니다.
 *  · 프런트엔드는 아직 이 API를 호출하지 않습니다(v0.1 뼈대). 샘플 데이터만 씁니다.
 */

interface HealthResponse {
  ok: boolean;
  app: 'jipmong';
  version: string;
  dataMode: 'sample' | 'live';
  checks: {
    molitApiKeyConfigured: boolean;
    env: string;
  };
  message: string;
  checkedAt: string;
}

const env = (): Record<string, string | undefined> =>
  (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {};

export default function handler(): Response {
  const current = env();
  const keyConfigured = Boolean(current.MOLIT_TRADE_API_KEY);
  const dataMode: 'sample' | 'live' =
    current.DATA_MODE === 'live' && keyConfigured ? 'live' : 'sample';

  const body: HealthResponse = {
    ok: true,
    app: 'jipmong',
    version: '0.1.0',
    dataMode,
    checks: {
      molitApiKeyConfigured: keyConfigured,
      env: current.VERCEL_ENV ?? 'local',
    },
    message:
      dataMode === 'sample'
        ? '집몽 v0.1 뼈대 · 단지 정보는 샘플 데이터입니다. 국토교통부 실거래가 키가 설정되면 live로 전환됩니다.'
        : '집몽 v0.1 뼈대 · 실거래가 키가 설정되어 있습니다.',
    checkedAt: new Date().toISOString(),
  };

  return new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}
