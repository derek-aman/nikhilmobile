export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-paper border-b border-line">
      <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="mono text-xs text-indigo tracking-widest uppercase">
            Fig. 01 — Diagnostic overview
          </span>
          <h1 className="font-display text-5xl md:text-6xl font-semibold mt-4 leading-[1.05]">
            Every phone tells<br />a story. We fix<br />the broken parts.
          </h1>
          <p className="text-muted mt-6 text-lg max-w-md">
            Certified diagnostics, transparent pricing, same-day repairs.
            Book online or walk in.
          </p>
          <div className="flex gap-4 mt-8">
            <a href="/book-repair" className="bg-signal text-white px-6 py-3 font-medium hover:bg-orange-600 transition">
              Book a diagnosis
            </a>
            <a href="/services" className="border border-ink px-6 py-3 font-medium hover:bg-ink hover:text-white transition">
              View services
            </a>
          </div>
        </div>

        <div className="relative">
          <PhoneSchematic />
        </div>
      </div>
    </section>
  );
}

function PhoneSchematic() {
  return (
    <svg viewBox="0 0 400 500" className="w-full max-w-sm mx-auto">
      <rect x="130" y="60" width="140" height="280" rx="14" fill="none" stroke="var(--color-ink)" strokeWidth="2" />
      <rect x="145" y="80" width="110" height="220" fill="none" stroke="var(--color-line)" strokeWidth="1.5" />

      <line x1="270" y1="90" x2="340" y2="90" stroke="var(--color-line)" strokeDasharray="3 3" />
      <circle cx="340" cy="90" r="2" fill="var(--color-indigo)" />
      <text x="345" y="86" className="mono" fontSize="10" fill="var(--color-indigo)">01 SCREEN</text>
      <text x="345" y="100" className="mono" fontSize="10" fill="var(--color-text-muted)">$79 – $349</text>

      <line x1="270" y1="180" x2="340" y2="180" stroke="var(--color-line)" strokeDasharray="3 3" />
      <circle cx="340" cy="180" r="2" fill="var(--color-circuit)" />
      <text x="345" y="176" className="mono" fontSize="10" fill="var(--color-circuit)">02 BATTERY</text>
      <text x="345" y="190" className="mono" fontSize="10" fill="var(--color-text-muted)">$39 – $89</text>

      <line x1="130" y1="270" x2="60" y2="270" stroke="var(--color-line)" strokeDasharray="3 3" />
      <circle cx="60" cy="270" r="2" fill="var(--color-signal)" />
      <text x="20" y="266" className="mono" fontSize="10" fill="var(--color-signal)">03 PORT</text>
      <text x="20" y="280" className="mono" fontSize="10" fill="var(--color-text-muted)">$49 – $99</text>

      <line x1="130" y1="120" x2="60" y2="120" stroke="var(--color-line)" strokeDasharray="3 3" />
      <circle cx="60" cy="120" r="2" fill="var(--color-indigo)" />
      <text x="20" y="116" className="mono" fontSize="10" fill="var(--color-indigo)">04 CAMERA</text>
    </svg>
  );
}