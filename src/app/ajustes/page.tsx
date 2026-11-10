"use client";

import type { CSSProperties } from "react";
import {
  BellRing,
  Check,
  Database,
  Info,
  RotateCcw,
  SlidersHorizontal,
  User,
} from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/page-header";
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
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  DEFAULT_SETTINGS,
  ZONES,
  type Thresholds,
  type Unit,
  type Zone,
} from "@/lib/saber-heat";
import { cn } from "@/lib/utils";

type ThresholdFieldProps = {
  label: string;
  description: string;
  value: number;
  min: number;
  max: number;
  zone: Zone;
  onChange: (value: number) => void;
};

const ZONE_ORDER: Zone[] = [
  "safe",
  "caution",
  "high",
  "danger",
  "extreme",
];

function ThresholdField({
  label,
  description,
  value,
  min,
  max,
  zone,
  onChange,
}: ThresholdFieldProps) {
  const meta = ZONES[zone];

  return (
    <Field>
      <div className="flex items-center justify-between gap-2">
        <FieldLabel className="flex items-center gap-2">
          <span className={cn("size-2 rounded-full", meta.dot)} />
          {label}
        </FieldLabel>
        <span className="font-mono text-xs" style={{ color: meta.color }}>
          {value} °C
        </span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={1}
        className="[&_[data-slot=slider-range]]:bg-[var(--threshold-color)] [&_[data-slot=slider-thumb]]:border-[var(--threshold-color)]"
        style={{ "--threshold-color": meta.color } as CSSProperties}
        onValueChange={(next) => {
          const nextValue = typeof next === "number" ? next : next[0];
          onChange(nextValue ?? value);
        }}
      />
      <FieldDescription>{description}</FieldDescription>
    </Field>
  );
}

