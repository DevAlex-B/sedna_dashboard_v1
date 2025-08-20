import React from 'react';

export default function GeofencesTable({ data }) {
  return (
    <div className="flex-1 overflow-auto">
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-white/10 dark:bg-gray-800/30">
          <tr>
            <th className="text-left p-2">ID</th>
            <th className="text-left p-2">Name</th>
            <th className="text-left p-2">Color</th>
            <th className="text-left p-2">Coordinates</th>
            <th className="text-left p-2">Created At</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="odd:bg-white/5">
              <td className="p-2">{row.id}</td>
              <td className="p-2">{row.name}</td>
              <td className="p-2">
                <div className="flex items-center space-x-2">
                  <span
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: row.color }}
                  />
                  <span>{row.color}</span>
                </div>
              </td>
              <td className="p-2 truncate" title={row.coordinates}>
                {row.coordinates}
              </td>
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

