"use client";

import type { CSSProperties } from "react";
import {
  BatteryMedium,
  Bluetooth,
  CheckCircle2,
  Cpu,
  Download,
  Footprints,
  Flame,
  HardHat,
  House,
  Radio,
  RefreshCw,
  Signal,
  Sun,
  Thermometer,
  Wifi,
  Waves,
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
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  SCENARIOS,
  type ScenarioId,
} from "@/lib/saber-heat";
import { cn } from "@/lib/utils";

const scenarioIcons: Record<ScenarioId, typeof HardHat> = {
  obra: HardHat,
  running: Footprints,
  salon: Sun,
  casa: House,
};

const sensors = [
  {
    name: "SHT30",
    detail: "Temperatura y humedad",
    icon: Thermometer,
    status: "Activo",
  },
  {
    name: "LED WS2812B",
    detail: "Hoja RGB de 8 LEDs",
    icon: Waves,
    status: "Activo",
  },
  {
    name: "Buzzer piezo",
    detail: "Alerta sonora de 85 dB",
    icon: Radio,
    status: "Activo",
  },
  {
    name: "Batería 18650",
    detail: "2000 mAh · reemplazable",
    icon: BatteryMedium,
    status: "78%",
  },
];

export default function DevicePage() {
  const {
    device,
    settings,
    currentZone,
    connectDevice,
    disconnectDevice,
    updateSettings,
    simulateDanger,
    mounted,
  } = useSaberHeat();

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Dispositivo"
        description="Estado de la conexión, sensores, firmware y escenarios de simulación."
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
          <CardContent className="relative flex flex-col items-center gap-4 py-8">
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

            <div className="flex flex-wrap items-center justify-center gap-2">
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
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-muted-foreground"
                onClick={() =>
                  toast.info("Dispositivo actualizado", {
                    description: "Última sincronización: ahora.",
                  })
                }
              >
                <RefreshCw className="size-3.5" />
                Sincronizar
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          <Card className="border-border/60 bg-card/70">
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Información del dispositivo
              </CardTitle>
              <CardDescription>
                Datos de fábrica y estado de la conexión.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-1">
              {[
                ["Modelo", "SABER HEAT Go"],
                ["Serie", device.serial],
                ["Firmware", device.firmware],
                ["Sensor", "SHT30 · ±0.3 °C / ±2 % HR"],
                ["Conectividad", "BLE 5.0 · Wi-Fi opcional"],
                ["Última sync", device.connected ? "Ahora" : "—"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-3 border-b border-border/40 py-1.5 text-xs last:border-0"
                >
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-mono text-foreground">{value}</span>
                </div>
              ))}

              <Separator className="my-3" />

              <Field orientation="horizontal">
                <FieldContent>
                  <FieldLabel htmlFor="demo-mode">Modo demo</FieldLabel>
                  <FieldDescription>
                    Genera lecturas cada 3.5 s sin hardware conectado.
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

              <Button
                variant="outline"
                size="sm"
                className="mt-3 w-full gap-1.5 border-border/70"
                onClick={() =>
                  toast.success("Firmware al día", {
                    description: "SABER HEAT 1.4.2 es la última versión.",
                  })
                }
              >
                <Download className="size-3.5" />
                Buscar actualizaciones
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/70">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Sensores</CardTitle>
              <CardDescription>
                Lo que el dispositivo mide y activa.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-1">
              {sensors.map((sensor) => (
                <div
                  key={sensor.name}
                  className="flex items-center gap-3 border-b border-border/40 py-2 last:border-0"
                >
                  <div className="flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <sensor.icon className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium">{sensor.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {sensor.detail}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-[9px]">
                    {sensor.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="border-border/60 bg-card/70">
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <div>
              <CardTitle className="text-sm font-medium">
                Escenario de simulación
              </CardTitle>
              <CardDescription>
                Cambia el contexto para probar el comportamiento del sistema.
              </CardDescription>
            </div>
            <Badge variant="secondary" className="hidden text-[10px] sm:inline-flex">
              {mounted ? "Datos simulados" : "Cargando"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {(Object.entries(SCENARIOS) as [ScenarioId, (typeof SCENARIOS)[ScenarioId]][]).map(
              ([id, scenario]) => {
                const Icon = scenarioIcons[id];
                const active = settings.scenario === id;

                return (
                  <Button
                    key={id}
                    type="button"
                    variant="outline"
                    aria-pressed={active}
                    className={cn(
                      "h-auto flex-col items-start justify-start gap-2 whitespace-normal border-border/70 bg-background/40 p-4 text-left",
                      active && "border-primary/50 bg-primary/5",
                    )}
                    onClick={() => {
                      updateSettings({ scenario: id });
                      toast.success(`Escenario: ${scenario.label}`, {
                        description: scenario.description,
                      });
                    }}
                  >
                    <span className="flex w-full items-center justify-between">
                      <Icon
                        className={cn(
                          "size-4",
                          active ? "text-primary" : "text-muted-foreground",
                        )}
                      />
                      {active ? (
                        <CheckCircle2 className="size-4 text-primary" />
                      ) : null}
                    </span>
                    <span className="text-sm font-medium">{scenario.label}</span>
                    <span className="text-[10px] leading-snug text-muted-foreground">
                      {scenario.description}
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      Base {scenario.baseTemp} °C · {scenario.baseHumidity}% HR
                    </span>
                  </Button>
                );
              },
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border/60 bg-card/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Wifi className="size-4 text-chart-2" />
              Modo Wi-Fi de respaldo
            </CardTitle>
            <CardDescription>
              Para iPhone o cuando no quieres usar BLE.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-xs leading-relaxed text-muted-foreground">
            El dispositivo crea una red temporal{" "}
            <span className="font-mono text-foreground">SABER-HEAT-8F2A</span>,
            abres el portal cautivo, eliges tu red de casa y se sincroniza
            directo a la nube. La red se apaga sola a los 5 minutos.
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Cpu className="size-4 text-primary" />
              Arquitectura edge-gateway-cloud
            </CardTitle>
            <CardDescription>
              El dispositivo decide; el teléfono es el puente.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-xs leading-relaxed text-muted-foreground">
            El ESP32-C3 calcula el índice de calor localmente y alerta aunque no
            haya internet. La PWA recibe los datos por BLE y los sincroniza con
            Vercel + Neon para historial, notificaciones y webhooks.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
