import { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import Chart from '../chart';

export default function EquipmentUtilizationChart({ data = [] }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    const labels = data.map((d) => d.equipment);
    const idleValues = data.map((d) => d.idle_pct);
    const runValues = data.map((d) => d.run_pct);
    const productiveValues = data.map((d) => d.productive_pct);

    chartRef.current?.destroy();
    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Idle',
            data: idleValues,
            backgroundColor: '#f59e0b',
            borderRadius: 6,
          },
          {
            label: 'Run',
            data: runValues,
            backgroundColor: '#22c55e',
            borderRadius: 6,
          },
          {
            label: 'Productive',
            data: productiveValues,
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
          legend: {
            position: 'top',
            labels: {
              color: theme === 'dark' ? '#e5e7eb' : '#374151',
              usePointStyle: true,
              pointStyle: 'rectRounded',
              boxWidth: 12,
              boxHeight: 12,
            },
          },
          datalabels: {
            anchor: 'end',
            align: 'end',
            offset: 4,
            formatter: (value) => `${value}%`,
            color: theme === 'dark' ? '#e5e7eb' : '#374151',
          },
        },
        scales: {
          x: {
            stacked: false,
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
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} />
    </div>
  );
}

