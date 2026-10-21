"use client";

import { useState } from "react";

type Evaluation = { recallAt: Record<string, number>; meanReciprocalRank: number; rankings: { queryIndex: number; rankedCandidateIndices: number[]; similarities: number[]; relevantRank: number }[] };

const syntheticDiagnostic = {
  sarEmbeddings: [[1, 0.12, 0], [0.05, 1, 0.08], [0.12, 0, 1], [0.7, 0.65, 0.1]],
  opticalEmbeddings: [[0.96, 0.18, 0.02], [0.02, 0.98, 0.12], [0.08, 0.04, 0.99], [0.68, 0.7, 0.08]],
};

export function EvaluationDemo() {
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function run() {
    setBusy(true); setMessage("");
    const response = await fetch("/api/retrieval/evaluate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(syntheticDiagnostic) });
    const data = await response.json();
    if (response.ok) setEvaluation(data.evaluation); else setMessage(response.status===401?"Enter the demo lab above before running evaluation.":data.error);
    setBusy(false);
  }
  return <section className="relative mx-auto max-w-7xl px-6 pb-24" aria-labelledby="evaluation-title"><div className="rounded-3xl border border-cyan-300/20 bg-[#071820]/90 p-6 md:p-8"><div className="flex flex-wrap items-end justify-between gap-4 border-b border-cyan-300/10 pb-5"><div><p className="font-mono text-xs tracking-[.2em] text-cyan-300">RETRIEVAL METRICS ENGINE</p><h2 id="evaluation-title" className="mt-2 text-3xl font-black">Embedding evaluation harness</h2></div><span className="rounded bg-amber-300/10 px-3 py-2 font-mono text-xs text-amber-200">SYNTHETIC DIAGNOSTIC VECTORS</span></div><div className="grid gap-8 pt-6 lg:grid-cols-[.75fr_1.25fr]"><div><p className="text-sm leading-6 text-slate-400">The server normalizes submitted vectors, ranks every optical candidate by cosine similarity, and computes paired Recall@K plus mean reciprocal rank. The bundled vectors test the evaluator only; they are not model output.</p><button onClick={run} disabled={busy} className="mt-5 rounded bg-cyan-300 px-5 py-3 font-semibold text-[#06151d] disabled:opacity-50">{busy?"EVALUATING…":"RUN DIAGNOSTIC"}</button>{message&&<p role="status" className="mt-4 text-sm text-amber-200">{message}</p>}</div><div>{!evaluation?<p className="rounded border border-dashed border-cyan-300/20 p-5 text-slate-500">No metric run in this session.</p>:<><div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{Object.entries(evaluation.recallAt).map(([key,value])=><div key={key} className="rounded bg-[#06151d] p-4"><p className="font-mono text-xs text-slate-500">{key}</p><p className="mt-2 text-2xl font-black text-cyan-200">{(value*100).toFixed(1)}%</p></div>)}<div className="rounded bg-[#06151d] p-4"><p className="font-mono text-xs text-slate-500">MRR</p><p className="mt-2 text-2xl font-black text-cyan-200">{evaluation.meanReciprocalRank.toFixed(3)}</p></div></div><div className="mt-3 space-y-2">{evaluation.rankings.map(row=><div key={row.queryIndex} className="flex justify-between rounded border border-cyan-300/10 bg-[#06151d] p-3 font-mono text-xs"><span>Query {row.queryIndex}</span><span className="text-cyan-200">match rank {row.relevantRank} · cos {row.similarities[0].toFixed(4)}</span></div>)}</div></>}</div></div></div></section>;
}
