import { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import Chart from '../chart';

export default function TimeInLocationChart({ data = [] }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    const parent = canvasRef.current?.parentElement;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx || !parent) return;

    canvasRef.current.height = parent.clientHeight;

    const labels = data.map((d) => d.equipment);
    const values = data.map((d) => d.time_in_location_minutes);

    chartRef.current?.destroy();
    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Time in location minutes',
            data: values,
            backgroundColor: '#036EC8',
            borderRadius: 6,
            maxBarThickness: 40,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { top: 16, right: 8 } },
        animation: { duration: 500, easing: 'easeOutQuart' },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: theme === 'dark' ? '#e5e7eb' : '#374151',
              usePointStyle: true,
              pointStyle: 'rectRounded',
              boxWidth: 10,
              boxHeight: 10,
              font: { size: 11 },
            },
          },
          datalabels: {
            anchor: 'end',
            align: 'end',
            offset: 4,
            color: theme === 'dark' ? '#e5e7eb' : '#374151',
            formatter: (v) => `${v}`,
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

