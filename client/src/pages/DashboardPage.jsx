import { Activity, Building2, FileCheck2, SearchX } from "lucide-react";
import { useEffect, useState } from "react";
import { PageHeader } from "../components/PageHeader.jsx";
import { StatCard } from "../components/StatCard.jsx";
import { apiRequest } from "../services/api.js";
import { StatusMessage } from "../components/StatusMessage.jsx";

const metricItems = [
  { key: "totalUniversities", label: "Universities", icon: Building2, tone: "bg-emerald-700" },
  { key: "totalDegrees", label: "Degrees", icon: FileCheck2, tone: "bg-sky-700" },
  { key: "verificationAttempts", label: "Verifications", icon: Activity, tone: "bg-stone-800" },
  { key: "fraudAttempts", label: "Fraud Flags", icon: SearchX, tone: "bg-red-700" },
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

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="border border-stone-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold">Credential Trust Workflow</h3>
          <div className="mt-5 grid gap-3">
            {["University registered", "Degree metadata stored", "Hash generated", "Blockchain proof issued", "Employer verification logged"].map((step, index) => (
              <div key={step} className="flex items-center gap-3 border border-stone-200 bg-stone-50 p-3">
                <span className="flex h-8 w-8 items-center justify-center bg-emerald-700 text-sm font-semibold text-white">{index + 1}</span>
                <p className="text-sm font-medium text-stone-800">{step}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-stone-200 bg-[#10241c] p-6 text-white shadow-sm">
          <h3 className="text-lg font-semibold">Verification Rule</h3>
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
