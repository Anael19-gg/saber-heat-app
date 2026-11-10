"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BatteryMedium,
  Bluetooth,
  ChevronRight,
  Cpu,
  Database,
  Footprints,
  HardHat,
  House,
  RotateCcw,
  Settings2,
  Sun,
} from "lucide-react";
import { toast } from "sonner";

import { useSaberHeat } from "@/components/providers";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { SCENARIOS, type ScenarioId } from "@/lib/saber-heat";
import { cn } from "@/lib/utils";

const pageMeta: Record<string, { title: string; description: string }> = {
  "/": {
    title: "Panel de control",
    description: "Monitoreo térmico en vivo",
  },
  "/historial": {
    title: "Historial",
    description: "Exposición, tendencias y reportes",
  },
  "/alertas": {
    title: "Alertas",
    description: "Eventos de riesgo y reconocimientos",
  },
  "/dispositivo": {
    title: "Dispositivo",
    description: "Conexión, sensores y firmware",
  },
  "/ajustes": {
    title: "Ajustes",
    description: "Umbrales, alertas y preferencias",
  },
};

const scenarioIcons: Record<ScenarioId, typeof HardHat> = {
  obra: HardHat,
  running: Footprints,
  salon: Sun,
  casa: House,
};

export function AppHeader() {
  const pathname = usePathname();
  const { settings, device, dbMode, updateSettings, resetDemo } =
    useSaberHeat();
  const meta = pageMeta[pathname] ?? {
    title: "SABER HEAT",
    description: "Consola de monitoreo",
  };
  const isLive = settings.demoMode && device.connected;
  const ScenarioIcon = scenarioIcons[settings.scenario];

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b border-border/60 bg-background/75 px-3 backdrop-blur-xl md:px-5">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-1 h-4" />

      <div className="flex min-w-0 flex-1 items-center gap-2">
        <span className="hidden text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground sm:inline">
          SABER HEAT
        </span>
        <ChevronRight className="hidden size-3 text-muted-foreground/50 sm:inline" />
        <span className="truncate text-sm font-semibold">{meta.title}</span>
        <Badge
          variant="outline"
          className={cn(
            "ml-1 hidden gap-1.5 border-border/70 bg-card/60 text-[10px] sm:inline-flex",
            isLive ? "text-chart-3" : "text-muted-foreground",
          )}
        >
          <span
            className={cn(
              "size-1.5 rounded-full",
              isLive ? "animate-pulse bg-chart-3" : "bg-muted-foreground",
            )}
          />
          {isLive ? "Demo en vivo" : "Demo pausado"}
        </Badge>
        <Badge
          variant="outline"
          className={cn(
            "ml-1 hidden gap-1.5 border-border/70 bg-card/60 text-[10px] md:inline-flex",
            dbMode === "online" ? "text-chart-3" : "text-muted-foreground",
          )}
        >
          <Database className="size-3" />
          {dbMode === "online"
            ? "Neon"
            : dbMode === "connecting"
              ? "Conectando"
              : "Local"}
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        <Select
          items={Object.entries(SCENARIOS).map(([value, scenario]) => ({
            value,
            label: scenario.label,
          }))}
          value={settings.scenario}
          onValueChange={(value) => {
            if (!value) return;
            const scenario = value as ScenarioId;
            updateSettings({ scenario });
            toast.success(`Escenario: ${SCENARIOS[scenario].label}`, {
              description: SCENARIOS[scenario].description,
            });
          }}
        >
          <SelectTrigger
            className="hidden h-8 w-[168px] gap-2 border-border/70 bg-card/60 text-xs md:flex"
            aria-label="Escenario de simulación"
          >
            <ScenarioIcon className="size-3.5 text-primary" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end">
            {Object.entries(SCENARIOS).map(([id, scenario]) => {
              const Icon = scenarioIcons[id as ScenarioId];
              return (
                <SelectItem key={id} value={id}>
                  <Icon className="size-3.5" />
                  {scenario.label}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="sm"
          className="hidden h-8 gap-2 border-border/70 bg-card/60 text-xs lg:flex"
          nativeButton={false}
          render={<Link href="/dispositivo" />}
        >
          <Bluetooth
            className={cn(
              "size-3.5",
              device.connected ? "text-chart-2" : "text-muted-foreground",
            )}
          />
          {device.connected ? "Conectado" : "Sin dispositivo"}
        </Button>

        <div className="hidden h-8 items-center gap-1.5 rounded-lg border border-border/70 bg-card/60 px-2.5 text-xs text-muted-foreground sm:flex">
          <BatteryMedium
            className={cn(
              "size-4",
              device.battery > 30 ? "text-chart-3" : "text-destructive",
            )}
          />
          <span className="font-mono">{device.battery}%</span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                className="rounded-full"
                aria-label="Abrir menú de cuenta"
              />
            }
          >
            <Avatar className="size-8">
              <AvatarFallback className="bg-primary/15 text-xs font-semibold text-primary">
                AH
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Cuenta demo</DropdownMenuLabel>
              <DropdownMenuItem render={<Link href="/dispositivo" />}>
                <Cpu />
                Dispositivo
              </DropdownMenuItem>
              <DropdownMenuItem render={<Link href="/ajustes" />}>
                <Settings2 />
                Ajustes
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={resetDemo}>
                <RotateCcw />
                Reiniciar demo
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
