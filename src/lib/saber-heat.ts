export type Zone = "safe" | "caution" | "high" | "danger" | "extreme";

export type ScenarioId = "obra" | "running" | "salon" | "casa";

export type Unit = "c" | "f";

export type Reading = {
  id: string;
  timestamp: number;
  temperature: number;
  humidity: number;
  heatIndex: number;
  uv: number;
  zone: Zone;
  battery: number;
};

export type AlertItem = {
  id: string;
  timestamp: number;
  zone: Zone;
  heatIndex: number;
  message: string;
  acknowledged: boolean;
};

export type DeviceState = {
  connected: boolean;
  name: string;
  serial: string;
  firmware: string;
  battery: number;
  signal: number;
  lastSync: number;
};

export type Thresholds = {
  caution: number;
  high: number;
  danger: number;
  extreme: number;
};

export type Settings = {
  unit: Unit;
  hydrationInterval: number;
  notifications: boolean;
  sound: boolean;
  vibration: boolean;
  emergencyContact: string;
  thresholds: Thresholds;
  scenario: ScenarioId;
  demoMode: boolean;
};

export type ZoneMeta = {
  label: string;
  short: string;
  description: string;
  advice: string;
  color: string;
  bg: string;
  text: string;
  border: string;
  dot: string;
};

export const ZONES: Record<Zone, ZoneMeta> = {
  safe: {
    label: "Seguro",
    short: "Azul",
    description: "Riesgo bajo",
    advice: "Sigue normal. Hidrátate y mantente atento.",
    color: "var(--zone-safe)",
    bg: "bg-zone-safe/10",
    text: "text-zone-safe",
    border: "border-zone-safe/30",
    dot: "bg-zone-safe",
  },
  caution: {
    label: "Precaución",
    short: "Verde",
    description: "Empieza a hacer calor",
    advice: "Bebe agua y busca sombra cuando puedas.",
    color: "var(--zone-caution)",
    bg: "bg-zone-caution/10",
    text: "text-zone-caution",
    border: "border-zone-caution/30",
    dot: "bg-zone-caution",
  },
  high: {
    label: "Alto",
    short: "Ámbar",
    description: "Riesgo alto",
    advice: "Reduce la actividad, busca sombra y descansa 10 min.",
    color: "var(--zone-high)",
    bg: "bg-zone-high/10",
    text: "text-zone-high",
    border: "border-zone-high/30",
    dot: "bg-zone-high",
  },
  danger: {
    label: "Peligro",
    short: "Rojo",
    description: "Riesgo importante",
    advice: "Detente, busca sombra, bebe agua y descansa 15 min.",
    color: "var(--zone-danger)",
    bg: "bg-zone-danger/10",
    text: "text-zone-danger",
    border: "border-zone-danger/30",
    dot: "bg-zone-danger",
  },
  extreme: {
    label: "Extremo",
    short: "Rojo intermitente",
    description: "Riesgo extremo",
    advice: "Sombra, agua y ayuda. Si hay síntomas, llama al 911.",
    color: "var(--zone-extreme)",
    bg: "bg-zone-extreme/15",
    text: "text-zone-extreme",
    border: "border-zone-extreme/40",
    dot: "bg-zone-extreme",
  },
};

export const SCENARIOS: Record<
  ScenarioId,
  {
    label: string;
    description: string;
    baseTemp: number;
    baseHumidity: number;
    baseUv: number;
    minTemp: number;
    maxTemp: number;
    variance: number;
  }
> = {
  obra: {
    label: "Obra al sol",
    description: "Trabajo pesado, sol directo, 41 °C",
    baseTemp: 41,
    baseHumidity: 38,
    baseUv: 10,
    minTemp: 36,
    maxTemp: 47,
    variance: 1.1,
  },
  running: {
    label: "Running",
    description: "Esfuerzo cardiovascular, 36 °C",
    baseTemp: 36,
    baseHumidity: 55,
    baseUv: 8,
    minTemp: 31,
    maxTemp: 42,
    variance: 1.7,
  },
  salon: {
    label: "Salón",
    description: "Interior con aire acondicionado",
    baseTemp: 26,
    baseHumidity: 50,
    baseUv: 1,
    minTemp: 23,
    maxTemp: 29,
    variance: 0.35,
  },
  casa: {
    label: "Casa",
    description: "Interior sin aire, 29 °C",
    baseTemp: 29,
    baseHumidity: 55,
    baseUv: 2,
    minTemp: 26,
    maxTemp: 34,
    variance: 0.55,
  },
};

export const DEFAULT_SETTINGS: Settings = {
  unit: "c",
  hydrationInterval: 30,
  notifications: true,
  sound: true,
  vibration: true,
  emergencyContact: "Mamá · +52 686 000 0000",
  thresholds: {
    caution: 27,
    high: 32,
    danger: 39,
    extreme: 51,
  },
  scenario: "obra",
  demoMode: true,
};

export const INITIAL_DEVICE: DeviceState = {
  connected: true,
  name: "SABER-HEAT-8F2A",
  serial: "SH-GO-000128",
  firmware: "1.4.2",
  battery: 78,
  signal: 82,
  lastSync: 0,
};

export const WEEKLY_DATA = [
  { day: "Lun", max: 38.2, avg: 31.4, danger: 35 },
  { day: "Mar", max: 40.1, avg: 33.1, danger: 50 },
  { day: "Mié", max: 42.6, avg: 34.8, danger: 75 },
  { day: "Jue", max: 44.3, avg: 36.2, danger: 95 },
  { day: "Vie", max: 41.8, avg: 34.1, danger: 60 },
  { day: "Sáb", max: 37.4, avg: 30.6, danger: 25 },
  { day: "Dom", max: 35.9, avg: 29.8, danger: 15 },
];

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function round1(value: number) {
  return Math.round(value * 10) / 10;
}

