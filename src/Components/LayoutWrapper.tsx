'use client';

import { useEffect } from 'react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { usePathname } from 'next/navigation';
import { refreshScroll } from 'lib/gsap';

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {

  const pathname = usePathname();

  const isAdmin = pathname?.startsWith('/admin');
  const isLogin = pathname?.startsWith('/login');

  // 🔥 FIX: ensure ScrollTrigger recalculates after route changes
  useEffect(() => {
    const t = setTimeout(() => {
      refreshScroll();
    }, 100);

    return () => clearTimeout(t);
  }, [pathname]);

  return (
    <>
      {!isAdmin && !isLogin && <Navbar />}
      {children}
      {!isAdmin && !isLogin && <Footer />}
    </>
  );
}