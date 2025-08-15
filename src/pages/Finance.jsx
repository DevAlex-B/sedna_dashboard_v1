import PageContainer from '../components/PageContainer';

const panelClasses =
  'p-4 h-full backdrop-blur-md bg-white/5 border border-white/10 rounded-xl shadow-md text-gray-900 dark:text-white';

export default function Finance() {
  return (
    <PageContainer>
      <div className="flex flex-col h-full">
        <h1 className="text-2xl font-semibold mb-4">Finance</h1>
        <div className="grid flex-1 grid-cols-5 grid-rows-5 gap-4">
          <div className={`col-start-1 row-start-1 ${panelClasses} flex flex-col`}>
            <h2 className="font-medium">Idle Cost</h2>
          </div>
          <div className={`col-start-2 row-start-1 ${panelClasses} flex flex-col`}>
            <h2 className="font-medium">Shutdown</h2>
          </div>
          <div className={`col-start-3 row-start-1 ${panelClasses} flex flex-col`}>
            <h2 className="font-medium">Production Lost</h2>
          </div>
          <div className={`col-start-4 row-start-1 ${panelClasses} flex flex-col`}>
            <h2 className="font-medium">Total Cost</h2>
          </div>
          <div className={`col-start-5 row-start-1 ${panelClasses} flex flex-col`}>
            <h2 className="font-medium">Downtime</h2>
          </div>
          <div
            className={`col-start-1 row-start-2 col-span-2 row-span-2 ${panelClasses} flex flex-col`}
          >
            <h2 className="font-medium">Fault Shutdowns</h2>
          </div>
          <div
            className={`col-start-1 row-start-4 col-span-2 row-span-2 ${panelClasses} flex flex-col`}
          >
            <h2 className="font-medium">Idle Cost Totals</h2>
          </div>
          <div
            className={`col-start-3 row-start-2 col-span-3 row-span-1 ${panelClasses} flex flex-col`}
          >
            <h2 className="font-medium">Downtime vs. Operational Time</h2>
          </div>
          <div
            className={`col-start-3 row-start-3 col-span-3 row-span-3 ${panelClasses} flex flex-col`}
          >
            <h2 className="font-medium">Equipment Utilisation Efficiency</h2>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
