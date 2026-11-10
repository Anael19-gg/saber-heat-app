import { NextResponse } from "next/server";

import { getDb } from "@/lib/db";
import { updateDevice } from "@/lib/neon-repo";
import { getSession } from "@/lib/session";


export async function PATCH(request: Request) {
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
    const body = (await request.json()) as { connected?: boolean };

    if (typeof body.connected !== "boolean") {
      return NextResponse.json(
        { ok: false, error: "invalid_body" },
        { status: 400 },
      );
    }

    await updateDevice(sql, session.uid, body.connected);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, configured: true, error: "db_error" },
      { status: 500 },
    );
  }
}

