import { useMemo, useState } from 'react';
import PageContainer from '../components/PageContainer';
import TimeRangeSelector, { ranges } from '../components/TimeRangeSelector';
import financeData from '../finance_data.json';
import FaultShutdownsChart from '../components/FaultShutdownsChart';
import IdleCostTotalsChart from '../components/IdleCostTotalsChart';
import EquipmentUtilizationChart from '../components/EquipmentUtilizationChart';
import DowntimeGaugeChart from '../components/DowntimeGaugeChart';
import DowntimeVsOperationalChart from '../components/DowntimeVsOperationalChart';

const panelClasses =
  'p-4 h-full backdrop-blur-md bg-white/5 border border-white/10 rounded-xl shadow-md text-gray-900 dark:text-white';

const currencyFormatter = new Intl.NumberFormat('en-ZA', {
  style: 'currency',
  currency: financeData.currency,
  maximumFractionDigits: 0,
});

function getRangeKey(range) {
  if (range.unit === 'hour' && range.value === 1) return 'last_1h';
  if (range.unit === 'hour' && range.value === 24) return 'last_24h';
  if (range.unit === 'day' && range.value === 7) return 'last_7d';
  return 'last_24h';
}

export default function Finance() {
  const [range, setRange] = useState(ranges[1]);
  const rangeData = useMemo(
    () =>
      financeData.time_ranges[getRangeKey(range)] || {
        kpis: {
          idle_cost: 0,
          shutdown_cost: 0,
          production_lost_cost: 0,
          total_cost: 0,
        },
        fault_shutdowns: [],
        idle_cost_totals: [],
        utilization: [],
      },
    [range]
  );

  return (
    <PageContainer>
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">Finance</h1>
          <TimeRangeSelector value={range} onChange={setRange} />
        </div>
        <div className="grid flex-1 min-h-0 grid-cols-5 grid-rows-5 gap-4">
          <div className={`col-start-1 row-start-1 ${panelClasses} flex flex-col`}>
            <h2 className="font-medium">Idle Cost</h2>
            <div className="flex-1 flex items-center justify-center">
              <span className="text-3xl font-bold">
                {currencyFormatter.format(rangeData.kpis.idle_cost)}
              </span>
            </div>
          </div>
          <div className={`col-start-2 row-start-1 ${panelClasses} flex flex-col`}>
            <h2 className="font-medium">Shutdown</h2>
            <div className="flex-1 flex items-center justify-center">
              <span className="text-3xl font-bold">
                {currencyFormatter.format(rangeData.kpis.shutdown_cost)}
              </span>
            </div>
          </div>
          <div className={`col-start-3 row-start-1 ${panelClasses} flex flex-col`}>
            <h2 className="font-medium">Production Lost</h2>
            <div className="flex-1 flex items-center justify-center">
              <span className="text-3xl font-bold">
                {currencyFormatter.format(rangeData.kpis.production_lost_cost)}
              </span>
            </div>
          </div>
          <div className={`col-start-4 row-start-1 ${panelClasses} flex flex-col`}>
            <h2 className="font-medium">Total Cost</h2>
            <div className="flex-1 flex items-center justify-center">
              <span className="text-3xl font-bold">
                {currencyFormatter.format(rangeData.kpis.total_cost)}
              </span>
            </div>
          </div>
          <div className={`col-start-5 row-start-1 ${panelClasses} flex flex-col`}>
            <h2 className="font-medium">Downtime</h2>
            <div className="flex-1 h-full min-h-0 mt-2">
              <DowntimeGaugeChart />
            </div>
          </div>
          <div
            className={`col-start-1 row-start-2 col-span-2 row-span-2 ${panelClasses} flex flex-col`}
          >
            <h2 className="font-medium">Fault Shutdowns</h2>
            <div className="flex-1 h-full min-h-0 mt-2">
              <FaultShutdownsChart data={rangeData.fault_shutdowns} />
            </div>
          </div>
          <div
            className={`col-start-1 row-start-4 col-span-2 row-span-2 ${panelClasses} flex flex-col`}
          >
            <h2 className="font-medium">Idle Cost Totals</h2>
            <div className="flex-1 h-full min-h-0 mt-2">
              <IdleCostTotalsChart data={rangeData.idle_cost_totals} />
            </div>
          </div>
          <div
            className={`col-start-3 row-start-2 col-span-3 row-span-1 ${panelClasses} flex flex-col`}
          >
            <h2 className="font-medium">Downtime vs. Operational Time</h2>
            <div className="flex-1 h-full min-h-0 mt-2">
              <DowntimeVsOperationalChart />
            </div>
          </div>
          <div
            className={`col-start-3 row-start-3 col-span-3 row-span-3 ${panelClasses} flex flex-col`}
          >
            <h2 className="font-medium">Equipment Utilisation Efficiency</h2>
            <div className="flex-1 h-full min-h-0 mt-2">
              <EquipmentUtilizationChart data={rangeData.utilization} />
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
