const baseUrl = process.env.BASE_URL ?? "https://sen12ms-retrieval.vercel.app";
const auth = await fetch(`${baseUrl}/api/auth/demo`, { method: "POST" });
if (!auth.ok) throw new Error(`Demo authentication failed: HTTP ${auth.status}`);
const cookie = auth.headers.get("set-cookie")?.split(";")[0];
if (!cookie) throw new Error("Demo session cookie was not returned");
const current = await fetch(`${baseUrl}/api/searches`, { headers: { Cookie: cookie } }).then(response => response.json());
if (!current.items?.some(item => item.query_tile === "SEN12MS_DEMO_TILE")) {
  const response = await fetch(`${baseUrl}/api/searches`, { method: "POST", headers: { "Content-Type": "application/json", Cookie: cookie }, body: JSON.stringify({ queryTile: "SEN12MS_DEMO_TILE", modality: "sar", topK: 5 }) });
  if (!response.ok) throw new Error(`Seed failed: HTTP ${response.status} ${await response.text()}`);
}
console.log("Verified the labeled SEN12MS demo query seed through the authenticated API.");
