import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import Chart from '../chart';

export default function DowntimeVsOperationalChart() {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const { theme } = useTheme();
  const [perc, setPerc] = useState({ downtime: 0, operational: 100 });

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
          const downtimeHours = planned + unplanned;
          const downtimePercentage = (downtimeHours / 24) * 100;
          const operationalPercentage = 100 - downtimePercentage;
          setPerc({
            downtime: downtimePercentage,
            operational: operationalPercentage,
          });
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
      type: 'bar',
      data: {
        labels: ['Downtime', 'Operational Time'],
        datasets: [
          {
            data: [perc.downtime, perc.operational],
            backgroundColor: ['#ef4444', '#22c55e'],
            borderRadius: 6,
          },
        ],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 500, easing: 'easeOutQuart' },
        plugins: {
          legend: { display: false },
          datalabels: {
            anchor: 'end',
            align: 'end',
            offset: 4,
            color: theme === 'dark' ? '#e5e7eb' : '#374151',
            formatter: (value) => `${value.toFixed(1)}%`,
          },
        },
        scales: {
          x: {
            beginAtZero: true,
            max: 100,
            ticks: {
              color: theme === 'dark' ? '#e5e7eb' : '#374151',
              callback: (value) => `${value}%`,
            },
            grid: { color: theme === 'dark' ? '#374151' : '#e5e7eb' },
          },
          y: {
            ticks: { color: theme === 'dark' ? '#e5e7eb' : '#374151' },
            grid: { display: false },
          },
        },
      },
    });

    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [perc, theme]);

  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}

