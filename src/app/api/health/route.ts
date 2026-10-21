export const dynamic = "force-dynamic";

export function GET() {
  return Response.json({ service: "sen12ms-retrieval", status: "ok", stage: "development", timestamp: new Date().toISOString() }, { headers: { "Cache-Control": "no-store" } });
}
