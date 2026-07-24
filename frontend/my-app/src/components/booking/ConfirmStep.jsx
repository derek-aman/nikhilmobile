export default function ConfirmStep({ booking, device, services, estimatedCost, onBack, onSubmit, loading }) {
  return (
    <div>
      <h2 className="font-display text-xl font-semibold mb-5">Confirm your booking</h2>

      <div className="border border-line p-5 mb-8 space-y-3 font-mono text-sm">
        <div className="flex justify-between">
          <span className="text-muted">Device</span>
          <span>{device ? `${device.brand} ${device.model}` : '—'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted">Services</span>
          <span className="text-right">{services.map((s) => s.name).join(', ')}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted">Date & Time</span>
          <span>{booking.date} at {booking.timeSlot}</span>
        </div>
        <div className="flex justify-between border-t border-line pt-3 text-indigo text-base">
          <span>Estimated cost</span>
          <span>${estimatedCost}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="border border-ink px-6 py-3 font-medium hover:bg-ink hover:text-white transition">
          Back
        </button>
        <button
          onClick={onSubmit}
          disabled={loading}
          className="bg-signal text-white px-6 py-3 font-medium disabled:opacity-60 hover:bg-orange-600 transition"
        >
          {loading ? 'Booking...' : 'Confirm booking'}
        </button>
      </div>
    </div>
  );
}