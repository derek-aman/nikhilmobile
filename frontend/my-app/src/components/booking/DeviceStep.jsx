export default function DeviceStep({ devices, booking, setBooking, onNext }) {
  return (
    <div>
      <h2 className="font-display text-xl font-semibold mb-5">Select your device</h2>
      <div className="grid sm:grid-cols-2 gap-3 mb-8">
        {devices.map((device) => (
          <button
            key={device._id}
            onClick={() => setBooking({ ...booking, deviceId: device._id })}
            className={`text-left p-4 border transition-colors ${
              booking.deviceId === device._id
                ? 'border-indigo bg-indigo/5'
                : 'border-line hover:border-ink'
            }`}
          >
            <p className="font-medium">{device.brand}</p>
            <p className="text-sm text-muted">{device.model}</p>
          </button>
        ))}
      </div>
      <button
        onClick={onNext}
        disabled={!booking.deviceId}
        className="bg-signal text-white px-6 py-3 font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-orange-600 transition"
      >
        Continue
      </button>
    </div>
  );
}