import type { Metadata } from 'next';
import { fontVariables } from '../lib/fonts';
import '../index.css';

export const metadata: Metadata = {
  title: 'Akshit Kumar Dhaka | Full Stack Developer & Technical Architect',
  description: 'Engineering high-performance digital solutions with absolute structural integrity, automated developer operations pipelines, and immersive aesthetics.',
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
