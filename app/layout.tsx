import type { Metadata } from "next";
import "./globals.css";
import { ClientProviders } from "./components/providers/ClientProviders";
import Footer from "./components/layout/Footer";
import { ReactNode } from "react";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "ESPeak - English for Specific Purpose | Aprende inglés profesional",
  description: "Domina el inglés para tu profesión y trabaja en cualquier parte del mundo con ESPeak",
  keywords: "inglés profesional, ESP, English for Specific Purposes, inglés técnico, inglés médico, inglés negocios",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default async function RootLayout({ children }: RootLayoutProps) {
  const headersList = await headers()
  const pathname = headersList.get("x-pathname") || ""
  const isDashboard = pathname.startsWith("/dashboard")

  return (
    <html lang="es">
      <body className="min-h-screen w-full bg-white antialiased relative" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <ClientProviders>
          <div className="relative flex flex-col min-h-screen">
            {/* Header se maneja dentro de las páginas (HeroSection, etc) */}
            <main className={`relative flex-1 ${isDashboard ? "" : ""}`}>
              {children}
            </main>
            <Footer />
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}
