import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Unified WhatsApp Chat',
  description: 'A unified interface for all WhatsApp conversations',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}