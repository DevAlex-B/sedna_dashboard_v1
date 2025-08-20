import React from 'react';

const days = [
  { label: 'M', key: 'monday_status' },
  { label: 'Tu', key: 'tuesday_status' },
  { label: 'W', key: 'wednesday_status' },
  { label: 'Th', key: 'thursday_status' },
  { label: 'F', key: 'friday_status' },
  { label: 'Sa', key: 'saturday_status' },
  { label: 'Su', key: 'sunday_status' },
];

const statusColor = (status) => {
  switch (status) {
    case 'Online':
      return 'bg-green-500 dark:bg-green-400';
    case 'Offline':
      return 'bg-red-500 dark:bg-red-400';
    case 'Standby':
      return 'bg-yellow-500 dark:bg-yellow-400';
    default:
      return 'bg-gray-400';
  }
};

export default function EquipmentStatusTable({ data }) {
  return (
    <div className="flex-1 overflow-auto">
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-white/10 dark:bg-gray-800/30">
          <tr>
            <th className="text-left p-2">Equipment</th>
            {days.map((d) => (
              <th key={d.key} className="p-2">
                {d.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data
            .slice()
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .map((row, i) => (
              <tr key={i} className="odd:bg-white/5">
                <td className="p-2">{row.equipment}</td>
                {days.map((d) => (
                  <td key={d.key} className="p-2">
                    <span
                      className={`block w-3 h-3 mx-auto rounded-full ${statusColor(
                        row[d.key]
                      )}`}
                    />
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
