import { apiFetch } from '@/lib/api';
import ServiceCard from '@/components/ui/services/ServiceCard';

export default async function ServicesPage() {
  const services = await apiFetch('/services?activeOnly=true');

  const grouped = services.reduce((acc, service) => {
    if (!acc[service.category]) acc[service.category] = [];
    acc[service.category].push(service);
    return acc;
  }, {});

  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <span className="font-mono text-xs text-indigo tracking-widest uppercase">
        Fig. 02 — Repair catalog
      </span>
      <h1 className="font-display text-4xl md:text-5xl font-semibold mt-3 mb-14">
        All services
      </h1>

      {Object.entries(grouped).map(([category, items]) => (
        <div key={category} className="mb-14">
          <h2 className="font-mono text-sm text-muted uppercase tracking-wide mb-5 pb-2 border-b border-line">
            {category.replace('_', ' ')}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}