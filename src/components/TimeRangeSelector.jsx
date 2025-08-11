import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const ranges = [
  { label: 'Last 1 hour', value: 1, unit: 'hour' },
  { label: 'Last 24 hours', value: 24, unit: 'hour' },
  { label: 'Last 7 days', value: 7, unit: 'day' },
];

function formatDate(date) {
  return date.toLocaleDateString('en-GB');
}

export default function TimeRangeSelector() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(ranges[1]);

  const rangeText = useMemo(() => {
    const end = new Date();
    const start = new Date(end);
    if (selected.unit === 'hour') {
      start.setHours(end.getHours() - selected.value);
    } else if (selected.unit === 'day') {
      start.setDate(end.getDate() - selected.value);
    }
    return `${formatDate(start)} - ${formatDate(end)}`;
  }, [selected]);

  return (
    <div className="relative">
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 bg-main text-white rounded-lg shadow"
      >
        {selected.label}
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={16} />
        </motion.span>
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-10"
          >
            {ranges.map((r) => (
              <li key={r.label}>
                <button
                  className="w-full px-4 py-2 text-left hover:bg-main/10 dark:hover:bg-main/20"
                  onClick={() => {
                    setSelected(r);
                    setOpen(false);
                  }}
                >
                  {r.label}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
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

