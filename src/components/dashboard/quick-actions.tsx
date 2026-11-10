"use client";

import {
  Bluetooth,
  BluetoothOff,
  CheckCheck,
  Droplets,
  Flame,
} from "lucide-react";

import { useSaberHeat } from "@/components/providers";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function QuickActions() {
  const {
    alerts,
    device,
    acknowledgeAlert,
    addWater,
    simulateDanger,
    connectDevice,
    disconnectDevice,
  } = useSaberHeat();

  const latestUnacknowledged = alerts.find((alert) => !alert.acknowledged);

  return (
    <Card className="border-border/60 bg-card/70">
      <CardHeader>
        <CardTitle className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Acciones rápidas
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Todo lo que puedes hacer desde el panel.
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Button
          variant="outline"
          className="h-auto justify-start gap-3 border-border/70 bg-background/40 p-3"
          disabled={!latestUnacknowledged}
          onClick={() =>
            latestUnacknowledged &&
            acknowledgeAlert(latestUnacknowledged.id)
          }
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-chart-3/10 text-chart-3">
            <CheckCheck className="size-4" />
          </span>
          <span className="flex flex-col items-start text-left">
            <span className="text-xs font-medium">Reconocer alerta</span>
            <span className="text-[10px] text-muted-foreground">
              {latestUnacknowledged
                ? "Hay una alerta pendiente"
                : "Sin alertas pendientes"}
            </span>
          </span>
        </Button>

        <Button
          variant="outline"
          className="h-auto justify-start gap-3 border-border/70 bg-background/40 p-3"
          onClick={() => addWater(250)}
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-chart-2/10 text-chart-2">
            <Droplets className="size-4" />
          </span>
          <span className="flex flex-col items-start text-left">
            <span className="text-xs font-medium">Registrar 250 ml</span>
            <span className="text-[10px] text-muted-foreground">
              Suma un vaso a tu hidratación
            </span>
          </span>
        </Button>

        <Button
          variant="outline"
          className="h-auto justify-start gap-3 border-border/70 bg-background/40 p-3"
          onClick={simulateDanger}
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
            <Flame className="size-4" />
          </span>
          <span className="flex flex-col items-start text-left">
            <span className="text-xs font-medium">Simular peligro</span>
            <span className="text-[10px] text-muted-foreground">
              Fuerza una alerta extrema de demo
            </span>
          </span>
        </Button>

        <Button
          variant="outline"
          className="h-auto justify-start gap-3 border-border/70 bg-background/40 p-3"
          onClick={device.connected ? disconnectDevice : connectDevice}
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {device.connected ? (
              <BluetoothOff className="size-4" />
            ) : (
              <Bluetooth className="size-4" />
            )}
          </span>
          <span className="flex flex-col items-start text-left">
            <span className="text-xs font-medium">
              {device.connected ? "Desconectar" : "Conectar dispositivo"}
            </span>
            <span className="text-[10px] text-muted-foreground">
              {device.connected
                ? "El dispositivo seguirá midiendo offline"
                : "Vuelve a enlazar el SABER HEAT"}
            </span>
          </span>
        </Button>

        <Separator className="my-1" />
        <p className="text-[10px] leading-relaxed text-muted-foreground">
          Demo con datos simulados. Los ajustes se guardan en este navegador;
          no hay base de datos.
        </p>
      </CardContent>
    </Card>
  );
}
