const OFFICIAL_TEST_SPLIT = "https://raw.githubusercontent.com/schmitt-muc/SEN12MS/master/splits/test_list.txt";

export type CatalogTile = { id: string; season: string; roi: string; patch: string; sar: string; optical: string; landCover: string };

export function parseTileId(id: string): CatalogTile | null {
  const match = /^(ROIs\d+)_(spring|summer|fall|winter)_s2_(\d+)_p(\d+)\.tif$/.exec(id);
  if (!match) return null;
  return { id, season: match[2], roi: `${match[1]} / scene ${match[3]}`, patch: match[4], sar: id.replace("_s2_", "_s1_"), optical: id, landCover: id.replace("_s2_", "_lc_") };
}

export async function officialCatalog(query: string, limit: number) {
  const response = await fetch(OFFICIAL_TEST_SPLIT, { next: { revalidate: 86_400 } });
  if (!response.ok) throw new Error(`Official manifest returned HTTP ${response.status}`);
  const normalized = query.toLowerCase();
  return (await response.text()).split(/\r?\n/).map(parseTileId).filter((tile): tile is CatalogTile => Boolean(tile) && (!normalized || JSON.stringify(tile).toLowerCase().includes(normalized))).slice(0, limit);
}

export const catalogProvenance = { source: OFFICIAL_TEST_SPLIT, dataset: "SEN12MS official holdout split", imageryBundled: false, download: "https://mediatum.ub.tum.de/1474000" };
