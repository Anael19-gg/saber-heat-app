import { neon } from "@neondatabase/serverless";

export type DbRow = Record<string, unknown>;

export type Db = (
  strings: TemplateStringsArray,
  ...values: unknown[]
) => Promise<DbRow[]>;

let client: Db | null = null;

export function getDb(): Db | null {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  if (!client) {
    client = neon(url) as unknown as Db;
  }
  return client;
}
