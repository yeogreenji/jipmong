/**
 * 내 집 마련 계산 — 순수 함수만 모았습니다.
 *
 * 화면과 테스트가 같은 함수를 씁니다. 여기 값은 모두 '단순 계산값'이며
 * 실제 대출 심사·세금 계산을 대신하지 않습니다.
 */

import type { FinancePlan, HousingType } from '../types';

export interface FinanceSummary {
  /** 목표 집값 − 예상 대출 + 부대비용 */
  requiredCashManwon: number;
  /** requiredCash − 현재 자기자금 (0 이상) */
  shortfallManwon: number;
  /** 0~100 */
  progressPct: number;
  /** 월 저축 목표가 0이면 null */
  monthsToGoal: number | null;
  /** 대출이 없으면 null */
  monthlyPaymentManwon: number | null;
  totalInterestManwon: number | null;
  /** 대출 / 목표 집값 × 100 */
  loanSharePct: number;
}

const clamp0 = (value: number): number => (Number.isFinite(value) && value > 0 ? value : 0);

export function normalizePlan(plan: FinancePlan): FinancePlan {
  return {
    targetPriceManwon: clamp0(plan.targetPriceManwon),
    currentFundsManwon: clamp0(plan.currentFundsManwon),
    expectedLoanManwon: clamp0(plan.expectedLoanManwon),
    extraCostsManwon: clamp0(plan.extraCostsManwon),
    monthlySavingManwon: clamp0(plan.monthlySavingManwon),
    loanRatePct: clamp0(plan.loanRatePct),
    loanYears: clamp0(plan.loanYears),
  };
}

/**
 * 원리금균등상환 월 납입액 (만원 단위 그대로 계산)
 * r=0이면 단순 분할, 기간이 0이면 계산하지 않습니다.
 */
export function monthlyPaymentManwon(
  principalManwon: number,
  annualRatePct: number,
  years: number,
): number | null {
  const principal = clamp0(principalManwon);
  const n = Math.round(clamp0(years) * 12);
  if (principal === 0 || n === 0) return null;

  const r = clamp0(annualRatePct) / 100 / 12;
  if (r === 0) return principal / n;

  const payment = (principal * r) / (1 - Math.pow(1 + r, -n));
  return Number.isFinite(payment) ? payment : null;
}

export function summarizeFinance(input: FinancePlan): FinanceSummary {
  const plan = normalizePlan(input);

  const requiredCashManwon = Math.max(
    0,
    plan.targetPriceManwon - plan.expectedLoanManwon + plan.extraCostsManwon,
  );
  const shortfallManwon = Math.max(0, requiredCashManwon - plan.currentFundsManwon);

  let progressPct = 0;
  if (requiredCashManwon > 0) {
    progressPct = Math.min(100, (plan.currentFundsManwon / requiredCashManwon) * 100);
  } else if (plan.currentFundsManwon > 0) {
    progressPct = 100;
  }

  let monthsToGoal: number | null = null;
  if (shortfallManwon === 0) {
    monthsToGoal = 0;
  } else if (plan.monthlySavingManwon > 0) {
    monthsToGoal = Math.ceil(shortfallManwon / plan.monthlySavingManwon);
  }

  const payment = monthlyPaymentManwon(
    plan.expectedLoanManwon,
    plan.loanRatePct,
    plan.loanYears,
  );
  const totalInterestManwon =
    payment === null ? null : Math.max(0, payment * plan.loanYears * 12 - plan.expectedLoanManwon);

  const loanSharePct =
    plan.targetPriceManwon > 0 ? (plan.expectedLoanManwon / plan.targetPriceManwon) * 100 : 0;

  return {
    requiredCashManwon,
    shortfallManwon,
    progressPct,
    monthsToGoal,
    monthlyPaymentManwon: payment,
    totalInterestManwon,
    loanSharePct,
  };
}

/**
 * 취득 비용 단순 추정 (매매가 대비).
 * 아파트 1.5% = 취득세 1.1% + 중개보수 0.4%
 * 오피스텔 5.0% = 취득세 4.6% + 중개보수 0.4%
 * 실제 세율·보수는 계약 형태·가격·정책에 따라 달라집니다.
 */
export function estimateAcquisitionCostManwon(priceManwon: number, type: HousingType): number {
  const rate = type === 'officetel' ? 0.05 : 0.015;
  return Math.round(clamp0(priceManwon) * rate);
}

/** 대출 60% 가정 시 월 원리금 (비교 표용, 30년·4.2% 고정 가정) */
export function estimateMonthlyWithLoan(priceManwon: number): {
  loanManwon: number;
  monthlyManwon: number;
} {
  const loanManwon = Math.round(clamp0(priceManwon) * 0.6);
  const monthly = monthlyPaymentManwon(loanManwon, 4.2, 30) ?? 0;
  return { loanManwon, monthlyManwon: monthly };
}
