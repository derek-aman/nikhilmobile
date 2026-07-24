export default function ServicesStep({ services, booking, setBooking, onNext, onBack }) {
  const toggle = (id) => {
    const exists = booking.serviceIds.includes(id);
    setBooking({
      ...booking,
      serviceIds: exists
        ? booking.serviceIds.filter((s) => s !== id)
        : [...booking.serviceIds, id]
    });
  };

  return (
    <div>
      <h2 className="font-display text-xl font-semibold mb-5">What needs fixing?</h2>
      <div className="space-y-3 mb-8">
        {services.map((service) => (
          <label
            key={service._id}
            className={`flex items-center justify-between p-4 border cursor-pointer transition-colors ${
              booking.serviceIds.includes(service._id) ? 'border-indigo bg-indigo/5' : 'border-line'
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={booking.serviceIds.includes(service._id)}
                onChange={() => toggle(service._id)}
                className="accent-indigo w-4 h-4"
              />
              <div>
                <p className="font-medium">{service.name}</p>
                <p className="text-sm text-muted">{service.description}</p>
              </div>
            </div>
            <p className="font-mono text-sm text-indigo whitespace-nowrap ml-4">
              ${service.priceMin}–${service.priceMax}
            </p>
          </label>
        ))}
      </div>
      <div className="flex gap-3">
        <button onClick={onBack} className="border border-ink px-6 py-3 font-medium hover:bg-ink hover:text-white transition">
          Back
        </button>
        <button
          onClick={onNext}
          disabled={booking.serviceIds.length === 0}
          className="bg-signal text-white px-6 py-3 font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-orange-600 transition"
        >
          Continue
        </button>
      </div>
    </div>
  );
}