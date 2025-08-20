import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Polygon, Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';

import trackDozer from '../assets/eq_icons/Track Dozer.svg';
import backhoeLoader from '../assets/eq_icons/Backhoe Loader.svg';
import dumpTruck from '../assets/eq_icons/Articulated Dump Truck.svg';
import dieselBowser from '../assets/eq_icons/Diesel Bowser.svg';
import excavator from '../assets/eq_icons/Excavator.svg';
import grader from '../assets/eq_icons/Motor Grader.svg';
import wheelLoader from '../assets/eq_icons/Wheel Loader.svg';
import pump from '../assets/eq_icons/FEL Water Load.svg';
import wheelDozer from '../assets/eq_icons/Wheel Dozer.svg';
import serviceTruck from '../assets/eq_icons/Service Truck.svg';

function randomColor() {
  return '#' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0');
}

export default function GeofenceMap({ equipment = [] }) {
  const mapRef = useRef(null);
  const [geofences, setGeofences] = useState([]);
  const [selected, setSelected] = useState(null);
  const [drawing, setDrawing] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [newData, setNewData] = useState({ name: '', color: randomColor(), coords: [] });
  const [toast, setToast] = useState('');
  const [zoom, setZoom] = useState(30);

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

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const handleZoom = () => setZoom(map.getZoom());
    map.on('zoomend', handleZoom);
    return () => {
      map.off('zoomend', handleZoom);
    };
  }, []);

  const iconMap = {
    'Track Dozer': trackDozer,
    'Backhoe Loader': backhoeLoader,
    'Dump Truck': dumpTruck,
    'Diesel Bowser': dieselBowser,
    Excavator: excavator,
    Grader: grader,
    'Wheel Loader': wheelLoader,
    Pump: pump,
    'Wheel dozer': wheelDozer,
    'Service trucks': serviceTruck,
  };

  const getIcon = (name) => {
    const baseSize = 40;
    const scale = zoom / 18;
    const size = baseSize * scale;
    const url = iconMap[name] || serviceTruck;
    return L.icon({
      iconUrl: url,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });
  };

  const startDrawing = () => {
    const map = mapRef.current;
    if (!map) return;
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
          <button className="px-2 py-1 bg-blue-600 rounded text-white" onClick={startDrawing}>
            New Geofence
          </button>
          {drawing && (
            <button className="px-2 py-1 bg-gray-600 rounded text-white" onClick={undoLast}>
              Undo
            </button>
          )}
          <button
            className="px-2 py-1 bg-red-600 rounded text-white disabled:opacity-50"
            onClick={deleteSelected}
            disabled={!selected}
          >
            Delete
          </button>
        </div>
        <div className="h-64 md:flex-1 md:h-auto rounded-lg overflow-hidden">
          <MapContainer
            center={[-26.11351258111618, 28.139693428835592]}
            zoom={18}
            style={{ height: '100%', width: '100%' }}
            ref={mapRef}
            className="h-full w-full"
          >
            <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
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
            {equipment
              .filter((e) => e.coordinate)
              .map((e, idx) => {
                const [lat, lng] = e.coordinate
                  .split(',')
                  .map((c) => parseFloat(c.trim()));
                return (
                  <Marker
                    key={`eq-${idx}`}
                    position={[lat, lng]}
                    icon={getIcon(e.equipment)}
                    zIndexOffset={1000}
                  >
                    <Tooltip direction="top" opacity={1} permanent={false}>
                      <div className="text-xs">
                        <div>{e.equipment}</div>
                        <div>Operator: {e.operator}</div>
                        <div>Status: {e.current_status}</div>
                        <div>{new Date(e.created_at).toLocaleString()}</div>
                      </div>
                    </Tooltip>
                  </Marker>
                );
              })}
          </MapContainer>
        </div>
      </div>
      {showDialog && (
        <div className="absolute inset-0 z-[1000] bg-black/50 flex items-center justify-center">
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
