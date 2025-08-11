import { useState, useEffect, useRef } from 'react';
import clsx from 'classnames';
import PageContainer from '../components/PageContainer';

// helpers
const pad = (n) => n.toString().padStart(2, '0');
const fmt = (d) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
const rangeLabel = (r) => `${fmt(r.preset === 'last1h' ? r.end : r.start)}–${fmt(r.end)}`;

const now = () => new Date();
const lastHours = (h) => {
  const end = now();
  const start = new Date(end.getTime() - h * 60 * 60 * 1000);
  return { preset: h === 1 ? 'last1h' : 'last24h', start, end };
};
const last7d = () => {
  const end = now();
  const start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);
  return { preset: 'last7d', start, end };
};

function usePrefersReducedMotion() {
  const [prefers, setPrefers] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefers(mq.matches);
    const handler = () => setPrefers(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return prefers;
}

const panelClasses =
  'rounded-2xl shadow-sm border border-neutral-200/50 dark:border-neutral-800/60 bg-white/60 dark:bg-neutral-900/60 backdrop-blur p-4 md:p-6';

function PanelDensityLevel({ range }) {
  return (
    <div className={panelClasses}>
      <h2 className="text-lg md:text-xl font-semibold text-neutral-900 dark:text-neutral-100">
        Density Level
      </h2>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">No data available</p>
    </div>
  );
}

function PanelInspectionHistory({ range }) {
  return (
    <div className={panelClasses}>
      <h2 className="text-lg md:text-xl font-semibold text-neutral-900 dark:text-neutral-100">
        Inspection History
      </h2>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">No data available</p>
    </div>
  );
}

function PanelDowntime({ range }) {
  return (
    <div className={panelClasses}>
      <h2 className="text-lg md:text-xl font-semibold text-neutral-900 dark:text-neutral-100">
        Downtime
      </h2>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">No data available</p>
    </div>
  );
}

function PanelEquipmentStatus({ range }) {
  return (
    <div className={panelClasses}>
      <h2 className="text-lg md:text-xl font-semibold text-neutral-900 dark:text-neutral-100">
        Equipment Status
      </h2>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">No data available</p>
    </div>
  );
}

function TimeRangeSelector({ range, setRange }) {
  const presets = [
    { key: 'last1h', label: 'Last 1 hour', get: () => lastHours(1) },
    { key: 'last24h', label: 'Last 24 hours', get: () => lastHours(24) },
    { key: 'last7d', label: 'Last 7 days', get: last7d },
  ];
  const containerRef = useRef(null);
  const btnRefs = useRef({});
  const [highlight, setHighlight] = useState({ left: 0, width: 0 });
  const reduceMotion = usePrefersReducedMotion();
  const [showPopover, setShowPopover] = useState(false);
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [visible, setVisible] = useState(true);
  const label = rangeLabel(range);

  useEffect(() => {
    const active = btnRefs.current[range.preset];
    const container = containerRef.current;
    if (active && container) {
      const b = active.getBoundingClientRect();
      const c = container.getBoundingClientRect();
      setHighlight({ left: b.left - c.left, width: b.width });
    }
  }, [range]);

  useEffect(() => {
    if (!showPopover) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setShowPopover(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [showPopover]);

  useEffect(() => {
    setVisible(false);
    const t = setTimeout(() => setVisible(true), 0);
    return () => clearTimeout(t);
  }, [label]);

  const applyCustom = () => {
    if (customStart && customEnd) {
      setRange({ preset: 'custom', start: new Date(customStart), end: new Date(customEnd) });
      setShowPopover(false);
    }
  };

  return (
    <div
      data-testid="time-range-selector"
      className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-neutral-900/60 border-b border-neutral-200/50 dark:border-neutral-800/60"
    >
      <div className="mx-auto max-w-[1400px] px-4 py-3 flex items-center justify-between gap-3 relative">
        <div className="flex items-center gap-3">
          <div
            ref={containerRef}
            className="relative inline-flex rounded-full bg-neutral-100 dark:bg-neutral-800 p-1"
          >
            <span
              className={clsx(
                'absolute z-0 h-[calc(100%-0.5rem)] rounded-full bg-white dark:bg-neutral-700 shadow',
                reduceMotion ? '' : 'transition-all duration-300'
              )}
              style={{ width: highlight.width, transform: `translateX(${highlight.left}px)` }}
            />
            {presets.map((p) => (
              <button
                key={p.key}
                ref={(el) => (btnRefs.current[p.key] = el)}
                aria-pressed={range.preset === p.key}
                onClick={() => setRange(p.get())}
                className="relative z-10 px-3 py-1.5 text-sm font-medium rounded-full"
              >
                {p.label}
              </button>
            ))}
            <button
              ref={(el) => (btnRefs.current.custom = el)}
              aria-pressed={range.preset === 'custom'}
              onClick={() => setShowPopover((v) => !v)}
              className="relative z-10 px-3 py-1.5 text-sm font-medium rounded-full"
            >
              Custom
            </button>
          </div>
          <div
            className={clsx(
              'text-sm text-neutral-500 dark:text-neutral-400 transition-opacity duration-200',
              visible ? 'opacity-100' : 'opacity-0'
            )}
            key={label}
          >
            {label}
          </div>
        </div>
        {showPopover && (
          <div
            role="dialog"
            className="absolute left-0 top-full mt-2 rounded-md shadow-lg border border-neutral-200/50 dark:border-neutral-800/60 bg-white/60 dark:bg-neutral-900/60 backdrop-blur p-4"
          >
            <div className="flex flex-col gap-2">
              <input
                type="date"
                aria-label="Start date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="rounded-md border border-neutral-300 dark:border-neutral-700 bg-transparent p-1 text-neutral-900 dark:text-neutral-100"
              />
              <input
                type="date"
                aria-label="End date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="rounded-md border border-neutral-300 dark:border-neutral-700 bg-transparent p-1 text-neutral-900 dark:text-neutral-100"
              />
              <button
                onClick={applyCustom}
                className="px-3 py-1.5 rounded-md bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 text-sm font-medium"
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function EquipmentStatus() {
  const [range, setRange] = useState(lastHours(24));

  return (
    <PageContainer>
      <TimeRangeSelector range={range} setRange={setRange} />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        <div className="md:col-span-2 xl:col-span-2">
          <PanelDensityLevel range={range} />
        </div>
        <div>
          <PanelInspectionHistory range={range} />
        </div>
        <div>
          <PanelDowntime range={range} />
        </div>
        <div className="md:col-span-2 xl:col-span-2">
          <PanelEquipmentStatus range={range} />
        </div>
      </div>
    </PageContainer>
  );
}

