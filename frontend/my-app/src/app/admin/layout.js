'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAdminToken, clearAdminToken } from '@/lib/adminAuth';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/appointments', label: 'Appointments' },
  { href: '/admin/services', label: 'Services' },
  { href: '/admin/devices', label: 'Devices' },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/orders', label: 'Orders' }
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) {
      setChecked(true);
      return;
    }
    const token = getAdminToken();
    if (!token) {
      router.push('/admin/login');
    } else {
      setChecked(true);
    }
  }, [pathname, isLoginPage, router]);

  if (isLoginPage) return children;

  if (!checked) return null; // brief blank while auth check runs

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <aside className="w-56 border-r border-line bg-surface shrink-0">
        <nav className="py-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-6 py-3 text-sm font-medium border-l-2 transition-colors ${
                  isActive
                    ? 'border-indigo text-indigo bg-indigo/5'
                    : 'border-transparent text-muted hover:text-ink hover:border-line'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-6 pt-4 border-t border-line mt-4">
          <button
            onClick={() => { clearAdminToken(); router.push('/admin/login'); }}
            className="text-sm font-medium text-muted hover:text-signal transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}