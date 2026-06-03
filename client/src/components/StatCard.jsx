export function StatCard({ label, value, icon: Icon, tone = "bg-emerald-700", caption }) {
  return (
    <div className="group border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-stone-500">{label}</p>
          <p className="mt-3 text-3xl font-semibold text-stone-950">{value}</p>
          {caption ? <p className="mt-2 text-xs text-stone-500">{caption}</p> : null}
        </div>
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center text-white shadow-sm ${tone}`}>
          <Icon size={23} />
        </div>
      </div>
      <div className="mt-5 h-1 bg-stone-100">
        <div className="h-full w-2/3 bg-emerald-600 transition group-hover:w-full" />
      </div>
    </div>
  );
}
