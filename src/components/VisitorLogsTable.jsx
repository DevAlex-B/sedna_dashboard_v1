import React from 'react';

export default function VisitorLogsTable({ data, sortBy, sortDir, onSort }) {
  const indicator = (column) => {
    if (sortDir === 'none') {
      return column === 'created_at' ? '▼' : null;
    }
    if (sortBy !== column) return null;
    return sortDir === 'asc' ? '▲' : '▼';
  };
  const header = (label, column) => (
    <th
      className="text-left p-2 cursor-pointer select-none"
      onClick={() => onSort(column)}
    >
      <span className="flex items-center">
        {label}
        {indicator(column) && <span className="ml-1">{indicator(column)}</span>}
      </span>
    </th>
  );
  return (
    <div className="flex-1 overflow-auto">
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-white/10 dark:bg-gray-800/30">
          <tr>
            {header('ID', 'id')}
            {header('Full Name', 'full_name')}
            {header('Email', 'email')}
            {header('Phone', 'phone_number')}
            {header('Signed In', 'created_at')}
            {header('Dashboard Visitor', 'dashboard_visitor')}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="odd:bg-white/5">
              <td className="p-2">{row.id}</td>
              <td className="p-2 truncate" title={row.full_name}>{row.full_name}</td>
              <td className="p-2 truncate" title={row.email}>{row.email}</td>
              <td className="p-2 truncate" title={row.phone_number || ''}>{row.phone_number || ''}</td>
              <td className="p-2">{new Date(row.created_at).toLocaleString()}</td>
              <td className="p-2">{row.dashboard_visitor == 1 ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
