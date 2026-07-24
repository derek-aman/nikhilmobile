'use client';

import { useSearchParams } from 'next/navigation';

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="max-w-xl mx-auto px-6 py-24 text-center">
      <span className="font-mono text-xs text-circuit tracking-widest uppercase">Order placed</span>
      <h1 className="font-display text-3xl font-semibold mt-3 mb-8">Thanks for your order.</h1>
      <div className="border border-line p-6 mb-8">
        <p className="text-sm text-muted mb-1">Order Reference</p>
        <p className="font-mono text-2xl text-indigo">{orderId}</p>
      </div>
      <p className="text-sm text-muted mb-8">Pay at pickup. We'll notify you when it's ready.</p>
      <a href="/shop" className="bg-signal text-white px-6 py-3 font-medium hover:bg-orange-600 transition inline-block">
        Continue Shopping
      </a>
    </div>
  );
}