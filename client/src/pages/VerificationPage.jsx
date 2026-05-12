import { Search, ShieldAlert, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "../components/PageHeader.jsx";
import { StatusMessage } from "../components/StatusMessage.jsx";
import { apiRequest } from "../services/api.js";

export function VerificationPage() {
  const [degreeId, setDegreeId] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleVerify(event) {
    event.preventDefault();
    setError("");
    setResult(null);
    setBusy(true);

    try {
      const data = await apiRequest(`/verification/degrees/${degreeId}`);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Public Verification"
        title="Verify Degree"
        description="Paste a degree ID to check database integrity, recomputed hash status, blockchain state, and revocation status."
      />

      <section className="border border-stone-200 bg-white p-6 shadow-sm">
        <h3 className="text-xl font-semibold">Credential Lookup</h3>
        <p className="mt-1 text-sm text-stone-500">Paste a degree ID from the issued degrees list or QR value.</p>

        <form onSubmit={handleVerify} className="mt-5 flex flex-col gap-3 sm:flex-row">
          <input
            className="focus-ring min-h-12 flex-1 border border-stone-300 bg-stone-50 px-3"
            value={degreeId}
            onChange={(event) => setDegreeId(event.target.value)}
            placeholder="Degree MongoDB ID"
            required
          />
          <button disabled={busy} type="submit" className="focus-ring inline-flex h-12 items-center justify-center gap-2 bg-emerald-700 px-5 font-semibold text-white hover:bg-emerald-800 disabled:opacity-60">
            <Search size={18} />
            {busy ? "Checking..." : "Verify"}
          </button>
        </form>
      </section>

      <StatusMessage error={error} />

      {result ? (
        <section className="border border-stone-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            {result.valid ? <ShieldCheck className="text-emerald-700" /> : <ShieldAlert className="text-red-700" />}
            <div>
              <p className="text-sm text-stone-500">Verification result</p>
              <h3 className="text-2xl font-semibold">{result.result}</h3>
            </div>
          </div>

          {result.degree ? (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Info label="Student" value={result.degree.studentName} />
              <Info label="Degree" value={result.degree.degreeTitle} />
              <Info label="University" value={result.degree.university} />
              <Info label="IPFS CID" value={result.degree.ipfsCID} />
              <Info label="Hash matches" value={String(result.checks.hashMatches)} />
              <Info label="Blockchain configured" value={String(result.checks.blockchainConfigured)} />
              <Info label="Blockchain exists" value={String(result.checks.blockchainExists)} />
              <Info label="Blockchain valid" value={String(result.checks.blockchainValid)} />
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="border border-stone-200 bg-stone-50 p-4">
      <p className="text-sm text-stone-500">{label}</p>
      <p className="mt-1 break-all font-medium">{value || "-"}</p>
    </div>
  );
}
