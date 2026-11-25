import { useMemo, useState } from 'react';
import {
  Calculator,
  CalendarClock,
  ClipboardCheck,
  Info,
  NotebookPen,
  Plus,
  Target,
  Trash2,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import { useI18n } from '../i18n';
import { useStore } from '../store';
import { CONTRACT_CHECKLIST, CONTRACT_GROUP_ORDER, type ContractChecklistItem } from '../data/checklists';
import {
  CheckRow,
  Field,
  NumberField,
  ProgressBar,
  SectionCard,
  Stat,
} from '../components/ui';
import { formatDuration, formatManwon, formatPct, todayIso } from '../lib/format';
import type { MessageKey } from '../i18n/ko';

const GROUP_LABEL_KEY: Record<ContractChecklistItem['group'], MessageKey> = {
  fund: 'project.checklistGroup.fund',
  find: 'project.checklistGroup.find',
  visit: 'project.checklistGroup.visit',
  contract: 'project.checklistGroup.contract',
  move: 'project.checklistGroup.move',
};

export default function ProjectPlan() {
  const { t, lang, pick } = useI18n();
  const {
    profile,
    finance,
    updateFinance,
    summary,
    savings,
    addSaving,
    removeSaving,
    diary,
    addDiary,
    removeDiary,
    contractChecks,
    toggleContract,
    resetContract,
    notify,
  } = useStore();

  const [savingAmount, setSavingAmount] = useState(100);
  const [savingDate, setSavingDate] = useState(todayIso());
  const [savingMemo, setSavingMemo] = useState('');
  const [diaryTitle, setDiaryTitle] = useState('');
  const [diaryMemo, setDiaryMemo] = useState('');

  const doneChecks = useMemo(
    () => CONTRACT_CHECKLIST.filter((item) => contractChecks[item.id]).length,
    [contractChecks],
  );

  const handleAddSaving = () => {
    if (savingAmount <= 0) return;
    addSaving({ amountManwon: Math.round(savingAmount), date: savingDate, memo: savingMemo.trim() });
    setSavingMemo('');
    notify(t('common.saved'));
  };

  const handleAddDiary = () => {
    if (!diaryTitle.trim()) return;
    addDiary({ date: todayIso(), title: diaryTitle.trim(), memo: diaryMemo.trim() });
    setDiaryTitle('');
    setDiaryMemo('');
    notify(t('common.saved'));
  };

  const durationText =
    summary.monthsToGoal === null
      ? t('project.monthsImpossible')
      : summary.monthsToGoal === 0
        ? t('project.monthsDone')
        : t('project.monthsValue', { duration: formatDuration(summary.monthsToGoal, lang) });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">{t('project.title')}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">{t('project.subtitle')}</p>
      </div>

      {/* 핵심 지표 */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-moss/25 bg-sprout-soft/70 p-4 sm:col-span-2 xl:col-span-1">
          <p className="text-[12px] font-semibold text-ink-soft">{t('project.progress')}</p>
          <p className="mt-1 text-3xl font-extrabold tabular-nums text-moss" data-testid="progress-value">{formatPct(summary.progressPct, 0)}</p>
          <div className="mt-2">
            <ProgressBar value={summary.progressPct} label={t('project.progress')} />
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-ink-faint">
            {t('project.progressCaption', {
              required: formatManwon(summary.requiredCashManwon, lang),
              saved: formatManwon(finance.currentFundsManwon, lang),
            })}
          </p>
        </div>
        <Stat label={t('project.requiredCash')} value={formatManwon(summary.requiredCashManwon, lang)} hint={t('project.requiredCashHint')} testId="required-cash" />
        <Stat label={t('project.shortfall')} value={formatManwon(summary.shortfallManwon, lang)} hint={t('project.shortfallHint')} testId="shortfall" />
        <Stat label={t('project.monthsToGoal')} value={durationText} hint={t('project.monthlySaving')} emphasis testId="months-to-go" />
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
        {/* 입력 */}
        <SectionCard
          title={t('project.inputs')}
          action={
            <button
              type="button"
              onClick={() => {
                updateFinance({ targetPriceManwon: profile.budgetManwon });
                notify(t('common.apply'));
              }}
              className="rounded-full border border-line bg-paper px-3 py-1.5 text-[11px] font-semibold text-ink-soft transition-colors hover:border-moss hover:text-moss"
            >
              {t('dream.budget')} {formatManwon(profile.budgetManwon, lang)}
            </button>
          }
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t('project.targetPrice')} htmlFor="fin-target">
              <NumberField
                id="fin-target"
                value={finance.targetPriceManwon}
                step={500}
                onChange={(value) => updateFinance({ targetPriceManwon: value })}
                suffix={t('common.manwon')}
                ariaLabel={t('project.targetPrice')}
              />
            </Field>
            <Field label={t('project.currentFunds')} htmlFor="fin-current">
              <NumberField
                id="fin-current"
                value={finance.currentFundsManwon}
                step={100}
                onChange={(value) => updateFinance({ currentFundsManwon: value })}
                suffix={t('common.manwon')}
                ariaLabel={t('project.currentFunds')}
              />
            </Field>
            <Field label={t('project.loan')} htmlFor="fin-loan">
              <NumberField
                id="fin-loan"
                value={finance.expectedLoanManwon}
                step={500}
                onChange={(value) => updateFinance({ expectedLoanManwon: value })}
                suffix={t('common.manwon')}
                ariaLabel={t('project.loan')}
              />
            </Field>
            <Field label={t('project.extraCosts')} htmlFor="fin-extra">
              <NumberField
                id="fin-extra"
                value={finance.extraCostsManwon}
                step={50}
                onChange={(value) => updateFinance({ extraCostsManwon: value })}
                suffix={t('common.manwon')}
                ariaLabel={t('project.extraCosts')}
              />
            </Field>
            <Field label={t('project.monthlySaving')} htmlFor="fin-saving">
              <NumberField
                id="fin-saving"
                value={finance.monthlySavingManwon}
                step={10}
                onChange={(value) => updateFinance({ monthlySavingManwon: value })}
                suffix={t('common.manwon')}
                ariaLabel={t('project.monthlySaving')}
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label={t('project.rate')} htmlFor="fin-rate">
                <NumberField
                  id="fin-rate"
                  value={finance.loanRatePct}
                  step={0.1}
                  max={20}
                  onChange={(value) => updateFinance({ loanRatePct: value })}
                  suffix="%"
                  ariaLabel={t('project.rate')}
                />
              </Field>
              <Field label={t('project.term')} htmlFor="fin-years">
                <NumberField
                  id="fin-years"
                  value={finance.loanYears}
                  step={1}
                  min={1}
                  max={50}
                  onChange={(value) => updateFinance({ loanYears: Math.round(value) })}
                  suffix={t('common.year')}
                  ariaLabel={t('project.term')}
                />
              </Field>
            </div>
          </div>
        </SectionCard>

        {/* 계산 결과 */}
        <aside className="space-y-4">
          <SectionCard
            title={
              <span className="flex items-center gap-2">
                <Calculator className="h-4 w-4 text-moss" aria-hidden />
                {t('project.monthlyPayment')}
              </span>
            }
          >
            <p className="text-2xl font-extrabold tabular-nums text-ink" data-testid="monthly-payment">
              {summary.monthlyPaymentManwon === null ? '—' : formatManwon(summary.monthlyPaymentManwon, lang)}
              {summary.monthlyPaymentManwon !== null && (
                <span className="ml-1 text-xs font-medium text-ink-faint">{t('common.perMonth')}</span>
              )}
            </p>
            <dl className="mt-3 space-y-2 text-xs">
              <div className="flex items-center justify-between gap-2">
                <dt className="flex items-center gap-1.5 text-ink-soft">
                  <TrendingUp className="h-3.5 w-3.5" aria-hidden />
                  {t('project.totalInterest')}
                </dt>
                <dd className="font-semibold tabular-nums text-ink">
                  {summary.totalInterestManwon === null ? '—' : formatManwon(summary.totalInterestManwon, lang)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-2">
                <dt className="flex items-center gap-1.5 text-ink-soft">
                  <Wallet className="h-3.5 w-3.5" aria-hidden />
                  {t('project.ltv')}
                </dt>
                <dd className="font-semibold tabular-nums text-ink">{formatPct(summary.loanSharePct, 0)}</dd>
              </div>
              <div className="flex items-center justify-between gap-2">
                <dt className="flex items-center gap-1.5 text-ink-soft">
                  <CalendarClock className="h-3.5 w-3.5" aria-hidden />
                  {t('project.monthsToGoal')}
                </dt>
                <dd className="font-semibold text-ink">{durationText}</dd>
              </div>
            </dl>
          </SectionCard>

          <div className="rounded-2xl border border-line bg-paper/70 p-4">
            <p className="flex items-center gap-1.5 text-[11px] font-bold text-clay">
              <Info className="h-3.5 w-3.5" aria-hidden />
              {t('project.disclaimer')}
            </p>
          </div>
        </aside>
      </div>

      {/* 저축·다이어리 */}
      <div className="grid gap-5 lg:grid-cols-2">
        <SectionCard title={t('project.saving')} subtitle={t('project.savingBody')}>
          <div className="grid gap-3 sm:grid-cols-[1fr_1fr]">
            <Field label={t('project.savingAmount')} htmlFor="saving-amount">
              <NumberField
                id="saving-amount"
                value={savingAmount}
                step={10}
                onChange={setSavingAmount}
                suffix={t('common.manwon')}
                ariaLabel={t('project.savingAmount')}
              />
            </Field>
            <Field label={t('project.savingDate')} htmlFor="saving-date">
              <input
                id="saving-date"
                type="date"
                className="jm-field"
                value={savingDate}
                onChange={(event) => setSavingDate(event.target.value)}
              />
            </Field>
          </div>
          <div className="mt-3 flex gap-2">
            <input
              className="jm-field"
              placeholder={t('project.savingMemo')}
              value={savingMemo}
              onChange={(event) => setSavingMemo(event.target.value)}
              aria-label={t('project.savingMemo')}
            />
            <button
              type="button"
              onClick={handleAddSaving}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-moss px-4 py-2 text-xs font-bold text-cream transition-colors hover:bg-moss-deep"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden />
              {t('project.savingAdd')}
            </button>
          </div>

          {savings.length === 0 ? (
            <p className="mt-4 text-xs text-ink-faint">{t('project.savingEmpty')}</p>
          ) : (
            <ul className="mt-4 divide-y divide-line">
              {savings.slice(0, 8).map((record) => (
                <li key={record.id} className="flex items-center justify-between gap-2 py-2.5">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold tabular-nums text-ink">
                      {formatManwon(record.amountManwon, lang)}
                    </p>
                    <p className="text-[11px] text-ink-faint">
                      {record.date}
                      {record.memo ? ` · ${record.memo}` : ''}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSaving(record.id)}
                    aria-label={t('common.delete')}
                    className="rounded-full p-1.5 text-ink-faint transition-colors hover:bg-clay-soft hover:text-clay"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard
          title={
            <span className="flex items-center gap-2">
              <NotebookPen className="h-4 w-4 text-apricot" aria-hidden />
              {t('project.diary')}
            </span>
          }
          subtitle={t('project.diaryBody')}
        >
          <div className="space-y-2">
            <input
              className="jm-field"
              placeholder={t('project.diaryTitle')}
              value={diaryTitle}
              onChange={(event) => setDiaryTitle(event.target.value)}
              aria-label={t('project.diaryTitle')}
            />
            <textarea
              className="jm-field resize-none leading-relaxed"
              rows={3}
              placeholder={t('project.diaryMemo')}
              value={diaryMemo}
              onChange={(event) => setDiaryMemo(event.target.value)}
              aria-label={t('project.diaryMemo')}
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleAddDiary}
                disabled={!diaryTitle.trim()}
                className="inline-flex items-center gap-1.5 rounded-full bg-apricot px-4 py-2 text-xs font-bold text-[#3a2216] transition-colors hover:bg-clay hover:text-cream disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Plus className="h-3.5 w-3.5" aria-hidden />
                {t('project.diaryAdd')}
              </button>
            </div>
          </div>

          {diary.length === 0 ? (
            <p className="mt-4 text-xs text-ink-faint">{t('project.diaryEmpty')}</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {diary.slice(0, 5).map((entry) => (
                <li key={entry.id} className="rounded-xl border border-line bg-cream/50 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-ink">{entry.title}</p>
                      <p className="text-[11px] text-ink-faint">{entry.date}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeDiary(entry.id)}
                      aria-label={t('project.diaryDelete')}
                      className="rounded-full p-1 text-ink-faint hover:text-clay"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden />
                    </button>
                  </div>
                  {entry.memo && <p className="mt-1.5 whitespace-pre-wrap text-xs leading-relaxed text-ink-soft">{entry.memo}</p>}
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>

      {/* 체크리스트 */}
      <SectionCard
        title={
          <span className="flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4 text-moss" aria-hidden />
            {t('project.checklist')}
          </span>
        }
        action={
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold tabular-nums text-ink-soft">
              {t('project.checklistProgress', { done: doneChecks, total: CONTRACT_CHECKLIST.length })}
            </span>
            <button
              type="button"
              onClick={resetContract}
              className="rounded-full border border-line px-2.5 py-1 text-[11px] font-semibold text-ink-faint hover:border-clay hover:text-clay"
            >
              {t('project.checklistReset')}
            </button>
          </div>
        }
      >
        <div className="mb-4">
          <ProgressBar value={(doneChecks / CONTRACT_CHECKLIST.length) * 100} tone="apricot" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {CONTRACT_GROUP_ORDER.map((group) => (
            <div key={group} className="rounded-xl border border-line bg-cream/40 p-3">
              <p className="mb-1 text-[12px] font-bold text-moss">
                {t(GROUP_LABEL_KEY[group])}
              </p>
              <div>
                {CONTRACT_CHECKLIST.filter((item) => item.group === group).map((item) => (
                  <CheckRow
                    key={item.id}
                    id={`check-${item.id}`}
                    checked={Boolean(contractChecks[item.id])}
                    onChange={() => toggleContract(item.id)}
                  >
                    {pick(item.label)}
                  </CheckRow>
                ))}
              </div>
            </div>
          ))}
        </div>
        {doneChecks === CONTRACT_CHECKLIST.length && (
          <p className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-ok">
            <Target className="h-3.5 w-3.5" aria-hidden />
            {t('project.monthsDone')}
          </p>
        )}
      </SectionCard>
    </div>
  );
}
