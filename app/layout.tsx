import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./context/CartContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Feastora — Artisanal Dining & Instant Gourmet Delivery",
  description:
    "Explore Dhaka's premier restaurants, royal saffron mutton kacchi, handcrafted burgers, woodfired pizzas and artisan bakery treats delivered in 30 minutes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 pb-20 md:pb-0">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
