"use client";

import Link from "next/link";
import { ArrowRight, BellOff, Check, CheckCheck } from "lucide-react";

import { useSaberHeat } from "@/components/providers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Separator } from "@/components/ui/separator";
import { formatTime, ZONES } from "@/lib/saber-heat";
import { cn } from "@/lib/utils";

export function RecentAlerts() {
  const { alerts, acknowledgeAlert } = useSaberHeat();
  const recent = alerts.slice(0, 3);

  return (
    <Card className="border-border/60 bg-card/70">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Últimas alertas
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1 px-2 text-[10px] text-muted-foreground"
            nativeButton={false}
            render={<Link href="/alertas" />}
          >
            Ver todas
            <ArrowRight className="size-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col">
        {recent.length === 0 ? (
          <Empty className="border-border/60 py-6">
            <EmptyMedia variant="icon">
              <BellOff />
            </EmptyMedia>
            <EmptyTitle>Sin alertas</EmptyTitle>
            <EmptyDescription>
              Cuando el índice de calor suba de umbral, aparecerá aquí.
            </EmptyDescription>
          </Empty>
        ) : (
          recent.map((alert, index) => {
            const zone = ZONES[alert.zone];
            return (
              <div key={alert.id}>
                {index > 0 ? <Separator className="my-1" /> : null}
                <div className="flex items-start gap-3 py-2">
                  <span
                    className={cn(
                      "mt-1.5 size-2 shrink-0 rounded-full",
                      zone.dot,
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        className={cn(
                          "border text-[9px]",
                          zone.bg,
                          zone.text,
                          zone.border,
                        )}
                      >
                        {zone.label}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">
                        {formatTime(alert.timestamp)}
                      </span>
                    </div>
                    <p className="mt-1 text-xs leading-snug text-muted-foreground">
                      {alert.message}
                    </p>
                  </div>
                  {alert.acknowledged ? (
                    <CheckCheck className="mt-1 size-4 shrink-0 text-chart-3" />
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="shrink-0 text-muted-foreground hover:text-foreground"
                      onClick={() => acknowledgeAlert(alert.id)}
                      aria-label="Reconocer alerta"
                    >
                      <Check className="size-4" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
