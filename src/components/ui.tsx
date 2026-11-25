import type { ReactNode } from 'react';

/* 화면 곳곳에서 반복되는 작은 조각들. 색·반경은 tokens.css를 따릅니다. */

export type BadgeTone = 'sample' | 'scenario' | 'onsite' | 'calc' | 'real' | 'soon' | 'ok' | 'neutral';

const BADGE_STYLES: Record<BadgeTone, string> = {
  sample: 'bg-apricot-soft text-clay border-apricot/40',
  scenario: 'bg-info-soft text-info border-info/25',
  onsite: 'bg-warn-soft text-warn border-warn/25',
  calc: 'bg-sprout-soft text-moss border-sprout/40',
  real: 'bg-sand text-ink-soft border-line-strong',
  soon: 'bg-sand text-ink-faint border-line',
  ok: 'bg-ok-soft text-ok border-ok/25',
  neutral: 'bg-sand/70 text-ink-soft border-line',
};

export function Badge({
  tone = 'neutral',
  children,
  className = '',
}: {
  tone?: BadgeTone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold leading-4 ${BADGE_STYLES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

export function SectionCard({
  title,
  subtitle,
  action,
  children,
  className = '',
  id,
}: {
  title?: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`jm-card p-5 sm:p-6 ${className}`}>
      {(title || action) && (
        <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            {title && <h2 className="text-base font-bold tracking-tight text-ink sm:text-lg">{title}</h2>}
            {subtitle && <p className="mt-1 text-sm leading-relaxed text-ink-soft">{subtitle}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </header>
      )}
      {children}
    </section>
  );
}

export function Field({
  label,
  hint,
  htmlFor,
  children,
  className = '',
}: {
  label: ReactNode;
  hint?: ReactNode;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label htmlFor={htmlFor} className="block text-[13px] font-semibold text-ink-soft">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs leading-relaxed text-ink-faint">{hint}</p>}
    </div>
  );
}

export function NumberField({
  id,
  value,
  onChange,
  step = 1,
  min = 0,
  max,
  suffix,
  ariaLabel,
  placeholder,
}: {
  id?: string;
  value: number;
  onChange: (value: number) => void;
  step?: number;
  min?: number;
  max?: number;
  suffix?: string;
  ariaLabel?: string;
  placeholder?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        id={id}
        type="number"
        inputMode="decimal"
        className="jm-field tabular-nums"
        value={Number.isFinite(value) ? value : 0}
        min={min}
        max={max}
        step={step}
        aria-label={ariaLabel}
        placeholder={placeholder}
        onChange={(event) => {
          const next = Number(event.target.value);
          onChange(Number.isFinite(next) ? Math.max(min, next) : min);
        }}
      />
      {suffix && <span className="shrink-0 text-xs font-medium text-ink-faint">{suffix}</span>}
    </div>
  );
}

export function ChipButton({
  active,
  onClick,
  children,
  className = '',
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`jm-chip ${className}`}
    >
      {children}
    </button>
  );
}

export function ProgressBar({
  value,
  tone = 'moss',
  label,
}: {
  value: number;
  tone?: 'moss' | 'apricot';
  label?: string;
}) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div
      className="h-2.5 w-full overflow-hidden rounded-full bg-sand"
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div
        className={`h-full rounded-full transition-[width] duration-500 ${
          tone === 'moss' ? 'bg-moss' : 'bg-apricot'
        }`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function Stat({
  label,
  value,
  hint,
  emphasis = false,
  testId,
}: {
  label: ReactNode;
  value: ReactNode;
  hint?: ReactNode;
  emphasis?: boolean;
  testId?: string;
}) {
  return (
    <div
      data-testid={testId}
      className={`rounded-2xl border p-4 ${
        emphasis ? 'border-moss/25 bg-sprout-soft/70' : 'border-line bg-cream/60'
      }`}
    >
      <p className="text-[12px] font-semibold text-ink-soft">{label}</p>
      <p className="mt-1 text-xl font-bold tracking-tight text-ink tabular-nums sm:text-2xl">{value}</p>
      {hint && <p className="mt-1 text-[11px] leading-relaxed text-ink-faint">{hint}</p>}
    </div>
  );
}

export function EmptyState({ title, body }: { title: ReactNode; body?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-line-strong bg-cream/50 p-6 text-center">
      <p className="text-sm font-semibold text-ink-soft">{title}</p>
      {body && <p className="mt-1 text-xs leading-relaxed text-ink-faint">{body}</p>}
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
  id,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: ReactNode;
  id: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-line bg-cream/60 px-4 py-3">
      <span className="text-sm font-medium text-ink">{label}</span>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={typeof label === 'string' ? label : undefined}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? 'bg-moss' : 'bg-line-strong'
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
            checked ? 'left-[1.4rem]' : 'left-0.5'
          }`}
        />
      </button>
    </div>
  );
}

export function CheckRow({
  checked,
  onChange,
  children,
  id,
}: {
  checked: boolean;
  onChange: () => void;
  children: ReactNode;
  id?: string;
}) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-start gap-3 rounded-xl border border-transparent px-2 py-2 transition-colors hover:border-line hover:bg-cream/70"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-moss)]"
      />
      <span className={`text-sm leading-relaxed ${checked ? 'text-ink-faint line-through' : 'text-ink'}`}>
        {children}
      </span>
    </label>
  );
}
