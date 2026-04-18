'use client';

import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { usePathname } from 'next/navigation';

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  const isLogin = pathname?.startsWith('/login');

  return (
    <>
      {!isAdmin && !isLogin && <Navbar />}
      {children}
      {!isAdmin && !isLogin && <Footer />}
    </>
  );
}