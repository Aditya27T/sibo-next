// app/layout.js
import './globals.css';
import { Inter } from 'next/font/google';
import { SessionProvider } from '@/components/SessionProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'SIBO - Sistem Informasi Beasiswa Online',
  description: 'Sistem Informasi Beasiswa Online untuk pengelolaan beasiswa',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}