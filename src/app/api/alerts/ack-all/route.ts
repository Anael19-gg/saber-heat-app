import { NextResponse } from "next/server";

import { getDb } from "@/lib/db";
import { acknowledgeAll } from "@/lib/neon-repo";
import { getSession } from "@/lib/session";


export async function POST() {
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
    await acknowledgeAll(sql, session.uid);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, configured: true, error: "db_error" },
      { status: 500 },
    );
  }
}

