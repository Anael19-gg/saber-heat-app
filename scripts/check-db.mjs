import { neon } from "@neondatabase/serverless";

const url = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

if (!url) {
  console.error("Missing DIRECT_URL or DATABASE_URL");
  process.exit(1);
}

const sql = neon(url);
const rows = await sql`select 1 as ok, current_database() as db, current_user as usr`;
console.log(JSON.stringify(rows));
