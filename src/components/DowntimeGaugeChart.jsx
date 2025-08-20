import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import Chart from '../chart';

export default function DowntimeGaugeChart() {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const { theme } = useTheme();
  const [downtime, setDowntime] = useState(0);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await fetch(`/api/equipment_status.php?latest=1&_=${Date.now()}`);
        const json = await res.json();
        json.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        const latest = json[0];
        if (latest) {
          const parseHours = (start, end) => {
            if (!start || !end) return 0;
            const s = new Date(`1970-01-01T${start}Z`);
            const e = new Date(`1970-01-01T${end}Z`);
            const diff = (e - s) / 3600000;
            return diff > 0 ? diff : 0;
          };
          const planned = parseHours(
            latest.planned_downtime_start,
            latest.planned_downtime_end
          );
          const unplanned = parseHours(
            latest.unplanned_downtime_start,
            latest.unplanned_downtime_end
          );
          setDowntime(planned + unplanned);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchLatest();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    const gaugeNeedle = {
      id: 'gaugeNeedle',
      afterDatasetsDraw(chart, args, opts) {
        const { ctx } = chart;
        const needleValue = Math.max(Math.min(opts.value, 24), 0);
        const angle = (needleValue / 24) * Math.PI - Math.PI / 2;
        const cx = chart.getDatasetMeta(0).data[0].x;
        const cy = chart.getDatasetMeta(0).data[0].y;
        const radius = chart.getDatasetMeta(0).data[0].outerRadius;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(radius, 0);
        ctx.lineWidth = 2;
        ctx.strokeStyle = opts.color;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, 4, 0, Math.PI * 2);
        ctx.fillStyle = opts.color;
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.fillStyle = opts.color;
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const labelRadius = radius + 10;
        ctx.fillText('0h', cx - labelRadius, cy);
        ctx.fillText('12h', cx, cy - labelRadius);
        ctx.fillText('24h', cx + labelRadius, cy);
        ctx.restore();
      },
    };

    chartRef.current?.destroy();
    chartRef.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        datasets: [
          {
            data: [1],
            backgroundColor: (context) => {
              const chart = context.chart;
              const { ctx, chartArea } = chart;
              if (!chartArea) return '#22c55e';
              const gradient = ctx.createLinearGradient(
                chartArea.left,
                0,
                chartArea.right,
                0
              );
              gradient.addColorStop(0, '#22c55e');
              gradient.addColorStop(0.5, '#fbbf24');
              gradient.addColorStop(1, '#ef4444');
              return gradient;
            },
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        rotation: -90,
        circumference: 180,
        cutout: '70%',
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false },
          datalabels: { display: false },
          gaugeNeedle: {
            value: downtime,
            color: theme === 'dark' ? '#e5e7eb' : '#374151',
          },
        },
      },
      plugins: [gaugeNeedle],
    });

    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [downtime, theme]);

  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full" />
      <div
        className={`absolute inset-0 flex items-center justify-center text-xl font-semibold ${
          theme === 'dark' ? 'text-white' : 'text-gray-800'
        }`}
      >
        {downtime.toFixed(1)}h
      </div>
    </div>
  );
}

