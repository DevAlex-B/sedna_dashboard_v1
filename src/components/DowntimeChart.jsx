import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import Chart from '../chart';

export default function DowntimeChart() {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const { theme } = useTheme();
  const [latest, setLatest] = useState(null);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await fetch('/api/equipment_status.php?latest=1');
        const json = await res.json();
        setLatest(json[0] || null);
      } catch (e) {
        console.error(e);
      }
    };
    fetchLatest();
  }, []);

  useEffect(() => {
    if (!latest) return;

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
    const values = [operational, planned, unplanned];

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    chartRef.current?.destroy();
    chartRef.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Operational Time', 'Planned Downtime', 'Unplanned Downtime'],
        datasets: [
          {
            data: values,
            backgroundColor: ['#22c55e', '#f59e0b', '#ef4444'],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 500, easing: 'easeOutQuart' },
        cutout: '60%',
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: theme === 'dark' ? '#e5e7eb' : '#374151',
              usePointStyle: true,
              pointStyle: 'circle',
              boxWidth: 10,
              boxHeight: 10,
            },
          },
          datalabels: {
            color: '#fff',
            formatter: (value, ctx) => {
              const dataset = ctx.chart.data.datasets[0].data;
              const total = dataset.reduce((a, b) => a + b, 0);
              return total ? `${Math.round((value / total) * 100)}%` : '0%';
            },
            font: { weight: 'bold' },
          },
        },
      },
    });

    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [latest, theme]);

  return (
    <div className="relative w-full h-72">
      <canvas ref={canvasRef} />
    </div>
  );
}
