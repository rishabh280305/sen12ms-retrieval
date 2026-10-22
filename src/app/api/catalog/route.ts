import { officialCatalog, catalogProvenance } from "@/lib/catalog";
import { getDemoUser } from "@/lib/session";

export async function GET(request: Request) {
  if (!await getDemoUser()) return Response.json({ error: "Authentication required." }, { status: 401 });
  const url=new URL(request.url); const query=(url.searchParams.get("query")??"").slice(0,80); const limit=Math.min(Math.max(Number(url.searchParams.get("limit")??20)||20,1),100);
  try { return Response.json({ tiles: await officialCatalog(query,limit), provenance: catalogProvenance, notice: "Identifiers come from the official test split. Pixel data is not bundled; no visual or geospatial claim is inferred from filenames." }); }
  catch(error){ return Response.json({ error:error instanceof Error?error.message:"Catalog unavailable.", retryable:true },{status:502}); }
}
