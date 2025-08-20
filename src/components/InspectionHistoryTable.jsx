import React from 'react';

export default function InspectionHistoryTable({ data }) {
  return (
    <div className="flex-1 overflow-auto">
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-white/10 dark:bg-gray-800/30">
          <tr>
            <th className="text-left p-2">Equipment</th>
            <th className="text-left p-2">Last Inspection</th>
            <th className="text-left p-2">Inspector</th>
            <th className="text-left p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {data
            .slice()
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .map((row, i) => (
            <tr key={i} className="odd:bg-white/5">
              <td className="p-2">{row.equipment}</td>
              <td className="p-2">
                {new Date(row.created_at).toLocaleString()}
              </td>
              <td className="p-2">{row.operator}</td>
              <td className="p-2">
                <span
                  className={
                    row.status === 'Passed'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }
                >
                  {row.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
