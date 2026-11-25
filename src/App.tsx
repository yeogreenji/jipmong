import { useEffect, useMemo, useState } from 'react';
import {
  Building2,
  CheckCircle2,
  Globe2,
  Home,
  Info,
  PiggyBank,
  Sparkles,
  Sunrise,
} from 'lucide-react';
import { useI18n } from './i18n';
import { StoreProvider, useStore } from './store';
import type { TabId } from './types';
import DreamSetup from './features/DreamSetup';
import DailyLife from './features/DailyLife';
import ProjectPlan from './features/ProjectPlan';
import ComplexTools from './features/ComplexTools';

interface TabDef {
  id: TabId;
  icon: typeof Home;
  labelKey: 'nav.dream' | 'nav.daily' | 'nav.project' | 'nav.complex';
  shortKey: 'nav.dreamShort' | 'nav.dailyShort' | 'nav.projectShort' | 'nav.complexShort';
}

const TABS: TabDef[] = [
  { id: 'dream', icon: Home, labelKey: 'nav.dream', shortKey: 'nav.dreamShort' },
  { id: 'daily', icon: Sunrise, labelKey: 'nav.daily', shortKey: 'nav.dailyShort' },
  { id: 'project', icon: PiggyBank, labelKey: 'nav.project', shortKey: 'nav.projectShort' },
  { id: 'complex', icon: Building2, labelKey: 'nav.complex', shortKey: 'nav.complexShort' },
];

function readTabFromHash(): TabId {
  const hash = window.location.hash.replace('#', '');
  return TABS.some((tab) => tab.id === hash) ? (hash as TabId) : 'dream';
}

function Header({ tab, setTab }: { tab: TabId; setTab: (tab: TabId) => void }) {
  const { t, lang, setLang } = useI18n();

  return (
    <header className="sticky top-0 z-30 border-b border-line/80 bg-cream/85 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-[var(--container-app)] items-center gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-moss text-cream shadow-[var(--shadow-card)]">
            <Home className="h-5 w-5" strokeWidth={2.2} aria-hidden />
          </span>
          <div className="leading-tight">
            <p className="flex items-baseline gap-2">
              <span className="text-lg font-extrabold tracking-tight text-ink">{t('app.name')}</span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-faint">
                {t('app.nameEn')}
              </span>
            </p>
            <p className="hidden text-xs text-ink-soft sm:block">{t('app.tagline')}</p>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <span className="hidden rounded-full border border-line bg-paper px-2.5 py-1 text-[11px] font-semibold text-ink-faint sm:inline">
            {t('app.badge')}
          </span>
          <div
            className="flex items-center gap-1 rounded-full border border-line bg-paper p-1"
            role="group"
            aria-label={t('app.lang.switch')}
          >
            <Globe2 className="ml-1 h-3.5 w-3.5 text-ink-faint" aria-hidden />
            {(['ko', 'en'] as const).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setLang(code)}
                aria-pressed={lang === code}
                className={`rounded-full px-2.5 py-1 text-[11px] font-bold transition-colors ${
                  lang === code ? 'bg-moss text-cream' : 'text-ink-soft hover:bg-cream'
                }`}
              >
                {code === 'ko' ? 'KO' : 'EN'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 데스크톱 탭 */}
      <nav
        className="mx-auto hidden w-full max-w-[var(--container-app)] gap-1 px-4 sm:flex sm:px-6"
        aria-label={t('app.menu')}
      >
        {TABS.map((item) => {
          const Icon = item.icon;
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              aria-current={active ? 'page' : undefined}
              data-tab={item.id}
              data-nav="desktop"
              className={`group relative flex items-center gap-2 rounded-t-xl px-3.5 py-2.5 text-[13px] font-semibold transition-colors ${
                active ? 'bg-paper text-moss' : 'text-ink-soft hover:bg-paper/60 hover:text-ink'
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden />
              {t(item.labelKey)}
              <span
                className={`absolute inset-x-3 bottom-0 h-0.5 rounded-full transition-colors ${
                  active ? 'bg-moss' : 'bg-transparent'
                }`}
              />
            </button>
          );
        })}
      </nav>
    </header>
  );
}

function SampleBanner() {
  const { t } = useI18n();
  return (
    <div className="border-b border-apricot/30 bg-apricot-soft/70">
      <div className="mx-auto flex w-full max-w-[var(--container-app)] items-start gap-2.5 px-4 py-2.5 sm:px-6">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-clay" aria-hidden />
        <div className="text-[12px] leading-relaxed text-clay">
          <p className="font-bold">{t('app.sampleBanner.title')}</p>
          <p className="text-clay/85 hidden sm:block">{t('app.sampleBanner.body')}</p>
        </div>
      </div>
    </div>
  );
}

function MobileNav({ tab, setTab }: { tab: TabId; setTab: (tab: TabId) => void }) {
  const { t } = useI18n();
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md sm:hidden"
      aria-label={t('app.menu')}
    >
      <div className="grid grid-cols-4">
        {TABS.map((item) => {
          const Icon = item.icon;
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              aria-current={active ? 'page' : undefined}
              data-tab={item.id}
              data-nav="mobile"
              className={`flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold transition-colors ${
                active ? 'text-moss' : 'text-ink-faint'
              }`}
            >
              <Icon className={`h-5 w-5 ${active ? 'text-moss' : 'text-ink-faint'}`} aria-hidden />
              {t(item.shortKey)}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function Toast() {
  const { notice } = useStore();
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-20 z-40 flex justify-center px-4 sm:bottom-8"
    >
      {notice && (
        <p className="flex items-center gap-2 rounded-full bg-moss px-4 py-2 text-sm font-semibold text-cream shadow-[var(--shadow-float)]">
          <CheckCircle2 className="h-4 w-4" aria-hidden />
          {notice}
        </p>
      )}
    </div>
  );
}

function Footer() {
  const { t } = useI18n();
  return (
    <footer className="mx-auto w-full max-w-[var(--container-app)] px-4 pb-28 pt-6 sm:px-6 sm:pb-10">
      <div className="border-t border-line pt-4 text-[11px] leading-relaxed text-ink-faint">
        <p>{t('app.footer.note')}</p>
        <p className="mt-1 flex items-center gap-1.5">
          <Sparkles className="h-3 w-3" aria-hidden />
          {t('app.footer.madeBy')}
        </p>
      </div>
    </footer>
  );
}

function Shell() {
  const [tab, setTab] = useState<TabId>(readTabFromHash);

  useEffect(() => {
    const onHash = () => setTab(readTabFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const changeTab = (next: TabId) => {
    setTab(next);
    if (window.location.hash !== `#${next}`) {
      window.history.replaceState(null, '', `#${next}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const body = useMemo(() => {
    switch (tab) {
      case 'daily':
        return <DailyLife onOpenComplex={() => changeTab('complex')} />;
      case 'project':
        return <ProjectPlan />;
      case 'complex':
        return <ComplexTools />;
      case 'dream':
      default:
        return <DreamSetup onOpenDaily={() => changeTab('daily')} />;
    }
  }, [tab]);

  return (
    <div className="min-h-dvh">
      <Header tab={tab} setTab={changeTab} />
      <SampleBanner />
      <main
        id="main"
        className="mx-auto w-full max-w-[var(--container-app)] px-4 pt-5 pb-6 sm:px-6 sm:pt-7"
      >
        {body}
      </main>
      <Footer />
      <MobileNav tab={tab} setTab={changeTab} />
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  );
}
