import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BuilddeckWorkspace',
  description: 'A lightweight founder operating system for products, roadmaps, tasks, docs, and launches.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}