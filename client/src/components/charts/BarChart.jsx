export function BarChart({ title, data = [], color = "#047857" }) {
  const max = Math.max(...data.map((item) => item.value), 1);

  return (
    <div className="border border-stone-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <span className="bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600">Live</span>
      </div>
      <div className="flex h-56 items-end gap-3">
        {data.length === 0 ? (
          <div className="flex h-full w-full items-center justify-center bg-stone-50 text-sm text-stone-500">
            No chart data yet
          </div>
        ) : (
          data.map((item) => (
            <div key={item.label} className="flex h-full flex-1 flex-col justify-end gap-2">
              <div className="flex flex-1 items-end bg-stone-50">
                <div
                  className="w-full transition-all"
                  style={{
                    height: `${Math.max((item.value / max) * 100, 8)}%`,
                    background: color,
                  }}
                />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-stone-800">{item.value}</p>
                <p className="text-[11px] text-stone-500">{item.label}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