export default function SettingsPage() {
  const {
    settings,
    updateSettings,
    updateThreshold,
    resetDemo,
  } = useSaberHeat();

  const setThreshold = (key: keyof Thresholds, value: number) => {
    updateThreshold(key, value);
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Ajustes"
        description="Umbrales, alertas y contacto de emergencia."
      >
        <Badge
          variant="outline"
          className="gap-1.5 border-chart-3/30 text-chart-3"
        >
          <Check className="size-3" />
          Guardado automático
        </Badge>
      </PageHeader>

      <Alert className="border-primary/20 bg-primary/5">
        <Info className="text-primary" />
        <AlertTitle>Persistencia</AlertTitle>
        <AlertDescription>
          Los ajustes se guardan en este navegador y, si Neon está configurado,
          también en PostgreSQL. El usuario demo no tiene login real.
        </AlertDescription>
      </Alert>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="border-border/60 bg-card/70">
          <CardHeader>
            <div className="flex items-center justify-between gap-2">
              <div>
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <SlidersHorizontal className="size-4 text-primary" />
                  Umbrales de alerta
                </CardTitle>
                <CardDescription>
                  Cuándo cambia la hoja de color y cuándo suena la alarma.
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-[10px] text-muted-foreground"
                onClick={() => {
                  updateSettings({ thresholds: DEFAULT_SETTINGS.thresholds });
                  toast.success("Umbrales restaurados");
                }}
              >
                <RotateCcw className="size-3" />
                Restaurar
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[10px] text-muted-foreground">
              {ZONE_ORDER.map((zone) => (
                <span key={zone} className="flex items-center gap-1.5">
                  <span
                    className={cn("size-1.5 rounded-full", ZONES[zone].dot)}
                  />
                  {ZONES[zone].short}
                </span>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <ThresholdField
                label="Precaución"
                description="La hoja pasa a verde. Empieza el recordatorio de agua."
                value={settings.thresholds.caution}
                min={20}
                max={30}
                zone="caution"
                onChange={(value) => setThreshold("caution", value)}
              />
              <ThresholdField
                label="Alto"
                description="La hoja pasa a ámbar. Se recomienda bajar el ritmo."
                value={settings.thresholds.high}
                min={30}
                max={38}
                zone="high"
                onChange={(value) => setThreshold("high", value)}
              />
              <ThresholdField
                label="Peligro"
                description="La hoja pasa a morado. Se activa la alerta y el contacto."
                value={settings.thresholds.danger}
                min={38}
                max={50}
                zone="danger"
                onChange={(value) => setThreshold("danger", value)}
              />
              <ThresholdField
                label="Extremo"
                description="La hoja pasa a rojo. Se envía la alerta crítica."
                value={settings.thresholds.extreme}
                min={50}
                max={55}
                zone="extreme"
                onChange={(value) => setThreshold("extreme", value)}
              />
            </FieldGroup>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <BellRing className="size-4 text-primary" />
              Alertas y preferencias
            </CardTitle>
            <CardDescription>
              Cómo quieres que el sistema te avise.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="unit">Unidad de temperatura</FieldLabel>
                <Select
                  items={[
                    { value: "c", label: "Celsius (°C)" },
                    { value: "f", label: "Fahrenheit (°F)" },
                  ]}
                  value={settings.unit}
                  onValueChange={(value) => {
                    if (value) {
                      updateSettings({ unit: value as Unit });
                      toast.success(
                        `Unidad: ${value === "f" ? "Fahrenheit" : "Celsius"}`,
                      );
                    }
                  }}
                >
                  <SelectTrigger id="unit" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="c">Celsius (°C)</SelectItem>
                    <SelectItem value="f">Fahrenheit (°F)</SelectItem>
                  </SelectContent>
                </Select>
                <FieldDescription>
                  Los umbrales se configuran en °C; la vista se convierte.
                </FieldDescription>
              </Field>

              <Field>
                <div className="flex items-center justify-between gap-2">
                  <FieldLabel>Recordatorio de hidratación</FieldLabel>
                  <span className="font-mono text-xs text-muted-foreground">
                    {settings.hydrationInterval} min
                  </span>
                </div>
                <Slider
                  value={[settings.hydrationInterval]}
                  min={15}
                  max={60}
                  step={5}
                  className="[&_[data-slot=slider-range]]:bg-chart-2 [&_[data-slot=slider-thumb]]:border-chart-2"
                  onValueChange={(value) => {
                    const nextValue =
                      typeof value === "number" ? value : value[0];
                    updateSettings({
                      hydrationInterval: nextValue ?? 30,
                    });
                  }}
                />
                <FieldDescription>
                  Cada cuánto la app te recuerda beber agua.
                </FieldDescription>
              </Field>

              <Field orientation="horizontal">
                <FieldContent>
                  <FieldLabel htmlFor="notifications">
                    Notificaciones push
                  </FieldLabel>
                  <FieldDescription>
                    Avisos de zona roja, hidratación y sincronización.
                  </FieldDescription>
                </FieldContent>
                <Switch
                  id="notifications"
                  checked={settings.notifications}
                  onCheckedChange={(checked) =>
                    updateSettings({ notifications: checked })
                  }
                />
              </Field>

              <Field orientation="horizontal">
                <FieldContent>
                  <FieldLabel htmlFor="sound">Sonido</FieldLabel>
                  <FieldDescription>
                    Beeps del buzzer y alertas de la app.
                  </FieldDescription>
                </FieldContent>
                <Switch
                  id="sound"
                  checked={settings.sound}
                  onCheckedChange={(checked) =>
                    updateSettings({ sound: checked })
                  }
                />
              </Field>

              <Field orientation="horizontal">
                <FieldContent>
                  <FieldLabel htmlFor="vibration">Vibración</FieldLabel>
                  <FieldDescription>
                    Patrón háptico del dispositivo.
                  </FieldDescription>
                </FieldContent>
                <Switch
                  id="vibration"
                  checked={settings.vibration}
                  onCheckedChange={(checked) =>
                    updateSettings({ vibration: checked })
                  }
                />
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <User className="size-4 text-primary" />
              Contacto de emergencia
            </CardTitle>
            <CardDescription>
              A quién avisar si no reconoces una alerta roja.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="contact">Nombre y teléfono</FieldLabel>
                <Input
                  id="contact"
                  value={settings.emergencyContact}
                  onChange={(event) =>
                    updateSettings({ emergencyContact: event.target.value })
                  }
                  placeholder="Mamá · +52 686 000 0000"
                />
                <FieldDescription>
                  Se usa solo si la alerta roja sigue sin reconocerse después de
                  60 segundos.
                </FieldDescription>
              </Field>

            </FieldGroup>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Database className="size-4 text-primary" />
              Datos y demo
            </CardTitle>
            <CardDescription>
              Dónde se guarda la demo y cómo reiniciarla.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="rounded-xl border border-border/60 bg-muted/20 p-3 text-xs text-muted-foreground">
              <p className="flex items-center gap-2 font-medium text-foreground">
                <Database className="size-3.5 text-primary" />
                Persistencia
              </p>
              <p className="mt-1">
                Con Neon, lecturas, alertas y ajustes se guardan en PostgreSQL.
                Sin <span className="font-mono">DATABASE_URL</span>, todo vive
                en este navegador.
              </p>
            </div>

            <Dialog>
              <DialogTrigger
                render={
                  <Button variant="destructive" className="w-full gap-1.5">
                    <RotateCcw className="size-3.5" />
                    Reiniciar demo
                  </Button>
                }
              />
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>¿Reiniciar la demo?</DialogTitle>
                  <DialogDescription>
                    Se reinician las lecturas, alertas, agua y ajustes del demo.
                    No se puede deshacer.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose
                    render={<Button variant="outline">Cancelar</Button>}
                  />
                  <DialogClose
                    render={
                      <Button variant="destructive" onClick={resetDemo}>
                        Sí, reiniciar
                      </Button>
                    }
                  />
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <p className="text-center text-[10px] text-muted-foreground">
              SABER HEAT · Demo 1.0.0 · Datos simulados
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