export function calculateHeatIndex(tempC: number, humidity: number): number {
  const t = (tempC * 9) / 5 + 32;
  const r = humidity;

  if (t < 80) return tempC;

  let hi =
    -42.379 +
    2.04901523 * t +
    10.14333127 * r -
    0.22475541 * t * r -
    0.00683783 * t * t -
    0.05481717 * r * r +
    0.00122874 * t * t * r +
    0.00085282 * t * r * r -
    0.00000199 * t * t * r * r;

  if (r < 13 && t >= 80 && t <= 112) {
    hi -= ((13 - r) / 4) * Math.sqrt((17 - Math.abs(t - 95)) / 17);
  } else if (r > 85 && t >= 80 && t <= 87) {
    hi += ((r - 85) / 10) * ((87 - t) / 5);
  }

  return (hi - 32) * (5 / 9);
}

export function getZone(heatIndex: number, thresholds: Thresholds): Zone {
  if (heatIndex >= thresholds.extreme) return "extreme";
  if (heatIndex >= thresholds.danger) return "danger";
  if (heatIndex >= thresholds.high) return "high";
  if (heatIndex >= thresholds.caution) return "caution";
  return "safe";
}

export function formatTemp(value: number, unit: Unit, digits = 0): string {
  const converted = unit === "f" ? (value * 9) / 5 + 32 : value;
  return `${converted.toFixed(digits)}°${unit === "f" ? "F" : "C"}`;
}

export function formatTime(timestamp: number): string {
  return new Intl.DateTimeFormat("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(timestamp);
}

export function formatDate(timestamp: number): string {
  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "short",
  }).format(timestamp);
}

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours} h ${rest} min` : `${hours} h`;
}

export function createInitialReadings(
  settings: Settings = DEFAULT_SETTINGS,
): Reading[] {
  const now = Date.now();
  const scenario = SCENARIOS[settings.scenario];
  const readings: Reading[] = [];

  for (let i = 0; i < 24; i += 1) {
    const timestamp = now - (23 - i) * 60 * 60 * 1000;
    const hour = new Date(timestamp).getHours();
    const wave = Math.sin(((hour - 9) / 24) * Math.PI * 2);
    const temperature = round1(
      clamp(
        scenario.baseTemp + wave * 4 + Math.sin(i * 1.7) * 0.4,
        scenario.minTemp,
        scenario.maxTemp,
      ),
    );
    const humidity = Math.round(
      clamp(
        scenario.baseHumidity - wave * 8 + Math.cos(i * 1.3) * 2,
        20,
        90,
      ),
    );
    const heatIndex = round1(calculateHeatIndex(temperature, humidity));
    const uv = round1(
      hour >= 6 && hour <= 18
        ? scenario.baseUv * Math.sin(((hour - 6) / 12) * Math.PI)
        : 0,
    );

    readings.push({
      id: `seed-${i}`,
      timestamp,
      temperature,
      humidity,
      heatIndex,
      uv: Math.max(0, uv),
      zone: getZone(heatIndex, settings.thresholds),
      battery: round1(92 - i * 0.6),
    });
  }

  return readings;
}

export function createInitialAlerts(): AlertItem[] {
  const now = Date.now();

  return [
    {
      id: "alert-1",
      timestamp: now - 18 * 60 * 1000,
      zone: "danger",
      heatIndex: 45.3,
      message: "Zona de peligro: busca sombra e hidrátate.",
      acknowledged: false,
    },
    {
      id: "alert-2",
      timestamp: now - 52 * 60 * 1000,
      zone: "high",
      heatIndex: 36.8,
      message: "Zona alta: reduce la actividad y descansa.",
      acknowledged: true,
    },
    {
      id: "alert-3",
      timestamp: now - 95 * 60 * 1000,
      zone: "danger",
      heatIndex: 43.1,
      message: "Zona de peligro: detente y busca un lugar fresco.",
      acknowledged: true,
    },
  ];
}

export function nextReading(
  previous: Reading,
  scenarioId: ScenarioId,
  thresholds: Thresholds,
): Reading {
  const scenario = SCENARIOS[scenarioId];
  const drift = (Math.random() - 0.5) * scenario.variance;
  const temperature = round1(
    clamp(
      previous.temperature + drift,
      scenario.minTemp,
      scenario.maxTemp,
    ),
  );
  const humidity = Math.round(
    clamp(previous.humidity + (Math.random() - 0.5) * 3, 20, 90),
  );
  const heatIndex = round1(calculateHeatIndex(temperature, humidity));
  const uv = round1(clamp(scenario.baseUv + (Math.random() - 0.5) * 1.4, 0, 12));

  return {
    id: `reading-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: Date.now(),
    temperature,
    humidity,
    heatIndex,
    uv,
    zone: getZone(heatIndex, thresholds),
    battery: Math.max(5, round1(previous.battery - 0.02)),
  };
}

export function scenarioReading(
  scenarioId: ScenarioId,
  thresholds: Thresholds,
  battery = 78,
  timestamp = Date.now(),
): Reading {
  const scenario = SCENARIOS[scenarioId];
  const heatIndex = round1(
    calculateHeatIndex(scenario.baseTemp, scenario.baseHumidity),
  );

  return {
    id: `scenario-${timestamp}`,
    timestamp,
    temperature: scenario.baseTemp,
    humidity: scenario.baseHumidity,
    heatIndex,
    uv: scenario.baseUv,
    zone: getZone(heatIndex, thresholds),
    battery,
  };
}
