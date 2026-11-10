"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";

import { useSaberHeat } from "@/components/providers";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { formatTime } from "@/lib/saber-heat";
import { cn } from "@/lib/utils";

const chartConfig = {
  temperature: {
    label: "Temperatura",
    color: "var(--chart-2)",
  },
  heatIndex: {
    label: "Sensación",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

type ReadingChartProps = {
  title?: string;
  description?: string;
  heightClass?: string;
  live?: boolean;
};

export function ReadingChart({
  title = "Temperatura y sensación",
  description = "Últimas lecturas del sensor",
  heightClass = "h-[260px]",
  live = true,
}: ReadingChartProps) {
  const { readings, settings, mounted } = useSaberHeat();
  const data = readings.slice(-30).map((reading) => ({
    time: formatTime(reading.timestamp),
    temperature: reading.temperature,
    heatIndex: reading.heatIndex,
  }));

  return (
    <Card className="border-border/60 bg-card/70">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Badge variant="secondary" className="text-[10px]">
            {live ? "En vivo" : "Sesión"}
          </Badge>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">{description}</p>
          <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-chart-2" />
              Temperatura
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-chart-1" />
              Sensación
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!mounted || data.length < 2 ? (
          <Skeleton className={cn("w-full rounded-lg", heightClass)} />
        ) : (
          <ChartContainer
            config={chartConfig}
            className={cn("aspect-auto w-full", heightClass)}
          >
            <AreaChart
              accessibilityLayer
              data={data}
              margin={{ left: 0, right: 8, top: 8, bottom: 0 }}
            >
              <defs>
                <linearGradient id="fill-temperature" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-temperature)"
                    stopOpacity={0.32}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-temperature)"
                    stopOpacity={0.02}
                  />
                </linearGradient>
                <linearGradient id="fill-heat-index" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-heatIndex)"
                    stopOpacity={0.22}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-heatIndex)"
                    stopOpacity={0.02}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="time"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={28}
                tick={{ fontSize: 10 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={6}
                width={34}
                domain={[20, 55]}
                tick={{ fontSize: 10 }}
                tickFormatter={(value: number) => `${value}°`}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <ReferenceLine
                y={settings.thresholds.danger}
                stroke="var(--zone-danger)"
                strokeDasharray="4 4"
                strokeOpacity={0.7}
              />
              <Area
                dataKey="heatIndex"
                type="monotone"
                fill="url(#fill-heat-index)"
                stroke="var(--color-heatIndex)"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
              <Area
                dataKey="temperature"
                type="monotone"
                fill="url(#fill-temperature)"
                stroke="var(--color-temperature)"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
