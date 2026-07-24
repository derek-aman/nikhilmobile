'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { useCart } from '@/context/CartContext';
import { apiFetch } from '@/lib/api';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, clearCart, totalAmount } = useCart();
  const { getToken, isSignedIn } = useAuth();
  const router = useRouter();
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async () => {
    if (!isSignedIn) {
      setError('Please sign in to place an order.');
      return;
    }
    setPlacing(true);
    setError('');
    try {
      const token = await getToken();
      const res = await apiFetch('/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity }))
        })
      });
      clearCart();
      router.push(`/order-confirmation?orderId=${res.orderId}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <p className="text-muted mb-6">Your cart is empty.</p>
        <a href="/shop" className="bg-signal text-white px-6 py-3 font-medium hover:bg-orange-600 transition inline-block">
          Browse Shop
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <span className="font-mono text-xs text-indigo tracking-widest uppercase">
        Fig. 11 — Your cart
      </span>
      <h1 className="font-display text-4xl font-semibold mt-3 mb-10">Cart</h1>

      <div className="space-y-3 mb-8">
        {items.map((item) => (
          <div key={item.productId} className="border border-line p-4 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-[150px]">
              <p className="font-medium">{item.name}</p>
              <p className="font-mono text-sm text-indigo">${item.price}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                className="w-8 h-8 border border-line hover:border-ink transition"
              >
                −
              </button>
              <span className="font-mono w-8 text-center">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                className="w-8 h-8 border border-line hover:border-ink transition"
              >
                +
              </button>
            </div>

            <p className="font-mono w-20 text-right">${(item.price * item.quantity).toFixed(2)}</p>

            <button
              onClick={() => removeFromCart(item.productId)}
              className="text-signal text-sm font-mono hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="border-t border-line pt-6 flex justify-between items-center mb-8">
        <span className="font-display text-xl font-semibold">Total</span>
        <span className="font-mono text-2xl text-indigo">${totalAmount.toFixed(2)}</span>
      </div>

      {error && (
        <div className="p-3 border border-signal text-signal text-sm font-mono mb-6">
          {error}
        </div>
      )}

      <button
        onClick={handleCheckout}
        disabled={placing}
        className="w-full bg-signal text-white py-4 font-medium hover:bg-orange-600 transition disabled:opacity-60"
      >
        {placing ? 'Placing order...' : 'Place Order (Pay on Pickup)'}
      </button>
    </div>
  );
}