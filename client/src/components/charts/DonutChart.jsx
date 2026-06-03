export function DonutChart({ title, data = [] }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let offset = 25;

  const segments = data.map((item) => {
    const dash = total === 0 ? 0 : (item.value / total) * 100;
    const segment = { ...item, dash, offset };
    offset -= dash;
    return segment;
  });

  return (
    <div className="border border-stone-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="mt-5 grid items-center gap-5 sm:grid-cols-[180px_1fr]">
        <div className="relative mx-auto h-44 w-44">
          <svg viewBox="0 0 42 42" className="h-full w-full -rotate-90">
            <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#e7e5e4" strokeWidth="6" />
            {segments.map((item) => (
              <circle
                key={item.label}
                cx="21"
                cy="21"
                r="15.915"
                fill="transparent"
                stroke={item.color}
                strokeDasharray={`${item.dash} ${100 - item.dash}`}
                strokeDashoffset={item.offset}
                strokeWidth="6"
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-3xl font-semibold">{total}</p>
            <p className="text-xs text-stone-500">checks</p>
          </div>
        </div>
        <div className="space-y-3">
          {data.map((item) => (
            <div key={item.label} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3" style={{ background: item.color }} />
                <span className="text-sm text-stone-600">{item.label}</span>
              </div>
              <span className="text-sm font-semibold">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

