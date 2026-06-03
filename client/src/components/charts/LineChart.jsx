export function LineChart({ title, data = [] }) {
  const max = Math.max(...data.map((item) => item.value), 1);
  const points = data.map((item, index) => {
    const x = data.length === 1 ? 50 : (index / (data.length - 1)) * 100;
    const y = 100 - (item.value / max) * 82 - 8;
    return `${x},${y}`;
  });

  return (
    <div className="border border-stone-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="mt-5 h-56 bg-stone-50 p-4">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-stone-500">No trend data yet</div>
        ) : (
          <>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-40 w-full">
              <polyline fill="none" stroke="#047857" strokeWidth="3" points={points.join(" ")} />
              <polyline
                fill="none"
                stroke="#0f766e"
                strokeOpacity="0.18"
                strokeWidth="10"
                points={points.join(" ")}
              />
            </svg>
            <div className="mt-3 flex justify-between gap-2">
              {data.map((item) => (
                <div key={item.label} className="text-center">
                  <p className="text-xs font-semibold text-stone-700">{item.value}</p>
                  <p className="text-[10px] text-stone-500">{item.label}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

