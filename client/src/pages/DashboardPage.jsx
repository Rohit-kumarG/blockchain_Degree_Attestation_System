import { Activity, Building2, FileCheck2, SearchX } from "lucide-react";
import { useEffect, useState } from "react";
import { apiRequest } from "../services/api.js";
import { StatusMessage } from "../components/StatusMessage.jsx";

const metricItems = [
  { key: "totalUniversities", label: "Universities", icon: Building2, tone: "bg-emerald-700" },
  { key: "totalDegrees", label: "Degrees", icon: FileCheck2, tone: "bg-sky-700" },
  { key: "verificationAttempts", label: "Verifications", icon: Activity, tone: "bg-stone-800" },
  { key: "fraudAttempts", label: "Fraud Flags", icon: SearchX, tone: "bg-red-700" },
];

export function DashboardPage({ token }) {
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiRequest("/analytics/dashboard", { token })
      .then(setAnalytics)
      .catch((err) => setError(err.message));
  }, [token]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Operations Dashboard</h2>
        <p className="mt-1 text-sm text-stone-500">Live counts from MongoDB-backed records and verification attempts.</p>
      </div>

      <StatusMessage error={error} />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metricItems.map((item) => (
          <div key={item.key} className="border border-stone-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-stone-500">{item.label}</p>
                <p className="mt-2 text-3xl font-semibold">{analytics?.[item.key] ?? "-"}</p>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center text-white ${item.tone}`}>
                <item.icon size={24} />
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

