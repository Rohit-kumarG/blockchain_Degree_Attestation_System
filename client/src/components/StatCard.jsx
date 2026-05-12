export function StatCard({ label, value, icon: Icon, tone = "bg-emerald-700", caption }) {
  return (
    <div className="border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-stone-500">{label}</p>
          <p className="mt-3 text-3xl font-semibold text-stone-950">{value}</p>
          {caption ? <p className="mt-2 text-xs text-stone-500">{caption}</p> : null}
        </div>
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center text-white ${tone}`}>
          <Icon size={23} />
        </div>
      </div>
    </div>
  );
}

