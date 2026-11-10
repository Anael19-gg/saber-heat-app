"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BatteryMedium,
  BellRing,
  ChartNoAxesCombined,
  ChevronsUpDown,
  Cpu,
  LayoutDashboard,
  RotateCcw,
  Settings2,
} from "lucide-react";

import { useSaberHeat } from "@/components/providers";
import { SaberHeatLogo } from "@/components/saber-heat-logo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const monitoringNav = [
  { href: "/", label: "Panel", icon: LayoutDashboard },
  { href: "/historial", label: "Historial", icon: ChartNoAxesCombined },
  { href: "/alertas", label: "Alertas", icon: BellRing },
] as const;

const systemNav = [
  { href: "/dispositivo", label: "Dispositivo", icon: Cpu },
  { href: "/ajustes", label: "Ajustes", icon: Settings2 },
] as const;

export function AppSidebar() {
  const pathname = usePathname();
  const { device, unacknowledgedCount, resetDemo } = useSaberHeat();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip="SABER HEAT"
              render={<Link href="/" />}
              className="overflow-hidden"
            >
              <div className="flex aspect-square size-9 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/25">
                <SaberHeatLogo className="size-6" />
              </div>
              <div className="grid flex-1 text-left leading-tight">
                <span className="truncate text-sm font-semibold tracking-[0.08em]">
                  SABER HEAT
                </span>
                <span className="truncate text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  Dev-Core · Cloud
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Monitoreo</SidebarGroupLabel>
          <SidebarMenu>
            {monitoringNav.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  isActive={isActive(item.href)}
                  tooltip={item.label}
                  render={<Link href={item.href} />}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
                {item.href === "/alertas" && unacknowledgedCount > 0 ? (
                  <SidebarMenuBadge className="bg-primary/15 text-primary">
                    {unacknowledgedCount}
                  </SidebarMenuBadge>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Sistema</SidebarGroupLabel>
          <SidebarMenu>
            {systemNav.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  isActive={isActive(item.href)}
                  tooltip={item.label}
                  render={<Link href={item.href} />}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip="Dispositivo"
              render={<Link href="/dispositivo" />}
              className="overflow-hidden"
            >
              <div className="relative flex size-8 items-center justify-center rounded-lg bg-muted">
                <Cpu className="size-4" />
                <span
                  className={cn(
                    "absolute -right-0.5 -top-0.5 size-2 rounded-full ring-2 ring-sidebar",
                    device.connected ? "bg-chart-3" : "bg-muted-foreground",
                  )}
                />
              </div>
              <div className="grid flex-1 text-left leading-tight">
                <span className="truncate text-xs font-medium">
                  {device.name}
                </span>
                <span className="truncate text-[10px] text-muted-foreground">
                  {device.connected
                    ? `${device.battery}% · BLE 5.0`
                    : "Sin conexión"}
                </span>
              </div>
              <BatteryMedium className="ml-auto size-4 text-muted-foreground" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarSeparator />

        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    size="lg"
                    className="data-[popup-open]:bg-sidebar-accent"
                  />
                }
              >
                <Avatar className="size-8 rounded-lg">
                  <AvatarFallback className="rounded-lg bg-primary/15 text-xs font-semibold text-primary">
                    AH
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left leading-tight">
                  <span className="truncate text-xs font-medium">Anael H.</span>
                  <span className="truncate text-[10px] text-muted-foreground">
                    Cuenta demo
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="end" className="w-56">
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
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
