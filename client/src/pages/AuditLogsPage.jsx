import { History } from "lucide-react";
import { useEffect, useState } from "react";
import { StatusMessage } from "../components/StatusMessage.jsx";
import { apiRequest } from "../services/api.js";

export function AuditLogsPage({ token }) {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    apiRequest("/audit-logs", { token })
      .then((data) => setLogs(data.logs))
      .catch((err) => setError(err.message));
  }, [token]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <History className="text-emerald-700" />
        <div>
          <h2 className="text-2xl font-semibold">Audit Logs</h2>
          <p className="text-sm text-stone-500">Recent security and business events recorded by the backend.</p>
        </div>
      </div>

      <StatusMessage error={error} />

      <section className="border border-stone-200 bg-white">
        <div className="divide-y divide-stone-200">
          {logs.map((log) => (
            <div key={log._id} className="grid gap-2 p-5 lg:grid-cols-[1fr_220px]">
              <div>
                <p className="font-semibold">{log.action}</p>
                <p className="text-sm text-stone-500">
                  {log.actor?.name || "System/Public"} · {log.role || "NO_ROLE"} · {log.targetType || "Target"}
                </p>
                <pre className="mt-2 overflow-auto bg-stone-50 p-3 text-xs text-stone-700">
                  {JSON.stringify(log.metadata || {}, null, 2)}
                </pre>
              </div>
              <div className="text-sm text-stone-500 lg:text-right">
                {new Date(log.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
          {logs.length === 0 && !error ? (
            <p className="p-5 text-sm text-stone-500">No audit logs yet.</p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
