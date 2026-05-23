import type { Metadata } from "next";
import { Inter, Fraunces, Amiri } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600"],
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600"],
  display: "swap",
});

const amiri = Amiri({
  subsets: ["latin", "arabic"],
  variable: "--font-arabic",
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Iqra Al-Ándalus",
  description: "Biblioteca comunitaria islámica sin ánimo de lucro.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} ${fraunces.variable} ${amiri.variable} antialiased min-h-screen flex flex-col`}>
        <Nav />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
