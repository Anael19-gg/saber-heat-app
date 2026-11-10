import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Tone = "default" | "orange" | "cyan" | "green" | "red" | "violet";

const toneClasses: Record<Tone, string> = {
  default: "bg-muted text-foreground",
  orange: "bg-primary/10 text-primary",
  cyan: "bg-chart-2/10 text-chart-2",
  green: "bg-chart-3/10 text-chart-3",
  red: "bg-destructive/10 text-destructive",
  violet: "bg-chart-5/10 text-chart-5",
};

type StatCardProps = {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  tone?: Tone;
  badge?: ReactNode;
};

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "default",
  badge,
}: StatCardProps) {
  return (
    <Card
      size="sm"
      className="border-border/60 bg-card/70 transition-colors hover:border-primary/30"
    >
      <CardContent className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            {label}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl font-semibold tracking-tight">
              {value}
            </span>
            {badge}
          </div>
          {hint ? (
            <span className="truncate text-xs text-muted-foreground">
              {hint}
            </span>
          ) : null}
        </div>
        <div
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-lg",
            toneClasses[tone],
          )}
        >
          <Icon className="size-4" />
        </div>
      </CardContent>
    </Card>
  );
}
