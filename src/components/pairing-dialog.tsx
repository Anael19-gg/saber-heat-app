"use client";

import { useEffect, useState, type ReactElement } from "react";
import {
  BatteryMedium,
  Bluetooth,
  Check,
  CheckCircle2,
  Cpu,
  LoaderCircle,
  Radio,
  Search,
  Smartphone,
  Wifi,
} from "lucide-react";

import { useSaberHeat } from "@/components/providers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const steps = ["Preparar", "Buscar", "Conectar"];

export function PairingDialog({ trigger }: { trigger?: ReactElement }) {
  const { device, connectDevice, disconnectDevice } = useSaberHeat();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [code, setCode] = useState("842 193");

  useEffect(() => {
    if (!open || step !== 1) return;

    const timeout = window.setTimeout(() => setStep(2), 1500);
    return () => window.clearTimeout(timeout);
  }, [open, step]);

  const handleConnect = () => {
    connectDevice();
    window.setTimeout(() => setOpen(false), 350);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) setStep(0);
      }}
    >
      <DialogTrigger
        render={
          trigger ?? (
            <Button size="sm" className="gap-2">
              <Bluetooth className="size-4" />
              Conectar dispositivo
            </Button>
          )
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Radio className="size-4" />
            </span>
            Emparejar SABER HEAT
          </DialogTitle>
          <DialogDescription>
            Simulación del flujo BLE. En el producto real, el teléfono detecta
            el dispositivo y valida el código de 6 dígitos.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2">
          {steps.map((label, index) => {
            const completed = device.connected || index < step;
            const active = !device.connected && index === step;

            return (
              <div key={label} className="flex flex-1 items-center gap-2">
                <div
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-full border text-[10px] font-semibold",
                    completed
                      ? "border-chart-3/40 bg-chart-3/15 text-chart-3"
                      : active
                        ? "border-primary/40 bg-primary/15 text-primary"
                        : "border-border bg-muted text-muted-foreground",
                  )}
                >
                  {completed ? <Check className="size-3" /> : index + 1}
                </div>
                <span
                  className={cn(
                    "text-[10px]",
                    active
                      ? "font-medium text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {label}
                </span>
                {index < steps.length - 1 ? (
                  <Separator className="flex-1" />
                ) : null}
              </div>
            );
          })}
        </div>

        {device.connected ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-chart-3/30 bg-chart-3/5 px-4 py-6 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-chart-3/15 text-chart-3">
              <CheckCircle2 className="size-7" />
            </div>
            <div>
              <p className="text-sm font-medium">Dispositivo conectado</p>
              <p className="text-xs text-muted-foreground">
                {device.name} · {device.battery}% de batería
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={disconnectDevice}>
              Desconectar
            </Button>
          </div>
        ) : step === 0 ? (
          <div className="flex flex-col gap-3">
            <div className="rounded-xl border border-border/70 bg-muted/30 p-4">
              <div className="flex items-start gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Cpu className="size-4" />
                </div>
                <div className="text-sm">
                  <p className="font-medium">1. Enciende el dispositivo</p>
                  <p className="text-xs text-muted-foreground">
                    Mantén el botón 2 segundos. La hoja hará un pulso azul.
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-border/70 bg-muted/30 p-4">
              <div className="flex items-start gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-chart-2/10 text-chart-2">
                  <Smartphone className="size-4" />
                </div>
                <div className="text-sm">
                  <p className="font-medium">2. Activa Bluetooth</p>
                  <p className="text-xs text-muted-foreground">
                    En Android también se necesita permiso de ubicación para
                    escanear BLE.
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-border/70 bg-muted/30 p-4">
              <div className="flex items-start gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-chart-3/10 text-chart-3">
                  <Search className="size-4" />
                </div>
                <div className="text-sm">
                  <p className="font-medium">3. Busca el dispositivo</p>
                  <p className="text-xs text-muted-foreground">
                    Aparecerá como SABER-HEAT-XXXX. Acércalo a menos de un
                    metro.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : step === 1 ? (
          <div className="flex flex-col items-center gap-4 rounded-xl border border-border/70 bg-muted/20 px-4 py-10 text-center">
            <div className="relative flex size-24 items-center justify-center">
              <span className="absolute size-16 rounded-full border border-primary/30 animate-pulse-ring" />
              <span className="absolute size-24 rounded-full border border-primary/15" />
              <div className="relative flex size-14 items-center justify-center rounded-full bg-primary/15 text-primary">
                <Bluetooth className="size-6" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium">Buscando dispositivos…</p>
              <p className="text-xs text-muted-foreground">
                Mantén el SABER HEAT encendido y cerca del teléfono.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <LoaderCircle className="size-3 animate-spin" />
              Escaneando BLE 5.0
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="rounded-xl border border-chart-3/30 bg-chart-3/5 p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-chart-3/15 text-chart-3">
                  <Cpu className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{device.name}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {device.serial} · BLE 5.0
                  </p>
                </div>
                <Badge variant="secondary" className="gap-1 text-[9px]">
                  <Wifi className="size-3" />
                  {device.signal}%
                </Badge>
              </div>
              <div className="mt-3 flex items-center gap-4 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <BatteryMedium className="size-3" />
                  {device.battery}%
                </span>
                <span>Firmware {device.firmware}</span>
                <span>Sensor SHT30</span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="pairing-code">Código de emparejamiento</Label>
              <Input
                id="pairing-code"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                inputMode="numeric"
                maxLength={7}
                className="text-center font-mono text-lg tracking-[0.35em]"
              />
              <p className="text-[10px] text-muted-foreground">
                El código aparece en la pantalla OLED del dispositivo.
              </p>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2">
          {device.connected ? (
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cerrar
            </Button>
          ) : step === 0 ? (
            <Button onClick={() => setStep(1)} className="gap-2">
              <Search className="size-4" />
              Buscar dispositivo
            </Button>
          ) : step === 1 ? (
            <Button variant="outline" onClick={() => setStep(0)}>
              Cancelar
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => setStep(1)}>
                Volver a buscar
              </Button>
              <Button
                onClick={handleConnect}
                disabled={code.replace(/\s/g, "").length < 6}
                className="gap-2"
              >
                <Check className="size-4" />
                Conectar
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
