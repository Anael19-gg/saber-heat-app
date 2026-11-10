"use client";

import { BluetoothOff } from "lucide-react";

import { HydrationCard } from "@/components/dashboard/hydration-card";
import { ZoneOverview } from "@/components/dashboard/zone-overview";
import { PageHeader } from "@/components/page-header";
import { useSaberHeat } from "@/components/providers";
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { device, connectDevice } = useSaberHeat();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Panel"
        description="Tu estado térmico, de un vistazo."
      />

      {!device.connected ? (
        <Alert className="border-primary/20 bg-primary/5">
          <BluetoothOff className="text-primary" />
          <AlertTitle>Dispositivo desconectado</AlertTitle>
          <AlertDescription>
            El panel muestra la última lectura. Vuelve a conectar para
            sincronizar.
          </AlertDescription>
          <AlertAction>
            <Button size="sm" onClick={connectDevice}>
              Conectar
            </Button>
          </AlertAction>
        </Alert>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[1.7fr_0.9fr]">
        <ZoneOverview />
        <HydrationCard className="h-full" />
      </div>
    </div>
  );
}
