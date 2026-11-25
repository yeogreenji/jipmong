/**
 * GET /api/health — Vercel Serverless Function 자리
 *
 * 이 파일은 배포 환경이 살아 있는지, 실거래가 키가 설정됐는지 확인하는 최소 엔드포인트입니다.
 *  · 비밀 값은 절대 응답에 담지 않습니다. 설정 여부(boolean)만 돌려줍니다.
 *  · 실거래가 연동(국토교통부)은 이 파일 옆에 `api/trades.ts`로 추가합니다.
 *  · 프런트엔드는 아직 이 API를 호출하지 않습니다(v0.1 뼈대). 샘플 데이터만 씁니다.
 *
 * Vercel Node 런타임은 핸들러를 `(req, res)`로 호출하고 `res.end()`가 있어야 응답을 마칩니다.
 * (Response 객체를 반환하는 방식은 Node 런타임에서 응답되지 않아 504 FUNCTION_INVOCATION_TIMEOUT이 납니다.
 *  2026-11-26 라이브 배포 검증에서 확인 후 이 시그니처로 고쳤습니다.)
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

/** Vercel(Node)이 넘겨주는 응답 객체 중 이 핸들러가 쓰는 부분만 타입으로 잡습니다. */
interface NodeLikeResponse {
  statusCode: number;
  setHeader(name: string, value: string): void;
  end(body?: string): void;
}

const env = (): Record<string, string | undefined> =>
  (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {};

export default function handler(_req: unknown, res: NodeLikeResponse): void {
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

  res.statusCode = 200;
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.setHeader('cache-control', 'no-store');
  res.end(JSON.stringify(body));
}
