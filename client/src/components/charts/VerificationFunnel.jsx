const stages = [
  { label: "Submitted", valueKey: "verificationAttempts", color: "bg-sky-700" },
  { label: "Valid", valueKey: "validDegrees", color: "bg-emerald-700" },
  { label: "On-chain", valueKey: "onChainDegrees", color: "bg-teal-700" },
  { label: "Flagged", valueKey: "fraudAttempts", color: "bg-red-700" },
];

export function VerificationFunnel({ analytics }) {
  const max = Math.max(...stages.map((stage) => Number(analytics?.[stage.valueKey] || 0)), 1);

  return (
    <div className="border border-stone-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">Verification Funnel</h3>
          <p className="mt-1 text-sm text-stone-500">How credential checks move through the trust pipeline.</p>
        </div>
        <span className="bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-900">Operational</span>
      </div>
      <div className="mt-6 space-y-4">
        {stages.map((stage) => {
          const value = Number(analytics?.[stage.valueKey] || 0);
          const width = Math.max((value / max) * 100, 10);

          return (
            <div key={stage.label}>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium text-stone-700">{stage.label}</span>
                <span className="font-semibold text-stone-950">{value}</span>
              </div>
              <div className="h-9 bg-stone-100">
                <div className={`flex h-full items-center px-3 text-xs font-semibold text-white ${stage.color}`} style={{ width: `${width}%` }}>
                  {stage.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

