import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--vt-font-sans",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vantaged | Construction Progress & Financial Verification",
  description: "Enterprise construction milestone management, progress verification, and stage payments.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-[var(--vt-color-background-default)] text-[var(--vt-color-text-default)]">
        {children}
      </body>
    </html>
  );
}
