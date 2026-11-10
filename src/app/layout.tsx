import type { Metadata } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";

import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { Providers } from "@/components/providers";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

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
  title: "SABER HEAT · Consola de monitoreo",
  description:
    "Diseño preliminar y funcional de la PWA de SABER HEAT: monitoreo térmico personal, alertas, historial y conexión BLE simulada.",
  applicationName: "SABER HEAT",
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
