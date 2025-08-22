import { useEffect, useState } from 'react';
import PageContainer from '../components/PageContainer';
import TimeRangeSelector, { ranges } from '../components/TimeRangeSelector';
import FeedToPlantChart from '../components/FeedToPlantChart';
import InspectionHistoryTable from '../components/InspectionHistoryTable';
import EquipmentStatusTable from '../components/EquipmentStatusTable';
import DowntimeChart from '../components/DowntimeChart';
import { formatDateForApi } from '../utils/date';

const panelClasses =
  'p-4 h-full backdrop-blur-md bg-white/5 border border-white/10 rounded-xl shadow-md text-gray-900 dark:text-white';

export default function EquipmentStatus() {
  const [range, setRange] = useState(ranges[1]);
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
          `/api/equipment_status.php?start=${formatDateForApi(start)}&end=${formatDateForApi(end)}&_=${Date.now()}`
        );
        const json = await res.json();
        json.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setData(json);
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
          <h1 className="text-2xl font-semibold">Equipment Status</h1>
          <TimeRangeSelector value={range} onChange={setRange} />
        </div>
        <div className="grid flex-1 grid-cols-1 gap-4 min-h-0 md:grid-cols-4 md:grid-rows-2">
          <div className={`col-span-1 md:col-span-3 ${panelClasses} flex flex-col`}>
            <h2 className="mb-2 font-medium">Feed to plant</h2>
            <div className="flex-1 h-full min-h-0">
              <FeedToPlantChart range={range} />
            </div>
          </div>
          <div className={`col-span-1 md:row-span-2 ${panelClasses} flex flex-col`}>
            <h2 className="mb-2 font-medium">Inspection History</h2>
            <InspectionHistoryTable data={data} />
          </div>
          <div className={`col-span-1 ${panelClasses} flex flex-col`}>
            <h2 className="mb-2 font-medium">Downtime</h2>
            <div className="flex-1 h-full min-h-0">
              <DowntimeChart />
            </div>
          </div>
          <div className={`col-span-1 md:col-span-2 ${panelClasses} flex flex-col`}>
            <h2 className="mb-2 font-medium">Equipment Status</h2>
            <EquipmentStatusTable data={data} />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

