'use client';

import Link from 'next/link';
import { useUser, SignInButton, UserButton } from '@clerk/nextjs';
import { useCart } from '@/context/CartContext';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/shop', label: 'Shop' },
  { href: '/book-repair', label: 'Book Repair' },
  { href: '/track-repair', label: 'Track Repair' },
  { href: '/contact', label: 'Contact' },
  { href: '/track-order', label: 'Track Order' },
];

export default function Header() {
  const { isSignedIn } = useUser();
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-surface/95 backdrop-blur border-b border-line">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-display text-lg font-semibold flex items-center gap-2">
          <span className="w-7 h-7 border-2 border-ink flex items-center justify-center text-xs">F</span>
          FixIt Mobile
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-ink hover:text-indigo transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/cart" className="relative">
            <span className="text-sm font-medium border border-ink px-3 py-2 hover:bg-ink hover:text-white transition-colors inline-block">
              Cart
            </span>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-signal text-white text-xs font-mono w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
          {!isSignedIn && (
            <SignInButton mode="modal">
              <button className="text-sm font-medium border border-ink px-4 py-2 hover:bg-ink hover:text-white transition-colors">
                Sign in
              </button>
            </SignInButton>
          )}
          {isSignedIn && <UserButton afterSignOutUrl="/" />}
          <Link href="/book-repair" className="hidden sm:block bg-signal text-white text-sm font-medium px-5 py-2 hover:bg-orange-600 transition-colors">
            Book Now
          </Link>
        </div>
      </div>
    </header>
  );
}