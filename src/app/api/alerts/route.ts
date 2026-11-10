import { NextResponse } from "next/server";

import { getDb } from "@/lib/db";
import { insertAlertForUser } from "@/lib/neon-repo";
import { getSession } from "@/lib/session";
import type { Zone } from "@/lib/saber-heat";


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
    const body = (await request.json()) as {
      zone?: string;
      heatIndex?: number;
      message?: string;
      timestamp?: number;
    };

    if (
      typeof body.zone !== "string" ||
      !zones.has(body.zone as Zone) ||
      typeof body.heatIndex !== "number" ||
      typeof body.message !== "string" ||
      body.message.length === 0 ||
      body.message.length > 240
    ) {
      return NextResponse.json(
        { ok: false, error: "invalid_body" },
        { status: 400 },
      );
    }

    await insertAlertForUser(sql, session.uid, {
      zone: body.zone as Zone,
      heatIndex: body.heatIndex,
      message: body.message,
      timestamp:
        typeof body.timestamp === "number" ? body.timestamp : Date.now(),
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, configured: true, error: "db_error" },
      { status: 500 },
    );
  }
}

