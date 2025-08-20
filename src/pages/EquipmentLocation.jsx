import { useEffect, useState } from 'react';
import PageContainer from '../components/PageContainer';
import GeofenceMap from '../components/GeofenceMap';
import GeofenceList from '../components/GeofenceList';
import DistanceKmChart from '../components/DistanceKmChart';
import TimeInLocationChart from '../components/TimeInLocationChart';
import LocationHistoryTable from '../components/LocationHistoryTable';
import CurrentStatusSummary from '../components/CurrentStatusSummary';
import locationData from '../location_data.json';

export default function EquipmentLocation() {
  const [history, setHistory] = useState([]);
  const [counts, setCounts] = useState({ Driving: 0, Parked: 0, Inactive: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/equipment_location.php');
        const json = await res.json();
        setHistory(json);
        const c = { Driving: 0, Parked: 0, Inactive: 0 };
        json.forEach((row) => {
          if (c[row.current_status] !== undefined) {
            c[row.current_status]++;
          }
        });
        setCounts(c);
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, []);

  const panelClasses =
    'p-4 backdrop-blur-md bg-white dark:bg-white/5 border border-border dark:border-white/10 rounded-xl shadow-md text-default flex flex-col h-full min-h-0 overflow-hidden';

  return (
    <PageContainer>
      <h1 className="text-2xl font-semibold mb-6">Equipment Location</h1>
      <div
        className="grid flex-1 h-full min-h-0 grid-cols-1 gap-4 md:grid-cols-5 md:grid-rows-5"
      >
        <div
          className={`md:col-start-1 md:col-end-2 md:row-start-1 md:row-end-2 ${panelClasses}`}
        >
          <h2 className="mb-2 font-medium">Geofences</h2>
          <GeofenceList />
        </div>
        <div
          className={`md:col-start-1 md:col-end-2 md:row-start-2 md:row-end-6 ${panelClasses}`}
        >
          <h2 className="mb-2 font-medium">1. History</h2>
          <LocationHistoryTable data={history} />
        </div>
        <div
          className={`md:col-start-2 md:col-end-4 md:row-start-1 md:row-end-6 ${panelClasses}`}
        >
          <GeofenceMap />
        </div>
        <div
          className={`md:col-start-4 md:col-end-5 md:row-start-1 md:row-end-4 ${panelClasses}`}
        >
          <h2 className="mb-2 font-medium text-center">3. Current Status</h2>
          <CurrentStatusSummary counts={counts} />
        </div>
        <div
          className={`md:col-start-5 md:col-end-6 md:row-start-1 md:row-end-4 ${panelClasses}`}
        >
          <h2 className="mb-2 font-medium">Distance - km</h2>
          <div className="flex-1 h-full min-h-0">
            <DistanceKmChart data={locationData} />
          </div>
        </div>
        <div
          className={`md:col-start-4 md:col-end-6 md:row-start-4 md:row-end-6 ${panelClasses}`}
        >
          <h2 className="mb-2 font-medium">Time in Location (min)</h2>
          <div className="flex-1 h-full min-h-0">
            <TimeInLocationChart data={locationData} />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
