import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "../client/context/ThemeContext";
import { GlobalCompanySignupModal } from "../client/website/components/CompanySignupModal";

const outfit = Outfit({
  variable: "--vt-font-sans",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vantaged | Construction Progress & Financial Verification",
  description: "Enterprise construction milestone management, progress verification, and stage payments.",
  icons: {
    icon: [
      { url: "/favicon.svg?v=2", type: "image/svg+xml" },
      { url: "/favicon.ico?v=2", sizes: "any" },
      { url: "/favicon-32x32.png?v=2", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png?v=2", type: "image/png", sizes: "16x16" },
    ],
    apple: [
      { url: "/apple-touch-icon.png?v=2", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${outfit.variable} h-full antialiased font-sans`}>
      <head>
        <link rel="icon" href="/favicon.svg?v=2" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico?v=2" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=2" />
        <link rel="manifest" href="/site.webmanifest" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('vantaged_theme');
                  if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.setAttribute('data-theme', 'dark');
                  } else {
                    document.documentElement.setAttribute('data-theme', 'light');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        style={{ fontFamily: "'Outfit', var(--vt-font-sans), sans-serif" }}
        className="min-h-full flex flex-col font-sans bg-[var(--vt-color-background-default)] text-[var(--vt-color-text-default)]"
      >
        <ThemeProvider>
          {children}
          <GlobalCompanySignupModal />
        </ThemeProvider>
      </body>
    </html>
  );
}
