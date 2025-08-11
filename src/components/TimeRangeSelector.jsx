import { useMemo } from 'react';
import { motion, LayoutGroup } from 'framer-motion';

export const ranges = [
  { label: '1H', value: 1, unit: 'hour' },
  { label: '24H', value: 24, unit: 'hour' },
  { label: '7D', value: 7, unit: 'day' },
];

function formatDate(date) {
  return date.toLocaleDateString('en-GB');
}

export default function TimeRangeSelector({ value = ranges[1], onChange }) {
  const rangeText = useMemo(() => {
    const end = new Date();
    const start = new Date(end);
    if (value.unit === 'hour') {
      start.setHours(end.getHours() - value.value);
    } else if (value.unit === 'day') {
      start.setDate(end.getDate() - value.value);
    }
    return `${formatDate(start)} - ${formatDate(end)}`;
  }, [value]);

  return (
    <div className="relative">
      <LayoutGroup>
        <div className="flex bg-gray-200 dark:bg-gray-700 rounded-full p-1">
          {ranges.map((r) => (
            <button
              key={r.label}
              onClick={() => onChange && onChange(r)}
              className={`relative flex-1 px-3 py-1 text-sm font-medium transition-colors ${
                value.label === r.label
                  ? 'text-white'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              {value.label === r.label && (
                <motion.span
                  layoutId="pill"
                  className="absolute inset-0 bg-main rounded-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <span className="relative z-10">{r.label}</span>
            </button>
          ))}
        </div>
      </LayoutGroup>
      <motion.div
        key={rangeText}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-xs mt-1 text-right text-gray-600 dark:text-gray-300"
      >
        {rangeText}
      </motion.div>
    </div>
  );
}
