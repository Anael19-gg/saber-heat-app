import { NextResponse } from "next/server";

import { getDb } from "@/lib/db";
import { updateSettings } from "@/lib/neon-repo";
import { getSession } from "@/lib/session";
import type {
  ScenarioId,
  Settings,
  Thresholds,
  Unit,
} from "@/lib/saber-heat";


const units = new Set<Unit>(["c", "f"]);
const scenarios = new Set<ScenarioId>([
  "obra",
  "running",
  "salon",
  "casa",
]);

export async function PUT(request: Request) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json(
      { ok: false, error: "unauthorized" },
      { status: 401 },
    );
  }

  const sql = getDb();

  if (!sql) {
    return NextResponse.json(
      { ok: false, configured: false },
      { status: 503 },
    );
  }

  try {
    const body = (await request.json()) as Partial<Settings>;
    const thresholds = body.thresholds as Partial<Thresholds> | undefined;

    if (
      !body.unit ||
      !units.has(body.unit) ||
      !body.scenario ||
      !scenarios.has(body.scenario) ||
      !thresholds ||
      typeof thresholds.caution !== "number" ||
      typeof thresholds.high !== "number" ||
      typeof thresholds.danger !== "number" ||
      typeof thresholds.extreme !== "number"
    ) {
      return NextResponse.json(
        { ok: false, error: "invalid_body" },
        { status: 400 },
      );
    }

    const settings: Settings = {
      unit: body.unit,
      hydrationInterval: Number(body.hydrationInterval ?? 30),
      notifications: Boolean(body.notifications),
      sound: Boolean(body.sound),
      vibration: Boolean(body.vibration),
      emergencyContact: String(body.emergencyContact ?? ""),
      thresholds: {
        caution: thresholds.caution,
        high: thresholds.high,
        danger: thresholds.danger,
        extreme: thresholds.extreme,
      },
      scenario: body.scenario,
      demoMode: Boolean(body.demoMode),
    };

    await updateSettings(sql, session.uid, settings);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, configured: true, error: "db_error" },
      { status: 500 },
    );
  }
}

