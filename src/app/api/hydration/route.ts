import { NextResponse } from "next/server";

import { getDb } from "@/lib/db";
import { addWater } from "@/lib/neon-repo";
import { getSession } from "@/lib/session";


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
    const body = (await request.json()) as { ml?: number };

    if (
      typeof body.ml !== "number" ||
      !Number.isFinite(body.ml) ||
      body.ml < 50 ||
      body.ml > 1000
    ) {
      return NextResponse.json(
        { ok: false, error: "invalid_body" },
        { status: 400 },
      );
    }

    const waterMl = await addWater(sql, session.uid, Math.round(body.ml));

    return NextResponse.json({ ok: true, waterMl });
  } catch {
    return NextResponse.json(
      { ok: false, configured: true, error: "db_error" },
      { status: 500 },
    );
  }
}

