"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast, Toaster } from "sonner";

import { ChunkReloader } from "@/components/chunk-reloader";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { ApiState } from "@/lib/api-types";
import {
  calculateHeatIndex,
  createInitialAlerts,
  createInitialReadings,
  DEFAULT_SETTINGS,
  getZone,
  INITIAL_DEVICE,
  nextReading,
  round1,
  scenarioReading,
  ZONES,
  type AlertItem,
  type DeviceState,
  type Reading,
  type ScenarioId,
  type Settings,
  type Thresholds,
  type Zone,
  type ZoneMeta,
} from "@/lib/saber-heat";

type DbMode = "connecting" | "online" | "local";

type SaberHeatContextValue = {
  device: DeviceState;
  settings: Settings;
  readings: Reading[];
  alerts: AlertItem[];
  waterMl: number;
  mounted: boolean;
  dbMode: DbMode;
  current: Reading;
  currentZone: ZoneMeta;
  zoneMinutes: number;
  unacknowledgedCount: number;
  updateSettings: (partial: Partial<Settings>) => void;
  updateThreshold: (key: keyof Thresholds, value: number) => void;
  connectDevice: () => void;
  disconnectDevice: () => void;
  acknowledgeAlert: (id: string) => void;
  acknowledgeAll: () => void;
  addWater: (ml: number) => void;
  simulateDanger: () => void;
  resetDemo: () => void;
};

const SaberHeatContext = createContext<SaberHeatContextValue | null>(null);

