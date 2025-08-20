import { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import Chart from '../chart';

export default function DistanceKmChart({ data = [] }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    const parent = canvasRef.current?.parentElement;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx || !parent) return;

    canvasRef.current.height = parent.clientHeight;

    const labels = data.map((d) => d.equipment);
    const values = data.map((d) => d.distance_km);
    const colors = values.map((v) => {
      if (v > 3500) return '#ef4444'; // red
      if (v > 2000) return '#f59e0b'; // amber
      return '#22c55e'; // green
    });

    chartRef.current?.destroy();
    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: colors,
            borderRadius: 6,
          },
        ],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { right: 24, top: 16 } },
        animation: { duration: 500, easing: 'easeOutQuart' },
        plugins: {
          legend: { display: false },
          datalabels: {
            anchor: 'end',
            align: 'end',
            color: theme === 'dark' ? '#e5e7eb' : '#374151',
            formatter: (v) => `${v}`,
          },
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: { color: theme === 'dark' ? '#e5e7eb' : '#374151' },
            grid: { color: theme === 'dark' ? '#374151' : '#e5e7eb' },
          },
          y: {
            ticks: {
              color: theme === 'dark' ? '#e5e7eb' : '#374151',
            },
            grid: { display: false },
          },
        },
      },
    });

    chartRef.current.resize(parent.clientWidth, parent.clientHeight);

    const handleResize = () => {
      const parent = canvasRef.current?.parentElement;
      if (!parent || !chartRef.current) return;
      canvasRef.current.height = parent.clientHeight;
      chartRef.current.resize(parent.clientWidth, parent.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [data, theme]);

  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}

