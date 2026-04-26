import VhFix from '@/Components/VhFix';
import './globals.css';
import LayoutWrapper from '@/Components/LayoutWrapper';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-full flex flex-col">
        <LayoutWrapper><VhFix />{children}</LayoutWrapper>
      </body>
    </html>
  );
}