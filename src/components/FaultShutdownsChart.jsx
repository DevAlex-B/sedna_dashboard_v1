import { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import Chart from '../chart';

export default function FaultShutdownsChart({ data = [] }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    const labels = data.map((d) => d.equipment);
    const values = data.map((d) => d.shutdown_count);

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    chartRef.current?.destroy();
    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: '#036EC8',
            borderRadius: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 500, easing: 'easeOutQuart' },
        plugins: {
          legend: { display: false },
          datalabels: {
            anchor: 'end',
            align: 'top',
            color: theme === 'dark' ? '#e5e7eb' : '#374151',
            font: { weight: 'bold' },
          },
        },
        scales: {
          x: {
            ticks: { color: theme === 'dark' ? '#e5e7eb' : '#374151' },
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
    <div className="relative w-full h-72">
      <canvas ref={canvasRef} />
    </div>
  );
}

