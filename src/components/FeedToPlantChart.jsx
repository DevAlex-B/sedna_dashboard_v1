import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

export default function FeedToPlantChart({ range }) {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    async function load() {
      const end = new Date();
      const start = new Date(end);
      if (range.unit === 'hour') {
        start.setHours(end.getHours() - range.value);
      } else if (range.unit === 'day') {
        start.setDate(end.getDate() - range.value);
      }
      try {
        const res = await fetch(
          `/api/ewon1?start=${start.toISOString()}&end=${end.toISOString()}`
        );
        const json = await res.json();
        setRows(json);
      } catch (e) {
        console.error(e);
        setRows([]);
      }
    }
    load();
  }, [range]);

  const labels = rows.map((d) =>
    new Date(d.sast_timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );
  const dataPoints = rows.map((d) => d.Final_Tails_SG * 1000);

  const isDark =
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
  const gridColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const textColor = isDark ? '#ffffff' : '#111827';

  const data = {
    labels,
    datasets: [
      {
        label: 'Tons',
        data: dataPoints,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59,130,246,0.3)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    animation: { duration: 500 },
    scales: {
      x: {
        ticks: { color: textColor },
        grid: { color: gridColor },
      },
      y: {
        ticks: { color: textColor },
        grid: { color: gridColor },
      },
    },
  };

  return <Line data={data} options={options} className="h-full" />;
}
