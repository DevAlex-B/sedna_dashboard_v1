import { useEffect, useState } from 'react';

export default function GeofenceList() {
  const [geofences, setGeofences] = useState([]);

  useEffect(() => {
    fetch('/api/geofences.php')
      .then((res) => res.json())
      .then(setGeofences)
      .catch(() => setGeofences([]));
  }, []);

  return (
    <div className="flex-1 overflow-auto space-y-2">
      {geofences.map((g) => (
        <div key={g.id} className="flex items-center space-x-2">
          <span
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: g.color }}
          />
          <span>{g.name}</span>
        </div>
      ))}
    </div>
  );
}
