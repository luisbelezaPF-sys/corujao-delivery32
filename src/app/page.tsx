'use client';

import { CartProvider } from '@/lib/cart-context';
import CorujaoDelivery from '@/components/corujao-delivery';

export default function Home() {
  return (
    <CartProvider>
      <CorujaoDelivery />
    </CartProvider>
  );
}