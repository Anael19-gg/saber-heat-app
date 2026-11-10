"use client";

import type { CSSProperties } from "react";
import {
  BatteryMedium,
  Bluetooth,
  Flame,
  Signal,
} from "lucide-react";
import { toast } from "sonner";

import { BladeVisual } from "@/components/blade-visual";
import { PageHeader } from "@/components/page-header";
import { PairingDialog } from "@/components/pairing-dialog";
import { useSaberHeat } from "@/components/providers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { SCENARIOS, type ScenarioId } from "@/lib/saber-heat";
import { cn } from "@/lib/utils";

export default function DevicePage() {
  const {
    device,
    settings,
    currentZone,
    dbMode,
    connectDevice,
    disconnectDevice,
    updateSettings,
    simulateDanger,
  } = useSaberHeat();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Dispositivo"
        description="Conexión, estado y escenario de simulación."
      >
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 border-border/70 bg-card/60"
          onClick={simulateDanger}
        >
          <Flame className="size-3.5" />
          Simular alerta
        </Button>
        <Button
          size="sm"
          variant={device.connected ? "outline" : "default"}
          className="gap-1.5"
          onClick={device.connected ? disconnectDevice : connectDevice}
        >
          <Bluetooth className="size-3.5" />
          {device.connected ? "Desconectar" : "Conectar"}
        </Button>
      </PageHeader>

      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <Card
          className="zone-glow relative overflow-hidden border-border/60 bg-card/70"
          style={{ "--zone-color": currentZone.color } as CSSProperties}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-15"
            style={{
              background:
                "radial-gradient(circle at 50% 38%, var(--zone-color), transparent 58%)",
            }}
          />
          <CardContent className="relative flex flex-col items-center gap-5 py-10">
            <BladeVisual className="h-[300px] w-auto animate-float" />

            <div className="flex flex-col items-center gap-2 text-center">
              <Badge
                variant="outline"
                className={cn(
                  "gap-1.5 border-border/70 bg-background/50 text-[10px]",
                  device.connected ? "text-chart-3" : "text-muted-foreground",
                )}
              >
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    device.connected
                      ? "animate-pulse bg-chart-3"
                      : "bg-muted-foreground",
                  )}
                />
                {device.connected ? "Conectado por BLE" : "Desconectado"}
              </Badge>
              <h2 className="text-lg font-semibold tracking-tight">
                {device.name}
              </h2>
              <p className="text-xs text-muted-foreground">
                {device.serial} · Firmware {device.firmware} · SHT30
              </p>
            </div>

            <div className="grid w-full max-w-md grid-cols-2 gap-3">
              <div className="rounded-xl border border-border/60 bg-background/40 p-3">
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <BatteryMedium className="size-3" />
                  Batería
                </div>
                <p className="mt-1 font-mono text-lg font-semibold">
                  {device.battery}%
                </p>
                <Progress value={device.battery} className="mt-1 h-1.5" />
              </div>
              <div className="rounded-xl border border-border/60 bg-background/40 p-3">
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <Signal className="size-3" />
                  Señal BLE
                </div>
                <p className="mt-1 font-mono text-lg font-semibold">
                  {device.signal}%
                </p>
                <Progress value={device.signal} className="mt-1 h-1.5" />
              </div>
            </div>

            <PairingDialog
              trigger={
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 border-border/70"
                >
                  <Bluetooth className="size-3.5" />
                  {device.connected ? "Reemparejar" : "Emparejar"}
                </Button>
              }
            />
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/70">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Información</CardTitle>
            <CardDescription>
              Datos del dispositivo y configuración de la demo.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            {[
              ["Modelo", "SABER HEAT Go"],
              ["Serie", device.serial],
              ["Firmware", device.firmware],
              [
                "Base de datos",
                dbMode === "online"
                  ? "Neon"
                  : dbMode === "connecting"
                    ? "Conectando"
                    : "Modo local",
              ],
              ["Última sync", device.connected ? "Ahora" : "—"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between gap-3 border-b border-border/40 py-2 text-xs last:border-0"
              >
                <span className="text-muted-foreground">{label}</span>
                <span className="font-mono text-foreground">{value}</span>
              </div>
            ))}

            <Separator className="my-4" />

            <Field orientation="horizontal">
              <FieldContent>
                <FieldLabel htmlFor="demo-mode">Modo demo</FieldLabel>
                <FieldDescription>
                  Lecturas cada 3.5 s sin hardware.
                </FieldDescription>
              </FieldContent>
              <Switch
                id="demo-mode"
                checked={settings.demoMode}
                onCheckedChange={(checked) =>
                  updateSettings({ demoMode: checked })
                }
              />
            </Field>

            <Field className="mt-4">
              <FieldLabel htmlFor="scenario">Escenario</FieldLabel>
              <Select
                items={Object.entries(SCENARIOS).map(([value, scenario]) => ({
                  value,
                  label: scenario.label,
                }))}
                value={settings.scenario}
                onValueChange={(value) => {
                  if (!value) return;
                  const scenario = value as ScenarioId;
                  updateSettings({ scenario });
                  toast.success(`Escenario: ${SCENARIOS[scenario].label}`, {
                    description: SCENARIOS[scenario].description,
                  });
                }}
              >
                <SelectTrigger id="scenario" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="start">
                  {Object.entries(SCENARIOS).map(([id, scenario]) => (
                    <SelectItem key={id} value={id}>
                      {scenario.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldDescription>
                {SCENARIOS[settings.scenario].description}
              </FieldDescription>
            </Field>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
