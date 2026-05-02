import { jost, playfair } from 'lib/fonts';
import './globals.css';
import LayoutWrapper from '@/Components/LayoutWrapper';

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