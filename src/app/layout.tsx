import type { Metadata } from 'next';
import { fontVariables } from '../lib/fonts';
import '../index.css';

export const metadata: Metadata = {
  title: 'Akshit Kumar Dhaka | Full Stack Developer',
  description:
    'Full Stack Developer with 2+ years of experience building scalable web apps with Next.js, React, TypeScript, NestJS, Prisma, AWS, and Azure.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={fontVariables}>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
