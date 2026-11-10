import type {
  ApiAlert,
  ApiReading,
  ApiSettings,
  ApiState,
} from "@/lib/api-types";
import type { Db } from "@/lib/db";
import { hashPassword } from "@/lib/security";
import {
  calculateHeatIndex,
  clamp,
  DEFAULT_SETTINGS,
  getZone,
  round1,
  type Reading,
  type ScenarioId,
  type Settings,
  type Thresholds,
  type Zone,
} from "@/lib/saber-heat";

const DEMO_EMAIL = "demo@saberheat.local";
const DEMO_SERIAL = "SH-GO-000128";
const DEFAULT_THRESHOLDS: Thresholds = DEFAULT_SETTINGS.thresholds;

let schemaReady = false;

export async function ensureSchema(sql: Db): Promise<void> {
  if (schemaReady) return;

  await sql`
    create table if not exists app_users (
      id uuid primary key default gen_random_uuid(),
      email text unique not null,
      name text not null,
      password_hash text,
      created_at timestamptz not null default now()
    )
  `;

  await sql`
    create table if not exists devices (
      id uuid primary key default gen_random_uuid(),
      user_id uuid not null references app_users(id) on delete cascade,
      serial text unique not null,
      name text not null,
      firmware text not null default '1.4.2',
      battery integer not null default 78,
      signal integer not null default 82,
      connected boolean not null default true,
      updated_at timestamptz not null default now()
    )
  `;

  await sql`
    create table if not exists readings (
      id uuid primary key default gen_random_uuid(),
      device_id uuid not null references devices(id) on delete cascade,
      temperature numeric(5,2) not null,
      humidity integer not null,
      heat_index numeric(5,2) not null,
      uv numeric(5,2) not null default 0,
      zone text not null,
      battery integer not null default 78,
      created_at timestamptz not null default now()
    )
  `;

  await sql`
    create index if not exists readings_device_created_idx
    on readings (device_id, created_at desc)
  `;

  await sql`
    create table if not exists alerts (
      id uuid primary key default gen_random_uuid(),
      device_id uuid not null references devices(id) on delete cascade,
      zone text not null,
      heat_index numeric(5,2) not null,
      message text not null,
      acknowledged boolean not null default false,
      created_at timestamptz not null default now()
    )
  `;

  await sql`
    create index if not exists alerts_device_created_idx
    on alerts (device_id, created_at desc)
  `;

  await sql`
    create table if not exists app_settings (
      user_id uuid primary key references app_users(id) on delete cascade,
      unit text not null default 'c',
      hydration_interval integer not null default 30,
      notifications boolean not null default true,
      sound boolean not null default true,
      vibration boolean not null default true,
      emergency_contact text,
      thresholds jsonb not null default '{"caution":27,"high":32,"danger":39,"extreme":51}'::jsonb,
      scenario text not null default 'obra',
      demo_mode boolean not null default true,
      water_ml integer not null default 750,
      water_date date not null default current_date,
      updated_at timestamptz not null default now()
    )
  `;

  schemaReady = true;
}

export async function ensureDemoUser(sql: Db) {
  const [user] = await sql`
    insert into app_users (email, name, password_hash)
    values (${DEMO_EMAIL}, 'Anael H.', ${hashPassword("saber-heat-demo")})
    on conflict (email) do update set name = excluded.name
    returning id, email, name
  `;

  return user as { id: string; email: string; name: string };
}

export async function ensureDemoDevice(
  sql: Db,
  userId: string,
): Promise<string> {
  const [device] = await sql`
    insert into devices (user_id, serial, name, firmware, battery, signal, connected)
    values (${userId}, ${DEMO_SERIAL}, 'SABER-HEAT-8F2A', '1.4.2', 78, 82, true)
    on conflict (serial) do update
      set user_id = excluded.user_id,
          updated_at = now()
    returning id
  `;

  return String(device.id);
}

export async function ensureDemoSettings(
  sql: Db,
  userId: string,
): Promise<void> {
  await sql`
    insert into app_settings (user_id, thresholds)
    values (${userId}, ${JSON.stringify(DEFAULT_THRESHOLDS)}::jsonb)
    on conflict (user_id) do nothing
  `;
}

