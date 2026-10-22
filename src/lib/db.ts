import "server-only";
import { neon } from "@neondatabase/serverless";

function client() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not configured");
  return neon(connectionString);
}

let initialized: Promise<void> | null = null;
export async function database() {
  const sql = client();
  initialized ??= (async () => {
    await sql`CREATE SCHEMA IF NOT EXISTS sen12ms`;
    await sql`CREATE TABLE IF NOT EXISTS sen12ms.saved_searches (
      id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      user_id text NOT NULL,
      query_tile text NOT NULL,
      modality text NOT NULL CHECK (modality IN ('sar', 'optical')),
      top_k integer NOT NULL CHECK (top_k BETWEEN 1 AND 20),
      created_at timestamptz NOT NULL DEFAULT now()
    )`;
    await sql`CREATE TABLE IF NOT EXISTS sen12ms.annotations (
      id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      user_id text NOT NULL,
      tile_id text NOT NULL,
      label text NOT NULL,
      note text NOT NULL DEFAULT '',
      created_at timestamptz NOT NULL DEFAULT now(),
      UNIQUE (user_id, tile_id)
    )`;
  })();
  await initialized;
  return sql;
}
