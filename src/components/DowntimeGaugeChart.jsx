import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import Chart from '../chart';

export default function DowntimeGaugeChart() {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const { theme } = useTheme();
  const [downtime, setDowntime] = useState(0);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await fetch('/api/equipment_status.php?latest=1');
        const json = await res.json();
        const latest = json[0];
        if (latest) {
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
          setDowntime(planned + unplanned);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchLatest();
  }, []);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    chartRef.current?.destroy();
    chartRef.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        datasets: [
          {
            data: [downtime, Math.max(24 - downtime, 0)],
            backgroundColor: ['#ef4444', '#e5e7eb'],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        rotation: -90,
        circumference: 180,
        cutout: '70%',
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false },
          datalabels: { display: false },
        },
      },
    });

    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [downtime]);

  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} />
      <div
        className={`absolute inset-0 flex items-center justify-center text-xl font-semibold ${
          theme === 'dark' ? 'text-white' : 'text-gray-800'
        }`}
      >
        {downtime.toFixed(1)}h
      </div>
    </div>
  );
}

