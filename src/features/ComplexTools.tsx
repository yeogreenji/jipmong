import { useMemo, useState } from 'react';
import {
  ArrowUpRight,
  Check,
  Columns3,
  Compass,
  Filter,
  MapPin,
  ShieldCheck,
  TrainFront,
  Users,
} from 'lucide-react';
import { useI18n } from '../i18n';
import { useStore } from '../store';
import { SAMPLE_COMPLEXES, SAMPLE_DISTRICTS, jeonseRatio, peakDiffPct } from '../data/complexes';
import { WALKTHROUGH_GROUPS, WALKTHROUGH_ITEMS } from '../data/checklists';
import { HOUSING_TYPES } from '../data/options';
import { Badge, CheckRow, ProgressBar, SectionCard } from '../components/ui';
import { estimateAcquisitionCostManwon, estimateMonthlyWithLoan } from '../lib/calc';
import { formatManwon, formatManwonShort, formatPct } from '../lib/format';
import type { Complex, HousingType } from '../types';

type TypeFilter = 'all' | HousingType;

export default function ComplexTools() {
  const { t, lang, pick } = useI18n();
  const { visitChecks, toggleVisit, visitMemos, setVisitMemo } = useStore();

  const [district, setDistrict] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [compareIds, setCompareIds] = useState<string[]>([]);

  const filtered = useMemo(
    () =>
      SAMPLE_COMPLEXES.filter(
        (complex) =>
          (district === 'all' || complex.district === district) &&
          (typeFilter === 'all' || complex.type === typeFilter),
      ),
    [district, typeFilter],
  );

  const compared = useMemo(
    () =>
      compareIds
        .map((id) => SAMPLE_COMPLEXES.find((complex) => complex.id === id))
        .filter((complex): complex is Complex => Boolean(complex)),
    [compareIds],
  );

  const checksDone = WALKTHROUGH_ITEMS.filter((item) => visitChecks[item.id]).length;

  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((entry) => entry !== id);
      if (prev.length >= 3) return [...prev.slice(1), id];
      return [...prev, id];
    });
  };

  const typeLabel = (type: HousingType) =>
    pick(HOUSING_TYPES.find((item) => item.id === type)?.label ?? HOUSING_TYPES[0].label);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">{t('complex.title')}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">{t('complex.subtitle')}</p>
        </div>
        <Badge tone="sample">{t('common.sample')}</Badge>
      </div>

      {/* 필터 */}
      <SectionCard className="!p-4 sm:!p-5">
        <div className="flex flex-wrap items-end gap-4">
          <div className="min-w-[12rem]">
            <label htmlFor="district-filter" className="mb-1 flex items-center gap-1.5 text-[13px] font-semibold text-ink-soft">
              <Filter className="h-3.5 w-3.5" aria-hidden />
              {t('complex.filterDistrict')}
            </label>
            <select
              id="district-filter"
              className="jm-field"
              value={district}
              onChange={(event) => setDistrict(event.target.value)}
            >
              <option value="all">{t('complex.all')}</option>
              {SAMPLE_DISTRICTS.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <p className="mb-1.5 text-[13px] font-semibold text-ink-soft">{t('complex.filterType')}</p>
            <div className="flex flex-wrap gap-2">
              {(['all', 'apartment', 'officetel'] as TypeFilter[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  aria-pressed={typeFilter === type}
                  onClick={() => setTypeFilter(type)}
                  className={`jm-chip ${
                    typeFilter === type ? '!border-moss !bg-moss !text-cream' : ''
                  }`}
                >
                  {type === 'all' ? t('complex.allTypes') : typeLabel(type)}
                </button>
              ))}
            </div>
          </div>
          <p className="ml-auto text-xs font-semibold text-ink-soft">{t('complex.count', { n: filtered.length })}</p>
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-ink-faint">{t('complex.table.note')}</p>
        <p className="mt-1 text-[11px] leading-relaxed text-ink-faint">{t('complex.listingNote')}</p>
      </SectionCard>

      {/* 표 (데스크톱) */}
      <SectionCard className="!p-0 overflow-hidden">
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[62rem] border-collapse text-sm">
            <thead>
              <tr className="border-b border-line bg-cream/70 text-left text-[11px] uppercase tracking-wide text-ink-faint">
                <th className="px-4 py-3 font-bold">{t('complex.table.complex')}</th>
                <th className="px-3 py-3 font-bold">{t('complex.table.type')}</th>
                <th className="px-3 py-3 text-right font-bold">{t('complex.table.area')}</th>
                <th className="px-3 py-3 text-right font-bold">{t('complex.table.price')}</th>
                <th className="px-3 py-3 text-right font-bold">{t('complex.table.jeonse')}</th>
                <th className="px-3 py-3 text-right font-bold">{t('complex.table.ratio')}</th>
                <th className="px-3 py-3 text-right font-bold">{t('complex.table.peak')}</th>
                <th className="px-3 py-3 text-right font-bold">{t('complex.table.trades')}</th>
                <th className="px-3 py-3 text-right font-bold">{t('complex.table.commute')}</th>
                <th className="px-3 py-3 text-right font-bold">{t('complex.compare')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((complex) => {
                const ratio = jeonseRatio(complex);
                const peak = peakDiffPct(complex);
                const inCompare = compareIds.includes(complex.id);
                return (
                  <tr key={complex.id} className="border-b border-line/70 last:border-0 hover:bg-cream/40">
                    <td className="px-4 py-3">
                      <p className="font-bold text-ink">{lang === 'en' ? complex.nameEn : complex.name}</p>
                      <p className="mt-0.5 flex items-center gap-1 text-[11px] text-ink-soft">
                        <MapPin className="h-3 w-3" aria-hidden />
                        {lang === 'en'
                          ? `${complex.neighborhoodEn}, ${complex.districtEn}`
                          : `${complex.district} ${complex.neighborhood}`}
                        <Badge tone="sample" className="ml-1">
                          {t('common.sample')}
                        </Badge>
                      </p>
                    </td>
                    <td className="px-3 py-3 text-ink-soft">{typeLabel(complex.type)}</td>
                    <td className="px-3 py-3 text-right tabular-nums text-ink-soft">{complex.areaM2}㎡</td>
                    <td className="px-3 py-3 text-right font-semibold tabular-nums text-ink">
                      {formatManwon(complex.priceManwon, lang)}
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums text-ink-soft">
                      {formatManwon(complex.jeonseManwon, lang)}
                    </td>
                    <td className="px-3 py-3 text-right">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-bold tabular-nums ${
                          ratio >= 80 ? 'bg-warn-soft text-warn' : 'bg-sprout-soft text-moss'
                        }`}
                      >
                        {formatPct(ratio, 0)}
                      </span>
                    </td>
                    <td className={`px-3 py-3 text-right tabular-nums ${peak < 0 ? 'text-info' : 'text-ink-soft'}`}>
                      {formatPct(peak, 1)}
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums text-ink-soft">{complex.tradeCount90d}</td>
                    <td className="px-3 py-3 text-right text-ink-soft">
                      <span className="inline-flex items-center gap-1 text-[11px]">
                        <TrainFront className="h-3 w-3" aria-hidden />
                        {complex.walkMin}분 · {complex.commuteMin}분
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => toggleCompare(complex.id)}
                        aria-pressed={inCompare}
                        className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                          inCompare
                            ? 'border-moss bg-moss text-cream'
                            : 'border-line bg-paper text-ink-soft hover:border-moss hover:text-moss'
                        }`}
                      >
                        {inCompare ? t('complex.comparePicked') : t('complex.comparePick')}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 카드 목록 (모바일) */}
        <ul className="divide-y divide-line md:hidden">
          {filtered.map((complex) => {
            const ratio = jeonseRatio(complex);
            const inCompare = compareIds.includes(complex.id);
            return (
              <li key={complex.id} className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 text-sm font-bold text-ink">
                      {lang === 'en' ? complex.nameEn : complex.name}
                      <Badge tone="sample">{t('common.sample')}</Badge>
                    </p>
                    <p className="mt-0.5 flex items-center gap-1 text-[11px] text-ink-soft">
                      <MapPin className="h-3 w-3" aria-hidden />
                      {lang === 'en'
                        ? `${complex.neighborhoodEn}, ${complex.districtEn}`
                        : `${complex.district} ${complex.neighborhood}`}
                      · {typeLabel(complex.type)} · {complex.areaM2}㎡
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-extrabold tabular-nums text-ink">
                    {formatManwon(complex.priceManwon, lang)}
                  </p>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2 rounded-xl bg-cream/60 p-2.5 text-center text-[11px]">
                  <div>
                    <p className="text-ink-faint">{t('complex.table.jeonse')}</p>
                    <p className="font-semibold tabular-nums text-ink">{formatManwonShort(complex.jeonseManwon, lang)}</p>
                  </div>
                  <div>
                    <p className="text-ink-faint">{t('complex.table.ratio')}</p>
                    <p className={`font-semibold tabular-nums ${ratio >= 80 ? 'text-warn' : 'text-moss'}`}>
                      {formatPct(ratio, 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-ink-faint">{t('complex.table.commute')}</p>
                    <p className="font-semibold tabular-nums text-ink">{complex.commuteMin}분</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleCompare(complex.id)}
                  aria-pressed={inCompare}
                  className={`mt-2 w-full rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-colors ${
                    inCompare ? 'border-moss bg-moss text-cream' : 'border-line text-ink-soft'
                  }`}
                >
                  {inCompare ? t('complex.comparePicked') : t('complex.comparePick')}
                </button>
              </li>
            );
          })}
        </ul>
      </SectionCard>

      {/* 비교 */}
      <SectionCard
        title={
          <span className="flex items-center gap-2">
            <Columns3 className="h-4 w-4 text-moss" aria-hidden />
            {t('complex.compare')}
          </span>
        }
        subtitle={t('complex.compareBody')}
        action={<Badge tone="calc">{t('common.estimate')}</Badge>}
      >
        {compared.length < 2 ? (
          <p className="rounded-xl border border-dashed border-line-strong bg-cream/50 p-4 text-xs text-ink-faint">
            {t('complex.compareEmpty')}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[36rem] border-collapse text-sm">
              <thead>
                <tr className="border-b border-line">
                  <th className="px-3 py-2 text-left text-[11px] font-bold uppercase tracking-wide text-ink-faint">
                    {t('complex.compare')}
                  </th>
                  {compared.map((complex) => (
                    <th key={complex.id} className="px-3 py-2 text-right text-xs font-bold text-ink">
                      {lang === 'en' ? complex.nameEn : complex.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <CompareRow
                  label={t('complex.compareRows.price')}
                  values={compared.map((complex) => formatManwon(complex.priceManwon, lang))}
                />
                <CompareRow
                  label={t('complex.compareRows.acquisition')}
                  values={compared.map((complex) =>
                    formatManwon(estimateAcquisitionCostManwon(complex.priceManwon, complex.type), lang),
                  )}
                />
                <CompareRow
                  label={t('complex.compareRows.loan')}
                  values={compared.map((complex) => {
                    const { loanManwon } = estimateMonthlyWithLoan(complex.priceManwon);
                    return formatManwon(loanManwon, lang);
                  })}
                />
                <CompareRow
                  label={t('complex.compareRows.monthly')}
                  values={compared.map((complex) => {
                    const { monthlyManwon } = estimateMonthlyWithLoan(complex.priceManwon);
                    return formatManwon(monthlyManwon + complex.monthlyFeeManwon, lang);
                  })}
                />
                <CompareRow
                  label={t('complex.compareRows.ratio')}
                  values={compared.map((complex) => formatPct(jeonseRatio(complex), 0))}
                />
                <CompareRow
                  label={t('complex.table.commute')}
                  values={compared.map((complex) => `${complex.commuteMin}분`)}
                />
              </tbody>
            </table>
            <p className="mt-3 text-[11px] leading-relaxed text-ink-faint">{t('complex.acquisitionHint')}</p>
            {compared.some((complex) => complex.type === 'officetel') && (
              <p className="mt-1 text-[11px] leading-relaxed text-warn">{t('complex.officetelHint')}</p>
            )}
          </div>
        )}
      </SectionCard>

      {/* 임장 체크리스트 */}
      <SectionCard
        title={
          <span className="flex items-center gap-2">
            <Compass className="h-4 w-4 text-clay" aria-hidden />
            {t('complex.walkthrough')}
          </span>
        }
        subtitle={t('complex.walkthroughBody')}
        action={
          <span className="text-xs font-semibold tabular-nums text-ink-soft">
            {t('complex.walkthroughProgress', { done: checksDone, total: WALKTHROUGH_ITEMS.length })}
          </span>
        }
      >
        <div className="mb-4">
          <ProgressBar value={(checksDone / WALKTHROUGH_ITEMS.length) * 100} tone="apricot" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {WALKTHROUGH_GROUPS.map((group) => (
            <div key={group.id} className="rounded-xl border border-line bg-cream/40 p-3">
              <p className="mb-1 flex items-center gap-1.5 text-[12px] font-bold text-moss">
                {pick(group.label)}
              </p>
              {WALKTHROUGH_ITEMS.filter((item) => item.group === group.id).map((item) => (
                <div key={item.id} className="py-1">
                  <CheckRow
                    id={`visit-${item.id}`}
                    checked={Boolean(visitChecks[item.id])}
                    onChange={() => toggleVisit(item.id)}
                  >
                    <span className="flex flex-wrap items-center gap-1.5">
                      {pick(item.label)}
                      {item.onsite && <Badge tone="onsite">{t('common.onsite')}</Badge>}
                    </span>
                  </CheckRow>
                  <input
                    className="jm-field mt-1 !py-1.5 !text-xs"
                    placeholder={t('complex.walkthroughMemo')}
                    aria-label={`${pick(item.label)} ${t('complex.walkthroughMemo')}`}
                    value={visitMemos[item.id] ?? ''}
                    onChange={(event) => setVisitMemo(item.id, event.target.value)}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </SectionCard>

      {/* 임장 원정대 */}
      <section className="relative overflow-hidden rounded-[1.5rem] border border-moss/20 bg-gradient-to-br from-moss to-moss-deep p-5 text-cream sm:p-7">
        <div className="absolute -right-8 -top-10 h-40 w-40 rounded-full bg-sprout/20 blur-2xl" aria-hidden />
        <div className="relative flex flex-wrap items-start gap-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-cream/15">
            <Users className="h-5 w-5" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-extrabold">{t('complex.expedition')}</h2>
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-cream/80">{t('complex.expeditionBody')}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] font-semibold">
              <span className="inline-flex items-center gap-1 rounded-full bg-cream/15 px-2.5 py-1">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
                {t('complex.expeditionCta')}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-cream/10 px-2.5 py-1 text-cream/80">
                <Check className="h-3.5 w-3.5" aria-hidden />
                {t('complex.expeditionNote')}
              </span>
            </div>
          </div>
          <button
            type="button"
            disabled
            className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-full bg-cream/15 px-4 py-2 text-xs font-bold text-cream/70"
          >
            {t('badge.soon')}
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </button>
        </div>
      </section>
    </div>
  );
}

function CompareRow({ label, values }: { label: string; values: string[] }) {
  return (
    <tr className="border-b border-line/70 last:border-0">
      <th className="px-3 py-2 text-left text-xs font-semibold text-ink-soft">{label}</th>
      {values.map((value, index) => (
        <td key={`${label}-${index}`} className="px-3 py-2 text-right text-sm font-semibold tabular-nums text-ink">
          {value}
        </td>
      ))}
    </tr>
  );
}
