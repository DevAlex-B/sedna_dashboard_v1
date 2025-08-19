import React from 'react';
import drivingIcon from '../assets/driving.png';
import parkedIcon from '../assets/parked.png';
import inactiveIcon from '../assets/inactive.png';

export default function CurrentStatusSummary({ counts }) {
  const items = [
    { icon: drivingIcon, title: 'Driving', value: counts.Driving || 0 },
    { icon: parkedIcon, title: 'Parked', value: counts.Parked || 0 },
    { icon: inactiveIcon, title: 'Inactive', value: counts.Inactive || 0 },
  ];

  return (
    <div className="flex flex-col justify-around h-full">
      {items.map((item) => (
        <div key={item.title} className="flex items-center justify-center space-x-4">
          <img src={item.icon} alt={item.title} className="h-12 w-12 object-contain" />
          <div className="text-center">
            <div className="text-sm">{item.title}</div>
            <div className="text-xl font-semibold">{item.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
