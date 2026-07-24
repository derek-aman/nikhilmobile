import { ClerkProvider } from '@clerk/nextjs';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/layout/Header';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <CartProvider>
            <Header />
            {children}
          </CartProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}