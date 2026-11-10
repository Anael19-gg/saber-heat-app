"use client";

import type { CSSProperties } from "react";
import { Check, Clock3, Droplets, Sun } from "lucide-react";

import { BladeVisual } from "@/components/blade-visual";
import { useSaberHeat } from "@/components/providers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  formatMinutes,
  formatTemp,
  formatTime,
  SCENARIOS,
  ZONES,
} from "@/lib/saber-heat";
import { cn } from "@/lib/utils";

export function ZoneOverview() {
  const {
    current,
    currentZone,
    settings,
    zoneMinutes,
    alerts,
    acknowledgeAlert,
  } = useSaberHeat();

  const latest = alerts.find((alert) => !alert.acknowledged);
  const latestZone = latest ? ZONES[latest.zone] : currentZone;
  const temperature =
    settings.unit === "f"
      ? (current.temperature * 9) / 5 + 32
      : current.temperature;
  const unitLabel = settings.unit === "f" ? "°F" : "°C";
  const scenario = SCENARIOS[settings.scenario];

  return (
    <div className="animate-rise rounded-[2rem] bg-white/[0.03] p-1.5 ring-1 ring-white/10">
      <div
        className="relative overflow-hidden rounded-[calc(2rem-0.375rem)] bg-card/80 p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] sm:p-8"
        style={{ "--zone-color": currentZone.color } as CSSProperties}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            background:
              "radial-gradient(circle at 80% 20%, var(--zone-color), transparent 55%)",
          }}
        />

        <div className="relative grid gap-8 sm:grid-cols-[1fr_180px] sm:items-center">
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-3">
              <Badge
                className={cn(
                  "border px-2.5 py-1 text-[10px] font-semibold",
                  currentZone.bg,
                  currentZone.text,
                  currentZone.border,
                )}
              >
                {currentZone.label}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {scenario.label} · Sensación{" "}
                {formatTemp(current.heatIndex, settings.unit, 1)}
              </span>
            </div>

            <div className="flex items-end gap-2">
              <span
                className="text-glow font-mono text-7xl font-semibold leading-none tracking-tighter sm:text-8xl"
                style={{ color: currentZone.color }}
              >
                {temperature.toFixed(1)}
              </span>
              <span className="mb-2 text-2xl text-muted-foreground">
                {unitLabel}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 text-xs">
              <div className="flex flex-col gap-1">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Droplets className="size-3" />
                  Humedad
                </span>
                <span className="font-mono text-sm font-medium">
                  {current.humidity}%
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Sun className="size-3" />
                  UV
                </span>
                <span className="font-mono text-sm font-medium">
                  {current.uv.toFixed(0)}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock3 className="size-3" />
                  En zona
                </span>
                <span className="font-mono text-sm font-medium">
                  {formatMinutes(zoneMinutes)}
                </span>
              </div>
            </div>

            {latest ? (
              <div
                className={cn(
                  "flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between",
                  latestZone.bg,
                  latestZone.border,
                )}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      "mt-1.5 size-2 shrink-0 rounded-full",
                      latestZone.dot,
                    )}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium leading-snug">
                      {latest.message}
                    </p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">
                      {formatTime(latest.timestamp)} · Sensación{" "}
                      {formatTemp(latest.heatIndex, settings.unit, 1)}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  className="shrink-0 gap-1.5 rounded-full"
                  onClick={() => acknowledgeAlert(latest.id)}
                >
                  <Check className="size-3.5" />
                  Reconocer
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Check className="size-4 text-chart-3" />
                Sin alertas pendientes
              </div>
            )}
          </div>

          <BladeVisual className="mx-auto h-[220px] w-auto animate-float sm:h-[280px]" />
        </div>
      </div>
    </div>
  );
}
