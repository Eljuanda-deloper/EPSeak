import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ClientProviders } from "./components/providers/ClientProviders";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "EPSeak - English for Specific Purpose | Aprende inglés profesional",
  description: "Domina el inglés para tu profesión y trabaja en cualquier parte del mundo con EPSeak",
  keywords: "inglés profesional, ESP, English for Specific Purposes, inglés técnico, inglés médico, inglés negocios",
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="es">
      <body className={`${poppins.variable} min-h-screen w-full font-poppins bg-white antialiased relative`}>
        <ClientProviders>
          <div className="relative flex flex-col min-h-screen">
            {/* Header solo en rutas públicas - se oculta automáticamente en dashboard */}
            <Header />
            <main className="flex-1 pt-16 lg:pt-20">
              {children}
            </main>
            {/* Footer solo en rutas públicas - se oculta automáticamente en dashboard */}
            <Footer />
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}
