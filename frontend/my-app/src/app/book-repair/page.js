'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { apiFetch } from '@/lib/api';
import DeviceStep from '@/components/booking/DeviceStep';
import ServicesStep from '@/components/booking/ServicesStep';
import ScheduleStep from '@/components/booking/ScheduleStep';
import ConfirmStep from '@/components/booking/ConfirmStep';
import SuccessStep from '@/components/booking/SuccessStep';

const STEPS = ['Device', 'Services', 'Schedule', 'Confirm'];

export default function BookRepairPage() {
  const { getToken, isSignedIn } = useAuth();
  const [step, setStep] = useState(0);
  const [devices, setDevices] = useState([]);
  const [services, setServices] = useState([]);
  const [booking, setBooking] = useState({
    deviceId: '',
    serviceIds: [],
    date: '',
    timeSlot: ''
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apiFetch('/devices').then(setDevices).catch(() => {});
    apiFetch('/services?activeOnly=true').then(setServices).catch(() => {});
  }, []);

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const selectedServices = services.filter((s) => booking.serviceIds.includes(s._id));
  const estimatedCost = selectedServices.reduce((sum, s) => sum + s.priceMin, 0);

  const handleSubmit = async () => {
    if (!isSignedIn) {
      setError('Please sign in to book a repair.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const token = await getToken();
      const res = await apiFetch('/appointments', {
        method: 'POST',
        headers: {'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(booking)
      });
      setResult(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (result) return <SuccessStep booking={result} />;

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <span className="font-mono text-xs text-indigo tracking-widest uppercase">
        Fig. 03 — Book a repair
      </span>
      <h1 className="font-display text-4xl font-semibold mt-3 mb-10">
        Schedule your repair
      </h1>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-12">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2 flex-1">
            <div className={`w-7 h-7 flex items-center justify-center text-xs font-mono border-2 ${
              i <= step ? 'border-indigo bg-indigo text-white' : 'border-line text-muted'
            }`}>
              {String(i + 1).padStart(2, '0')}
            </div>
            <span className={`text-sm font-medium hidden sm:block ${i <= step ? 'text-ink' : 'text-muted'}`}>
              {label}
            </span>
            {i < STEPS.length - 1 && <div className="flex-1 h-px bg-line" />}
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-6 p-3 border border-signal text-signal text-sm font-mono">
          {error}
        </div>
      )}

      {step === 0 && (
        <DeviceStep devices={devices} booking={booking} setBooking={setBooking} onNext={next} />
      )}
      {step === 1 && (
        <ServicesStep services={services} booking={booking} setBooking={setBooking} onNext={next} onBack={back} />
      )}
      {step === 2 && (
        <ScheduleStep booking={booking} setBooking={setBooking} onNext={next} onBack={back} />
      )}
      {step === 3 && (
        <ConfirmStep
          booking={booking}
          device={devices.find((d) => d._id === booking.deviceId)}
          services={selectedServices}
          estimatedCost={estimatedCost}
          onBack={back}
          onSubmit={handleSubmit}
          loading={loading}
        />
      )}
    </div>
  );
}