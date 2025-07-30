import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Letta Chat Assistant',
  description: 'A stateful AI assistant powered by Letta',
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