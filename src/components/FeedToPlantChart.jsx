import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

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
        setData(json);
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, [range]);

  useEffect(() => {
    if (!window.Chart) return;
    const labels = data.map((d) => d.time);
    const values = data.map((d) => d.value);
    const ctx = canvasRef.current.getContext('2d');
    if (chartRef.current) {
      chartRef.current.destroy();
    }
    chartRef.current = new window.Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            data: values,
            borderColor: theme === 'dark' ? '#34d399' : '#2563eb',
            backgroundColor: 'transparent',
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        animation: { duration: 500, easing: 'easeOutQuart' },
        plugins: { legend: { display: false } },
        scales: {
          x: {
            ticks: {
              color: theme === 'dark' ? '#e5e7eb' : '#374151',
            },
            grid: {
              color: theme === 'dark' ? '#374151' : '#e5e7eb',
            },
          },
          y: {
            ticks: {
              color: theme === 'dark' ? '#e5e7eb' : '#374151',
            },
            grid: {
              color: theme === 'dark' ? '#374151' : '#e5e7eb',
            },
          },
        },
      },
    });
    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, [data, theme]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}
