import { MapContainer, TileLayer, Polygon, FeatureGroup, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';
import { useEffect, useRef, useState } from 'react';
import { getGeofences, createGeofence, deleteGeofence } from '../api/geofences';

const CENTER = [-26.11351258111618, 28.139693428835592];

export default function GeofenceMap() {
  const [map, setMap] = useState(null);
  const [geofences, setGeofences] = useState([]);
  const [draft, setDraft] = useState(null); // {layer, name, color}
  const groupRef = useRef();

  useEffect(() => {
    getGeofences().then(setGeofences).catch(() => {});
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') {
        if (draft) cancelDraft();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [draft]);

  const startDrawing = () => {
    if (!map) return;
    const drawer = new L.Draw.Polygon(map, { showArea: false });
    drawer.enable();
    map.dragging.disable();
    const onCreated = (e) => {
      drawer.disable();
      map.dragging.enable();
      map.off(L.Draw.Event.CREATED, onCreated);
      groupRef.current.addLayer(e.layer);
      setDraft({ layer: e.layer, name: '', color: '#ff0000' });
    };
    map.on(L.Draw.Event.CREATED, onCreated);
  };

  const cancelDraft = () => {
    if (draft) {
      groupRef.current.removeLayer(draft.layer);
      setDraft(null);
    }
  };

  const saveDraft = async () => {
    if (!draft) return;
    const latlngs = draft.layer.getLatLngs()[0];
    if (latlngs.length < 3) {
      alert('Please add at least 3 points');
      return;
    }
    let coords = latlngs.map((p) => [p.lng, p.lat]);
    const first = coords[0];
    const last = coords[coords.length - 1];
    if (first[0] !== last[0] || first[1] !== last[1]) coords.push(first);
    try {
      const newFence = await createGeofence({
        name: draft.name,
        color: draft.color,
        coordinates: { type: 'Polygon', coordinates: [coords] },
      });
      setGeofences((f) => [...f, newFence]);
      setDraft(null);
    } catch {
      alert('Error saving geofence');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this geofence?')) return;
    try {
      await deleteGeofence(id);
      setGeofences((f) => f.filter((g) => g.id !== id));
    } catch {
      alert('Error deleting geofence');
    }
  };

  const polygonPositions = (geo) => geo.coordinates[0].map(([lng, lat]) => [lat, lng]);

  return (
    <div className="relative w-full h-full">
      <button
        className="absolute z-[1000] top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded"
        onClick={startDrawing}
      >
        New Geofence
      </button>
      {draft && (
        <div className="absolute z-[1000] top-12 left-2 bg-white text-black p-2 rounded shadow w-40">
          <label className="block text-sm">Name</label>
          <input
            className="w-full border mb-1 p-1 text-sm"
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
          />
          <label className="block text-sm">Color</label>
          <input
            type="color"
            className="w-full mb-2"
            value={draft.color}
            onChange={(e) => setDraft({ ...draft, color: e.target.value })}
          />
          <div className="flex justify-end gap-2 text-sm">
            <button onClick={cancelDraft}>Cancel</button>
            <button
              className="bg-blue-500 text-white px-2 rounded"
              onClick={saveDraft}
            >
              Save
            </button>
          </div>
        </div>
      )}
      <MapContainer center={CENTER} zoom={13} whenCreated={setMap} className="h-full w-full">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <FeatureGroup ref={groupRef}>
          {geofences.map((g) => (
            <Polygon
              key={g.id}
              positions={polygonPositions(g.coordinates)}
              pathOptions={{ color: g.color, fillColor: g.color, fillOpacity: 0.2 }}
            >
              <Popup>
                <div>
                  <div className="font-semibold">{g.name}</div>
                  <button
                    className="mt-2 text-red-600"
                    onClick={() => handleDelete(g.id)}
                  >
                    Delete
                  </button>
                </div>
              </Popup>
            </Polygon>
          ))}
        </FeatureGroup>
      </MapContainer>
    </div>
  );
}
