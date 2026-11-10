"use client";

import { useSaberHeat } from "@/components/providers";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatTemp, ZONES } from "@/lib/saber-heat";
import { cn } from "@/lib/utils";

const SCALE_MIN = 20;
const SCALE_MAX = 55;

export function HeatScale() {
  const { current, currentZone, settings } = useSaberHeat();
  const position = Math.min(
    100,
    Math.max(0, ((current.heatIndex - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)) * 100),
  );

  return (
    <Card className="border-border/60 bg-card/70">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Escala de riesgo
          </CardTitle>
          <Badge
            className={cn(
              "border text-[10px]",
              currentZone.bg,
              currentZone.text,
              currentZone.border,
            )}
          >
            {currentZone.label}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Índice de calor actual{" "}
          <span className="font-mono font-medium text-foreground">
            {formatTemp(current.heatIndex, settings.unit, 1)}
          </span>
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="relative pt-2">
          <div className="relative h-3 w-full overflow-hidden rounded-full">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg, var(--zone-safe), var(--zone-caution), var(--zone-high), var(--zone-danger), var(--zone-extreme))",
              }}
            />
          </div>
          <div
            className="absolute top-0 size-5 -translate-x-1/2 rounded-full border-2 border-background bg-foreground shadow-[0_0_16px_var(--zone-color)] transition-[left] duration-700 ease-out"
            style={{
              left: `${position}%`,
              backgroundColor: currentZone.color,
            }}
          />
          <div className="mt-2 flex justify-between font-mono text-[10px] text-muted-foreground">
            <span>{SCALE_MIN}°</span>
            <span>{settings.thresholds.caution}°</span>
            <span>{settings.thresholds.high}°</span>
            <span>{settings.thresholds.danger}°</span>
            <span>{settings.thresholds.extreme}°</span>
            <span>{SCALE_MAX}°</span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          {(
            [
              ["safe", `< ${settings.thresholds.caution}°`],
              [
                "caution",
                `${settings.thresholds.caution}–${settings.thresholds.high}°`,
              ],
              [
                "high",
                `${settings.thresholds.high}–${settings.thresholds.danger}°`,
              ],
              [
                "danger",
                `${settings.thresholds.danger}–${settings.thresholds.extreme}°`,
              ],
              ["extreme", `> ${settings.thresholds.extreme}°`],
            ] as const
          ).map(([zone, range]) => {
            const meta = ZONES[zone];
            return (
              <div
                key={zone}
                className="flex items-center justify-between gap-2 rounded-md px-1.5 py-1 text-xs odd:bg-muted/30"
              >
                <span className="flex items-center gap-2">
                  <span className={cn("size-2 rounded-full", meta.dot)} />
                  <span className="text-muted-foreground">{meta.label}</span>
                </span>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {range}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
