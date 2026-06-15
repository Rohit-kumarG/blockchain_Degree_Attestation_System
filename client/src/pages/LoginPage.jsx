import { LockKeyhole, Mail, ShieldCheck, UserRound } from "lucide-react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { apiRequest } from "../services/api.js";
import { StatusMessage } from "../components/StatusMessage.jsx";

export function LoginPage({ onLogin }) {
  const location = useLocation();
  const [mode, setMode] = useState(location.state?.mode || "signin");
  const [form, setForm] = useState({
    name: "",
    email: location.state?.mode === "signup" ? "" : "admin@example.com",
    password: location.state?.mode === "signup" ? "" : "ChangeMe123!",
    role: "STUDENT",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    if (mode === "signup") {
      const emailDomain = form.email.split("@")[1]?.toLowerCase();
      if (emailDomain !== "iqra.edu.pk" && !emailDomain?.endsWith(".iqra.edu.pk")) {
        setError("Only Iqra University email addresses (ending with @iqra.edu.pk) are allowed to sign up.");
        setLoading(false);
        return;
      }
    }

    try {
      const body =
        mode === "signin"
          ? { email: form.email, password: form.password }
          : { name: form.name, email: form.email, password: form.password, role: form.role };
      const session = await apiRequest(mode === "signin" ? "/auth/login" : "/auth/register", {
        method: "POST",
        body,
      });
      onLogin(session);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function switchMode(nextMode) {
    setMode(nextMode);
    setError("");
    setForm({
      name: "",
      email: nextMode === "signin" ? "admin@example.com" : "",
      password: nextMode === "signin" ? "ChangeMe123!" : "",
      role: "STUDENT",
    });
  }

  return (
    <main className="grid min-h-screen bg-slate-100 lg:grid-cols-[1fr_500px]">
      <section className="relative flex items-center overflow-hidden px-6 py-10 sm:px-10">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#0b2240_0%,#1e40af_48%,#dbeafe_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-white/10" />
        <div className="relative max-w-3xl text-white">
          <div className="mb-6 flex h-14 w-14 items-center justify-center bg-white p-2 shadow-sm rounded-lg">
            <img src="/logoiqra.png" alt="Iqra Logo" className="h-10 w-auto object-contain" />
          </div>
          <h1 className="max-w-2xl text-4xl font-semibold leading-tight sm:text-5xl">
            Iqra University Degree Attestation Portal
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-blue-50">
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
            <h2 className="text-2xl font-semibold">{mode === "signin" ? "Sign in" : "Create account"}</h2>
            <p className="mt-1 text-sm text-stone-500">
              {mode === "signin"
                ? "Use a demo account or your registered account."
                : "Public signup is available for students and employers."}
            </p>
          </div>

          <div className="grid grid-cols-2 border border-stone-300 bg-stone-50 p-1">
            <button
              type="button"
              onClick={() => switchMode("signin")}
              className={`h-10 text-sm font-semibold ${mode === "signin" ? "bg-blue-800 text-white" : "text-stone-700"}`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => switchMode("signup")}
              className={`h-10 text-sm font-semibold ${mode === "signup" ? "bg-blue-800 text-white" : "text-stone-700"}`}
            >
              Sign up
            </button>
          </div>

          <StatusMessage error={error} />

          {mode === "signup" ? (
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-medium text-stone-700">
                <UserRound size={16} />
                Full name
              </span>
              <input
                className="focus-ring w-full border border-stone-300 bg-stone-50 px-3 py-3"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                required
              />
            </label>
          ) : null}

          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm font-medium text-stone-700">
              <Mail size={16} />
              Email
            </span>
            <input
              className="focus-ring w-full border border-stone-300 bg-stone-50 px-3 py-3"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              required
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
              required
            />
          </label>

          {mode === "signup" ? (
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-stone-700">Account type</span>
              <select
                className="focus-ring w-full border border-stone-300 bg-stone-50 px-3 py-3"
                value={form.role}
                onChange={(event) => setForm({ ...form, role: event.target.value })}
              >
                <option value="STUDENT">Student</option>
                <option value="EMPLOYER">Employer</option>
              </select>
            </label>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="focus-ring flex h-12 w-full items-center justify-center bg-blue-800 px-4 font-semibold text-white hover:bg-blue-900 disabled:opacity-60"
          >
            {loading ? "Please wait..." : mode === "signin" ? "Sign in" : "Sign up"}
          </button>

          <div className="border border-stone-200 bg-stone-50 p-4">
            <p className="text-sm font-semibold text-stone-800">Demo accounts</p>
            <div className="mt-2 space-y-1 text-xs leading-5 text-stone-600">
              <p>Admin: admin@example.com</p>
              <p>University: university@example.com</p>
              <p>Student: student@example.com</p>
              <p>Employer: employer@example.com</p>
              <p>Auditor: auditor@example.com</p>
              <p>Password: ChangeMe123!</p>
            </div>
          </div>
        </form>
      </section>
    </main>
  );
}
