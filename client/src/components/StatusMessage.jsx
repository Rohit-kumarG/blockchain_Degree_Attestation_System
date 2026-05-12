export function StatusMessage({ error, success }) {
  if (!error && !success) return null;

  return (
    <div
      className={`border px-4 py-3 text-sm ${
        error ? "border-red-200 bg-red-50 text-red-800" : "border-emerald-200 bg-emerald-50 text-emerald-900"
      }`}
    >
      {error || success}
    </div>
  );
}

