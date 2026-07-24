'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminFetch, clearAdminToken } from '@/lib/adminAuth';

export default function AdminDashboardPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    adminFetch(`/appointments?date=${today}`)
      .then((data) => setAppointments(data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const stats = {
    today: appointments.length,
    booked: appointments.filter((a) => a.status === 'BOOKED').length,
    inRepair: appointments.filter((a) => a.status === 'IN_REPAIR').length,
    ready: appointments.filter((a) => a.status === 'READY_FOR_PICKUP').length
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <span className="font-mono text-xs text-indigo tracking-widest uppercase">
            Fig. 06 — Admin overview
          </span>
          <h1 className="font-display text-3xl font-semibold mt-2">Dashboard</h1>
        </div>
        <button
          onClick={() => { clearAdminToken(); window.location.href = '/admin/login'; }}
          className="text-sm font-medium border border-ink px-4 py-2 hover:bg-ink hover:text-white transition"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Today's Bookings", value: stats.today },
          { label: 'Booked', value: stats.booked },
          { label: 'In Repair', value: stats.inRepair },
          { label: 'Ready for Pickup', value: stats.ready }
        ].map((stat) => (
          <div key={stat.label} className="border border-line p-5">
            <p className="font-mono text-3xl text-indigo">{loading ? '—' : stat.value}</p>
            <p className="text-sm text-muted mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <Link
        href="/admin/appointments"
        className="inline-block bg-signal text-white px-6 py-3 font-medium hover:bg-orange-600 transition"
      >
        Manage Appointments →
      </Link>
    </div>
  );
}