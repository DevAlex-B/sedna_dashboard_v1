import React from 'react';

export default function LogDetailsTable({ data }) {
  return (
    <div className="flex-1 overflow-auto">
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-white/10 dark:bg-gray-800/30">
          <tr>
            <th className="text-left p-2">Operator</th>
            <th className="text-left p-2">Equipment</th>
            <th className="text-left p-2">Status</th>
            <th className="text-left p-2">Monday</th>
            <th className="text-left p-2">Tuesday</th>
            <th className="text-left p-2">Wednesday</th>
            <th className="text-left p-2">Thursday</th>
            <th className="text-left p-2">Friday</th>
            <th className="text-left p-2">Saturday</th>
            <th className="text-left p-2">Sunday</th>
            <th className="text-left p-2">Downtime</th>
            <th className="text-left p-2">Planned Start</th>
            <th className="text-left p-2">Planned End</th>
            <th className="text-left p-2">Unplanned Start</th>
            <th className="text-left p-2">Unplanned End</th>
            <th className="text-left p-2">Created At</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="odd:bg-white/5">
              <td className="p-2">{row.operator}</td>
              <td className="p-2">{row.equipment}</td>
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
              <td className="p-2">{row.monday_status}</td>
              <td className="p-2">{row.tuesday_status}</td>
              <td className="p-2">{row.wednesday_status}</td>
              <td className="p-2">{row.thursday_status}</td>
              <td className="p-2">{row.friday_status}</td>
              <td className="p-2">{row.saturday_status}</td>
              <td className="p-2">{row.sunday_status}</td>
              <td className="p-2">{row.downtime ? 'Yes' : 'No'}</td>
              <td className="p-2">{row.planned_downtime_start}</td>
              <td className="p-2">{row.planned_downtime_end}</td>
              <td className="p-2">{row.unplanned_downtime_start}</td>
              <td className="p-2">{row.unplanned_downtime_end}</td>
              <td className="p-2">
                {new Date(row.created_at).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

