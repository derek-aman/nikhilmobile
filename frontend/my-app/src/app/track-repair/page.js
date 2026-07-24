'use client';

import { useState } from 'react';
import { apiFetch } from '@/lib/api';

const STATUS_STEPS = [
  { key: 'BOOKED', label: 'Booked' },
  { key: 'IN_REPAIR', label: 'In Repair' },
  { key: 'WAITING_FOR_PARTS', label: 'Waiting for Parts' },
  { key: 'READY_FOR_PICKUP', label: 'Ready for Pickup' },
  { key: 'DELIVERED', label: 'Delivered' }
];

export default function TrackRepairPage() {
  const [bookingId, setBookingId] = useState('');
  const [appointment, setAppointment] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setAppointment(null);
    try {
      const res = await apiFetch(`/appointments/${bookingId.trim().toUpperCase()}`);
      setAppointment(res);
    } catch (err) {
      setError('Booking not found. Check your reference ID and try again.');
    } finally {
      setLoading(false);
    }
  };

  const isCancelled = appointment?.status === 'CANCELLED';
  const currentStepIndex = STATUS_STEPS.findIndex((s) => s.key === appointment?.status);

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <span className="font-mono text-xs text-indigo tracking-widest uppercase">
        Fig. 04 — Repair status
      </span>
      <h1 className="font-display text-4xl font-semibold mt-3 mb-10">
        Track your repair
      </h1>

      <form onSubmit={handleSearch} className="flex gap-3 mb-10">
        <input
          type="text"
          value={bookingId}
          onChange={(e) => setBookingId(e.target.value)}
          placeholder="e.g. FIX-960936"
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

      {appointment && (
        <div>
          <div className="border border-line p-5 mb-8 font-mono text-sm space-y-3">
            <div className="flex justify-between">
              <span className="text-muted">Booking Reference</span>
              <span className="text-indigo">{appointment.bookingId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Device</span>
              <span>{appointment.deviceId?.brand} {appointment.deviceId?.model}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Services</span>
              <span className="text-right">
                {appointment.serviceIds?.map((s) => s.name).join(', ')}
              </span>
            </div>
            <div className="flex justify-between border-t border-line pt-3 text-indigo text-base">
              <span>Estimated cost</span>
              <span>${appointment.estimatedCost}</span>
            </div>
          </div>

          <h2 className="font-display text-lg font-semibold mb-6">Repair Timeline</h2>

          {isCancelled ? (
            <div className="p-4 border border-signal text-signal font-mono text-sm">
              This booking has been cancelled.
            </div>
          ) : (
            <div>
              {STATUS_STEPS.map((step, i) => {
                const isDone = i <= currentStepIndex;
                const isLast = i === STATUS_STEPS.length - 1;
                return (
                  <div key={step.key} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-9 h-9 flex items-center justify-center border-2 text-xs font-mono ${
                          isDone ? 'border-indigo bg-indigo text-white' : 'border-line text-muted'
                        }`}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </div>
                      {!isLast && (
                        <div className={`w-px flex-1 min-h-[2rem] ${isDone ? 'bg-indigo' : 'bg-line'}`} />
                      )}
                    </div>
                    <div className="pb-8">
                      <p className={`font-medium ${isDone ? 'text-ink' : 'text-muted'}`}>
                        {step.label}
                      </p>
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