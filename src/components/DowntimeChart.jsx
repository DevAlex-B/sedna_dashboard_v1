import { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function DowntimeChart({ data }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!window.Chart) return;
    if (!data.length) return;

      const latest = data[0];
    const parseHours = (start, end) => {
      if (!start || !end) return 0;
      const s = new Date(`1970-01-01T${start}Z`);
      const e = new Date(`1970-01-01T${end}Z`);
      const diff = (e - s) / 3600000;
      return diff > 0 ? diff : 0;
    };

    const planned = parseHours(
      latest.planned_downtime_start,
      latest.planned_downtime_end
    );
    const unplanned = parseHours(
      latest.unplanned_downtime_start,
      latest.unplanned_downtime_end
    );
    const operational = Math.max(24 - planned - unplanned, 0);

    const ctx = canvasRef.current.getContext('2d');
    if (chartRef.current) chartRef.current.destroy();
    chartRef.current = new window.Chart(ctx, {
      type: 'doughnut',
        data: {
          labels: ['Operational Time', 'Planned Downtime', 'Unplanned Downtime'],
          datasets: [
            {
              data: [operational, planned, unplanned],
              backgroundColor: ['#036EC8', '#e16f3d', '#ef4444'],
              borderWidth: 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: theme === 'dark' ? '#e5e7eb' : '#374151',
              },
            },
          },
          animation: { duration: 500, easing: 'easeOutQuart' },
        },
      });

    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, [data, theme]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}
