"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";

type SearchItem = { id: string; query_tile: string; modality: "sar" | "optical"; top_k: number; created_at: string };

export function SearchDemo() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [items, setItems] = useState<SearchItem[]>([]);
  const [queryTile, setQueryTile] = useState("");
  const [modality, setModality] = useState<"sar" | "optical">("sar");
  const [topK, setTopK] = useState(5);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const response = await fetch("/api/searches", { cache: "no-store" });
    if (response.status === 401) return setAuthenticated(false);
    if (!response.ok) throw new Error("Could not load searches.");
    const data = await response.json(); setItems(data.items); setAuthenticated(true);
  }, []);
  useEffect(() => {
    const task = window.setTimeout(() => { void load().catch(() => { setAuthenticated(false); setMessage("The research workspace is temporarily unavailable."); }); }, 0);
    return () => window.clearTimeout(task);
  }, [load]);

  async function enterWorkspace() {
    setBusy(true); setMessage("");
    const response = await fetch("/api/auth/demo", { method: "POST" });
    if (response.ok) await load(); else setMessage("Demo sign-in is unavailable.");
    setBusy(false);
  }
  async function save(event: FormEvent) {
    event.preventDefault(); setBusy(true); setMessage("");
    const response = await fetch("/api/searches", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ queryTile, modality, topK }) });
    const data = await response.json();
    if (response.ok) { setQueryTile(""); setMessage("Search configuration saved. Embedding inference remains explicitly offline."); await load(); }
    else setMessage(data.error ?? "Could not save the search.");
    setBusy(false);
  }

  return <section className="relative mx-auto max-w-7xl px-6 pb-24" aria-labelledby="search-lab-title"><div className="rounded-3xl border border-cyan-300/20 bg-[#071820]/90 p-6 md:p-8">
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-cyan-300/10 pb-5"><div><p className="font-mono text-xs tracking-[.2em] text-cyan-300">PERSISTENT EXPERIMENT LOG</p><h2 id="search-lab-title" className="mt-2 text-3xl font-black">Cross-modal query setup</h2></div><span className="rounded bg-amber-300/10 px-3 py-2 font-mono text-xs text-amber-200">NO INFERENCE SCORES YET</span></div>
    {authenticated === null ? <p className="py-10 text-slate-400">Establishing ground station link…</p> : !authenticated ? <div className="py-10"><p className="max-w-xl text-slate-400">Enter the demo workspace to persist reproducible query configurations. This phase records metadata only and does not pretend a model has run.</p><button onClick={enterWorkspace} disabled={busy} className="mt-5 rounded bg-cyan-300 px-5 py-3 font-semibold text-[#06151d] disabled:opacity-50">{busy ? "CONNECTING…" : "ENTER DEMO LAB"}</button></div> : <div className="grid gap-8 pt-6 lg:grid-cols-[.8fr_1.2fr]">
      <form onSubmit={save} className="space-y-4"><label className="block text-sm text-slate-300">Tile reference<input required minLength={3} maxLength={80} value={queryTile} onChange={e=>setQueryTile(e.target.value)} placeholder="SEN12MS_ROIs1970_spring_42" className="mt-2 w-full rounded border border-cyan-300/20 bg-[#06151d] px-4 py-3 text-white outline-none focus:border-cyan-300" /></label><div className="grid grid-cols-2 gap-3"><label className="block text-sm text-slate-300">Query modality<select value={modality} onChange={e=>setModality(e.target.value as "sar"|"optical")} className="mt-2 w-full rounded border border-cyan-300/20 bg-[#06151d] px-4 py-3 text-white"><option value="sar">SAR</option><option value="optical">Optical</option></select></label><label className="block text-sm text-slate-300">Top-K<input type="number" min={1} max={20} value={topK} onChange={e=>setTopK(Number(e.target.value))} className="mt-2 w-full rounded border border-cyan-300/20 bg-[#06151d] px-4 py-3 text-white" /></label></div><button disabled={busy} className="rounded bg-cyan-300 px-5 py-3 font-semibold text-[#06151d] disabled:opacity-50">{busy ? "SAVING…" : "SAVE QUERY"}</button>{message && <p role="status" className="text-sm text-amber-200">{message}</p>}</form>
      <div><p className="mb-3 font-mono text-xs text-slate-500">RECENT CONFIGURATIONS</p>{items.length===0 ? <p className="rounded border border-dashed border-cyan-300/20 p-5 text-slate-500">No saved query configurations.</p> : <div className="space-y-2">{items.map(item=><div key={item.id} className="grid grid-cols-[1fr_auto] gap-4 rounded border border-cyan-300/10 bg-[#06151d] p-4"><div><p className="font-mono text-sm text-cyan-100">{item.query_tile}</p><p className="mt-1 text-xs text-slate-500">Saved {new Date(item.created_at).toLocaleString()}</p></div><span className="font-mono text-xs uppercase text-cyan-300">{item.modality} · K={item.top_k}</span></div>)}</div>}</div>
    </div>}
    {!authenticated && message && <p role="status" className="pb-5 text-sm text-amber-200">{message}</p>}
  </div></section>;
}
