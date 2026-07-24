'use client';

import { useEffect, useState } from 'react';
import { adminFetch } from '@/lib/adminAuth';

const CATEGORIES = ['SCREEN', 'BATTERY', 'CHARGING_PORT', 'WATER_DAMAGE', 'CAMERA', 'SPEAKER_MIC', 'SOFTWARE', 'BACK_GLASS', 'OTHER'];

const emptyForm = {
  name: '', category: 'SCREEN', description: '', priceMin: '', priceMax: '', durationMinutes: '', warranty: ''
};

export default function AdminServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    adminFetch('/services').then((data) => setServices(data || [])).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError('');
    setShowModal(true);
  };

  const openEdit = (service) => {
    setForm({
      name: service.name,
      category: service.category,
      description: service.description || '',
      priceMin: service.priceMin,
      priceMax: service.priceMax,
      durationMinutes: service.durationMinutes || '',
      warranty: service.warranty || ''
    });
    setEditingId(service._id);
    setError('');
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        priceMin: Number(form.priceMin),
        priceMax: Number(form.priceMax),
        durationMinutes: form.durationMinutes ? Number(form.durationMinutes) : undefined
      };
      if (editingId) {
        await adminFetch(`/services/${editingId}`, { method: 'PUT', body: JSON.stringify(payload) });
      } else {
        await adminFetch('/services', { method: 'POST', body: JSON.stringify(payload) });
      }
      setShowModal(false);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (id) => {
    await adminFetch(`/services/${id}/toggle`, { method: 'PATCH' });
    load();
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="font-mono text-xs text-indigo tracking-widest uppercase">
            Fig. 08 — Service catalog
          </span>
          <h1 className="font-display text-3xl font-semibold mt-2">Services</h1>
        </div>
        <button
          onClick={openAdd}
          className="bg-signal text-white px-5 py-3 font-medium hover:bg-orange-600 transition"
        >
          + Add Service
        </button>
      </div>

      {loading && <p className="text-muted">Loading...</p>}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <div key={service._id} className="relative border border-line bg-surface p-5">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-display text-lg font-semibold">{service.name}</h3>
              <button
                onClick={() => toggleActive(service._id)}
                className={`w-10 h-6 rounded-full relative transition-colors ${
                  service.isActive ? 'bg-circuit' : 'bg-line'
                }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    service.isActive ? 'translate-x-[18px]' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
            <p className="text-sm text-muted mb-3 line-clamp-2">{service.description}</p>
            <p className="font-mono text-sm text-indigo mb-1">
              ${service.priceMin}–${service.priceMax}
            </p>
            <p className="font-mono text-xs text-muted mb-4">
              ~{service.durationMinutes} min · {service.warranty}
            </p>
            <button
              onClick={() => openEdit(service)}
              className="w-full border border-ink py-2 text-sm font-medium hover:bg-ink hover:text-white transition"
            >
              Edit
            </button>
          </div>
        ))}
      </div>

      {!loading && services.length === 0 && (
        <p className="text-muted">No services yet. Add your first one.</p>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-ink/50 flex items-center justify-center p-6 z-50">
          <div className="bg-surface max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="font-display text-xl font-semibold mb-5">
              {editingId ? 'Edit Service' : 'Add New Service'}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Service Name *</label>
                <input
                  type="text" required value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-line px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Category *</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full border border-line px-3 py-2"
                >
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-line px-3 py-2"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Min Price ($) *</label>
                  <input
                    type="number" required value={form.priceMin}
                    onChange={(e) => setForm({ ...form, priceMin: e.target.value })}
                    className="w-full border border-line px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Max Price ($) *</label>
                  <input
                    type="number" required value={form.priceMax}
                    onChange={(e) => setForm({ ...form, priceMax: e.target.value })}
                    className="w-full border border-line px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Duration (min)</label>
                  <input
                    type="number" value={form.durationMinutes}
                    onChange={(e) => setForm({ ...form, durationMinutes: e.target.value })}
                    className="w-full border border-line px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Warranty</label>
                  <input
                    type="text" value={form.warranty} placeholder="e.g. 6 months"
                    onChange={(e) => setForm({ ...form, warranty: e.target.value })}
                    className="w-full border border-line px-3 py-2"
                  />
                </div>
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
                  {saving ? 'Saving...' : editingId ? 'Update Service' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}