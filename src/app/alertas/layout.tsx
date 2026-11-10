import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Alertas",
  description:
    "Eventos de riesgo térmico, reconocimientos y trazabilidad de las alertas de SABER HEAT.",
};

export default function AlertsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
