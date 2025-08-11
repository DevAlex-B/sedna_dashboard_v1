import PageContainer from '../components/PageContainer';
import TimeRangeSelector from '../components/TimeRangeSelector';

const panelClasses =
  'p-4 h-full backdrop-blur-md bg-white/5 border border-white/10 rounded-xl shadow-md text-gray-900 dark:text-white';

export default function EquipmentStatus() {
  return (
    <PageContainer>
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">Equipment Status</h1>
          <TimeRangeSelector />
        </div>
        <div className="grid flex-1 grid-cols-3 grid-rows-2 gap-4">
          <div className={`col-span-2 ${panelClasses}`}>
            <h2 className="mb-2 font-medium">Density Level</h2>
          </div>
          <div className={`col-span-1 ${panelClasses}`}>
            <h2 className="mb-2 font-medium">Inspection History</h2>
          </div>
          <div className={`col-span-1 ${panelClasses}`}>
            <h2 className="mb-2 font-medium">Downtime</h2>
          </div>
          <div className={`col-span-2 ${panelClasses}`}>
            <h2 className="mb-2 font-medium">Equipment Status</h2>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

