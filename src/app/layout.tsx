import type { Metadata } from "next";
import "./globals.css";
import 'prismjs/themes/prism-tomorrow.css';
import 'highlight.js/styles/github-dark.css';
import { ThemeProvider } from 'next-themes'

const title = "test";
const description =
  "blog test";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    siteName: "JinLog",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    creator: "@Jin",
  },
  robots: {
    index: true,
    follow: true,
  },
  // pwa
  applicationName: "JinLog",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "JinLog",
  },
  formatDetection: {
    telephone: false,
  },
  // safe area for iOS PWA
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "white-translucent",
  },
};

export const viewport = {
  themeColor: "#FFF",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="h-full">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
