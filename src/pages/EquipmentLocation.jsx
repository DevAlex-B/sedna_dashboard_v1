import PageContainer from '../components/PageContainer';
import GeofenceMap from '../components/GeofenceMap';
import DistanceKmChart from '../components/DistanceKmChart';
import TimeInLocationChart from '../components/TimeInLocationChart';
import locationData from '../location_data.json';

export default function EquipmentLocation() {
  const panelClasses =
    "p-4 backdrop-blur-md bg-white/5 border border-white/10 rounded-xl shadow-md text-white flex flex-col h-full";

  return (
    <PageContainer>
      <h1 className="text-2xl font-semibold mb-6">Equipment Location</h1>
      <div
        className="grid flex-1 h-full grid-cols-1 gap-4 md:grid-cols-5 md:grid-rows-5"
      >
        <div
          className={`md:col-start-1 md:col-end-2 md:row-start-1 md:row-end-6 ${panelClasses}`}
        >
          1. History
        </div>
          <div
            className={`md:col-start-2 md:col-end-4 md:row-start-1 md:row-end-6 ${panelClasses}`}
          >
            <GeofenceMap />
          </div>
        <div
          className={`md:col-start-4 md:col-end-5 md:row-start-1 md:row-end-4 ${panelClasses}`}
        >
          3. Current Status
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
