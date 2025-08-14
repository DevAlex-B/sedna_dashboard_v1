import { useEffect, useState } from 'react';
import PageContainer from '../components/PageContainer';
import TimeRangeSelector, { ranges } from '../components/TimeRangeSelector';
import LogDetailsTable from '../components/LogDetailsTable';

const panelClasses =
  'p-4 h-full backdrop-blur-md bg-white/5 border border-white/10 rounded-xl shadow-md text-gray-900 dark:text-white';

export default function LogDetails() {
  const [range, setRange] = useState(ranges[1]);
  const [counts, setCounts] = useState({ visitors: 0, dashboard: 0 });
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
        const [cRes, dRes] = await Promise.all([
          fetch(`/api/user_counts.php?start=${start.toISOString()}&end=${end.toISOString()}`),
          fetch(`/api/equipment_status.php?start=${start.toISOString()}&end=${end.toISOString()}`),
        ]);
        const cJson = await cRes.json();
        const dJson = await dRes.json();
        setCounts({ visitors: cJson.visitors || 0, dashboard: cJson.dashboard || 0 });
        setData(dJson);
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, [range]);

  return (
    <PageContainer>
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">Log Details</h1>
          <TimeRangeSelector value={range} onChange={setRange} />
        </div>
        <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
          <div className={`${panelClasses} flex flex-col items-center justify-center`}>
            <h2 className="mb-2 font-medium">Visitors</h2>
            <p className="text-4xl font-bold">{counts.visitors}</p>
          </div>
          <div className={`${panelClasses} flex flex-col items-center justify-center`}>
            <h2 className="mb-2 font-medium">Dashboard Visitors</h2>
            <p className="text-4xl font-bold">{counts.dashboard}</p>
          </div>
        </div>
        <div className={`${panelClasses} flex flex-col flex-1`}>
          <h2 className="mb-2 font-medium">Equipment Logs</h2>
          <LogDetailsTable data={data} />
        </div>
      </div>
    </PageContainer>
  );
}

