import React from 'react';

export default function LocationHistoryTable({ data }) {
  return (
    <div className="flex-1 overflow-auto">
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-white/10">
          <tr>
            <th className="text-left p-2">Equipment</th>
            <th className="text-left p-2">Status</th>
            <th className="text-left p-2">Created At</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="odd:bg-white/5">
              <td className="p-2">{row.equipment}</td>
              <td className="p-2">{row.current_status}</td>
              <td className="p-2">{new Date(row.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
