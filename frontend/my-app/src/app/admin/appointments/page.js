'use client';

import { useEffect, useState } from 'react';
import { adminFetch } from '@/lib/adminAuth';

const STATUSES = ['BOOKED', 'IN_REPAIR', 'WAITING_FOR_PARTS', 'READY_FOR_PICKUP', 'DELIVERED', 'CANCELLED'];

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const load = () => {
    setLoading(true);
    adminFetch('/appointments')
      .then((data) => setAppointments(data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id);
    try {
      await adminFetch(`/appointments/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
      load();
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <span className="font-mono text-xs text-indigo tracking-widest uppercase">
        Fig. 07 — Appointment log
      </span>
      <h1 className="font-display text-3xl font-semibold mt-2 mb-8">Appointments</h1>

      {loading && <p className="text-muted">Loading...</p>}

      <div className="space-y-3">
        {appointments.map((apt) => (
          <div key={apt._id} className="border border-line p-4 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="font-medium">
                {apt.customerId?.name || 'Customer'}
                {apt.isWalkIn && (
                  <span className="ml-2 text-xs font-mono border border-line px-2 py-0.5">Walk-in</span>
                )}
              </p>
              <p className="text-sm text-muted">
                {apt.deviceId?.brand} {apt.deviceId?.model} — {apt.serviceIds?.map((s) => s.name).join(', ')}
              </p>
              <p className="font-mono text-xs text-muted mt-1">
                {apt.date} {apt.timeSlot} · {apt.bookingId} · ${apt.estimatedCost}
              </p>
            </div>

            <select
              value={apt.status}
              onChange={(e) => handleStatusChange(apt._id, e.target.value)}
              disabled={updatingId === apt._id}
              className="border border-line px-3 py-2 font-mono text-sm"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {!loading && appointments.length === 0 && (
        <p className="text-muted">No appointments yet.</p>
      )}
    </div>
  );
}