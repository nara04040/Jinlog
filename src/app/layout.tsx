import type { Metadata } from "next";
import "./globals.css";


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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body>
        {children}
      </body>
    </html>
  );
}
