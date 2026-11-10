"use client";

import { Droplets, Plus } from "lucide-react";

import { useSaberHeat } from "@/components/providers";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export function HydrationCard({ className }: { className?: string }) {
  const { waterMl, addWater } = useSaberHeat();
  const liters = (waterMl / 1000).toFixed(2);
  const percent = Math.min(100, (waterMl / 3000) * 100);

  return (
    <Card
      className={cn("border-border/60 bg-card/70", className)}
    >
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-sm font-medium">Hidratación</CardTitle>
          <span className="text-[10px] text-muted-foreground">Meta 3 L</span>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between gap-5">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-chart-2/10 text-chart-2">
            <Droplets className="size-5" />
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-4xl font-semibold tracking-tight">
                {liters}
              </span>
              <span className="text-sm text-muted-foreground">L</span>
            </div>
            <p className="text-[10px] text-muted-foreground">de 3 L al día</p>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Progress value={percent} className="h-2" />
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>{Math.round(percent)}% de la meta</span>
            <span className="font-mono">{waterMl} ml</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 border-border/70 bg-background/40"
            onClick={() => addWater(250)}
          >
            <Plus className="size-3.5" />
            250 ml
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 border-border/70 bg-background/40"
            onClick={() => addWater(500)}
          >
            <Plus className="size-3.5" />
            500 ml
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
