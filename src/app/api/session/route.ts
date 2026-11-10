import { NextResponse } from "next/server";

import { getDb } from "@/lib/db";
import {
  ensureDemoDevice,
  ensureDemoSettings,
  ensureDemoUser,
  ensureSchema,
} from "@/lib/neon-repo";
import { createSession, getSession } from "@/lib/session";


export async function POST() {
  const sql = getDb();

  if (!sql) {
    return NextResponse.json(
      { ok: false, configured: false },
      { status: 503 },
    );
  }

  try {
    await ensureSchema(sql);
    const user = await ensureDemoUser(sql);
    await ensureDemoDevice(sql, user.id);
    await ensureDemoSettings(sql, user.id);
    await createSession(user.id);

    return NextResponse.json({ ok: true, user });
  } catch {
    return NextResponse.json(
      { ok: false, configured: true, error: "db_error" },
      { status: 500 },
    );
  }
}

export async function GET() {
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
    const [user] = await sql`
      select id, email, name from app_users where id = ${session.uid}
    `;

    if (!user) {
      return NextResponse.json(
        { ok: false, error: "not_found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ ok: true, user });
  } catch {
    return NextResponse.json(
      { ok: false, configured: true, error: "db_error" },
      { status: 500 },
    );
  }
}

