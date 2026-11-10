"use client";

import { Clock3, Download } from "lucide-react";
import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

import { PageHeader } from "@/components/page-header";
import { ReadingChart } from "@/components/dashboard/reading-chart";
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
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  formatTemp,
  formatTime,
  WEEKLY_DATA,
  ZONES,
} from "@/lib/saber-heat";
import { cn } from "@/lib/utils";

const weeklyConfig = {
  max: {
    label: "Máxima",
    color: "var(--zone-danger)",
  },
  avg: {
    label: "Promedio",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export default function HistoryPage() {
  const { readings, alerts, settings } = useSaberHeat();

  const maxTemp = readings.length
    ? Math.max(...readings.map((reading) => reading.temperature))
    : 0;
  const dangerAlerts = alerts.filter(
    (alert) => alert.zone === "danger" || alert.zone === "extreme",
  ).length;
  const dangerMinutes = Math.min(180, dangerAlerts * 15);

  const exportCsv = () => {
    const header =
      "hora,temperatura_c,humedad_pct,indice_calor_c,uv,zona,bateria_pct";
    const rows = readings.map((reading) =>
      [
        formatTime(reading.timestamp),
        reading.temperature,
        reading.humidity,
        reading.heatIndex,
        reading.uv,
        reading.zone,
        reading.battery,
      ].join(","),
    );
    const blob = new Blob([[header, ...rows].join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "saber-heat-historial.csv";
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success("Historial exportado", {
      description: "Se descargó saber-heat-historial.csv",
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Historial"
        description="Temperatura, exposición y alertas."
      >
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 border-border/70 bg-card/60"
          onClick={exportCsv}
        >
          <Download className="size-3.5" />
          Exportar CSV
        </Button>
      </PageHeader>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-muted-foreground">
        <span>
          Máx.{" "}
          <span className="font-mono text-foreground">
            {readings.length
              ? formatTemp(maxTemp, settings.unit, 1)
              : "—"}
          </span>
        </span>
        <span>
          Zona roja{" "}
          <span className="font-mono text-foreground">
            {dangerMinutes} min
          </span>
        </span>
        <span>
          Alertas{" "}
          <span className="font-mono text-foreground">{alerts.length}</span>
        </span>
      </div>

      <Tabs defaultValue="24h" className="gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-medium">Exposición térmica</h2>
            <p className="text-xs text-muted-foreground">
              Compara la temperatura real contra la sensación calculada.
            </p>
          </div>
          <TabsList>
            <TabsTrigger value="24h">Sesión</TabsTrigger>
            <TabsTrigger value="7d">7 días</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="24h" className="flex flex-col gap-4">
          <ReadingChart
            title="Temperatura y sensación"
            description="Lecturas del sensor durante la sesión"
            heightClass="h-[320px]"
            live={false}
          />

          <Card className="border-border/60 bg-card/70">
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Últimas lecturas
              </CardTitle>
              <CardDescription>
                Cada punto viene del SHT30 y del cálculo de índice de calor.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hora</TableHead>
                    <TableHead className="text-right">Temp.</TableHead>
                    <TableHead className="text-right">HR</TableHead>
                    <TableHead className="text-right">Sensación</TableHead>
                    <TableHead className="text-right">UV</TableHead>
                    <TableHead className="text-right">Zona</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {readings
                    .slice(-10)
                    .reverse()
                    .map((reading) => {
                      const zone = ZONES[reading.zone];
                      return (
                        <TableRow key={reading.id}>
                          <TableCell className="font-mono text-xs text-muted-foreground">
                            {formatTime(reading.timestamp)}
                          </TableCell>
                          <TableCell className="text-right font-mono text-xs">
                            {formatTemp(reading.temperature, settings.unit, 1)}
                          </TableCell>
                          <TableCell className="text-right font-mono text-xs text-muted-foreground">
                            {reading.humidity}%
                          </TableCell>
                          <TableCell className="text-right font-mono text-xs">
                            {formatTemp(reading.heatIndex, settings.unit, 1)}
                          </TableCell>
                          <TableCell className="text-right font-mono text-xs text-muted-foreground">
                            {reading.uv.toFixed(0)}
                          </TableCell>
                          <TableCell className="text-right">
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
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="7d" className="flex flex-col gap-4">
          <Card className="border-border/60 bg-card/70">
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Resumen de la semana
              </CardTitle>
              <CardDescription>
                Máxima diaria y promedio de temperatura. Las barras rojas
                indican días que superaron el umbral de peligro.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={weeklyConfig}
                className="aspect-auto h-[320px] w-full"
              >
                <ComposedChart
                  accessibilityLayer
                  data={WEEKLY_DATA}
                  margin={{ left: 0, right: 8, top: 8, bottom: 0 }}
                >
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis
                    domain={[25, 50]}
                    tickLine={false}
                    axisLine={false}
                    width={34}
                    tick={{ fontSize: 10 }}
                    tickFormatter={(value: number) => `${value}°`}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" />}
                  />
                  <Bar dataKey="max" radius={[6, 6, 0, 0]}>
                    {WEEKLY_DATA.map((entry) => (
                      <Cell
                        key={entry.day}
                        fill={
                          entry.max >= 39
                            ? "var(--zone-danger)"
                            : entry.max >= 32
                              ? "var(--zone-high)"
                              : "var(--zone-caution)"
                        }
                      />
                    ))}
                  </Bar>
                  <Line
                    dataKey="avg"
                    type="monotone"
                    stroke="var(--color-avg)"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />
                </ComposedChart>
              </ChartContainer>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-chart-2" />
                  Promedio
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-zone-danger" />
                  Máx. ≥ 39°
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-zone-high" />
                  Máx. 32–39°
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-zone-caution" />
                  Máx. &lt; 32°
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/70">
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Detalle por día
              </CardTitle>
              <CardDescription>
                Minutos estimados en zona de peligro o extrema.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Día</TableHead>
                    <TableHead className="text-right">Máx.</TableHead>
                    <TableHead className="text-right">Promedio</TableHead>
                    <TableHead className="text-right">Zona roja</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {WEEKLY_DATA.map((day) => (
                    <TableRow key={day.day}>
                      <TableCell className="font-medium">{day.day}</TableCell>
                      <TableCell className="text-right font-mono text-xs">
                        {formatTemp(day.max, settings.unit, 1)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs text-muted-foreground">
                        {formatTemp(day.avg, settings.unit, 1)}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="inline-flex items-center gap-1.5 font-mono text-xs">
                          <Clock3 className="size-3 text-muted-foreground" />
                          {day.danger} min
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
