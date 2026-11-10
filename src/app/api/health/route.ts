import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { getDb } from "@/lib/db";

export async function GET() {
  await headers();
  const sql = getDb();

  if (!sql) {
    return NextResponse.json(
      { ok: false, configured: false },
      { status: 503 },
    );
  }

  try {
    const rows = await sql`select 1 as ok`;
    return NextResponse.json({
      ok: true,
      db: "neon",
      check: rows[0]?.ok === 1,
    });
  } catch {
    return NextResponse.json(
      { ok: false, configured: true, error: "db_error" },
      { status: 500 },
    );
  }
}

