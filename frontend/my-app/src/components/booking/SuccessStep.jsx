export default function SuccessStep({ booking }) {
  return (
    <div className="max-w-xl mx-auto px-6 py-24 text-center">
      <span className="font-mono text-xs text-circuit tracking-widest uppercase">Booking confirmed</span>
      <h1 className="font-display text-3xl font-semibold mt-3 mb-8">
        You are all set.
      </h1>
      <div className="border border-line p-6 mb-8">
        <p className="text-sm text-muted mb-1">Booking Reference</p>
        <p className="font-mono text-2xl text-indigo">{booking.bookingId}</p>
      </div>
      <a href="/track-repair" className="bg-signal text-white px-6 py-3 font-medium hover:bg-orange-600 transition inline-block">
        Track your repair
      </a>
    </div>
  );
}