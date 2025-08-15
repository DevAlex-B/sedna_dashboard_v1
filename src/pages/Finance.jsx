import { useState, useMemo } from 'react';
import PageContainer from '../components/PageContainer';
import TimeRangeSelector, { ranges } from '../components/TimeRangeSelector';
import FaultShutdownsChart from '../components/FaultShutdownsChart';
import IdleCostTotalsChart from '../components/IdleCostTotalsChart';
import UtilizationChart from '../components/UtilizationChart';
import financeData from '../finance_data.json';

const panelClasses =
  'p-4 h-full backdrop-blur-md bg-white/5 border border-white/10 rounded-xl shadow-md text-gray-900 dark:text-white';

export default function Finance() {
  const [range, setRange] = useState(ranges[1]);

  const rangeKey = useMemo(
    () => `last_${range.value}${range.unit === 'hour' ? 'h' : 'd'}`,
    [range]
  );
  const data = financeData.time_ranges[rangeKey];

  const formatter = useMemo(
    () =>
      new Intl.NumberFormat('en-ZA', {
        style: 'currency',
        currency: financeData.currency,
        minimumFractionDigits: 0,
      }),
    []
  );

  return (
    <PageContainer>
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">Finance</h1>
          <TimeRangeSelector value={range} onChange={setRange} />
        </div>
        <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-4">
          <div className={`${panelClasses} flex flex-col justify-center`}>
            <h2 className="font-medium">Idle Cost</h2>
            <p className="text-2xl font-bold">
              {formatter.format(data.kpis.idle_cost)}
            </p>
          </div>
          <div className={`${panelClasses} flex flex-col justify-center`}>
            <h2 className="font-medium">Shutdown</h2>
            <p className="text-2xl font-bold">
              {formatter.format(data.kpis.shutdown_cost)}
            </p>
          </div>
          <div className={`${panelClasses} flex flex-col justify-center`}>
            <h2 className="font-medium">Production Lost</h2>
            <p className="text-2xl font-bold">
              {formatter.format(data.kpis.production_lost_cost)}
            </p>
          </div>
          <div className={`${panelClasses} flex flex-col justify-center`}>
            <h2 className="font-medium">Total Cost</h2>
            <p className="text-2xl font-bold">
              {formatter.format(data.kpis.total_cost)}
            </p>
          </div>
        </div>
        <div className="grid flex-1 grid-cols-1 gap-4 mb-4 md:grid-cols-2">
          <div className={`${panelClasses} flex flex-col`}>
            <h2 className="mb-2 font-medium">Fault Shutdowns</h2>
            <div className="flex-1 min-h-0">
              <FaultShutdownsChart data={data.fault_shutdowns} />
            </div>
          </div>
          <div className={`${panelClasses} flex flex-col`}>
            <h2 className="mb-2 font-medium">Idle Cost Totals</h2>
            <div className="flex-1 min-h-0">
              <IdleCostTotalsChart
                data={data.idle_cost_totals}
                currency={financeData.currency}
              />
            </div>
          </div>
        </div>
        <div className={`${panelClasses} flex flex-col flex-1`}>
          <h2 className="mb-2 font-medium">Equipment Utilisation Efficiency</h2>
          <div className="flex-1 min-h-0">
            <UtilizationChart data={data.utilization} />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

