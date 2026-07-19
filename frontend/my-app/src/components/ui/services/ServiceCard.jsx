export default function ServiceCard({ service }) {
  return (
    <div className="relative border border-line bg-surface p-5 hover:border-indigo transition-colors group">
      <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-ink group-hover:border-indigo" />
      <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-ink group-hover:border-indigo" />
      <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-ink group-hover:border-indigo" />
      <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-ink group-hover:border-indigo" />

      <h3 className="font-display text-lg font-semibold mb-2">{service.name}</h3>
      <p className="text-sm text-muted mb-4 line-clamp-2">{service.description}</p>

      <div className="flex items-end justify-between">
        <div>
          <p className="font-mono text-lg text-indigo">
            ${service.priceMin} – ${service.priceMax}
          </p>
          <p className="font-mono text-xs text-muted mt-1">
            ~{service.durationMinutes} min · {service.warranty} warranty
          </p>
        </div>
      </div>
    </div>
  );
}