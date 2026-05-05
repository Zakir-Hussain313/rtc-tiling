import { jost, playfair } from 'lib/fonts';
import './globals.css';
import LayoutWrapper from '@/Components/LayoutWrapper';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'RTC Tiling — Precision Tile Installation',
  description: 'RTC Tiling delivers premium tile installations for homes and businesses. Kitchens, bathrooms, floors, pools and more. Get a free quote today.',
  metadataBase: new URL('https://rtc-tiling.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'RTC Tiling — Precision Tile Installation',
    description: 'Premium tile installations for homes and businesses.',
    url: 'https://rtc-tiling.vercel.app',
    siteName: 'RTC Tiling',
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
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}