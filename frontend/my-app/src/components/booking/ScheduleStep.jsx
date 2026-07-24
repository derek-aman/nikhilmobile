export default function ScheduleStep({ booking, setBooking, onNext, onBack }) {
  const timeSlots = ['10:00', '11:00', '13:00', '14:00', '15:30', '17:00'];
  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div>
      <h2 className="font-display text-xl font-semibold mb-5">Pick a date & time</h2>

      <label className="block text-sm font-medium mb-2">Date</label>
      <input
        type="date"
        min={minDate}
        value={booking.date}
        onChange={(e) => setBooking({ ...booking, date: e.target.value })}
        className="border border-line px-4 py-3 mb-6 w-full sm:w-auto"
      />

      <label className="block text-sm font-medium mb-2">Time slot</label>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-8">
        {timeSlots.map((slot) => (
          <button
            key={slot}
            onClick={() => setBooking({ ...booking, timeSlot: slot })}
            className={`py-2 font-mono text-sm border transition-colors ${
              booking.timeSlot === slot ? 'border-indigo bg-indigo text-white' : 'border-line hover:border-ink'
            }`}
          >
            {slot}
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="border border-ink px-6 py-3 font-medium hover:bg-ink hover:text-white transition">
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!booking.date || !booking.timeSlot}
          className="bg-signal text-white px-6 py-3 font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-orange-600 transition"
        >
          Continue
        </button>
      </div>
    </div>
  );
}