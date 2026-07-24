'use client';

import { useEffect, useState } from 'react';
import { adminFetch } from '@/lib/adminAuth';

const CATEGORIES = ['ACCESSORY', 'SPARE_PART', 'SKIN', 'CHARGER', 'CABLE', 'CASE', 'EARPHONE', 'OTHER'];

const emptyForm = {
  name: '', category: 'ACCESSORY', description: '', price: '', compatibleWith: '', imageUrl: '', stock: ''
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const load = () => {
    setLoading(true);
    const params = filterCategory ? `?category=${filterCategory}` : '';
    adminFetch(`/products${params}`).then((data) => setProducts(data || [])).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(load, [filterCategory]);

  const openAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError('');
    setShowModal(true);
  };

  const openEdit = (p) => {
    setForm({
      name: p.name, category: p.category, description: p.description || '',
      price: p.price, compatibleWith: p.compatibleWith || '', imageUrl: p.imageUrl || '', stock: p.stock
    });
    setEditingId(p._id);
    setError('');
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
      if (editingId) {
        await adminFetch(`/products/${editingId}`, { method: 'PUT', body: JSON.stringify(payload) });
      } else {
        await adminFetch('/products', { method: 'POST', body: JSON.stringify(payload) });
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
    await adminFetch(`/products/${id}/toggle`, { method: 'PATCH' });
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    await adminFetch(`/products/${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="font-mono text-xs text-indigo tracking-widest uppercase">
            Fig. 12 — Product inventory
          </span>
          <h1 className="font-display text-3xl font-semibold mt-2">Products</h1>
        </div>
        <button
          onClick={openAdd}
          className="bg-signal text-white px-5 py-3 font-medium hover:bg-orange-600 transition"
        >
          + Add Product
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setFilterCategory('')}
          className={`px-3 py-1.5 text-xs font-mono border ${!filterCategory ? 'border-indigo bg-indigo text-white' : 'border-line'}`}
        >
          All
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setFilterCategory(c)}
            className={`px-3 py-1.5 text-xs font-mono border ${filterCategory === c ? 'border-indigo bg-indigo text-white' : 'border-line'}`}
          >
            {c.replace('_', ' ')}
          </button>
        ))}
      </div>

      {loading && <p className="text-muted">Loading...</p>}

      <div className="space-y-3">
        {products.map((p) => (
          <div key={p._id} className="border border-line p-4 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <p className="font-medium">{p.name}</p>
              <p className="text-xs font-mono text-muted uppercase">{p.category.replace('_', ' ')}</p>
              {p.compatibleWith && <p className="text-xs text-muted">Fits: {p.compatibleWith}</p>}
            </div>
            <p className="font-mono text-indigo w-20">${p.price}</p>
            <p className={`font-mono text-sm w-24 ${p.stock === 0 ? 'text-signal' : 'text-muted'}`}>
              Stock: {p.stock}
            </p>
            <button
              onClick={() => toggleActive(p._id)}
              className={`w-10 h-6 rounded-full relative transition-colors ${p.isActive ? 'bg-circuit' : 'bg-line'}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${p.isActive ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
            </button>
            <div className="flex gap-2">
              <button onClick={() => openEdit(p)} className="text-xs font-mono border border-ink px-3 py-1.5 hover:bg-ink hover:text-white transition">
                Edit
              </button>
              <button onClick={() => handleDelete(p._id)} className="text-xs font-mono border border-signal text-signal px-3 py-1.5 hover:bg-signal hover:text-white transition">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {!loading && products.length === 0 && <p className="text-muted">No products yet.</p>}

      {showModal && (
        <div className="fixed inset-0 bg-ink/50 flex items-center justify-center p-6 z-50">
          <div className="bg-surface max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="font-display text-xl font-semibold mb-5">
              {editingId ? 'Edit Product' : 'Add New Product'}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name *</label>
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-line px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category *</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full border border-line px-3 py-2">
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border border-line px-3 py-2" rows={2} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Price ($) *</label>
                  <input type="number" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full border border-line px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Stock *</label>
                  <input type="number" required value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="w-full border border-line px-3 py-2" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Compatible With</label>
                <input type="text" placeholder="e.g. iPhone 15 Pro Max" value={form.compatibleWith} onChange={(e) => setForm({ ...form, compatibleWith: e.target.value })} className="w-full border border-line px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Image URL</label>
                <input type="text" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="w-full border border-line px-3 py-2" />
              </div>

              {error && <div className="p-2 border border-signal text-signal text-sm font-mono">{error}</div>}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 border border-ink py-3 font-medium hover:bg-ink hover:text-white transition">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="flex-1 bg-signal text-white py-3 font-medium hover:bg-orange-600 transition disabled:opacity-60">
                  {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}