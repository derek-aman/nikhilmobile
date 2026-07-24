'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { useCart } from '@/context/CartContext';

const CATEGORIES = [
  { key: '', label: 'All' },
  { key: 'ACCESSORY', label: 'Accessories' },
  { key: 'SPARE_PART', label: 'Spare Parts' },
  { key: 'SKIN', label: 'Skins' },
  { key: 'CHARGER', label: 'Chargers' },
  { key: 'CABLE', label: 'Cables' },
  { key: 'CASE', label: 'Cases' },
  { key: 'EARPHONE', label: 'Earphones' },
  { key: 'OTHER', label: 'Other' }
];

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ activeOnly: 'true' });
    if (category) params.set('category', category);
    if (search) params.set('search', search);

    apiFetch(`/products?${params}`)
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [category, search]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <span className="font-mono text-xs text-indigo tracking-widest uppercase">
        Fig. 10 — Parts &amp; Accessories
      </span>
      <h1 className="font-display text-4xl font-semibold mt-3 mb-8">Shop</h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-line px-4 py-3"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-10">
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            onClick={() => setCategory(c.key)}
            className={`px-4 py-2 text-sm font-mono border transition-colors ${
              category === c.key ? 'border-indigo bg-indigo text-white' : 'border-line hover:border-ink'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {loading && <p className="text-muted">Loading...</p>}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {products.map((product) => (
          <div key={product._id} className="border border-line bg-surface p-4 flex flex-col">
            <div className="aspect-square bg-paper border border-line mb-3 flex items-center justify-center">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <span className="font-mono text-xs text-muted">No image</span>
              )}
            </div>
            <p className="text-xs font-mono text-muted uppercase mb-1">{product.category.replace('_', ' ')}</p>
            <h3 className="font-medium mb-1 line-clamp-2">{product.name}</h3>
            {product.compatibleWith && (
              <p className="text-xs text-muted mb-2">Fits: {product.compatibleWith}</p>
            )}
            <p className="font-mono text-lg text-indigo mb-3 mt-auto">${product.price}</p>
            <button
              onClick={() => addToCart(product)}
              disabled={product.stock === 0}
              className="w-full bg-signal text-white py-2 text-sm font-medium hover:bg-orange-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        ))}
      </div>

      {!loading && products.length === 0 && (
        <p className="text-muted">No products found.</p>
      )}
    </div>
  );
}