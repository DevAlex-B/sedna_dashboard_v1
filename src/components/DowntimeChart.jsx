import { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function DowntimeChart({ data }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!window.Chart) return;
    if (!data.length) return;
    if (window.ChartDataLabels && !window.Chart.registry.plugins.get('datalabels')) {
      window.Chart.register(window.ChartDataLabels);
    }

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
    const values = [operational, planned, unplanned];

    const ctx = canvasRef.current.getContext('2d');
    if (!chartRef.current) {
      chartRef.current = new window.Chart(ctx, {
        type: 'pie',
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
          plugins: {
            legend: {
              position: 'top',
              labels: {
                color: theme === 'dark' ? '#e5e7eb' : '#374151',
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
    } else {
      const chart = chartRef.current;
      chart.data.datasets[0].data = values;
      chart.options.plugins.legend.labels.color =
        theme === 'dark' ? '#e5e7eb' : '#374151';
      chart.update();
    }
  }, [data, theme]);

  useEffect(() => {
    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} />
    </div>
  );
}
