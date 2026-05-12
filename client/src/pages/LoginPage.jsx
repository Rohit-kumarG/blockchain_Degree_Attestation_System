import { LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { apiRequest } from "../services/api.js";
import { StatusMessage } from "../components/StatusMessage.jsx";

export function LoginPage({ onLogin }) {
  const [form, setForm] = useState({ email: "admin@example.com", password: "ChangeMe123!" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const session = await apiRequest("/auth/login", {
        method: "POST",
        body: form,
      });
      onLogin(session);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen bg-[#eef2ef] lg:grid-cols-[1fr_500px]">
      <section className="relative flex items-center overflow-hidden px-6 py-10 sm:px-10">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#0f2b21_0%,#1f6f55_48%,#d7e7df_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-white/10" />
        <div className="relative max-w-3xl text-white">
          <div className="mb-6 flex h-14 w-14 items-center justify-center bg-white text-emerald-800 shadow-sm">
            <ShieldCheck size={30} />
          </div>
          <h1 className="max-w-2xl text-4xl font-semibold leading-tight sm:text-5xl">
            Degree Attestation Operations Console
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-emerald-50">
            Issue trusted degree records, generate tamper-evident hashes, and verify credentials through the backend and blockchain proof layer.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {["MongoDB records", "IPFS metadata", "Ethereum proof"].map((item) => (
              <div key={item} className="border border-white/25 bg-white/10 p-4 text-sm font-semibold backdrop-blur">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="flex items-center border-l border-stone-200 bg-white px-6 py-10 shadow-xl">
        <form onSubmit={handleSubmit} className="w-full space-y-5">
          <div>
            <h2 className="text-2xl font-semibold">Sign in</h2>
            <p className="mt-1 text-sm text-stone-500">Use the seeded super admin account.</p>
          </div>

          <StatusMessage error={error} />

          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm font-medium text-stone-700">
              <Mail size={16} />
              Email
            </span>
            <input
              className="focus-ring w-full border border-stone-300 bg-stone-50 px-3 py-3"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
            />
          </label>

          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm font-medium text-stone-700">
              <LockKeyhole size={16} />
              Password
            </span>
            <input
              className="focus-ring w-full border border-stone-300 bg-stone-50 px-3 py-3"
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="focus-ring flex h-12 w-full items-center justify-center bg-emerald-700 px-4 font-semibold text-white hover:bg-emerald-800 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </section>
    </main>
  );
}
