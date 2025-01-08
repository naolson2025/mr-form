import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Super Fun Survey',
  description: 'How to make an engaging survey',
};

export default async function RootLayout({
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
