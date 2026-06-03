import { Award, Building2, ShieldCheck } from "lucide-react";

export function UniversityLeaderboard({ analytics }) {
  const total = analytics?.totalUniversities || 0;
  const active = analytics?.activeUniversities || 0;
  const inactive = Math.max(total - active, 0);

  const rows = [
    { label: "Active institutions", value: active, icon: ShieldCheck, color: "text-emerald-700" },
    { label: "Total institutions", value: total, icon: Building2, color: "text-sky-700" },
    { label: "Pending/inactive", value: inactive, icon: Award, color: "text-amber-700" },
  ];

  return (
    <div className="border border-stone-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">University Network</h3>
          <p className="mt-1 text-sm text-stone-500">Institution onboarding and trust readiness summary.</p>
        </div>
        <span className="bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-900">Consortium</span>
      </div>
      <div className="mt-6 divide-y divide-stone-200 border border-stone-200">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-4 p-4">
            <div className="flex items-center gap-3">
              <row.icon className={row.color} size={22} />
              <p className="text-sm font-medium text-stone-700">{row.label}</p>
            </div>
            <p className="text-2xl font-semibold text-stone-950">{row.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

