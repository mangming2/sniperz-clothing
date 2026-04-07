import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'SNIPERZ Clothing',
  description: 'SNIPERZ 브랜드 소개 사이트'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <nav className="nav">
          <Link href="/" className="nav-logo">Sniperz</Link>
          <div className="nav-links">
            <Link href="/collections">Collections</Link>
            <Link href="/events">Events</Link>
          </div>
        </nav>
        <div className="page-body">{children}</div>
      </body>
    </html>
  );
}
