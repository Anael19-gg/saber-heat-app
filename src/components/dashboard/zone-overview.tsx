"use client";

import type { CSSProperties } from "react";
import { Clock3, Droplets, Flame, Sun } from "lucide-react";

import { useSaberHeat } from "@/components/providers";
import { BladeVisual } from "@/components/blade-visual";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatMinutes, formatTemp } from "@/lib/saber-heat";
import { cn } from "@/lib/utils";

export function ZoneOverview() {
  const { current, currentZone, settings, zoneMinutes } = useSaberHeat();
  const temperature =
    settings.unit === "f"
      ? (current.temperature * 9) / 5 + 32
      : current.temperature;
  const unitLabel = settings.unit === "f" ? "°F" : "°C";

  return (
    <Card
      className="zone-glow relative overflow-hidden border-border/60 bg-card/70"
      style={{ "--zone-color": currentZone.color } as CSSProperties}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          background:
            "radial-gradient(circle at 78% 24%, var(--zone-color), transparent 56%)",
        }}
      />
      <CardHeader className="relative">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Estado actual
          </CardTitle>
          <Badge
            className={cn(
              "border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em]",
              currentZone.bg,
              currentZone.text,
              currentZone.border,
            )}
          >
            {currentZone.label}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          {currentZone.description} · Sensación{" "}
          <span className="font-medium text-foreground">
            {formatTemp(current.heatIndex, settings.unit, 1)}
          </span>
        </p>
      </CardHeader>

      <CardContent className="relative grid gap-4 sm:grid-cols-[1fr_150px] sm:items-center">
        <div className="flex flex-col gap-4">
          <div className="flex items-end gap-2">
            <span
              className="text-glow font-mono text-6xl font-semibold leading-none tracking-tighter sm:text-7xl"
              style={{ color: currentZone.color }}
            >
              {temperature.toFixed(1)}
            </span>
            <span className="mb-2 text-xl text-muted-foreground">
              {unitLabel}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="flex flex-col gap-0.5">
              <span className="flex items-center gap-1 text-muted-foreground">
                <Droplets className="size-3" />
                Humedad
              </span>
              <span className="font-mono text-sm font-medium">
                {current.humidity}%
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="flex items-center gap-1 text-muted-foreground">
                <Sun className="size-3" />
                UV
              </span>
              <span className="font-mono text-sm font-medium">
                {current.uv.toFixed(0)}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="flex items-center gap-1 text-muted-foreground">
                <Flame className="size-3" />
                Batería
              </span>
              <span className="font-mono text-sm font-medium">
                {current.battery.toFixed(0)}%
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Clock3 className="size-3" />
                {formatMinutes(zoneMinutes)} en esta zona
              </span>
              <span className="font-mono">{current.battery.toFixed(0)}%</span>
            </div>
            <Progress value={current.battery} className="h-1.5" />
          </div>

          <p className="max-w-md text-xs leading-relaxed text-muted-foreground">
            {currentZone.advice}
          </p>
        </div>

        <BladeVisual className="mx-auto h-[210px] w-auto animate-float sm:h-[230px]" />
      </CardContent>
    </Card>
  );
}
