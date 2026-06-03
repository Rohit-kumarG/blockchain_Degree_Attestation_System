import { Activity, Building2, FileCheck2, Link2, SearchX, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { PageHeader } from "../components/PageHeader.jsx";
import { StatCard } from "../components/StatCard.jsx";
import { apiRequest } from "../services/api.js";
import { StatusMessage } from "../components/StatusMessage.jsx";
import { BarChart } from "../components/charts/BarChart.jsx";
import { DonutChart } from "../components/charts/DonutChart.jsx";
import { FraudIntelligence } from "../components/charts/FraudIntelligence.jsx";
import { LineChart } from "../components/charts/LineChart.jsx";
import { TrustScore } from "../components/charts/TrustScore.jsx";
import { UniversityLeaderboard } from "../components/charts/UniversityLeaderboard.jsx";
import { VerificationFunnel } from "../components/charts/VerificationFunnel.jsx";

const metricItems = [
  { key: "totalUniversities", label: "Universities", icon: Building2, tone: "bg-emerald-700" },
  { key: "totalDegrees", label: "Degrees", icon: FileCheck2, tone: "bg-sky-700" },
  { key: "verificationAttempts", label: "Verifications", icon: Activity, tone: "bg-stone-800" },
  { key: "fraudAttempts", label: "Fraud Flags", icon: SearchX, tone: "bg-red-700" },
];

const workflowSteps = [
  "University registered",
  "Metadata stored on IPFS",
  "Degree hash generated",
  "Smart contract proof issued",
  "Employer verification logged",
];

export function DashboardPage({ token }) {
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiRequest("/analytics/dashboard", { token })
      .then(setAnalytics)
      .catch((err) => setError(err.message));
  }, [token]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Command Center"
        title="Degree Attestation Operations"
        description="Monitor university onboarding, issued credentials, verification attempts, and suspicious tamper signals across the platform."
      />

      <StatusMessage error={error} />

      <section className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="relative overflow-hidden border border-emerald-900/20 bg-[#0f2b21] p-7 text-white shadow-sm">
          <div className="absolute -right-16 -top-16 h-56 w-56 bg-emerald-400/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-24 w-full bg-[linear-gradient(90deg,transparent,rgba(52,211,153,.18))]" />
          <div className="relative">
            <p className="text-sm font-semibold uppercase text-emerald-200">Private Ethereum + IPFS + MongoDB</p>
            <h3 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight">
              Tamper-evident academic credential verification platform
            </h3>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-emerald-50">
              The dashboard summarizes how many institutions, degrees, verifications, blockchain confirmations, and suspicious attempts exist in the system.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <HeroPill label="Active universities" value={analytics?.activeUniversities ?? "-"} />
              <HeroPill label="On-chain proofs" value={analytics?.onChainDegrees ?? "-"} />
              <HeroPill label="Valid degrees" value={analytics?.validDegrees ?? "-"} />
            </div>
          </div>
        </div>

        <TrustScore value={analytics?.trustScore ?? 100} />
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <VerificationFunnel analytics={analytics} />
        <UniversityLeaderboard analytics={analytics} />
        <FraudIntelligence analytics={analytics} />
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metricItems.map((item) => (
          <StatCard
            key={item.key}
            label={item.label}
            value={analytics?.[item.key] ?? "-"}
            icon={item.icon}
            tone={item.tone}
            caption="Live backend metric"
          />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <LineChart title="Degree Issuance Trend" data={analytics?.issuanceTrend ?? []} />
        <DonutChart title="Verification Results" data={analytics?.verificationBreakdown ?? []} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <BarChart
          title="Credential Coverage"
          color="#0369a1"
          data={[
            { label: "Valid", value: analytics?.validDegrees ?? 0 },
            { label: "Revoked", value: analytics?.revokedDegrees ?? 0 },
            { label: "On-chain", value: analytics?.onChainDegrees ?? 0 },
            { label: "Fraud", value: analytics?.fraudAttempts ?? 0 },
          ]}
        />

        <div className="border border-stone-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold">Recent Verification Activity</h3>
            <span className="bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-900">Audit-ready</span>
          </div>
          <div className="mt-5 space-y-3">
            {(analytics?.recentVerifications ?? []).length === 0 ? (
              <div className="bg-stone-50 p-5 text-sm text-stone-500">No verification attempts yet.</div>
            ) : (
              analytics.recentVerifications.map((item) => (
                <div key={item.id} className="flex items-start gap-3 border border-stone-200 bg-stone-50 p-3">
                  <div className="flex h-9 w-9 items-center justify-center bg-white text-emerald-700">
                    <ShieldCheck size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{item.result}</p>
                    <p className="truncate text-xs text-stone-500">
                      {item.studentName || "Unknown student"} · {item.degreeTitle || "Credential check"}
                    </p>
                  </div>
                  <p className="text-right text-[11px] text-stone-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="border border-stone-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold">Credential Trust Workflow</h3>
          <div className="mt-5 grid gap-3">
            {workflowSteps.map((step, index) => (
              <div key={step} className="flex items-center gap-3 border border-stone-200 bg-stone-50 p-3">
                <span className="flex h-8 w-8 items-center justify-center bg-emerald-700 text-sm font-semibold text-white">{index + 1}</span>
                <p className="text-sm font-medium text-stone-800">{step}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-stone-200 bg-[#10241c] p-6 text-white shadow-sm">
          <div className="flex items-center gap-3">
            <Link2 className="text-emerald-300" />
            <h3 className="text-lg font-semibold">Verification Rule</h3>
          </div>
          <p className="mt-4 text-sm leading-6 text-emerald-50">
            A degree is trusted only when the recomputed backend hash matches the stored proof and the credential has not been revoked.
          </p>
          <div className="mt-5 bg-white/10 p-4 font-mono text-xs leading-6 text-emerald-50">
            computedHash == blockchainHash
            <br />
            revoked == false
          </div>
        </div>
      </section>
    </div>
  );
}

function HeroPill({ label, value }) {
  return (
    <div className="border border-white/20 bg-white/10 p-4 backdrop-blur">
      <p className="text-xs font-semibold uppercase text-emerald-100">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}
