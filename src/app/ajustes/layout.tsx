import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ajustes",
  description:
    "Umbrales, unidades, hidratación, notificaciones y contacto de emergencia de SABER HEAT.",
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
