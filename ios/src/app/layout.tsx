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
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <style dangerouslySetInnerHTML={{
          __html: `
            :root {
              --safe-area-inset-top: env(safe-area-inset-top);
              --safe-area-inset-bottom: env(safe-area-inset-bottom);
            }
          `
        }} />
      </head>
      <body className="antialiased">
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Service worker disabled for debugging
              console.log('Service worker disabled');
            `,
          }}
        />
      </body>
    </html>
  );
}