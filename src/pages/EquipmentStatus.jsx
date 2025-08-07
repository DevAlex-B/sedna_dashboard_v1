import PageContainer from '../components/PageContainer';
import data from '../api/equipmentStatusData.json';

const panelClasses =
  "p-4 backdrop-blur-md bg-white/5 border border-white/10 rounded-xl shadow-md text-gray-900 dark:text-white";

function LineChart({ data }) {
  const width = 300;
  const height = 120;
  const maxVal = Math.max(...data.map((d) => d.value));
  const points = data
    .map((d, i) => `${(i / (data.length - 1)) * width},${height - (d.value / maxVal) * height}`)
    .join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
      <polyline
        fill="none"
        strokeWidth="2"
        stroke="currentColor"
        points={points}
        className="text-main"
      />
    </svg>
  );
}

function BarChart({ data }) {
  const width = 300;
  const height = 120;
  const maxVal = Math.max(...data.map((d) => d.value));
  const barWidth = width / data.length;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
      {data.map((d, i) => (
        <rect
          key={d.label}
          x={i * barWidth + barWidth * 0.1}
          y={height - (d.value / maxVal) * height}
          width={barWidth * 0.8}
          height={(d.value / maxVal) * height}
          className="fill-main"
        />
      ))}
    </svg>
  );
}

function StatusTable({ data }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left">
          <th className="py-1">Equipment</th>
          <th className="py-1">Status</th>
          <th className="py-1">Temp (°C)</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.equipment} className="odd:bg-white/5">
            <td className="py-1">{row.equipment}</td>
            <td className="py-1">{row.status}</td>
            <td className="py-1">{row.temp ?? '--'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function StatusDistribution({ data }) {
  const counts = data.reduce((acc, cur) => {
    acc[cur.status] = (acc[cur.status] || 0) + 1;
    return acc;
  }, {});
  const entries = Object.entries(counts);
  const width = 300;
  const height = 120;
  const maxVal = Math.max(...entries.map((e) => e[1]));
  const barWidth = width / entries.length;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
      {entries.map(([status, count], i) => (
        <g key={status}>
          <rect
            x={i * barWidth + barWidth * 0.1}
            y={height - (count / maxVal) * height}
            width={barWidth * 0.8}
            height={(count / maxVal) * height}
            className="fill-secondary"
          />
          <text
            x={i * barWidth + barWidth / 2}
            y={height - 4}
            textAnchor="middle"
            className="text-xs fill-current"
          >
            {status}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function EquipmentStatus() {
  return (
    <PageContainer>
      <h1 className="text-2xl font-semibold mb-6">Equipment Status</h1>
      <div className="flex gap-4 h-[500px]">
        <div className={`w-1/3 ${panelClasses}`}>
          <h2 className="mb-2 font-medium">Weekly Uptime %</h2>
          <LineChart data={data.uptime} />
        </div>
        <div className="flex flex-col gap-4 flex-1">
          <div className={`flex-1 ${panelClasses}`}>
            <h2 className="mb-2 font-medium">Output by Equipment</h2>
            <BarChart data={data.output} />
          </div>
          <div className="flex gap-4 flex-1">
            <div className={`flex-1 ${panelClasses}`}>
              <h2 className="mb-2 font-medium">Current Status</h2>
              <StatusTable data={data.statuses} />
            </div>
            <div className={`flex-1 ${panelClasses}`}>
              <h2 className="mb-2 font-medium">Status Distribution</h2>
              <StatusDistribution data={data.statuses} />
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

