import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Cryptocurrency | Performance Chart",
  description: "Display cryptocurrency performance across different timeframes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <body className={`${inter.variable} antialiased bg-gray-50`}>
        <main className="container mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
