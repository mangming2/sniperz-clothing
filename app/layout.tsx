import type { Metadata } from 'next';
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
      <body>{children}</body>
    </html>
  );
}
