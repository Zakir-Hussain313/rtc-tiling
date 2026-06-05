
import './globals.css';
import LayoutWrapper from '@/Components/LayoutWrapper';
import type { Metadata } from 'next';
import ScrollToTop from '@/Components/ScrollToTop';
import { jost, playfair } from '../../lib/fonts';

export const metadata: Metadata = {
  title: 'RTC Projects — Precision Tile Installation',
  description: 'RTC Projects delivers premium tile installations for homes and businesses. Kitchens, bathrooms, floors, pools and more. Get a free quote today.',
  metadataBase: new URL('https://rtc-Projects.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'RTC Projects — Precision Tile Installation',
    description: 'Premium tile installations for homes and businesses.',
    url: 'https://rtc-Projects.vercel.app',
    siteName: 'RTC Projects',
    type: 'website',
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jost.variable} ${playfair.variable}`}>
      <body className="min-h-full flex flex-col">
        <ScrollToTop />
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}