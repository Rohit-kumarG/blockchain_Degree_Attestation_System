import { AlertTriangle, FileCheck2, LockKeyhole, ScanSearch } from "lucide-react";

export function FraudIntelligence({ analytics }) {
  const fraud = analytics?.fraudAttempts || 0;
  const revoked = analytics?.revokedDegrees || 0;
  const checks = analytics?.verificationAttempts || 0;

  const cards = [
    { label: "Tamper attempts", value: fraud, icon: AlertTriangle, tone: "bg-red-50 text-red-800" },
    { label: "Revoked degrees", value: revoked, icon: LockKeyhole, tone: "bg-amber-50 text-amber-800" },
    { label: "Total checks", value: checks, icon: ScanSearch, tone: "bg-sky-50 text-sky-800" },
    { label: "Clean records", value: Math.max((analytics?.validDegrees || 0) - revoked, 0), icon: FileCheck2, tone: "bg-emerald-50 text-emerald-900" },
  ];

  return (
    <div className="border border-stone-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">Fraud Intelligence</h3>
          <p className="mt-1 text-sm text-stone-500">Quick signals for suspicious credential activity.</p>
        </div>
        <span className="bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">Detection</span>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {cards.map((card) => (
          <div key={card.label} className={`p-4 ${card.tone}`}>
            <div className="flex items-center justify-between gap-3">
              <card.icon size={22} />
              <p className="text-2xl font-semibold">{card.value}</p>
            </div>
            <p className="mt-3 text-sm font-semibold">{card.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

