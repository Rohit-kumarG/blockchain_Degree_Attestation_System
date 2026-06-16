import React from "react";

/**
 * Premium Admin Analytics Dashboard
 * Uses real data from requests prop
 */
export function AdminAnalyticsDashboard({ requests = [] }) {
  const total = requests.length;
  const issued    = requests.filter(r => r.status === "ISSUED").length;
  const rejected  = requests.filter(r => r.status === "REJECTED").length;
  const paid      = requests.filter(r => r.status === "PAID").length;
  const pendingVerify  = requests.filter(r => r.status === "PENDING_VERIFICATION" || r.status === "VERIFICATION_FAILED").length;
  const pendingPayment = requests.filter(r => r.status === "PENDING_PAYMENT").length;
  const yoloVerified   = requests.filter(r => r.yoloStatus === "VERIFIED").length;
  const ocrPassed      = requests.filter(r => r.ocrStatus === "PASSED").length;

  const safe = (n, d) => (d === 0 ? 0 : Math.round((n / d) * 100));
  const ocrRate      = safe(ocrPassed, total);
  const yoloRate     = safe(yoloVerified, total);
  const issuanceRate = safe(issued, total);
  const paymentRate  = safe(paid + issued, total);

  // ── Monthly trend (last 6 months) built from real request dates ──────────
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    return { year: d.getFullYear(), month: d.getMonth(), label: d.toLocaleString("default", { month: "short" }) };
  });

  const monthlyData = months.map(({ year, month, label }) => {
    const all      = requests.filter(r => { const d = new Date(r.createdAt); return d.getFullYear() === year && d.getMonth() === month; }).length;
    const approved = requests.filter(r => { const d = new Date(r.createdAt); return d.getFullYear() === year && d.getMonth() === month && r.status === "ISSUED"; }).length;
    const rej      = requests.filter(r => { const d = new Date(r.createdAt); return d.getFullYear() === year && d.getMonth() === month && r.status === "REJECTED"; }).length;
    return { label, all, approved, rejected: rej };
  });

  const maxMonthly = Math.max(1, ...monthlyData.map(m => m.all));

  // ── Status donut segments ─────────────────────────────────────────────────
  const statusData = [
    { label: "Issued",          value: issued,         color: "#22d3ee" },
    { label: "Rejected",        value: rejected,        color: "#f43f5e" },
    { label: "Paid",            value: paid,            color: "#a78bfa" },
    { label: "Pending Verify",  value: pendingVerify,  color: "#fbbf24" },
    { label: "Pending Payment", value: pendingPayment, color: "#34d399" },
  ].filter(s => s.value > 0);

  // Build donut arcs
  const radius = 36;
  const circ   = 2 * Math.PI * radius;
  let offset   = 0;
  const totalStatus = statusData.reduce((s, d) => s + d.value, 0) || 1;
  const donutSlices = statusData.map(s => {
    const pct  = s.value / totalStatus;
    const dash = pct * circ;
    const gap  = circ - dash;
    const slice = { ...s, dasharray: `${dash} ${gap}`, dashoffset: circ - offset, pct: Math.round(pct * 100) };
    offset += dash;
    return slice;
  });

  // ── Circular progress ring helper ─────────────────────────────────────────
  const Ring = ({ pct, color, label, sublabel }) => (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-20 h-20">
        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1e293b" strokeWidth="3.5" />
          <circle
            cx="18" cy="18" r="15.9" fill="none"
            stroke={color} strokeWidth="3.5" strokeLinecap="round"
            strokeDasharray={`${pct} ${100 - pct}`}
            style={{ filter: `drop-shadow(0 0 4px ${color})` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-base font-black text-white leading-none">{pct}%</span>
          <span className="text-[8px] text-slate-400 font-bold uppercase mt-0.5">{sublabel}</span>
        </div>
      </div>
      <span className="text-[10px] text-slate-400 font-semibold text-center leading-tight">{label}</span>
    </div>
  );

  if (total === 0) {
    return (
      <div className="rounded-2xl bg-[#0f172a] border border-slate-800 p-8 text-center text-slate-500 text-sm font-medium">
        No application data yet. Analytics will appear here once requests are submitted.
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-[#0f172a] border border-slate-800/60 shadow-2xl overflow-hidden font-sans">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-[#0f172a] to-[#0c1d3a]">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 mb-0.5">Admin Control Deck</p>
          <h2 className="text-base font-extrabold text-white">Attestation Analytics Overview</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Live</span>
          <span className="ml-3 text-xs font-bold text-slate-400">{total} total requests</span>
        </div>
      </div>

      <div className="p-6 space-y-6">

        {/* ── Row 1: KPI Cards ───────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Issued",          value: issued,         icon: "✅", color: "from-cyan-600/20 to-cyan-900/10 border-cyan-700/30", text: "text-cyan-300" },
            { label: "Rejected",        value: rejected,       icon: "❌", color: "from-rose-600/20 to-rose-900/10 border-rose-700/30", text: "text-rose-300" },
            { label: "Pending Verify",  value: pendingVerify,  icon: "🔍", color: "from-amber-600/20 to-amber-900/10 border-amber-700/30", text: "text-amber-300" },
            { label: "Pending Payment", value: pendingPayment, icon: "💳", color: "from-violet-600/20 to-violet-900/10 border-violet-700/30", text: "text-violet-300" },
          ].map(c => (
            <div key={c.label} className={`rounded-xl bg-gradient-to-br ${c.color} border p-4`}>
              <div className="text-xl mb-1">{c.icon}</div>
              <div className={`text-2xl font-black ${c.text}`}>{c.value}</div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide mt-1">{c.label}</div>
            </div>
          ))}
        </div>

        {/* ── Row 2: Monthly Bar Chart + Donut ──────────────────────────── */}
        <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">

          {/* Monthly grouped bar chart */}
          <div className="rounded-xl bg-[#0d1527] border border-slate-800 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Monthly Breakdown</p>
                <h3 className="text-sm font-bold text-white mt-0.5">Request Volume (Last 6 Months)</h3>
              </div>
              <div className="flex gap-3 text-[10px] font-bold">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-cyan-400 inline-block" /> Submitted</span>
                <span className="flex items-center gap-1 text-slate-400"><span className="w-2 h-2 rounded-sm bg-emerald-400 inline-block" /> Issued</span>
                <span className="flex items-center gap-1 text-slate-400"><span className="w-2 h-2 rounded-sm bg-rose-400 inline-block" /> Rejected</span>
              </div>
            </div>

            <div className="flex items-end gap-2 h-36">
              {monthlyData.map((m) => {
                const totalH   = Math.round((m.all      / maxMonthly) * 100);
                const approvedH = Math.round((m.approved / maxMonthly) * 100);
                const rejectedH = Math.round((m.rejected / maxMonthly) * 100);
                return (
                  <div key={m.label} className="flex-1 flex flex-col items-center gap-1">
                    <div className="flex gap-0.5 items-end w-full h-28">
                      {/* Total bar */}
                      <div className="flex-1 flex flex-col justify-end h-full" title={`${m.all} submitted`}>
                        <div
                          className="w-full rounded-t-sm bg-gradient-to-t from-cyan-600 to-cyan-400"
                          style={{ height: `${totalH}%`, boxShadow: "0 0 6px #22d3ee55", minHeight: m.all > 0 ? "4px" : "0" }}
                        />
                      </div>
                      {/* Issued bar */}
                      <div className="flex-1 flex flex-col justify-end h-full" title={`${m.approved} issued`}>
                        <div
                          className="w-full rounded-t-sm bg-gradient-to-t from-emerald-600 to-emerald-400"
                          style={{ height: `${approvedH}%`, boxShadow: "0 0 6px #34d39955", minHeight: m.approved > 0 ? "4px" : "0" }}
                        />
                      </div>
                      {/* Rejected bar */}
                      <div className="flex-1 flex flex-col justify-end h-full" title={`${m.rejected} rejected`}>
                        <div
                          className="w-full rounded-t-sm bg-gradient-to-t from-rose-600 to-rose-400"
                          style={{ height: `${rejectedH}%`, boxShadow: "0 0 6px #f43f5e55", minHeight: m.rejected > 0 ? "4px" : "0" }}
                        />
                      </div>
                    </div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase">{m.label}</span>
                    <span className="text-[9px] font-mono text-slate-600">{m.all}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Status donut */}
          <div className="rounded-xl bg-[#0d1527] border border-slate-800 p-5 flex flex-col">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">Request Status</p>
            <h3 className="text-sm font-bold text-white mb-4">Distribution</h3>

            <div className="flex gap-4 items-center flex-1">
              <div className="relative w-28 h-28 flex-shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  {donutSlices.length > 0 ? donutSlices.map((s, i) => (
                    <circle
                      key={i}
                      cx="50" cy="50" r={radius}
                      fill="none"
                      stroke={s.color}
                      strokeWidth="16"
                      strokeDasharray={s.dasharray}
                      strokeDashoffset={s.dashoffset}
                      style={{ filter: `drop-shadow(0 0 3px ${s.color}88)` }}
                    />
                  )) : (
                    <circle cx="50" cy="50" r={radius} fill="none" stroke="#1e293b" strokeWidth="16" />
                  )}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-white">{total}</span>
                  <span className="text-[9px] text-slate-400 font-bold">Total</span>
                </div>
              </div>

              <div className="space-y-2 flex-1 min-w-0">
                {donutSlices.map(s => (
                  <div key={s.label} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: s.color, boxShadow: `0 0 6px ${s.color}` }} />
                    <span className="text-[10px] text-slate-300 flex-1 truncate">{s.label}</span>
                    <span className="text-[10px] font-mono font-bold text-white">{s.value}</span>
                    <span className="text-[9px] text-slate-500 font-mono">({s.pct}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Row 3: Progress Rings + Pipeline Bars ──────────────────────── */}
        <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">

          {/* 4 rings */}
          <div className="rounded-xl bg-[#0d1527] border border-slate-800 p-5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">AI Verification Rates</p>
            <h3 className="text-sm font-bold text-white mb-4">System Performance</h3>
            <div className="grid grid-cols-2 gap-4">
              <Ring pct={ocrRate}      color="#22d3ee" sublabel="OCR"      label="OCR Document Scans" />
              <Ring pct={yoloRate}     color="#a78bfa" sublabel="YOLO"     label="Stamp Detection" />
              <Ring pct={issuanceRate} color="#34d399" sublabel="Issued"   label="Attestation Rate" />
              <Ring pct={paymentRate}  color="#fbbf24" sublabel="Paid"     label="Fee Cleared Rate" />
            </div>
          </div>

          {/* Pipeline horizontal bars */}
          <div className="rounded-xl bg-[#0d1527] border border-slate-800 p-5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Pipeline Status</p>
            <h3 className="text-sm font-bold text-white mb-5">Live Queue Breakdown</h3>
            <div className="space-y-4">
              {[
                { label: "Issued / Attested",    count: issued,         color: "#22d3ee", glow: "#22d3ee55" },
                { label: "Pending Verification", count: pendingVerify,  color: "#fbbf24", glow: "#fbbf2455" },
                { label: "Pending Payment",      count: pendingPayment, color: "#a78bfa", glow: "#a78bfa55" },
                { label: "Paid (Awaiting Mint)", count: paid,           color: "#34d399", glow: "#34d39955" },
                { label: "Rejected",             count: rejected,       color: "#f43f5e", glow: "#f43f5e55" },
              ].map(item => {
                const pct = total === 0 ? 0 : Math.round((item.count / total) * 100);
                return (
                  <div key={item.label}>
                    <div className="flex justify-between text-[10px] font-bold mb-1.5">
                      <span className="text-slate-300">{item.label}</span>
                      <span className="font-mono text-white">{item.count} <span className="text-slate-500">/ {total}</span></span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, background: item.color, boxShadow: `0 0 8px ${item.glow}` }}
                      />
                    </div>
                    <div className="text-right text-[9px] text-slate-600 font-mono mt-0.5">{pct}%</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
