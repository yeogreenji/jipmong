import { useMemo, useState } from 'react';
import {
  Building2,
  Check,
  Footprints,
  Info,
  MapPin,
  Moon,
  ShoppingBasket,
  Sunrise,
  TrainFront,
  Wallet,
} from 'lucide-react';
import { useI18n } from '../i18n';
import { useStore } from '../store';
import { buildDay, type MomentKind } from '../lib/dayScenario';
import { WALKTHROUGH_ITEMS } from '../data/checklists';
import { Badge, EmptyState, SectionCard } from '../components/ui';
import { formatManwon } from '../lib/format';
import { HOUSING_TYPES } from '../data/options';

const MOMENT_ICONS = {
  morning: Sunrise,
  commute: TrainFront,
  'evening-commute': TrainFront,
  grocery: ShoppingBasket,
  walk: Footprints,
  night: Moon,
} as const;

function momentBadge(kind: MomentKind) {
  if (kind === 'estimate') return 'calc' as const;
  return 'scenario' as const;
}

export default function DailyLife({ onOpenComplex }: { onOpenComplex: () => void }) {
  const { t, lang, pick } = useI18n();
  const { profile, savedComplexes, summary, visitChecks, toggleVisit } = useStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = useMemo(() => {
    if (savedComplexes.length === 0) return null;
    return savedComplexes.find((complex) => complex.id === selectedId) ?? savedComplexes[0];
  }, [savedComplexes, selectedId]);

  const day = useMemo(() => {
    if (!selected) return null;
    return buildDay(profile, selected, summary, t, lang);
  }, [profile, selected, summary, t, lang]);

  if (!selected || !day) {
    return (
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">{t('daily.title')}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">{t('daily.subtitle')}</p>
        </div>
        <EmptyState title={t('daily.empty')} body={t('daily.emptyBody')} />
      </div>
    );
  }

  const typeLabel = HOUSING_TYPES.find((item) => item.id === selected.type)?.label ?? HOUSING_TYPES[0].label;
  const onsiteChecks = Array.from(new Set(day.moments.flatMap((moment) => moment.checks ?? [])))
    .map((id) => WALKTHROUGH_ITEMS.find((item) => item.id === id))
    .filter((item): item is (typeof WALKTHROUGH_ITEMS)[number] => Boolean(item));

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">{t('daily.title')}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">{t('daily.subtitle')}</p>
        </div>
        <Badge tone="real">{t('badge.real')}</Badge>
      </div>

      {/* 단지 선택 */}
      <SectionCard title={t('daily.pick')} className="!p-4 sm:!p-5">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label={t('daily.pick')}>
          {savedComplexes.map((complex) => (
            <button
              key={complex.id}
              type="button"
              role="tab"
              aria-selected={selected.id === complex.id}
              onClick={() => setSelectedId(complex.id)}
              className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                selected.id === complex.id
                  ? 'border-moss bg-moss text-cream'
                  : 'border-line bg-paper text-ink-soft hover:border-sprout'
              }`}
            >
              {lang === 'en' ? complex.nameEn : complex.name}
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <span className="inline-flex items-center gap-1.5 font-bold text-ink">
            <Building2 className="h-4 w-4 text-moss" aria-hidden />
            {lang === 'en' ? selected.nameEn : selected.name}
          </span>
          <span className="inline-flex items-center gap-1 text-ink-soft">
            <MapPin className="h-3.5 w-3.5" aria-hidden />
            {lang === 'en'
              ? `${selected.neighborhoodEn}, ${selected.districtEn}`
              : `${selected.district} ${selected.neighborhood}`}
          </span>
          <span className="text-ink-soft">{pick(typeLabel)}</span>
          <span className="tabular-nums text-ink-soft">{selected.areaM2}㎡</span>
          <Badge tone="sample">{t('common.sample')}</Badge>
          <span className="text-ink-soft">{t('daily.priceLine', { price: formatManwon(selected.priceManwon, lang) })}</span>
          <button
            type="button"
            onClick={onOpenComplex}
            className="ml-auto text-xs font-semibold text-moss hover:underline"
          >
            {t('daily.openComplex')}
          </button>
        </div>
      </SectionCard>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_21rem]">
        {/* 타임라인 */}
        <div className="jm-timeline space-y-3.5">
          {day.moments.map((moment) => {
            const Icon = MOMENT_ICONS[moment.id as keyof typeof MOMENT_ICONS] ?? Sunrise;
            return (
              <article key={moment.id} className="relative flex gap-3">
                <span className="relative z-10 mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line bg-paper text-moss shadow-sm">
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <div className="jm-card flex-1 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-clay tabular-nums">{moment.time}</span>
                    <h3 className="text-sm font-bold text-ink">{moment.title}</h3>
                    <Badge tone={momentBadge(moment.kind)}>
                      {moment.kind === 'estimate' ? t('badge.estimate') : t('badge.scenario')}
                    </Badge>
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{moment.body}</p>
                  {moment.checks && moment.checks.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {moment.checks.map((checkId) => {
                        const item = WALKTHROUGH_ITEMS.find((entry) => entry.id === checkId);
                        if (!item) return null;
                        const checked = Boolean(visitChecks[checkId]);
                        return (
                          <button
                            key={checkId}
                            type="button"
                            onClick={() => toggleVisit(checkId)}
                            aria-pressed={checked}
                            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold transition-colors ${
                              checked
                                ? 'border-ok/30 bg-ok-soft text-ok'
                                : 'border-warn/25 bg-warn-soft text-warn hover:border-warn'
                            }`}
                          >
                            {checked ? <Check className="h-3 w-3" aria-hidden /> : null}
                            {t('common.onsite')} · {pick(item.label)}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        <aside className="space-y-4">
          {/* 월 주거비 */}
          <SectionCard title={t('daily.cost')} subtitle={t('daily.costBody')}>
            <dl className="space-y-2 text-sm">
              <div className="flex items-center justify-between gap-2">
                <dt className="flex items-center gap-1.5 text-ink-soft">
                  <Wallet className="h-3.5 w-3.5" aria-hidden />
                  {t('daily.loanPayment')}
                  <Badge tone="calc">{t('badge.calc')}</Badge>
                </dt>
                <dd className="font-semibold tabular-nums text-ink">
                  {day.monthly.loanManwon === null
                    ? '—'
                    : formatManwon(day.monthly.loanManwon, lang)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-2">
                <dt className="flex items-center gap-1.5 text-ink-soft">
                  {t('daily.fee')}
                  <Badge tone="sample">{t('badge.sample')}</Badge>
                </dt>
                <dd className="font-semibold tabular-nums text-ink">
                  {formatManwon(day.monthly.feeManwon, lang)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-2">
                <dt className="flex items-center gap-1.5 text-ink-soft">
                  {t('daily.transport')}
                  <Badge tone="calc">{t('badge.estimate')}</Badge>
                </dt>
                <dd className="font-semibold tabular-nums text-ink">
                  {formatManwon(day.monthly.transportManwon, lang)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-2">
                <dt className="flex items-center gap-1.5 text-ink-soft">
                  {t('daily.etc')}
                  <Badge tone="scenario">{t('badge.scenario')}</Badge>
                </dt>
                <dd className="font-semibold tabular-nums text-ink">
                  {formatManwon(day.monthly.bufferManwon, lang)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-2 border-t border-line pt-2.5">
                <dt className="font-bold text-ink">{t('daily.total')}</dt>
                <dd className="text-lg font-extrabold tabular-nums text-moss">
                  {formatManwon(day.monthly.totalManwon, lang)}
                  <span className="ml-1 text-xs font-medium text-ink-faint">{t('common.perMonth')}</span>
                </dd>
              </div>
            </dl>
          </SectionCard>

          {/* 배지 안내 */}
          <div className="rounded-2xl border border-line bg-paper/70 p-4">
            <p className="flex items-center gap-1.5 text-[11px] font-bold text-ink-soft">
              <Info className="h-3.5 w-3.5" aria-hidden />
              {t('daily.legend')}
            </p>
            <ul className="mt-2 space-y-1.5 text-[11px] leading-relaxed text-ink-faint">
              <li>
                <Badge tone="real">{t('badge.real')}</Badge> <span className="ml-1">{t('daily.legendReal')}</span>
              </li>
              <li>
                <Badge tone="scenario">{t('badge.scenario')}</Badge>{' '}
                <span className="ml-1">{t('daily.legendScenario')}</span>
              </li>
              <li>
                <Badge tone="onsite">{t('common.onsite')}</Badge>{' '}
                <span className="ml-1">{t('daily.legendCheck')}</span>
              </li>
            </ul>
          </div>

          {/* 임장 확인 */}
          <SectionCard title={t('daily.checkTitle')} subtitle={t('daily.checkBody')}>
            <ul className="space-y-1">
              {onsiteChecks.map((item) => {
                const checked = Boolean(visitChecks[item.id]);
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => toggleVisit(item.id)}
                      aria-pressed={checked}
                      className="flex w-full items-start gap-2 rounded-lg px-1.5 py-1.5 text-left text-xs leading-relaxed transition-colors hover:bg-cream"
                    >
                      <span
                        className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded border ${
                          checked ? 'border-ok bg-ok text-cream' : 'border-line-strong bg-paper'
                        }`}
                      >
                        {checked && <Check className="h-3 w-3" aria-hidden />}
                      </span>
                      <span className={checked ? 'text-ink-faint line-through' : 'text-ink-soft'}>
                        {pick(item.label)}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </SectionCard>
        </aside>
      </div>
    </div>
  );
}
