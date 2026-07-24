'use client';

import { useState } from 'react';
import { apiFetch } from '@/lib/api';

const STATUS_STEPS = [
  { key: 'PENDING', label: 'Order Placed' },
  { key: 'CONFIRMED', label: 'Confirmed' },
  { key: 'READY_FOR_PICKUP', label: 'Ready for Pickup' },
  { key: 'COMPLETED', label: 'Completed' }
];

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOrder(null);
    try {
      const res = await apiFetch(`/orders/${orderId.trim().toUpperCase()}`);
      setOrder(res);
    } catch (err) {
      setError('Order not found. Check your reference ID and try again.');
    } finally {
      setLoading(false);
    }
  };

  const isCancelled = order?.status === 'CANCELLED';
  const currentStepIndex = STATUS_STEPS.findIndex((s) => s.key === order?.status);

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <span className="font-mono text-xs text-indigo tracking-widest uppercase">
        Fig. 14 — Order status
      </span>
      <h1 className="font-display text-4xl font-semibold mt-3 mb-10">
        Track your order
      </h1>

      <form onSubmit={handleSearch} className="flex gap-3 mb-10">
        <input
          type="text"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="e.g. ORD-607707"
          className="flex-1 border border-line px-4 py-3 font-mono uppercase"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-signal text-white px-6 py-3 font-medium hover:bg-orange-600 transition disabled:opacity-60"
        >
          {loading ? 'Searching...' : 'Track'}
        </button>
      </form>

      {error && (
        <div className="p-3 border border-signal text-signal text-sm font-mono mb-8">
          {error}
        </div>
      )}

      {order && (
        <div>
          <div className="border border-line p-5 mb-8 font-mono text-sm space-y-3">
            <div className="flex justify-between">
              <span className="text-muted">Order Reference</span>
              <span className="text-indigo">{order.orderId}</span>
            </div>
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between">
                <span className="text-muted">{item.quantity}x {item.name}</span>
                <span>${item.price * item.quantity}</span>
              </div>
            ))}
            <div className="flex justify-between border-t border-line pt-3 text-indigo text-base">
              <span>Total</span>
              <span>${order.totalAmount}</span>
            </div>
          </div>

          <h2 className="font-display text-lg font-semibold mb-6">Order Status</h2>

          {isCancelled ? (
            <div className="p-4 border border-signal text-signal font-mono text-sm">
              This order has been cancelled.
            </div>
          ) : (
            <div>
              {STATUS_STEPS.map((step, i) => {
                const isDone = i <= currentStepIndex;
                const isLast = i === STATUS_STEPS.length - 1;
                return (
                  <div key={step.key} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-9 h-9 flex items-center justify-center border-2 text-xs font-mono ${
                        isDone ? 'border-indigo bg-indigo text-white' : 'border-line text-muted'
                      }`}>
                        {String(i + 1).padStart(2, '0')}
                      </div>
                      {!isLast && <div className={`w-px flex-1 min-h-[2rem] ${isDone ? 'bg-indigo' : 'bg-line'}`} />}
                    </div>
                    <div className="pb-8">
                      <p className={`font-medium ${isDone ? 'text-ink' : 'text-muted'}`}>{step.label}</p>
                      {i === currentStepIndex && (
                        <p className="font-mono text-xs text-circuit mt-1">Current status</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}