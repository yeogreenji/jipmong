import { useMemo, useState } from 'react';
import {
  ArrowRight,
  Building2,
  Heart,
  MapPin,
  PawPrint,
  RotateCcw,
  Save,
  Sparkles,
  Sun,
  Sunrise,
  Target,
  Trees,
  Wallet,
} from 'lucide-react';
import { useI18n } from '../i18n';
import { useStore } from '../store';
import {
  AMENITIES,
  COMMUTE_MODES,
  CONDITIONS,
  HOUSING_TYPES,
  PET_KINDS,
  ROUTINE_PRESETS,
} from '../data/options';
import { Badge, ChipButton, Field, NumberField, ProgressBar, SectionCard, Toggle } from '../components/ui';
import { formatManwon, formatPyeong } from '../lib/format';
import type { HousingType } from '../types';

const BUDGET_PRESETS = [50_000, 70_000, 90_000, 120_000];

export default function DreamSetup({ onOpenDaily }: { onOpenDaily: () => void }) {
  const { t, lang, pick } = useI18n();
  const {
    profile,
    updateProfile,
    resetProfile,
    markProfileSaved,
    completion,
    candidates,
    toggleSavedComplex,
    notify,
  } = useStore();
  const [savedFlash, setSavedFlash] = useState(false);

  const toggleInList = (key: 'amenities' | 'conditions' | 'petKinds', id: string) => {
    const list = profile[key];
    updateProfile({
      [key]: list.includes(id) ? list.filter((item) => item !== id) : [...list, id],
    });
  };

  const savedSet = useMemo(() => new Set(profile.savedComplexIds), [profile.savedComplexIds]);

  const handleSave = () => {
    markProfileSaved();
    notify(t('common.saved'));
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 1600);
  };

  const handleReset = () => {
    if (window.confirm(t('common.resetConfirm'))) {
      resetProfile();
      notify(t('app.badge'));
    }
  };

  return (
    <div className="space-y-5">
      {/* 상단 요약 */}
      <section className="relative overflow-hidden rounded-[1.5rem] border border-sprout/30 bg-gradient-to-br from-sprout-soft via-cream to-dawn p-5 sm:p-7">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-apricot/20 blur-2xl" aria-hidden />
        <div className="relative">
          <p className="inline-flex items-center gap-1.5 rounded-full border border-moss/20 bg-paper/80 px-2.5 py-1 text-[11px] font-bold text-moss">
            <Sparkles className="h-3 w-3" aria-hidden />
            {t('dream.completion', { pct: completion })}
          </p>
          <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            {t('dream.title')}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">{t('dream.subtitle')}</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-line bg-paper/85 p-3.5">
              <p className="flex items-center gap-1.5 text-[11px] font-semibold text-ink-faint">
                <Wallet className="h-3.5 w-3.5" aria-hidden />
                {t('dream.budget')}
              </p>
              <p className="mt-1 text-lg font-bold text-ink tabular-nums">{formatManwon(profile.budgetManwon, lang)}</p>
            </div>
            <div className="rounded-2xl border border-line bg-paper/85 p-3.5">
              <p className="flex items-center gap-1.5 text-[11px] font-semibold text-ink-faint">
                <Target className="h-3.5 w-3.5" aria-hidden />
                {t('dream.area')}
              </p>
              <p className="mt-1 text-lg font-bold text-ink tabular-nums">
                {t('dream.areaValue', { m2: profile.areaM2, pyeong: formatPyeong(profile.areaM2) })}
              </p>
            </div>
            <div className="rounded-2xl border border-line bg-paper/85 p-3.5">
              <p className="flex items-center gap-1.5 text-[11px] font-semibold text-ink-faint">
                <Sunrise className="h-3.5 w-3.5" aria-hidden />
                {t('dream.maxCommute')}
              </p>
              <p className="mt-1 text-lg font-bold text-ink tabular-nums">
                {t('dream.maxCommuteValue', { n: profile.maxCommuteMin })}
              </p>
            </div>
          </div>

          <div className="mt-4 max-w-md">
            <ProgressBar value={completion} label={t('dream.completion', { pct: completion })} />
          </div>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="space-y-5">
          {/* 예산·유형·면적 */}
          <SectionCard title={t('dream.budgetSection')} subtitle={t('dream.budgetHint')}>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label={t('dream.budget')} htmlFor="dream-budget">
                <NumberField
                  id="dream-budget"
                  value={profile.budgetManwon}
                  step={500}
                  onChange={(value) => updateProfile({ budgetManwon: value })}
                  suffix={t('common.manwon')}
                  ariaLabel={t('dream.budget')}
                />
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {BUDGET_PRESETS.map((preset) => (
                    <ChipButton
                      key={preset}
                      active={profile.budgetManwon === preset}
                      onClick={() => updateProfile({ budgetManwon: preset })}
                    >
                      {formatManwon(preset, lang)}
                    </ChipButton>
                  ))}
                </div>
              </Field>

              <Field label={t('dream.area')} htmlFor="dream-area" hint={t('dream.areaHint', { m2: profile.areaM2, pyeong: formatPyeong(profile.areaM2) })}>
                <NumberField
                  id="dream-area"
                  value={profile.areaM2}
                  step={0.1}
                  min={9}
                  max={200}
                  onChange={(value) => updateProfile({ areaM2: value })}
                  suffix={t('common.unitM2')}
                  ariaLabel={t('dream.area')}
                />
                <input
                  type="range"
                  min={20}
                  max={130}
                  step={1}
                  value={Math.min(130, Math.max(20, profile.areaM2))}
                  onChange={(event) => updateProfile({ areaM2: Number(event.target.value) })}
                  className="mt-3 w-full accent-[var(--color-moss)]"
                  aria-label={t('dream.area')}
                />
              </Field>
            </div>

            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {HOUSING_TYPES.map((type) => {
                const active = profile.housingType === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => updateProfile({ housingType: type.id as HousingType })}
                    className={`flex items-start gap-3 rounded-2xl border p-3.5 text-left transition-colors ${
                      active ? 'border-moss bg-sprout-soft/70' : 'border-line bg-paper hover:border-sprout'
                    }`}
                  >
                    <Building2 className={`mt-0.5 h-5 w-5 ${active ? 'text-moss' : 'text-ink-faint'}`} aria-hidden />
                    <span>
                      <span className="block text-sm font-bold text-ink">{pick(type.label)}</span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-ink-soft">{pick(type.hint)}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </SectionCard>

          {/* 출퇴근 */}
          <SectionCard title={t('dream.commute')} subtitle={t('dream.subtitle')}>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label={t('dream.workplace')} htmlFor="dream-workplace">
                <input
                  id="dream-workplace"
                  className="jm-field"
                  value={profile.workplace}
                  placeholder={t('dream.workplacePlaceholder')}
                  onChange={(event) => updateProfile({ workplace: event.target.value })}
                />
              </Field>
              <Field label={t('dream.maxCommute')} htmlFor="dream-commute" hint={t('dream.maxCommuteValue', { n: profile.maxCommuteMin })}>
                <input
                  id="dream-commute"
                  type="range"
                  min={10}
                  max={90}
                  step={5}
                  value={profile.maxCommuteMin}
                  onChange={(event) => updateProfile({ maxCommuteMin: Number(event.target.value) })}
                  className="w-full accent-[var(--color-moss)]"
                />
              </Field>
            </div>
            <div className="mt-4">
              <p className="mb-1.5 text-[13px] font-semibold text-ink-soft">{t('dream.commuteMode')}</p>
              <div className="flex flex-wrap gap-2">
                {COMMUTE_MODES.map((mode) => (
                  <ChipButton
                    key={mode.id}
                    active={profile.commuteMode === mode.id}
                    onClick={() => updateProfile({ commuteMode: mode.id })}
                  >
                    {pick(mode.label)}
                  </ChipButton>
                ))}
              </div>
            </div>
          </SectionCard>

          {/* 반려동물 */}
          <SectionCard title={t('dream.pets')}>
            <Toggle
              id="dream-pet-toggle"
              checked={profile.hasPet}
              onChange={(next) => updateProfile({ hasPet: next, petCount: next ? Math.max(1, profile.petCount) : 0 })}
              label={
                <span className="flex items-center gap-2">
                  <PawPrint className="h-4 w-4 text-clay" aria-hidden />
                  {t('dream.hasPet')}
                </span>
              }
            />
            {profile.hasPet && (
              <div className="mt-4 space-y-4">
                <div>
                  <p className="mb-1.5 text-[13px] font-semibold text-ink-soft">{t('dream.petKinds')}</p>
                  <div className="flex flex-wrap gap-2">
                    {PET_KINDS.map((kind) => (
                      <ChipButton key={kind.id} active={profile.petKinds.includes(kind.id)} onClick={() => toggleInList('petKinds', kind.id)}>
                        {pick(kind.label)}
                      </ChipButton>
                    ))}
                  </div>
                </div>
                <Field label={t('dream.petCount')} htmlFor="dream-pet-count" className="max-w-[10rem]">
                  <NumberField
                    id="dream-pet-count"
                    value={profile.petCount}
                    min={1}
                    max={10}
                    onChange={(value) => updateProfile({ petCount: Math.round(value) })}
                    suffix={t('common.person')}
                    ariaLabel={t('dream.petCount')}
                  />
                </Field>
              </div>
            )}
          </SectionCard>

          {/* 생활환경 */}
          <SectionCard
            title={
              <span className="flex items-center gap-2">
                <Trees className="h-4 w-4 text-moss" aria-hidden />
                {t('dream.amenities')}
              </span>
            }
            subtitle={t('dream.amenitiesHint')}
          >
            <div className="flex flex-wrap gap-2">
              {AMENITIES.map((item) => (
                <ChipButton
                  key={item.id}
                  active={profile.amenities.includes(item.id)}
                  onClick={() => toggleInList('amenities', item.id)}
                >
                  {pick(item.label)}
                </ChipButton>
              ))}
            </div>

            <div className="mt-6">
              <p className="text-[13px] font-semibold text-ink-soft">{t('dream.conditions')}</p>
              <p className="mb-2 mt-0.5 text-xs text-ink-faint">{t('dream.conditionsHint')}</p>
              <div className="flex flex-wrap gap-2">
                {CONDITIONS.map((item) => (
                  <ChipButton
                    key={item.id}
                    active={profile.conditions.includes(item.id)}
                    onClick={() => toggleInList('conditions', item.id)}
                  >
                    {pick(item.label)}
                  </ChipButton>
                ))}
              </div>
            </div>
          </SectionCard>

          {/* 하루 */}
          <SectionCard
            title={
              <span className="flex items-center gap-2">
                <Sun className="h-4 w-4 text-apricot" aria-hidden />
                {t('dream.morning')} · {t('dream.evening')}
              </span>
            }
            subtitle={t('daily.legendScenario')}
          >
            <div className="mb-4 flex flex-wrap gap-2">
              {ROUTINE_PRESETS.map((preset) => (
                <ChipButton
                  key={preset.id}
                  active={false}
                  onClick={() =>
                    updateProfile({
                      morning: pick(preset.morning),
                      evening: pick(preset.evening),
                    })
                  }
                >
                  {pick(preset.label)}
                </ChipButton>
              ))}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={t('dream.morning')} htmlFor="dream-morning">
                <textarea
                  id="dream-morning"
                  rows={3}
                  className="jm-field resize-none leading-relaxed"
                  placeholder={t('dream.morningPlaceholder')}
                  value={profile.morning}
                  onChange={(event) => updateProfile({ morning: event.target.value })}
                />
              </Field>
              <Field label={t('dream.evening')} htmlFor="dream-evening">
                <textarea
                  id="dream-evening"
                  rows={3}
                  className="jm-field resize-none leading-relaxed"
                  placeholder={t('dream.eveningPlaceholder')}
                  value={profile.evening}
                  onChange={(event) => updateProfile({ evening: event.target.value })}
                />
              </Field>
            </div>
          </SectionCard>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-2 rounded-full bg-moss px-5 py-2.5 text-sm font-bold text-cream transition-colors hover:bg-moss-deep"
            >
              <Save className="h-4 w-4" aria-hidden />
              {savedFlash ? t('common.saved') : t('dream.save')}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-4 py-2.5 text-sm font-semibold text-ink-soft transition-colors hover:border-clay hover:text-clay"
            >
              <RotateCcw className="h-4 w-4" aria-hidden />
              {t('common.reset')}
            </button>
            <span className="text-xs text-ink-faint">{t('dream.nextStepBody')}</span>
          </div>
        </div>

        {/* 후보 단지 */}
        <aside className="space-y-4 self-start lg:sticky lg:top-36">
          <SectionCard
            title={t('dream.matched')}
            subtitle={t('dream.matchedDesc', { n: candidates.length })}
            action={<Badge tone="sample">{t('common.sample')}</Badge>}
          >
            {candidates.length === 0 ? (
              <p className="rounded-xl border border-dashed border-line-strong bg-cream/60 p-4 text-xs leading-relaxed text-ink-faint">
                {t('dream.matchedEmpty')}
              </p>
            ) : (
              <ul className="space-y-2.5">
                {candidates.map(({ complex, score }) => {
                  const saved = savedSet.has(complex.id);
                  return (
                    <li key={complex.id} className="rounded-2xl border border-line bg-cream/50 p-3.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-ink">
                            {lang === 'en' ? complex.nameEn : complex.name}
                          </p>
                          <p className="mt-0.5 flex items-center gap-1 text-[11px] text-ink-soft">
                            <MapPin className="h-3 w-3" aria-hidden />
                            {lang === 'en'
                              ? `${complex.neighborhoodEn}, ${complex.districtEn}`
                              : `${complex.district} ${complex.neighborhood}`}
                          </p>
                        </div>
                        <Badge tone="calc">{t('dream.matchScore', { score })}</Badge>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-ink-soft">
                        <span>{pick(typeLabel(complex.type))}</span>                        <span className="tabular-nums">{complex.areaM2}㎡</span>
                        <span className="font-semibold tabular-nums text-ink">{formatManwon(complex.priceManwon, lang)}</span>
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            toggleSavedComplex(complex.id);
                            notify(saved ? t('common.delete') : t('dream.savedBadge'));
                          }}
                          aria-pressed={saved}
                          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                            saved ? 'border-clay bg-clay text-cream' : 'border-line bg-paper text-ink-soft hover:border-clay hover:text-clay'
                          }`}
                        >
                          <Heart className={`h-3 w-3 ${saved ? 'fill-cream' : ''}`} aria-hidden />
                          {saved ? t('dream.savedBadge') : t('common.add')}
                        </button>
                        <button
                          type="button"
                          onClick={onOpenDaily}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-moss hover:underline"
                        >
                          {t('dream.openDaily')}
                          <ArrowRight className="h-3 w-3" aria-hidden />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </SectionCard>

          <div className="rounded-2xl border border-line bg-paper/70 p-4">
            <p className="text-[11px] font-bold text-ink-soft">{t('dream.nextStep')}</p>
            <p className="mt-1 text-xs leading-relaxed text-ink-faint">{t('dream.nextStepBody')}</p>
            <button
              type="button"
              onClick={onOpenDaily}
              className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-apricot px-3.5 py-2 text-xs font-bold text-[#3a2216] transition-colors hover:bg-clay hover:text-cream"
            >
              {t('daily.title')}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function typeLabel(type: HousingType) {
  return HOUSING_TYPES.find((item) => item.id === type)?.label ?? { ko: '아파트', en: 'Apartment' };
}
