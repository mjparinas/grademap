import type { Metadata, Viewport } from "next";
import { Andika, Fredoka } from "next/font/google";
import { AppEffects } from "@/components/AppEffects";
import { SiteAnalytics } from "@/components/SiteAnalytics";
import { APP_NAME } from "@/lib/brand";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
});

// Andika is designed for beginning readers (simple a, g and clear letter shapes).
const andika = Andika({
  variable: "--font-andika",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${APP_NAME} · Curriculum practice and games for Kindergarten to Grade 7`,
    template: `%s · ${APP_NAME}`,
  },
  description:
    "Friendly, ad-free practice for Kindergarten to Grade 7, matched to the curriculum: math, reading and writing, science and social studies. Learning games, trophies, offline play and clear progress reports for parents.",
  applicationName: APP_NAME,
  appleWebApp: { capable: true, title: APP_NAME, statusBarStyle: "default" },
  openGraph: { type: "website", siteName: APP_NAME, locale: "en_CA" },
  twitter: { card: "summary_large_image" },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#fffaf1",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-CA" className={`${fredoka.variable} ${andika.variable} antialiased`}>
      <body>
        <AppEffects />
        {children}
        <SiteAnalytics />
      </body>
    </html>
  );
}
