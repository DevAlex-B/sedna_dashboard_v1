import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import Chart from '../chart';

export default function FeedToPlantChart({ range }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const { theme } = useTheme();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const end = new Date();
      const start = new Date(end);
      if (range.unit === 'hour') {
        start.setHours(end.getHours() - range.value);
      } else {
        start.setDate(end.getDate() - range.value);
      }
      try {
        const res = await fetch(
          `/api/feed_to_plant.php?start=${start.toISOString()}&end=${end.toISOString()}`
        );
        const json = await res.json();
        const maxPoints =
          range.unit === 'hour' && range.value === 1
            ? 60
            : range.unit === 'hour' && range.value === 24
            ? 48
            : range.unit === 'day' && range.value === 7
            ? 7
            : json.length;
        const step = Math.ceil(json.length / maxPoints);
        const sampled = json.filter((_, i) => i % step === 0).slice(-maxPoints);
        setData(sampled);
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, [range]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    const labels = data.map((d) => {
      const date = new Date(d.time);
      return range.unit === 'day'
        ? date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
        : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    });
    const values = data.map((d) => d.value);

    chartRef.current?.destroy();
    chartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            data: values,
            borderColor: '#036EC8',
            backgroundColor: 'transparent',
            tension: 0.4,
            pointRadius: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 500, easing: 'easeOutQuart' },
        plugins: { legend: { display: false }, datalabels: { display: false } },
        scales: {
          x: {
            ticks: {
              color: theme === 'dark' ? '#e5e7eb' : '#374151',
              maxTicksLimit: range.unit === 'day' ? 7 : 6,
            },
            grid: { display: false },
          },
          y: {
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
