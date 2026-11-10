import { NextResponse } from "next/server";

import { getDb } from "@/lib/db";
import { insertReadingForUser } from "@/lib/neon-repo";
import { getSession } from "@/lib/session";
import type { Reading, Zone } from "@/lib/saber-heat";


const zones = new Set<Zone>([
  "safe",
  "caution",
  "high",
  "danger",
  "extreme",
]);

export async function POST(request: Request) {
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
    const body = (await request.json()) as Partial<Reading>;

    if (
      typeof body.temperature !== "number" ||
      typeof body.humidity !== "number" ||
      typeof body.heatIndex !== "number" ||
      typeof body.uv !== "number" ||
      typeof body.zone !== "string" ||
      typeof body.battery !== "number" ||
      !zones.has(body.zone as Zone)
    ) {
      return NextResponse.json(
        { ok: false, error: "invalid_body" },
        { status: 400 },
      );
    }

    const reading: Reading = {
      id: `api-${Date.now()}`,
      timestamp:
        typeof body.timestamp === "number" ? body.timestamp : Date.now(),
      temperature: body.temperature,
      humidity: body.humidity,
      heatIndex: body.heatIndex,
      uv: body.uv,
      zone: body.zone as Zone,
      battery: body.battery,
    };

    await insertReadingForUser(sql, session.uid, reading);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, configured: true, error: "db_error" },
      { status: 500 },
    );
  }
}

