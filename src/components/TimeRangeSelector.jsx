import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';

export const ranges = [
  { label: '1H', value: 1, unit: 'hour' },
  { label: '24H', value: 24, unit: 'hour' },
  { label: '7D', value: 7, unit: 'day' },
];

function formatDate(date) {
  return date.toLocaleDateString('en-GB');
}

export default function TimeRangeSelector({ value = ranges[1], onChange }) {
  const [selected, setSelected] = useState(value);
  useEffect(() => setSelected(value), [value]);

  const rangeText = useMemo(() => {
    const end = new Date();
    const start = new Date(end);
    if (selected.unit === 'hour') {
      start.setHours(end.getHours() - selected.value);
    } else {
      start.setDate(end.getDate() - selected.value);
    }
    return `${formatDate(start)} - ${formatDate(end)}`;
  }, [selected]);

  const handleSelect = (r) => {
    setSelected(r);
    onChange && onChange(r);
  };

  return (
    <div className="relative">
      <div className="relative flex bg-gray-200 dark:bg-gray-700 rounded-full p-1">
        {ranges.map((r) => (
          <button
            key={r.label}
            onClick={() => handleSelect(r)}
            className="relative flex-1 px-3 py-1 text-sm z-10"
          >
            {selected.label === r.label && (
              <motion.span
                layoutId="active-pill"
                className="absolute inset-0 bg-white dark:bg-gray-800 rounded-full shadow"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative">{r.label}</span>
          </button>
        ))}
      </div>
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
