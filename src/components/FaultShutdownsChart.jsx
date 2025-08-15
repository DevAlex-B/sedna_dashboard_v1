import { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import Chart from '../chart';

export default function FaultShutdownsChart({ data = [] }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    const labels = data.map((d) => d.equipment);
    const values = data.map((d) => d.shutdown_count);

    chartRef.current?.destroy();
    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: '#036EC8',
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { top: 25 } },
        animation: { duration: 500, easing: 'easeOutQuart' },
        plugins: {
          legend: { display: false },
          datalabels: {
            anchor: 'end',
            align: 'end',
            offset: 4,
            color: theme === 'dark' ? '#e5e7eb' : '#374151',
          },
        },
        scales: {
          x: {
            ticks: {
              color: theme === 'dark' ? '#e5e7eb' : '#374151',
              autoSkip: false,
              maxRotation: 45,
              minRotation: 45,
            },
            grid: { display: false },
          },
          y: {
            beginAtZero: true,
            ticks: { color: theme === 'dark' ? '#e5e7eb' : '#374151' },
            grid: { color: theme === 'dark' ? '#374151' : '#e5e7eb' },
          },
        },
      },
    });

    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [data, theme]);

  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} />
    </div>
  );
}

