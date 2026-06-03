const cells = [
  ["Auth", "Low", "bg-emerald-500"],
  ["Roles", "Low", "bg-emerald-500"],
  ["Hash", "Strong", "bg-sky-500"],
  ["IPFS", "Watch", "bg-amber-500"],
  ["Chain", "Ready", "bg-emerald-500"],
  ["Fraud", "Tracked", "bg-red-500"],
  ["Audit", "Active", "bg-sky-500"],
  ["QR", "Live", "bg-emerald-500"],
];

export function RiskHeatmap() {
  return (
    <div className="border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Security Heatmap</h3>
        <span className="bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">Fraud-aware</span>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {cells.map(([label, status, color]) => (
          <div key={label} className="border border-stone-200 bg-stone-50 p-3">
            <div className={`h-2 w-full ${color}`} />
            <p className="mt-3 text-sm font-semibold text-stone-800">{label}</p>
            <p className="text-xs text-stone-500">{status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

