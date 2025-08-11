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
    if (!window.Chart) return;
    const labels = data.map((d) => d.time);
    const values = data.map((d) => d.value);
    const ctx = canvasRef.current.getContext('2d');
    if (!chartRef.current) {
      chartRef.current = new window.Chart(ctx, {
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
          plugins: { legend: { display: false } },
          scales: {
            x: {
              ticks: {
                color: theme === 'dark' ? '#e5e7eb' : '#374151',
                maxTicksLimit: Math.ceil(labels.length / 2),
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
    } else {
      const chart = chartRef.current;
      chart.data.labels = labels;
      chart.data.datasets[0].data = values;
      chart.options.scales.x.ticks.color =
        theme === 'dark' ? '#e5e7eb' : '#374151';
      chart.options.scales.x.ticks.maxTicksLimit = Math.ceil(labels.length / 2);
      chart.options.scales.y.ticks.color =
        theme === 'dark' ? '#e5e7eb' : '#374151';
      chart.options.scales.y.grid.color =
        theme === 'dark' ? '#374151' : '#e5e7eb';
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
