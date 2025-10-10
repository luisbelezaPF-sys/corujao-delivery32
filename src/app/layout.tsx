import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// Import all available fonts for AI usage
import "../lib/fonts";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "🦉 Corujão Lanches & Açaí - Delivery Premium",
  description: "Seu apetite nunca mais será o mesmo na madrugada! Delivery de lanches artesanais e açaí com sistema completo de pedidos via WhatsApp.",
  keywords: "delivery, lanches, açaí, hamburger, comida, madrugada, WhatsApp, pedidos online",
  openGraph: {
    title: "🦉 Corujão Lanches & Açaí - Delivery Premium",
    description: "Seu apetite nunca mais será o mesmo na madrugada!",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}