'use client';

import { useEffect, useState } from 'react';
import { adminFetch } from '@/lib/adminAuth';

const STATUSES = ['PENDING', 'CONFIRMED', 'READY_FOR_PICKUP', 'COMPLETED', 'CANCELLED'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const load = () => {
    setLoading(true);
    adminFetch('/orders').then((data) => setOrders(data || [])).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id);
    try {
      await adminFetch(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
      load();
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <span className="font-mono text-xs text-indigo tracking-widest uppercase">Fig. 13 — Order log</span>
      <h1 className="font-display text-3xl font-semibold mt-2 mb-8">Orders</h1>

      {loading && <p className="text-muted">Loading...</p>}

      <div className="space-y-3">
        {orders.map((order) => (
          <div key={order._id} className="border border-line p-4">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
              <div>
                <p className="font-medium">{order.customerId?.name || 'Customer'}</p>
                <p className="font-mono text-xs text-muted">{order.orderId} · ${order.totalAmount}</p>
              </div>
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                disabled={updatingId === order._id}
                className="border border-line px-3 py-2 font-mono text-sm"
              >
                {STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
              </select>
            </div>
            <div className="text-sm text-muted space-y-1">
              {order.items.map((item, i) => (
                <p key={i} className="font-mono">
                  {item.quantity}x {item.name} — ${item.price * item.quantity}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>

      {!loading && orders.length === 0 && <p className="text-muted">No orders yet.</p>}
    </div>
  );
}