export async function getState(
  sql: Db,
  userId: string,
): Promise<ApiState | null> {
  const [device] = await sql`
    select id, connected, name, serial, firmware, battery, signal, updated_at
    from devices
    where user_id = ${userId}
    order by updated_at desc
    limit 1
  `;

  if (!device) return null;

  const [settings] = await sql`
    select unit, hydration_interval, notifications, sound, vibration,
           emergency_contact, thresholds, scenario, demo_mode, water_ml
    from app_settings
    where user_id = ${userId}
  `;

  if (!settings) return null;

  const readingRows = await sql`
    select * from (
      select id, temperature, humidity, heat_index, uv, zone, battery, created_at
      from readings
      where device_id = ${device.id as string}
      order by created_at desc
      limit 120
    ) t
    order by created_at asc
  `;

  const alertRows = await sql`
    select id, zone, heat_index, message, acknowledged, created_at
    from alerts
    where device_id = ${device.id as string}
    order by created_at desc
    limit 30
  `;

  return {
    device: {
      connected: Boolean(device.connected),
      name: String(device.name),
      serial: String(device.serial),
      firmware: String(device.firmware),
      battery: Number(device.battery),
      signal: Number(device.signal),
      updated_at: new Date(device.updated_at as string).toISOString(),
    },
    settings: mapSettings(settings),
    readings: readingRows.map((row) => mapReading(row)),
    alerts: alertRows.map((row) => mapAlert(row)),
  };
}

export async function insertReadingForUser(
  sql: Db,
  userId: string,
  reading: Reading,
): Promise<void> {
  const [device] = await sql`
    select id from devices
    where user_id = ${userId}
    order by updated_at desc
    limit 1
  `;

  if (!device) return;

  const deviceId = String(device.id);

  await sql`
    insert into readings
      (device_id, temperature, humidity, heat_index, uv, zone, battery, created_at)
    values
      (${deviceId}, ${round1(reading.temperature)}, ${Math.round(reading.humidity)}, ${round1(reading.heatIndex)}, ${round1(reading.uv)}, ${reading.zone}, ${Math.round(reading.battery)}, ${new Date(reading.timestamp).toISOString()})
  `;

  await sql`
    update devices
    set battery = ${Math.round(reading.battery)}, updated_at = now()
    where id = ${deviceId}
  `;

  await sql`
    delete from readings
    where device_id = ${deviceId}
      and id in (
        select id from readings
        where device_id = ${deviceId}
        order by created_at desc
        offset 400
      )
  `;
}

export async function insertAlertForUser(
  sql: Db,
  userId: string,
  alert: {
    zone: Zone;
    heatIndex: number;
    message: string;
    timestamp: number;
  },
): Promise<void> {
  const [device] = await sql`
    select id from devices
    where user_id = ${userId}
    order by updated_at desc
    limit 1
  `;

  if (!device) return;

  const deviceId = String(device.id);

  await sql`
    insert into alerts
      (device_id, zone, heat_index, message, acknowledged, created_at)
    values
      (${deviceId}, ${alert.zone}, ${round1(alert.heatIndex)}, ${alert.message}, false, ${new Date(alert.timestamp).toISOString()})
  `;

  await sql`
    delete from alerts
    where device_id = ${deviceId}
      and id in (
        select id from alerts
        where device_id = ${deviceId}
        order by created_at desc
        offset 50
      )
  `;
}

export async function acknowledgeAlert(
  sql: Db,
  userId: string,
  alertId: string,
): Promise<boolean> {
  const rows = await sql`
    update alerts
    set acknowledged = true
    where id = ${alertId}
      and device_id in (select id from devices where user_id = ${userId})
    returning id
  `;

  return rows.length > 0;
}

export async function acknowledgeAll(
  sql: Db,
  userId: string,
): Promise<void> {
  await sql`
    update alerts
    set acknowledged = true
    where device_id in (select id from devices where user_id = ${userId})
  `;
}

export async function updateSettings(
  sql: Db,
  userId: string,
  settings: Settings,
): Promise<void> {
  await sql`
    update app_settings
    set unit = ${settings.unit},
        hydration_interval = ${settings.hydrationInterval},
        notifications = ${settings.notifications},
        sound = ${settings.sound},
        vibration = ${settings.vibration},
        emergency_contact = ${settings.emergencyContact},
        thresholds = ${JSON.stringify(settings.thresholds)}::jsonb,
        scenario = ${settings.scenario},
        demo_mode = ${settings.demoMode},
        updated_at = now()
    where user_id = ${userId}
  `;
}

export async function addWater(
  sql: Db,
  userId: string,
  ml: number,
): Promise<number> {
  const [row] = await sql`
    update app_settings
    set water_ml = least(4000, (case when water_date = current_date then water_ml else 0 end) + ${ml}),
        water_date = current_date,
        updated_at = now()
    where user_id = ${userId}
    returning water_ml
  `;

  return Number(row?.water_ml ?? 0);
}

export async function updateDevice(
  sql: Db,
  userId: string,
  connected: boolean,
): Promise<void> {
  await sql`
    update devices
    set connected = ${connected}, updated_at = now()
    where user_id = ${userId}
  `;
}

