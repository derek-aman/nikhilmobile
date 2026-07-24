'use client';

import { useEffect, useState } from 'react';
import { adminFetch } from '@/lib/adminAuth';

const emptyForm = { brand: '', model: '' };

export default function AdminDevicesPage() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    adminFetch('/devices').then((data) => setDevices(data || [])).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError('');
    setShowModal(true);
  };

  const openEdit = (device) => {
    setForm({ brand: device.brand, model: device.model });
    setEditingId(device._id);
    setError('');
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editingId) {
        await adminFetch(`/devices/${editingId}`, { method: 'PUT', body: JSON.stringify(form) });
      } else {
        await adminFetch('/devices', { method: 'POST', body: JSON.stringify(form) });
      }
      setShowModal(false);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this device?')) return;
    try {
      await adminFetch(`/devices/${id}`, { method: 'DELETE' });
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  // group by brand for cleaner display
  const grouped = devices.reduce((acc, d) => {
    if (!acc[d.brand]) acc[d.brand] = [];
    acc[d.brand].push(d);
    return acc;
  }, {});

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="font-mono text-xs text-indigo tracking-widest uppercase">
            Fig. 09 — Device registry
          </span>
          <h1 className="font-display text-3xl font-semibold mt-2">Devices</h1>
        </div>
        <button
          onClick={openAdd}
          className="bg-signal text-white px-5 py-3 font-medium hover:bg-orange-600 transition"
        >
          + Add Device
        </button>
      </div>

      {loading && <p className="text-muted">Loading...</p>}

      {Object.entries(grouped).map(([brand, items]) => (
        <div key={brand} className="mb-8">
          <h2 className="font-mono text-sm text-muted uppercase tracking-wide mb-3 pb-2 border-b border-line">
            {brand}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {items.map((device) => (
              <div key={device._id} className="border border-line p-4 flex items-center justify-between">
                <p className="font-medium">{device.model}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(device)}
                    className="text-xs font-mono border border-ink px-3 py-1.5 hover:bg-ink hover:text-white transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(device._id)}
                    className="text-xs font-mono border border-signal text-signal px-3 py-1.5 hover:bg-signal hover:text-white transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {!loading && devices.length === 0 && (
        <p className="text-muted">No devices yet. Add your first one.</p>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-ink/50 flex items-center justify-center p-6 z-50">
          <div className="bg-surface max-w-md w-full p-6">
            <h2 className="font-display text-xl font-semibold mb-5">
              {editingId ? 'Edit Device' : 'Add New Device'}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Brand *</label>
                <input
                  type="text" required value={form.brand}
                  placeholder="e.g. Apple, Samsung, OnePlus"
                  onChange={(e) => setForm({ ...form, brand: e.target.value })}
                  className="w-full border border-line px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Model *</label>
                <input
                  type="text" required value={form.model}
                  placeholder="e.g. iPhone 15 Pro Max"
                  onChange={(e) => setForm({ ...form, model: e.target.value })}
                  className="w-full border border-line px-3 py-2"
                />
              </div>

              {error && (
                <div className="p-2 border border-signal text-signal text-sm font-mono">{error}</div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 border border-ink py-3 font-medium hover:bg-ink hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-signal text-white py-3 font-medium hover:bg-orange-600 transition disabled:opacity-60"
                >
                  {saving ? 'Saving...' : editingId ? 'Update Device' : 'Add Device'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}