import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers"; // Importamos nuestro provider

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Premium Snippets",
  description: "App con Next.js, Auth y Stripe",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {/* Envolvemos la app con el Provider de Auth */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}