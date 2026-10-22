import { SearchDemo } from "@/components/search-demo";
import { EvaluationDemo } from "@/components/evaluation-demo";
import { CatalogWorkbench } from "@/components/catalog-workbench";

const bands = ["SAR VV", "SAR VH", "Optical RGB", "Embeddings"];
export default function Home() {
  return <main className="min-h-screen overflow-hidden bg-[#06151d] text-white">
    <div className="pointer-events-none fixed inset-0 opacity-20 [background-image:linear-gradient(rgba(96,220,255,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(96,220,255,.12)_1px,transparent_1px)] [background-size:48px_48px]" />
    <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-6"><div><span className="text-2xl font-black tracking-tight">SEN<span className="text-cyan-300">12</span>MS</span><span className="ml-3 text-xs tracking-[.3em] text-slate-500">RETRIEVAL LAB</span></div><span className="rounded bg-cyan-300/10 px-3 py-2 font-mono text-xs text-cyan-200">REPRODUCIBLE LAB</span></nav>
    <section className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 pb-20 pt-16 lg:grid-cols-2 lg:pt-28"><div><div className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 px-4 py-2 text-xs tracking-widest text-cyan-200"><span className="h-2 w-2 rounded-full bg-cyan-300"/> VERIFIED DATA PROVENANCE</div><h1 className="text-5xl font-black leading-[.95] tracking-[-.05em] md:text-7xl">Find the Earth across sensors.</h1><p className="mt-7 max-w-xl text-lg leading-8 text-slate-400">A reproducible research workspace for cross-modal retrieval between Sentinel-1 radar and Sentinel-2 optical imagery using learned embeddings—not hand-authored matches.</p><a href="/api/health" className="mt-9 inline-flex rounded bg-cyan-300 px-6 py-3 font-semibold text-[#06151d]">Mission health</a></div>
      <div className="relative aspect-square rounded-full border border-cyan-300/20 bg-[radial-gradient(circle_at_40%_35%,#256e7d_0,#103341_32%,#071820_63%,transparent_64%)] shadow-[0_0_100px_rgba(34,211,238,.12)]"><div className="absolute inset-[12%] rounded-full border border-dashed border-cyan-300/30"/><div className="absolute inset-[28%] rounded-full border border-cyan-300/30"/><div className="absolute left-[15%] top-1/2 h-px w-[70%] bg-cyan-300/30"/><div className="absolute bottom-8 left-1/2 grid -translate-x-1/2 grid-cols-2 gap-2 sm:grid-cols-4">{bands.map(b=><span key={b} className="whitespace-nowrap rounded bg-[#071820]/90 px-3 py-2 font-mono text-[10px] text-cyan-100">{b}</span>)}</div></div>
    </section>
    <SearchDemo />
    <EvaluationDemo />
    <CatalogWorkbench />
  </main>;
}
