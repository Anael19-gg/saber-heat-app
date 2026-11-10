import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";

import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { Providers } from "@/components/providers";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { siteDescription, siteName, siteUrl } from "@/lib/site";

import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SABER HEAT · Consola de monitoreo",
    template: "%s · SABER HEAT",
  },
  description: siteDescription,
  applicationName: siteName,
  keywords: [
    "SABER HEAT",
    "IoT",
    "riesgo térmico",
    "golpe de calor",
    "Mexicali",
    "PWA",
    "Next.js",
    "shadcn/ui",
  ],
  authors: [{ name: "Anael" }],
  creator: "Anael",
  publisher: siteName,
  category: "health",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: siteUrl,
    siteName,
    title: "SABER HEAT · Monitor personal de riesgo térmico",
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: "SABER HEAT · Monitor personal de riesgo térmico",
    description: siteDescription,
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      {
        url: "/icons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    shortcut: "/icons/icon-192.png",
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "SABER HEAT",
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#0b1220",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${spaceGrotesk.variable} ${ibmPlexMono.variable} dark`}
    >
      <body className="min-h-svh antialiased">
        <Providers>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="flex min-w-0 flex-1 flex-col">
              <AppHeader />
              <main className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col px-4 py-5 md:px-6 lg:px-8">
                {children}
              </main>
            </SidebarInset>
          </SidebarProvider>
        </Providers>
      </body>
    </html>
  );
}
