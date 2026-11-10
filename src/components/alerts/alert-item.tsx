"use client";

import { Check, CheckCheck, Flame } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  formatDate,
  formatTemp,
  formatTime,
  ZONES,
  type AlertItem as AlertRecord,
  type Unit,
} from "@/lib/saber-heat";
import { cn } from "@/lib/utils";

type AlertItemProps = {
  alert: AlertRecord;
  unit: Unit;
  onAcknowledge: (id: string) => void;
};

export function AlertItem({ alert, unit, onAcknowledge }: AlertItemProps) {
  const zone = ZONES[alert.zone];

  return (
    <Card
      className="border-border/60 border-l-2 bg-card/70"
      style={{ borderLeftColor: zone.color }}
    >
      <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-xl",
            zone.bg,
            zone.text,
          )}
        >
          <Flame className="size-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              className={cn(
                "border text-[9px] uppercase tracking-[0.1em]",
                zone.bg,
                zone.text,
                zone.border,
              )}
            >
              {zone.label}
            </Badge>
            <span className="text-[10px] text-muted-foreground">
              {formatTime(alert.timestamp)} · {formatDate(alert.timestamp)}
            </span>
            {alert.acknowledged ? (
              <Badge variant="secondary" className="gap-1 text-[9px]">
                <CheckCheck className="size-3" />
                Reconocida
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="border-primary/30 text-[9px] text-primary"
              >
                Pendiente
              </Badge>
            )}
          </div>
          <p className="mt-1.5 text-sm leading-snug">{alert.message}</p>
          <p className="mt-0.5 text-[10px] text-muted-foreground">
            Sensación {formatTemp(alert.heatIndex, unit, 1)} · registrada por el
            dispositivo
          </p>
        </div>

        {!alert.acknowledged ? (
          <Button
            variant="outline"
            size="sm"
            className="shrink-0 gap-1.5 border-border/70"
            onClick={() => onAcknowledge(alert.id)}
          >
            <Check className="size-3.5" />
            Reconocer
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
