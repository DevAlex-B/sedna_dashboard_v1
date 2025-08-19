import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Polygon } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

function randomColor() {
  return '#' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0');
}

export default function GeofenceMap() {
  const mapRef = useRef(null);
  const [geofences, setGeofences] = useState([]);
  const [selected, setSelected] = useState(null);
  const [drawing, setDrawing] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [newData, setNewData] = useState({ name: '', color: randomColor(), coords: [] });
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  };

  useEffect(() => {
    fetch('/api/geofences.php')
      .then((res) => res.json())
      .then((data) =>
        setGeofences(
          data.map((g) => ({
            ...g,
            coordinates: JSON.parse(g.coordinates),
          }))
        )
      );
  }, []);

  const startDrawing = () => {
    const map = mapRef.current;
    const draw = new L.Draw.Polygon(map, { showArea: false });
    draw.enable();
    setDrawing(draw);
    map.once(L.Draw.Event.CREATED, (e) => {
      draw.disable();
      setDrawing(null);
      const coords = e.layer.getLatLngs()[0].map((ll) => [ll.lat, ll.lng]);
      setNewData({ name: '', color: randomColor(), coords });
      setShowDialog(true);
    });
  };

  const undoLast = () => {
    if (drawing) {
      drawing.deleteLastVertex();
    }
  };

  const saveGeofence = () => {
    fetch('/api/geofences.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: newData.name,
        color: newData.color,
        coordinates: JSON.stringify(newData.coords),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setGeofences([
          ...geofences,
          { id: data.id, name: newData.name, color: newData.color, coordinates: newData.coords },
        ]);
        setShowDialog(false);
        showToast('Geofence saved');
      })
      .catch(() => showToast('Error saving'));
  };

  const deleteSelected = () => {
    if (!selected) return;
    if (!window.confirm('Delete selected geofence?')) return;
    fetch(`/api/geofences.php?id=${selected}`, { method: 'DELETE' })
      .then((res) => res.json())
      .then(() => {
        setGeofences(geofences.filter((g) => g.id !== selected));
        setSelected(null);
        showToast('Geofence deleted');
      })
      .catch(() => showToast('Delete failed'));
  };

  return (
    <div className="flex h-full relative">
      <div className="flex flex-col flex-1">
        <div className="mb-2 space-x-2">
          <button className="px-2 py-1 bg-blue-600 rounded" onClick={startDrawing}>
            New Geofence
          </button>
          {drawing && (
            <button className="px-2 py-1 bg-gray-600 rounded" onClick={undoLast}>
              Undo
            </button>
          )}
          <button
            className="px-2 py-1 bg-red-600 rounded disabled:opacity-50"
            onClick={deleteSelected}
            disabled={!selected}
          >
            Delete
          </button>
        </div>
        <div className="flex-1">
          <MapContainer
            center={[-26.11351258111618, 28.139693428835592]}
            zoom={18}
            style={{ height: '100%', width: '100%' }}
            whenCreated={(map) => {
              mapRef.current = map;
            }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {geofences.map((g) => (
              <Polygon
                key={g.id}
                positions={g.coordinates}
                pathOptions={{
                  color: g.color,
                  fillColor: g.color,
                  fillOpacity: 0.4,
                  weight: selected === g.id ? 4 : 2,
                }}
                eventHandlers={{
                  click: () => setSelected(g.id),
                }}
              />
            ))}
          </MapContainer>
        </div>
      </div>
      <div className="w-48 ml-2 overflow-y-auto">
        <h3 className="font-semibold mb-2">Geofences</h3>
        <ul>
          {geofences.map((g) => (
            <li
              key={g.id}
              className={`cursor-pointer mb-1 p-1 rounded ${
                selected === g.id ? 'bg-white/20' : ''
              }`}
              onClick={() => setSelected(g.id)}
            >
              <span
                className="inline-block w-3 h-3 mr-2"
                style={{ backgroundColor: g.color }}
              ></span>
              {g.name}
            </li>
          ))}
        </ul>
      </div>
      {showDialog && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white text-black p-4 rounded space-y-2">
            <div>
              <label className="block text-sm">Name</label>
              <input
                className="border p-1 w-full"
                value={newData.name}
                onChange={(e) => setNewData({ ...newData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm">Color</label>
              <input
                type="color"
                value={newData.color}
                onChange={(e) => setNewData({ ...newData, color: e.target.value })}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button className="px-2 py-1 bg-gray-300" onClick={() => setShowDialog(false)}>
                Cancel
              </button>
              <button
                className="px-2 py-1 bg-green-600 text-white disabled:opacity-50"
                onClick={saveGeofence}
                disabled={!newData.name}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      {toast && (
        <div className="absolute bottom-2 right-2 bg-gray-800 text-white px-3 py-1 rounded">
          {toast}
        </div>
      )}
    </div>
  );
}