export async function resetDemo(
  sql: Db,
  userId: string,
): Promise<void> {
  const [device] = await sql`
    select id from devices
    where user_id = ${userId}
    order by updated_at desc
    limit 1
  `;

  if (device) {
    const deviceId = String(device.id);
    await sql`delete from readings where device_id = ${deviceId}`;
    await sql`delete from alerts where device_id = ${deviceId}`;
    await seedDemoReadings(sql, deviceId);
    await seedDemoAlerts(sql, deviceId);
  }

  await sql`
    update devices
    set connected = true, battery = 78, signal = 82, updated_at = now()
    where user_id = ${userId}
  `;

  await sql`
    update app_settings
    set unit = 'c',
        hydration_interval = 30,
        notifications = true,
        sound = true,
        vibration = true,
        thresholds = ${JSON.stringify(DEFAULT_THRESHOLDS)}::jsonb,
        scenario = 'obra',
        demo_mode = true,
        water_ml = 750,
        water_date = current_date,
        updated_at = now()
    where user_id = ${userId}
  `;
}

async function seedDemoReadings(sql: Db, deviceId: string): Promise<void> {
  const scenario = {
    baseTemp: 41,
    baseHumidity: 38,
    baseUv: 10,
    minTemp: 36,
    maxTemp: 47,
  };
  const now = Date.now();

  for (let i = 0; i < 24; i += 1) {
    const date = new Date(now - (23 - i) * 60 * 60 * 1000);
    const hour = date.getHours();
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
    const zone = getZone(heatIndex, DEFAULT_THRESHOLDS);

    await sql`
      insert into readings
        (device_id, temperature, humidity, heat_index, uv, zone, battery, created_at)
      values
        (${deviceId}, ${temperature}, ${humidity}, ${heatIndex}, ${Math.max(0, uv)}, ${zone}, ${Math.round(92 - i * 0.6)}, ${date.toISOString()})
    `;
  }
}

async function seedDemoAlerts(sql: Db, deviceId: string): Promise<void> {
  const now = Date.now();
  const alerts = [
    {
      zone: "danger",
      heatIndex: 45.3,
      message: "Zona de peligro: busca sombra e hidrátate.",
      acknowledged: false,
      minutesAgo: 18,
    },
    {
      zone: "high",
      heatIndex: 36.8,
      message: "Zona alta: reduce la actividad y descansa.",
      acknowledged: true,
      minutesAgo: 52,
    },
    {
      zone: "danger",
      heatIndex: 43.1,
      message: "Zona de peligro: detente y busca un lugar fresco.",
      acknowledged: true,
      minutesAgo: 95,
    },
  ];

  for (const alert of alerts) {
    await sql`
      insert into alerts
        (device_id, zone, heat_index, message, acknowledged, created_at)
      values
        (${deviceId}, ${alert.zone}, ${alert.heatIndex}, ${alert.message}, ${alert.acknowledged}, ${new Date(now - alert.minutesAgo * 60 * 1000).toISOString()})
    `;
  }
}

function mapSettings(row: Record<string, unknown>): ApiSettings {
  const rawThresholds = row.thresholds;
  let thresholds: Thresholds = DEFAULT_THRESHOLDS;

  if (typeof rawThresholds === "string") {
    try {
      thresholds = JSON.parse(rawThresholds) as Thresholds;
    } catch {
      thresholds = DEFAULT_THRESHOLDS;
    }
  } else if (rawThresholds && typeof rawThresholds === "object") {
    thresholds = rawThresholds as Thresholds;
  }

  return {
    unit: row.unit === "f" ? "f" : "c",
    hydration_interval: Number(row.hydration_interval ?? 30),
    notifications: Boolean(row.notifications),
    sound: Boolean(row.sound),
    vibration: Boolean(row.vibration),
    emergency_contact:
      typeof row.emergency_contact === "string"
        ? row.emergency_contact
        : null,
    thresholds,
    scenario: (row.scenario as ScenarioId) ?? "obra",
    demo_mode: Boolean(row.demo_mode),
    water_ml: Number(row.water_ml ?? 750),
  };
}

function mapReading(row: Record<string, unknown>): ApiReading {
  return {
    id: String(row.id),
    temperature: Number(row.temperature),
    humidity: Number(row.humidity),
    heat_index: Number(row.heat_index),
    uv: Number(row.uv),
    zone: row.zone as Zone,
    battery: Number(row.battery),
    created_at: new Date(row.created_at as string).toISOString(),
  };
}

function mapAlert(row: Record<string, unknown>): ApiAlert {
  return {
    id: String(row.id),
    zone: row.zone as Zone,
    heat_index: Number(row.heat_index),
    message: String(row.message),
    acknowledged: Boolean(row.acknowledged),
    created_at: new Date(row.created_at as string).toISOString(),
  };
}
