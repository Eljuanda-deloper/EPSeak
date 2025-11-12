import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Autenticación - ESPeak",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full font-poppins bg-white antialiased relative">
      {children}
    </div>
  );
}
