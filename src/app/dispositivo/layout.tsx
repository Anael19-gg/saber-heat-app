import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dispositivo",
  description:
    "Estado de conexión, sensores, firmware y escenarios de simulación del SABER HEAT.",
};

export default function DeviceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
