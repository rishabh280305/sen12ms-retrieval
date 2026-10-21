import { z } from "zod";
import { getDemoUser } from "@/lib/session";
import { evaluatePairedRetrieval } from "@/lib/retrieval";

const vector = z.array(z.number().finite()).min(1).max(256);
const inputSchema = z.object({
  sarEmbeddings: z.array(vector).min(1).max(64),
  opticalEmbeddings: z.array(vector).min(1).max(64),
});

export async function POST(request: Request) {
  const userId = await getDemoUser();
  if (!userId) return Response.json({ error: "Authentication required." }, { status: 401 });
  const parsed = inputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Provide 1–64 paired, finite embedding vectors with at most 256 dimensions." }, { status: 400 });
  try {
    const evaluation = evaluatePairedRetrieval(parsed.data.sarEmbeddings, parsed.data.opticalEmbeddings);
    return Response.json({
      evaluation,
      direction: "SAR query → optical candidates",
      provenance: "Metrics are calculated from the submitted vectors. This endpoint does not claim they came from a trained model.",
    });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Evaluation failed." }, { status: 400 });
  }
}
