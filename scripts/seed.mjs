import { scryptSync } from "node:crypto";
import { neon } from "@neondatabase/serverless";

const url = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

if (!url) {
  console.error("Missing DIRECT_URL or DATABASE_URL");
  process.exit(1);
}

const salt = process.env.HASH_SALT;

if (!salt) {
  console.error("Missing HASH_SALT");
  process.exit(1);
}

const sql = neon(url);

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

const passwordHash = `${salt}:${scryptSync("saber-heat-demo", salt, 64).toString("hex")}`;

const [user] = await sql`
  insert into app_users (email, name, password_hash)
  values ('demo@saberheat.local', 'Anael H.', ${passwordHash})
  on conflict (email) do update
    set name = excluded.name,
        password_hash = excluded.password_hash
  returning id, email, name
`;

const [device] = await sql`
  insert into devices (user_id, serial, name, firmware, battery, signal, connected)
  values (${user.id}, 'SH-GO-000128', 'SABER-HEAT-8F2A', '1.4.2', 78, 82, true)
  on conflict (serial) do update
    set user_id = excluded.user_id,
        name = excluded.name,
        firmware = excluded.firmware,
        updated_at = now()
  returning id
`;

await sql`
  insert into app_settings (user_id, thresholds)
  values (${user.id}, ${JSON.stringify({ caution: 27, high: 32, danger: 39, extreme: 51 })}::jsonb)
  on conflict (user_id) do nothing
`;

await sql`delete from readings where device_id = ${device.id}`;
await sql`delete from alerts where device_id = ${device.id}`;

{
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
    const zone = getZone(heatIndex);

    await sql`
      insert into readings
        (device_id, temperature, humidity, heat_index, uv, zone, battery, created_at)
      values
        (${device.id}, ${temperature}, ${humidity}, ${heatIndex}, ${Math.max(0, uv)}, ${zone}, ${Math.round(92 - i * 0.6)}, ${date.toISOString()})
    `;
  }
}

{
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
        (${device.id}, ${alert.zone}, ${alert.heatIndex}, ${alert.message}, ${alert.acknowledged}, ${new Date(now - alert.minutesAgo * 60 * 1000).toISOString()})
    `;
  }
}

const [counts] = await sql`
  select
    (select count(*)::int from app_users) as users,
    (select count(*)::int from devices) as devices,
    (select count(*)::int from readings) as readings,
    (select count(*)::int from alerts) as alerts,
    (select count(*)::int from app_settings) as settings
`;

console.log("SEED_OK", JSON.stringify(counts));

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function round1(value) {
  return Math.round(value * 10) / 10;
}

function calculateHeatIndex(tempC, humidity) {
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

function getZone(heatIndex) {
  if (heatIndex >= 51) return "extreme";
  if (heatIndex >= 39) return "danger";
  if (heatIndex >= 32) return "high";
  if (heatIndex >= 27) return "caution";
  return "safe";
}
