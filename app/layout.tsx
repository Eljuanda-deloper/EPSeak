import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

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
      <body className={`${poppins.variable} relative min-h-screen w-full overflow-x-hidden font-poppins`}>
        <div className="flex min-h-screen w-full flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
