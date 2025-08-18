export async function getGeofences() {
  const res = await fetch('/api/geofences');
  if (!res.ok) throw new Error('Failed to load');
  return res.json();
}

export async function createGeofence(data) {
  const res = await fetch('/api/geofences', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create');
  return res.json();
}

export async function updateGeofence(id, data) {
  const res = await fetch(`/api/geofences/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update');
  return res.json();
}

export async function deleteGeofence(id) {
  const res = await fetch(`/api/geofences/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete');
  return res.json();
}
