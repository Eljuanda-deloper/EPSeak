import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ClientProviders } from "./components/providers/ClientProviders";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import { ReactNode } from "react";
import { headers } from "next/headers";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
});

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
      <body className={`${poppins.variable} min-h-screen w-full font-poppins bg-white antialiased relative`}>
        <ClientProviders>
          <div className="relative flex flex-col min-h-screen">
            {/* Header y Footer se ocultan automáticamente en dashboard */}
            <Header />
            <main className={`relative flex-1 ${isDashboard ? "" : "pt-16 lg:pt-20"}`}>
              {children}
            </main>
            <Footer />
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}
