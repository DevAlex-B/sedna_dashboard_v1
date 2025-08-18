import { MapContainer, TileLayer, Polygon, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import { useEffect, useRef, useState } from 'react';

// Ensure Leaflet is available globally for plugins like Geoman
window.L = L;
import {
  getGeofences,
  createGeofence,
  updateGeofence,
  deleteGeofence,
} from '../api/geofences';

const CENTER = [-26.11351258111618, 28.139693428835592];

export default function GeofenceMap() {
  const [geofences, setGeofences] = useState([]);
  const [draft, setDraft] = useState(null); // {layer, name, color}
  const [editing, setEditing] = useState(false);
  const [removing, setRemoving] = useState(false);
  const mapRef = useRef();

  useEffect(() => {
    getGeofences().then(setGeofences).catch(() => {});
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') {
        if (draft) cancelDraft();
        if (editing) toggleEdit();
        if (removing) toggleRemove();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [draft, editing, removing]);

  const startDrawing = () => {
    const map = mapRef.current;
    if (!map || !map.pm) return;
    if (editing) toggleEdit();
    if (removing) toggleRemove();
    map.pm.enableDraw('Polygon');
  };

  const toggleEdit = () => {
    const map = mapRef.current;
    if (!map || !map.pm) return;
    if (removing) {
      map.pm.disableGlobalRemovalMode();
      setRemoving(false);
    }
    if (editing) {
      map.pm.disableGlobalEditMode();
    } else {
      map.pm.enableGlobalEditMode();
    }
    setEditing(!editing);
  };

  const toggleRemove = () => {
    const map = mapRef.current;
    if (!map || !map.pm) return;
    if (editing) {
      map.pm.disableGlobalEditMode();
      setEditing(false);
    }
    if (removing) {
      map.pm.disableGlobalRemovalMode();
    } else {
      map.pm.enableGlobalRemovalMode();
    }
    setRemoving(!removing);
  };

  const handleCreate = (e) => {
    const layer = e.layer;
    layer.setStyle({ color: '#ff0000', fillColor: '#ff0000', fillOpacity: 0.2 });
    setDraft({ layer, name: '', color: '#ff0000' });
  };

  const cancelDraft = () => {
    if (draft) {
      draft.layer.remove();
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
      draft.layer.remove();
      setDraft(null);
    } catch {
      alert('Error saving geofence');
    }
  };

  const handleEdit = async (e) => {
    const layer = e.layer;
    const id = layer.geofenceId;
    if (!id) return;
    const latlngs = layer.getLatLngs()[0];
    let coords = latlngs.map((p) => [p.lng, p.lat]);
    const first = coords[0];
    const last = coords[coords.length - 1];
    if (first[0] !== last[0] || first[1] !== last[1]) coords.push(first);
    try {
      const updated = await updateGeofence(id, {
        coordinates: { type: 'Polygon', coordinates: [coords] },
      });
      setGeofences((f) =>
        f.map((g) => (g.id === id ? { ...g, coordinates: updated.coordinates } : g))
      );
    } catch {
      alert('Error updating geofence');
    }
  };

  const handleRemove = async (e) => {
    const layer = e.layer;
    const id = layer.geofenceId;
    if (!id) return;
    if (!window.confirm('Delete this geofence?')) {
      mapRef.current.addLayer(layer);
      return;
    }
    try {
      await deleteGeofence(id);
      setGeofences((f) => f.filter((g) => g.id !== id));
    } catch {
      alert('Error deleting geofence');
      mapRef.current.addLayer(layer);
    }
  };

  const polygonPositions = (geo) =>
    geo.coordinates[0].map(([lng, lat]) => [lat, lng]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.pm) return;
    map.on('pm:create', handleCreate);
    map.on('pm:edit', handleEdit);
    map.on('pm:remove', handleRemove);
    map.pm.addControls({
      position: 'topright',
      drawMarker: false,
      drawCircle: false,
      drawPolyline: false,
      drawRectangle: false,
      drawCircleMarker: false,
      drawPolygon: false,
      editMode: false,
      dragMode: false,
      cutPolygon: false,
      removalMode: false,
      rotateMode: false,
    });
    return () => {
      map.off('pm:create', handleCreate);
      map.off('pm:edit', handleEdit);
      map.off('pm:remove', handleRemove);
    };
  }, [mapRef.current]);

  return (
    <div className="relative w-full h-full">
      <div className="absolute z-[1000] top-2 right-2 flex flex-col gap-2">
        <button
          className="bg-blue-500 text-white px-2 py-1 rounded"
          onClick={startDrawing}
        >
          New Geofence
        </button>
        <button
          className="bg-blue-500 text-white px-2 py-1 rounded"
          onClick={toggleEdit}
        >
          {editing ? 'Finish Edit' : 'Edit'}
        </button>
        <button
          className="bg-blue-500 text-white px-2 py-1 rounded"
          onClick={toggleRemove}
        >
          {removing ? 'Finish Delete' : 'Delete'}
        </button>
      </div>
      {draft && (
        <div className="absolute z-[1000] top-2 left-2 bg-white text-black p-2 rounded shadow w-40">
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
            onChange={(e) => {
              draft.layer.setStyle({
                color: e.target.value,
                fillColor: e.target.value,
                fillOpacity: 0.2,
              });
              setDraft({ ...draft, color: e.target.value });
            }}
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
      <MapContainer
        center={CENTER}
        zoom={13}
        className="h-full w-full"
        whenCreated={(map) => {
          mapRef.current = map;
        }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {geofences.map((g) => (
          <Polygon
            key={g.id}
            positions={polygonPositions(g.coordinates)}
            pathOptions={{
              color: g.color,
              fillColor: g.color,
              fillOpacity: 0.2,
            }}
            ref={(layer) => {
              if (layer) layer.geofenceId = g.id;
            }}
          >
            <Popup>
              <div className="font-semibold">{g.name}</div>
            </Popup>
          </Polygon>
        ))}
      </MapContainer>
    </div>
  );
}

