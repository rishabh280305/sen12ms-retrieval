import { z } from "zod";
import { database } from "@/lib/db";
import { getDemoUser } from "@/lib/session";

const inputSchema = z.object({
  queryTile: z.string().trim().min(3).max(80),
  modality: z.enum(["sar", "optical"]),
  topK: z.coerce.number().int().min(1).max(20),
});

export async function GET() {
  const userId = await getDemoUser();
  if (!userId) return Response.json({ error: "Authentication required." }, { status: 401 });
  const sql = await database();
  const items = await sql`SELECT id, query_tile, modality, top_k, created_at FROM sen12ms.saved_searches WHERE user_id = ${userId} ORDER BY created_at DESC LIMIT 20`;
  return Response.json({ items, mode: "saved-search metadata", modelStatus: "Embedding inference is not yet deployed." });
}

export async function POST(request: Request) {
  const userId = await getDemoUser();
  if (!userId) return Response.json({ error: "Authentication required." }, { status: 401 });
  const parsed = inputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Provide a tile reference, modality, and Top-K from 1 to 20." }, { status: 400 });
  const sql = await database();
  const [item] = await sql`INSERT INTO sen12ms.saved_searches (user_id, query_tile, modality, top_k)
    VALUES (${userId}, ${parsed.data.queryTile}, ${parsed.data.modality}, ${parsed.data.topK})
    RETURNING id, query_tile, modality, top_k, created_at`;
  return Response.json({ item, modelStatus: "Saved only; no retrieval score has been fabricated." }, { status: 201 });
}
