import type { Metadata } from 'next';
import './globals.css';
import { initializeDatabase } from './db';

export const metadata: Metadata = {
  title: 'Super Fun Survey',
  description: 'How to make an engaging survey',
};

// Initialize the database outside the component to ensure it runs only once on server startup
if (typeof window === 'undefined') {
  // Check if running on the server
  try {
    initializeDatabase();
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="valentine">
      <body>{children}</body>
    </html>
  );
}
