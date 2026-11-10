"use client";

import Link from "next/link";
import {
  ArrowRight,
  BluetoothOff,
  Droplets,
  Flame,
  Sun,
  Thermometer,
} from "lucide-react";

import { HydrationCard } from "@/components/dashboard/hydration-card";
import { HeatScale } from "@/components/dashboard/heat-scale";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { ReadingChart } from "@/components/dashboard/reading-chart";
import { RecentAlerts } from "@/components/dashboard/recent-alerts";
import { ZoneOverview } from "@/components/dashboard/zone-overview";
import { PageHeader } from "@/components/page-header";
import { PairingDialog } from "@/components/pairing-dialog";
import { useSaberHeat } from "@/components/providers";
import { StatCard } from "@/components/stat-card";
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { formatTemp } from "@/lib/saber-heat";

export default function DashboardPage() {
  const { current, settings, device, connectDevice } = useSaberHeat();

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Panel de control"
        description="Monitoreo térmico en vivo, alertas y acciones rápidas para tu jornada."
      >
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 border-border/70 bg-card/60"
          nativeButton={false}
          render={<Link href="/historial" />}
        >
          Ver historial
          <ArrowRight className="size-3.5" />
        </Button>
        <PairingDialog />
      </PageHeader>

      {!device.connected ? (
        <Alert className="border-primary/20 bg-primary/5">
          <BluetoothOff className="text-primary" />
          <AlertTitle>Dispositivo desconectado</AlertTitle>
          <AlertDescription>
            El panel muestra la última lectura. El SABER HEAT sigue midiendo y
            guardando datos offline; vuelve a conectarlo para sincronizar.
          </AlertDescription>
          <AlertAction>
            <Button size="sm" onClick={connectDevice}>
              Conectar
            </Button>
          </AlertAction>
        </Alert>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Temperatura"
          value={formatTemp(current.temperature, settings.unit, 1)}
          hint="Sensor SHT30 · cámara ventilada"
          icon={Thermometer}
          tone="orange"
        />
        <StatCard
          label="Sensación"
          value={formatTemp(current.heatIndex, settings.unit, 1)}
          hint="Índice de calor calculado"
          icon={Flame}
          tone="red"
        />
        <StatCard
          label="Humedad"
          value={`${current.humidity}%`}
          hint="Humedad relativa del aire"
          icon={Droplets}
          tone="cyan"
        />
        <StatCard
          label="UV"
          value={`${current.uv.toFixed(0)}`}
          hint={`Batería ${current.battery.toFixed(0)}% · BLE 5.0`}
          icon={Sun}
          tone="green"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.55fr_1fr]">
        <ZoneOverview />
        <QuickActions />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.55fr_1fr]">
        <ReadingChart />
        <HeatScale />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.55fr_1fr]">
        <RecentAlerts />
        <HydrationCard />
      </div>
    </div>
  );
}
