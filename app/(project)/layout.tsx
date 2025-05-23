import type { Metadata } from "next";
import { Poppins } from 'next/font/google';
import "./globals.css";

export const metadata: Metadata = {
  title: "Template SAAS",
  description: "saas template",
};

const poppins = Poppins({
  weight: ['400','500','600','700'],
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${poppins.className} bg-gray-100 antialiased`}>{children}</body>
    </html>
  );
}
