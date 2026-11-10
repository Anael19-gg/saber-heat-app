"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BatteryMedium,
  Bluetooth,
  ChevronRight,
  Cpu,
  Database,
  RotateCcw,
  Settings2,
} from "lucide-react";

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
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const pageMeta: Record<string, { title: string; description: string }> = {
  "/": {
    title: "Panel",
    description: "Tu estado térmico, de un vistazo",
  },
  "/historial": {
    title: "Historial",
    description: "Tu exposición en el tiempo",
  },
  "/alertas": {
    title: "Alertas",
    description: "Eventos y reconocimientos",
  },
  "/dispositivo": {
    title: "Dispositivo",
    description: "Conexión y sensores",
  },
  "/ajustes": {
    title: "Ajustes",
    description: "Umbrales y preferencias",
  },
};

export function AppHeader() {
  const pathname = usePathname();
  const { device, dbMode, resetDemo } = useSaberHeat();
  const meta = pageMeta[pathname] ?? {
    title: "SABER HEAT",
    description: "Consola de monitoreo",
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b border-border/50 bg-background/75 px-3 backdrop-blur-xl md:px-5">
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
            "ml-1 hidden gap-1.5 border-border/60 bg-card/50 text-[10px] md:inline-flex",
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
        <Button
          variant="ghost"
          size="sm"
          className="hidden h-8 gap-2 text-xs text-muted-foreground lg:flex"
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

        <div className="hidden h-8 items-center gap-1.5 rounded-lg border border-border/60 bg-card/50 px-2.5 text-xs text-muted-foreground sm:flex">
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
