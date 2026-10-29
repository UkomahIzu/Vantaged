import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "../context/ThemeContext";
import { AdminAuthProvider } from "../context/AdminAuthContext";
import { AdminShell } from "../components/AdminShell";

export const metadata: Metadata = {
  title: "Vantaged Admin | Operations & Verification Console",
  description: "Internal platform operations console for contractor verification, CAC checks, audits, and dispute resolution.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans transition-colors duration-150">
        <ThemeProvider>
          <AdminAuthProvider>
            <AdminShell>{children}</AdminShell>
          </AdminAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
