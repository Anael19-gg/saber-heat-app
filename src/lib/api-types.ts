import type {
  ScenarioId,
  Thresholds,
  Unit,
  Zone,
} from "@/lib/saber-heat";

export type ApiDevice = {
  connected: boolean;
  name: string;
  serial: string;
  firmware: string;
  battery: number;
  signal: number;
  updated_at: string;
};

export type ApiSettings = {
  unit: Unit;
  hydration_interval: number;
  notifications: boolean;
  sound: boolean;
  vibration: boolean;
  emergency_contact: string | null;
  thresholds: Thresholds;
  scenario: ScenarioId;
  demo_mode: boolean;
  water_ml: number;
};

export type ApiReading = {
  id: string;
  temperature: number;
  humidity: number;
  heat_index: number;
  uv: number;
  zone: Zone;
  battery: number;
  created_at: string;
};

export type ApiAlert = {
  id: string;
  zone: Zone;
  heat_index: number;
  message: string;
  acknowledged: boolean;
  created_at: string;
};

export type ApiState = {
  device: ApiDevice;
  settings: ApiSettings;
  readings: ApiReading[];
  alerts: ApiAlert[];
};

export type ApiSuccess<T> = {
  ok: true;
  data: T;
};

export type ApiFailure = {
  ok: false;
  error: string;
  configured?: boolean;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;
