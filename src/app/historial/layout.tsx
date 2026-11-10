import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Historial",
  description:
    "Historial de temperatura, sensación térmica, exposición y alertas de SABER HEAT.",
};

export default function HistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