export function SaberHeatProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [device, setDevice] = useState<DeviceState>(INITIAL_DEVICE);
  const [readings, setReadings] = useState<Reading[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [waterMl, setWaterMl] = useState(750);
  const [mounted, setMounted] = useState(false);
  const [dbMode, setDbMode] = useState<DbMode>("connecting");
  const [zoneMinutes, setZoneMinutes] = useState(12);

  const zoneEnteredAtRef = useRef(0);
  const lastReadingRef = useRef<Reading | null>(null);
  const lastZoneRef = useRef<Zone>("safe");
  const lastScenarioRef = useRef<ScenarioId>("obra");
  const scenarioInitializedRef = useRef(false);
  const settingsSyncedRef = useRef<string | null>(null);

  /* eslint-disable react-hooks/set-state-in-effect -- one-time hydration from localStorage */
  useEffect(() => {
    let initialSettings = DEFAULT_SETTINGS;

    try {
      const stored = window.localStorage.getItem("saber-heat-settings-v1");
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<Settings>;
        initialSettings = {
          ...DEFAULT_SETTINGS,
          ...parsed,
          thresholds: {
            ...DEFAULT_SETTINGS.thresholds,
            ...parsed.thresholds,
          },
        };
      }
    } catch {
      // Ignore corrupted settings and use the demo defaults.
    }

    const initialReadings = createInitialReadings(initialSettings);
    const lastReading = initialReadings[initialReadings.length - 1];

    lastReadingRef.current = lastReading;
    lastZoneRef.current = lastReading.zone;
    lastScenarioRef.current = initialSettings.scenario;

    setSettings(initialSettings);
    setReadings(initialReadings);
    setAlerts(createInitialAlerts());
    setDevice({ ...INITIAL_DEVICE, lastSync: Date.now() });

    try {
      const storedWater = window.localStorage.getItem("saber-heat-water-v1");
      if (storedWater) {
        const parsed = JSON.parse(storedWater) as { date: string; ml: number };
        if (parsed.date === new Date().toDateString()) {
          setWaterMl(parsed.ml);
        }
      }
    } catch {
      // Ignore corrupted water data.
    }

    setMounted(true);
    zoneEnteredAtRef.current = Date.now() - 12 * 60 * 1000;
    setZoneMinutes(12);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Hydrate the demo state from Neon when the API and the session are ready.
  useEffect(() => {
    if (!mounted) return;

    let cancelled = false;

    const hydrate = async () => {
      try {
        const sessionResponse = await fetch("/api/session", {
          method: "POST",
          credentials: "include",
        });

        if (!sessionResponse.ok) {
          if (!cancelled) setDbMode("local");
          return;
        }

        const stateResponse = await fetch("/api/state", {
          credentials: "include",
        });

        if (!stateResponse.ok) {
          if (!cancelled) setDbMode("local");
          return;
        }

        const json = (await stateResponse.json()) as {
          ok: boolean;
          data?: ApiState;
        };

        if (cancelled) return;

        if (!json.ok || !json.data) {
          setDbMode("local");
          return;
        }

        const data = json.data;
        const dbSettings: Settings = {
          unit: data.settings.unit,
          hydrationInterval: data.settings.hydration_interval,
          notifications: data.settings.notifications,
          sound: data.settings.sound,
          vibration: data.settings.vibration,
          emergencyContact: data.settings.emergency_contact ?? "",
          thresholds: data.settings.thresholds,
          scenario: data.settings.scenario,
          demoMode: data.settings.demo_mode,
        };
        const dbReadings: Reading[] = data.readings.map((reading) => ({
          id: reading.id,
          timestamp: new Date(reading.created_at).getTime(),
          temperature: reading.temperature,
          humidity: reading.humidity,
          heatIndex: reading.heat_index,
          uv: reading.uv,
          zone: reading.zone,
          battery: reading.battery,
        }));
        const dbAlerts: AlertItem[] = data.alerts.map((alert) => ({
          id: alert.id,
          timestamp: new Date(alert.created_at).getTime(),
          zone: alert.zone,
          heatIndex: alert.heat_index,
          message: alert.message,
          acknowledged: alert.acknowledged,
        }));

        setDevice({
          connected: data.device.connected,
          name: data.device.name,
          serial: data.device.serial,
          firmware: data.device.firmware,
          battery: data.device.battery,
          signal: data.device.signal,
          lastSync: new Date(data.device.updated_at).getTime(),
        });
        setSettings(dbSettings);
        setReadings(dbReadings);
        setAlerts(dbAlerts);
        setWaterMl(data.settings.water_ml);

        const last = dbReadings[dbReadings.length - 1];

        if (last) {
          lastReadingRef.current = last;
          lastZoneRef.current = last.zone;
        }

        lastScenarioRef.current = dbSettings.scenario;
        scenarioInitializedRef.current = true;
        setDbMode("online");
      } catch {
        if (!cancelled) setDbMode("local");
      }
    };

    void hydrate();

    return () => {
      cancelled = true;
    };
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    window.localStorage.setItem(
      "saber-heat-settings-v1",
      JSON.stringify(settings),
    );
  }, [mounted, settings]);

  useEffect(() => {
    if (!mounted) return;
    window.localStorage.setItem(
      "saber-heat-water-v1",
      JSON.stringify({ date: new Date().toDateString(), ml: waterMl }),
    );
  }, [mounted, waterMl]);

  // Persist settings changes to Neon, debounced.
  useEffect(() => {
    if (!mounted || dbMode !== "online") return;

    const serialized = JSON.stringify(settings);

    if (settingsSyncedRef.current === null) {
      settingsSyncedRef.current = serialized;
      return;
    }

    if (settingsSyncedRef.current === serialized) return;

    const timeout = window.setTimeout(() => {
      settingsSyncedRef.current = serialized;
      void fetch("/api/settings", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: serialized,
      }).catch(() => {});
    }, 700);

    return () => window.clearTimeout(timeout);
  }, [mounted, dbMode, settings]);

  useEffect(() => {
    if (!mounted) return;
    if (!scenarioInitializedRef.current) {
      scenarioInitializedRef.current = true;
      return;
    }

    const next = scenarioReading(
      settings.scenario,
      settings.thresholds,
      lastReadingRef.current?.battery ?? device.battery,
    );

    lastReadingRef.current = next;
    lastZoneRef.current = next.zone;
    zoneEnteredAtRef.current = Date.now();
    setZoneMinutes(0);
    setReadings((previous) => [...previous, next].slice(-120));
    // We only want to react to scenario changes, not threshold changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.scenario, mounted]);

  const sync = useCallback(
    (url: string, init: RequestInit) => {
      if (dbMode !== "online") return;

      void fetch(url, {
        credentials: "include",
        ...init,
      }).catch(() => {});
    },
    [dbMode],
  );

  useEffect(() => {
    if (!mounted || !device.connected || !settings.demoMode) return;

    const interval = window.setInterval(() => {
      const previous = lastReadingRef.current;
      if (!previous) return;

      const next =
        lastScenarioRef.current !== settings.scenario
          ? scenarioReading(
              settings.scenario,
              settings.thresholds,
              previous.battery,
            )
          : nextReading(previous, settings.scenario, settings.thresholds);

      lastReadingRef.current = next;
      lastScenarioRef.current = settings.scenario;
      setReadings((current) => [...current, next].slice(-120));

      sync("/api/readings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });

      setZoneMinutes(
        Math.max(
          0,
          Math.floor((Date.now() - zoneEnteredAtRef.current) / 60000),
        ),
      );

      if (next.zone !== lastZoneRef.current) {
        lastZoneRef.current = next.zone;
        zoneEnteredAtRef.current = Date.now();
        setZoneMinutes(0);

        if (
          next.zone === "high" ||
          next.zone === "danger" ||
          next.zone === "extreme"
        ) {
          const alert: AlertItem = {
            id: `alert-${Date.now()}`,
            timestamp: Date.now(),
            zone: next.zone,
            heatIndex: next.heatIndex,
            message: ZONES[next.zone].advice,
            acknowledged: false,
          };

          setAlerts((current) => [alert, ...current].slice(0, 30));
          sync("/api/alerts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(alert),
          });
        }
      }
    }, 3500);

    return () => window.clearInterval(interval);
  }, [
    mounted,
    device.connected,
    settings.demoMode,
    settings.scenario,
    settings.thresholds,
    sync,
  ]);

  const updateSettings = useCallback((partial: Partial<Settings>) => {
    setSettings((current) => ({ ...current, ...partial }));
  }, []);

  const updateThreshold = useCallback(
    (key: keyof Thresholds, value: number) => {
      setSettings((current) => ({
        ...current,
        thresholds: { ...current.thresholds, [key]: value },
      }));
    },
    [],
  );

  const connectDevice = useCallback(() => {
    setDevice((current) => ({
      ...current,
      connected: true,
      lastSync: Date.now(),
    }));
    sync("/api/device", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ connected: true }),
    });
    toast.success("Dispositivo conectado", {
      description: "SABER-HEAT-8F2A · BLE 5.0 · señal 82 %",
    });
  }, [sync]);

  const disconnectDevice = useCallback(() => {
    setDevice((current) => ({ ...current, connected: false }));
    sync("/api/device", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ connected: false }),
    });
    toast.info("Dispositivo desconectado", {
      description: "El dispositivo sigue midiendo y guardando datos offline.",
    });
  }, [sync]);

  const acknowledgeAlert = useCallback(
    (id: string) => {
      setAlerts((current) =>
        current.map((alert) =>
          alert.id === id ? { ...alert, acknowledged: true } : alert,
        ),
      );
      sync(`/api/alerts/${id}`, { method: "PATCH" });
      toast.success("Alerta reconocida");
    },
    [sync],
  );

  const acknowledgeAll = useCallback(() => {
    setAlerts((current) =>
      current.map((alert) => ({ ...alert, acknowledged: true })),
    );
    sync("/api/alerts/ack-all", { method: "POST" });
    toast.success("Todas las alertas fueron reconocidas");
  }, [sync]);

  const addWater = useCallback(
    (ml: number) => {
      setWaterMl((current) => Math.min(4000, current + ml));

      if (dbMode === "online") {
        void fetch("/api/hydration", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ml }),
        })
          .then(async (response) => {
            if (!response.ok) return;
            const json = (await response.json()) as {
              ok: boolean;
              waterMl?: number;
            };
            if (json.ok && typeof json.waterMl === "number") {
              setWaterMl(json.waterMl);
            }
          })
          .catch(() => {});
      }

      toast.success(`+${ml} ml registrados`, {
        description: "La meta diaria es de 3 litros.",
      });
    },
    [dbMode],
  );

  const simulateDanger = useCallback(() => {
    const heatIndex = round1(calculateHeatIndex(44, 35));
    const next: Reading = {
      id: `danger-${Date.now()}`,
      timestamp: Date.now(),
      temperature: 44,
      humidity: 35,
      heatIndex,
      uv: 10,
      zone: "extreme",
      battery: lastReadingRef.current?.battery ?? device.battery,
    };

    lastReadingRef.current = next;
    lastZoneRef.current = "extreme";
    zoneEnteredAtRef.current = Date.now();
    setZoneMinutes(0);
    setReadings((current) => [...current, next].slice(-120));
    sync("/api/readings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });

    const alert: AlertItem = {
      id: `alert-${Date.now()}`,
      timestamp: Date.now(),
      zone: "extreme",
      heatIndex,
      message:
        "Riesgo extremo: busca sombra, agua y ayuda. Si hay síntomas, llama al 911.",
      acknowledged: false,
    };

    setAlerts((current) => [alert, ...current].slice(0, 30));
    sync("/api/alerts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(alert),
    });

    toast.error("Alerta extrema simulada", {
      description: "La hoja se pondría en rojo.",
    });
  }, [device.battery, sync]);

  const resetDemo = useCallback(() => {
    const initialReadings = createInitialReadings(DEFAULT_SETTINGS);
    const lastReading = initialReadings[initialReadings.length - 1];

    lastReadingRef.current = lastReading;
    lastZoneRef.current = lastReading.zone;
    lastScenarioRef.current = DEFAULT_SETTINGS.scenario;
    scenarioInitializedRef.current = false;
    settingsSyncedRef.current = JSON.stringify(DEFAULT_SETTINGS);
    zoneEnteredAtRef.current = Date.now() - 12 * 60 * 1000;
    setZoneMinutes(12);

    setSettings(DEFAULT_SETTINGS);
    setReadings(initialReadings);
    setAlerts(createInitialAlerts());
    setWaterMl(750);
    setDevice({ ...INITIAL_DEVICE, lastSync: Date.now() });

    window.localStorage.removeItem("saber-heat-settings-v1");
    window.localStorage.removeItem("saber-heat-water-v1");

    sync("/api/reset", { method: "POST" });

    toast.success("Demo reiniciada", {
      description: "Los datos volvieron al estado inicial.",
    });
  }, [sync]);

  const current =
    readings.length > 0
      ? readings[readings.length - 1]
      : scenarioReading(
          settings.scenario,
          settings.thresholds,
          device.battery,
          0,
        );
  const currentZone = ZONES[getZone(current.heatIndex, settings.thresholds)];
  const unacknowledgedCount = alerts.filter(
    (alert) => !alert.acknowledged,
  ).length;

  const value = useMemo<SaberHeatContextValue>(
    () => ({
      device,
      settings,
      readings,
      alerts,
      waterMl,
      mounted,
      dbMode,
      current,
      currentZone,
      zoneMinutes,
      unacknowledgedCount,
      updateSettings,
      updateThreshold,
      connectDevice,
      disconnectDevice,
      acknowledgeAlert,
      acknowledgeAll,
      addWater,
      simulateDanger,
      resetDemo,
    }),
    [
      device,
      settings,
      readings,
      alerts,
      waterMl,
      mounted,
      dbMode,
      current,
      currentZone,
      zoneMinutes,
      unacknowledgedCount,
      updateSettings,
      updateThreshold,
      connectDevice,
      disconnectDevice,
      acknowledgeAlert,
      acknowledgeAll,
      addWater,
      simulateDanger,
      resetDemo,
    ],
  );

  return (
    <SaberHeatContext.Provider value={value}>
      {children}
    </SaberHeatContext.Provider>
  );
}

export function useSaberHeat() {
  const context = useContext(SaberHeatContext);

  if (!context) {
    throw new Error("useSaberHeat must be used within SaberHeatProvider");
  }

  return context;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SaberHeatProvider>
      <TooltipProvider>
        <ChunkReloader />
        {children}
        <Toaster
          theme="dark"
          position="bottom-right"
          richColors
          closeButton
        />
      </TooltipProvider>
    </SaberHeatProvider>
  );
}
