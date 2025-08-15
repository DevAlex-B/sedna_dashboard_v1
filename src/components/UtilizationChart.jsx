import { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import Chart from '../chart';

export default function UtilizationChart({ data = [] }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    const labels = data.map((d) => d.equipment);
    const idle = data.map((d) => d.idle_pct);
    const run = data.map((d) => d.run_pct);
    const productive = data.map((d) => d.productive_pct);

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
            label: 'Idle',
            data: idle,
            backgroundColor: '#f59e0b',
            borderRadius: 8,
          },
          {
            label: 'Run',
            data: run,
            backgroundColor: '#3b82f6',
            borderRadius: 8,
          },
          {
            label: 'Productive',
            data: productive,
            backgroundColor: '#22c55e',
            borderRadius: 8,
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
              usePointStyle: true,
              pointStyle: 'rectRounded',
            },
          },
          datalabels: {
            anchor: 'end',
            align: 'top',
            color: theme === 'dark' ? '#e5e7eb' : '#374151',
            formatter: (value) => `${value}%`,
            font: { weight: 'bold' },
          },
        },
        scales: {
          x: {
            ticks: {
              color: theme === 'dark' ? '#e5e7eb' : '#374151',
              maxRotation: 45,
              minRotation: 45,
            },
            grid: { display: false },
          },
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              color: theme === 'dark' ? '#e5e7eb' : '#374151',
              callback: (value) => `${value}%`,
            },
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
    <div className="relative w-full h-96">
      <canvas ref={canvasRef} />
    </div>
  );
}

