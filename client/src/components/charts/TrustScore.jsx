export function TrustScore({ value = 100 }) {
  const score = Math.max(0, Math.min(100, value));

  return (
    <div className="border border-stone-200 bg-[#10241c] p-6 text-white shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase text-emerald-200">Trust Score</p>
          <h3 className="mt-2 text-2xl font-semibold">Credential Integrity</h3>
        </div>
        <span className="bg-white/10 px-3 py-1 text-xs font-semibold text-emerald-50">Blockchain-backed</span>
      </div>
      <div className="mt-6 flex items-center gap-6">
        <div className="relative h-36 w-36">
          <svg viewBox="0 0 42 42" className="h-full w-full -rotate-90">
            <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="rgba(255,255,255,0.16)" strokeWidth="5" />
            <circle
              cx="21"
              cy="21"
              r="15.915"
              fill="transparent"
              stroke="#34d399"
              strokeDasharray={`${score} ${100 - score}`}
              strokeDashoffset="25"
              strokeLinecap="round"
              strokeWidth="5"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-3xl font-semibold">{score}%</p>
          </div>
        </div>
        <p className="max-w-sm text-sm leading-6 text-emerald-50">
          This score compares valid verification attempts against suspicious or tampered results.
        </p>
      </div>
    </div>
  );
}

