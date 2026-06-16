import { useEffect, useState } from "react";
import { PageHeader } from "../components/PageHeader.jsx";
import { StatusMessage } from "../components/StatusMessage.jsx";
import { apiRequest } from "../services/api.js";
import { AdminAnalyticsDashboard } from "../components/charts/AdminAnalyticsDashboard.jsx";
import {
  Building2, FileCheck2, Activity, ShieldAlert, TrendingUp, CheckCircle2, XCircle, AlertTriangle
} from "lucide-react";

export function DashboardPage({ token }) {
  const [analytics, setAnalytics] = useState(null);
  const [requests, setRequests]   = useState([]);
  const [error, setError]         = useState("");

  useEffect(() => {
    apiRequest("/analytics/dashboard", { token })
      .then(setAnalytics)
      .catch((err) => setError(err.message));

    // Also fetch all requests for the AdminAnalyticsDashboard chart
    apiRequest("/degree-requests/pending", { token })
      .then(data => setRequests(data.requests || []))
      .catch(() => {});
  }, [token]);

  // ── Derived values ────────────────────────────────────────────────────────
  const trustScore       = analytics?.trustScore ?? 100;
  const totalUniversities = analytics?.totalUniversities ?? 0;
  const totalDegrees      = analytics?.totalDegrees ?? 0;
  const verifications     = analytics?.verificationAttempts ?? 0;
  const fraudAttempts     = analytics?.fraudAttempts ?? 0;
  const validDegrees      = analytics?.validDegrees ?? 0;
  const revokedDegrees    = analytics?.revokedDegrees ?? 0;
  const onChainDegrees    = analytics?.onChainDegrees ?? 0;
  const activeUniversities = analytics?.activeUniversities ?? 0;

  // issuance trend
  const trend    = analytics?.issuanceTrend ?? [];
  const maxTrend = Math.max(1, ...trend.map(t => t.value));

  // verification breakdown donut
  const verBreakdown = analytics?.verificationBreakdown ?? [];
  const verTotal     = verBreakdown.reduce((s, d) => s + d.value, 0) || 1;
  const radius = 34;
  const circ   = 2 * Math.PI * radius;
  let   arcOff = 0;
  const donutArcs = verBreakdown.map(d => {
    const pct  = d.value / verTotal;
    const dash = pct * circ;
    const arc  = { ...d, dasharray: `${dash} ${circ - dash}`, dashoffset: circ - arcOff };
    arcOff += dash;
    return arc;
  });

  // top-level KPI cards
  const kpiCards = [
    { label: "Universities",    value: totalUniversities,  icon: Building2,    color: "from-cyan-600/20 to-cyan-900/10 border-cyan-700/30",     text: "text-cyan-300"   },
    { label: "Degrees Issued",  value: totalDegrees,       icon: FileCheck2,   color: "from-emerald-600/20 to-emerald-900/10 border-emerald-700/30", text: "text-emerald-300" },
    { label: "Verifications",   value: verifications,      icon: Activity,     color: "from-violet-600/20 to-violet-900/10 border-violet-700/30",  text: "text-violet-300" },
    { label: "Fraud Flags",     value: fraudAttempts,      icon: ShieldAlert,  color: "from-rose-600/20 to-rose-900/10 border-rose-700/30",        text: "text-rose-300"   },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Command Center"
        title="Degree Attestation Operations"
        description="Monitor university onboarding, issued credentials, verification attempts, and suspicious tamper signals across the platform."
      />
      <StatusMessage error={error} />

      {/* ── Request-Level Analytics (from AdminAnalyticsDashboard) ───────── */}
      <AdminAnalyticsDashboard requests={requests} />

      {/* ── Hero Banner + Trust Score ─────────────────────────────────────── */}
      <section className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0c1a3a] via-[#0f2057] to-[#071630] border border-blue-800/30 p-7 text-white shadow-2xl">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-32 w-full bg-gradient-to-t from-blue-950/40 to-transparent" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <p className="text-xs font-bold uppercase tracking-widest text-cyan-400">Ethereum + IPFS + MongoDB</p>
            </div>
            <h3 className="text-3xl font-black leading-tight text-white max-w-xl">
              Tamper-Evident Academic Credential Verification
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-200 opacity-80">
              Real-time blockchain-backed attestation system for degree verification with AI-powered document scanning.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { label: "Active Universities", value: activeUniversities },
                { label: "On-Chain Proofs",     value: onChainDegrees },
                { label: "Valid Degrees",        value: validDegrees },
              ].map(p => (
                <div key={p.label} className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-blue-300 mb-1">{p.label}</p>
                  <p className="text-2xl font-black text-white">{analytics ? p.value : "—"}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trust Score Ring */}
        <div className="rounded-2xl bg-[#0f172a] border border-slate-800 p-6 flex flex-col items-center justify-center gap-3 shadow-2xl">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Platform Trust Index</p>
          <div className="relative w-36 h-36">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1e293b" strokeWidth="3" />
              <circle
                cx="18" cy="18" r="15.9" fill="none"
                stroke={trustScore >= 80 ? "#22d3ee" : trustScore >= 50 ? "#fbbf24" : "#f43f5e"}
                strokeWidth="3" strokeLinecap="round"
                strokeDasharray={`${trustScore} ${100 - trustScore}`}
                style={{ filter: `drop-shadow(0 0 6px ${trustScore >= 80 ? "#22d3ee" : trustScore >= 50 ? "#fbbf24" : "#f43f5e"})` }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-white">{analytics ? trustScore : "—"}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">/ 100</span>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm font-black text-white">Trust Score</p>
            <p className="text-[10px] text-slate-500 mt-0.5">
              {trustScore >= 90 ? "Excellent – Minimal fraud signals" : trustScore >= 70 ? "Good – Minor anomalies" : "Review – High fraud signals"}
            </p>
          </div>
        </div>
      </section>

      {/* ── KPI Cards ─────────────────────────────────────────────────────── */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {kpiCards.map(({ label, value, icon: Icon, color, text }) => (
          <div key={label} className={`rounded-2xl bg-gradient-to-br ${color} border p-5 shadow-lg`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</span>
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                <Icon size={15} className={text} />
              </div>
            </div>
            <p className={`text-3xl font-black ${text}`}>{analytics ? value : "—"}</p>
            <p className="text-[9px] text-slate-500 font-semibold mt-1 uppercase tracking-wide">Live metric</p>
          </div>
        ))}
      </section>

      {/* ── Issuance Trend Bar Chart + Verification Donut ─────────────────── */}
      <section className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">

        {/* Monthly issuance bar chart */}
        <div className="rounded-2xl bg-[#0f172a] border border-slate-800 p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Trend</p>
              <h3 className="text-base font-bold text-white mt-0.5">Degree Issuance by Month</h3>
            </div>
            <TrendingUp size={18} className="text-cyan-400" />
          </div>

          {trend.length === 0 ? (
            <div className="h-36 flex items-center justify-center text-slate-600 text-sm">No issuance data yet</div>
          ) : (
            <>
              <div className="flex items-end gap-2 h-36">
                {trend.map((t, i) => {
                  const h = Math.round((t.value / maxTrend) * 100);
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[9px] font-mono text-cyan-400 font-bold">{t.value}</span>
                      <div className="w-full flex flex-col justify-end" style={{ height: "100px" }}>
                        <div
                          className="w-full rounded-t-md bg-gradient-to-t from-cyan-700 to-cyan-400 transition-all duration-700"
                          style={{ height: `${h}%`, minHeight: t.value > 0 ? "4px" : "0", boxShadow: "0 0 8px #22d3ee55" }}
                        />
                      </div>
                      <span className="text-[8px] text-slate-500 font-bold uppercase">{t.label}</span>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Verification donut */}
        <div className="rounded-2xl bg-[#0f172a] border border-slate-800 p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Breakdown</p>
              <h3 className="text-base font-bold text-white mt-0.5">Verification Results</h3>
            </div>
          </div>

          {verBreakdown.length === 0 || verBreakdown.every(v => v.value === 0) ? (
            <div className="h-36 flex items-center justify-center text-slate-600 text-sm">No verification data yet</div>
          ) : (
            <div className="flex gap-6 items-center">
              <div className="relative w-32 h-32 flex-shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  {donutArcs.map((arc, i) => (
                    <circle
                      key={i}
                      cx="50" cy="50" r={radius}
                      fill="none"
                      stroke={arc.color}
                      strokeWidth="14"
                      strokeDasharray={arc.dasharray}
                      strokeDashoffset={arc.dashoffset}
                      style={{ filter: `drop-shadow(0 0 3px ${arc.color}88)` }}
                    />
                  ))}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-white">{verifications}</span>
                  <span className="text-[9px] text-slate-400 font-bold">Total</span>
                </div>
              </div>
              <div className="space-y-2.5 flex-1">
                {verBreakdown.map(d => (
                  <div key={d.label} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color, boxShadow: `0 0 6px ${d.color}` }} />
                    <div className="flex-1">
                      <div className="flex justify-between text-[10px] font-bold mb-1">
                        <span className="text-slate-300">{d.label}</span>
                        <span className="text-white font-mono">{d.value}</span>
                      </div>
                      <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${Math.round((d.value / verTotal) * 100)}%`, background: d.color }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Credential Stats Bar Chart + Recent Verifications ─────────────── */}
      <section className="grid gap-4 xl:grid-cols-[1fr_1fr]">

        {/* Credential coverage horizontal bars */}
        <div className="rounded-2xl bg-[#0f172a] border border-slate-800 p-6 shadow-2xl">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Overview</p>
          <h3 className="text-base font-bold text-white mb-5">Credential Coverage</h3>
          <div className="space-y-5">
            {[
              { label: "Valid Degrees",   value: validDegrees,   max: totalDegrees || 1,  color: "#22d3ee", icon: CheckCircle2 },
              { label: "Revoked Degrees", value: revokedDegrees, max: totalDegrees || 1,  color: "#f43f5e", icon: XCircle },
              { label: "On-Chain Proofs", value: onChainDegrees, max: totalDegrees || 1,  color: "#a78bfa", icon: TrendingUp },
              { label: "Fraud Flags",     value: fraudAttempts,  max: verifications || 1, color: "#fbbf24", icon: AlertTriangle },
            ].map(({ label, value, max, color, icon: Icon }) => {
              const pct = Math.round((value / max) * 100);
              return (
                <div key={label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <Icon size={12} style={{ color }} />
                      <span className="text-[11px] font-bold text-slate-300">{label}</span>
                    </div>
                    <span className="text-[11px] font-mono font-black text-white">{analytics ? value : "—"} <span className="text-slate-600 font-normal text-[9px]">({pct}%)</span></span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, background: color, boxShadow: `0 0 8px ${color}66` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Verifications */}
        <div className="rounded-2xl bg-[#0f172a] border border-slate-800 p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Live Feed</p>
              <h3 className="text-base font-bold text-white">Recent Verifications</h3>
            </div>
            <span className="bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 text-[9px] font-bold text-cyan-400 rounded-full uppercase tracking-wider">Audit-ready</span>
          </div>
          <div className="space-y-2.5">
            {(analytics?.recentVerifications ?? []).length === 0 ? (
              <div className="rounded-xl bg-slate-800/50 p-5 text-sm text-slate-500 text-center">
                No verification attempts yet.
              </div>
            ) : (
              analytics.recentVerifications.map((item) => {
                const colorMap = { VALID: "#22d3ee", REVOKED: "#fbbf24", TAMPERED: "#f43f5e", NOT_FOUND: "#64748b" };
                const color = colorMap[item.result] || "#94a3b8";
                return (
                  <div key={item.id} className="flex items-center gap-3 rounded-xl bg-slate-800/40 border border-slate-700/30 p-3">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-white">{item.studentName || "Unknown student"}</p>
                      <p className="text-[10px] text-slate-400 truncate">{item.degreeTitle || "Credential check"}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ color, background: `${color}18`, border: `1px solid ${color}44` }}>
                        {item.result}
                      </span>
                      <p className="text-[9px] text-slate-600 mt-1">{new Date(item.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
