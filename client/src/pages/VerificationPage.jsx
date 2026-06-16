import { Search, ShieldAlert, ShieldCheck, Copy, CheckCircle2, XCircle, AlertTriangle, Hash, Calendar, Building2, GraduationCap, Link } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "../components/PageHeader.jsx";
import { StatusMessage } from "../components/StatusMessage.jsx";
import { apiRequest } from "../services/api.js";

export function VerificationPage() {
  const [hash, setHash]     = useState("");
  const [result, setResult] = useState(null);
  const [error, setError]   = useState("");
  const [busy, setBusy]     = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleVerify(event) {
    event.preventDefault();
    setError("");
    setResult(null);
    setBusy(true);

    try {
      const trimmed = hash.trim();
      // Use the new hash-based endpoint
      const data = await apiRequest(`/verification/hash/${encodeURIComponent(trimmed)}`);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  function handleCopy(text) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const resultConfig = {
    VALID:     { color: "emerald", icon: ShieldCheck,    label: "Degree is Authentic",    bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700" },
    REVOKED:   { color: "amber",   icon: AlertTriangle,  label: "Degree has been Revoked", bg: "bg-amber-50",   border: "border-amber-200",   text: "text-amber-700"   },
    TAMPERED:  { color: "red",     icon: ShieldAlert,    label: "Degree may be Tampered",  bg: "bg-red-50",     border: "border-red-200",     text: "text-red-700"     },
    NOT_FOUND: { color: "slate",   icon: XCircle,        label: "Degree not Found",        bg: "bg-slate-50",   border: "border-slate-200",   text: "text-slate-700"   },
  };

  const cfg = result ? (resultConfig[result.result] || resultConfig.NOT_FOUND) : null;
  const ResultIcon = cfg?.icon;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <PageHeader
        eyebrow="Public Blockchain Verification"
        title="Verify Degree Credential"
        description="Enter a degree blockchain hash to verify its authenticity, blockchain status, and tamper-evidence in real time."
      />

      {/* ── Input Card ────────────────────────────────────────────────────── */}
      <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
            <Hash size={18} className="text-emerald-700" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Credential Hash Lookup</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Paste the <strong>degree blockchain hash</strong> (from the issued certificate or QR code) to verify.
            </p>
          </div>
        </div>

        <form onSubmit={handleVerify} className="space-y-3">
          <div className="relative">
            <Hash size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="w-full pl-9 pr-4 py-3 border border-slate-300 rounded-xl bg-slate-50 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder-slate-400"
              value={hash}
              onChange={(e) => setHash(e.target.value)}
              placeholder="0x1a2b3c4d5e6f... (degree blockchain hash)"
              required
              spellCheck={false}
            />
          </div>
          <button
            disabled={busy || !hash.trim()}
            type="submit"
            className="w-full h-11 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all"
          >
            <Search size={16} />
            {busy ? "Verifying on Blockchain..." : "Verify Degree"}
          </button>
        </form>

        {/* Help text */}
        <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 text-xs text-blue-700 space-y-1">
          <p className="font-bold">Where to find the degree hash?</p>
          <ul className="list-disc list-inside space-y-0.5 text-blue-600">
            <li>On the blockchain-attested degree certificate (bottom section)</li>
            <li>Scan the QR code on the printed certificate</li>
            <li>From the student portal → "My Degrees" → Copy Hash</li>
            <li>Shared directly by the degree holder</li>
          </ul>
        </div>
      </section>

      <StatusMessage error={error} />

      {/* ── Result Card ───────────────────────────────────────────────────── */}
      {result && cfg && (
        <section className={`rounded-2xl border ${cfg.border} ${cfg.bg} p-6 space-y-5`}>
          {/* Result header */}
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${result.valid ? "bg-emerald-100" : "bg-red-100"}`}>
              <ResultIcon size={28} className={cfg.text} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Verification Result</p>
              <h3 className={`text-2xl font-black ${cfg.text}`}>{cfg.label}</h3>
              <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${cfg.border} ${cfg.text} bg-white`}>
                {result.result}
              </span>
            </div>
          </div>

          {/* Degree details */}
          {result.degree && (
            <>
              <div className="rounded-xl bg-white border border-slate-200 p-5 space-y-4">
                <p className="text-xs font-black uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-2">Degree Information</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <InfoRow icon={GraduationCap} label="Student Name" value={result.degree.studentName} />
                  <InfoRow icon={GraduationCap} label="Degree Title" value={result.degree.degreeTitle} />
                  <InfoRow icon={Building2}     label="University"   value={result.degree.university} />
                  <InfoRow icon={Calendar}      label="Graduation Year" value={String(result.degree.graduationYear)} />
                  <InfoRow icon={Calendar}      label="Issue Date"   value={result.degree.issueDate ? new Date(result.degree.issueDate).toLocaleDateString() : "-"} />
                  <InfoRow icon={GraduationCap} label="Department"   value={result.degree.department} />
                </div>

                {result.degree.revokedReason && (
                  <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800">
                    <span className="font-bold">Revocation Reason: </span>{result.degree.revokedReason}
                  </div>
                )}
              </div>

              {/* Hash + IPFS */}
              <div className="rounded-xl bg-white border border-slate-200 p-5 space-y-3">
                <p className="text-xs font-black uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-2">Blockchain Details</p>

                {result.degree.degreeHash && (
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Degree Hash</p>
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                      <p className="text-xs font-mono text-slate-700 break-all flex-1">{result.degree.degreeHash}</p>
                      <button onClick={() => handleCopy(result.degree.degreeHash)} className="flex-shrink-0 text-slate-400 hover:text-slate-700 transition">
                        {copied ? <CheckCircle2 size={14} className="text-emerald-600" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>
                )}

                {result.degree.ipfsCID && (
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-500 uppercase">IPFS CID</p>
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                      <p className="text-xs font-mono text-slate-700 break-all flex-1">{result.degree.ipfsCID}</p>
                      <a
                        href={`https://ipfs.io/ipfs/${result.degree.ipfsCID}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 text-blue-500 hover:text-blue-700 transition"
                        title="Open on IPFS"
                      >
                        <Link size={14} />
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Integrity checks */}
              <div className="rounded-xl bg-white border border-slate-200 p-5 space-y-3">
                <p className="text-xs font-black uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-2">Integrity Checks</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  <CheckRow label="Hash Matches"           pass={result.checks?.hashMatches} />
                  <CheckRow label="Blockchain Configured"  pass={result.checks?.blockchainConfigured} />
                  <CheckRow label="Exists on Blockchain"   pass={result.checks?.blockchainExists} />
                  <CheckRow label="Blockchain Valid"       pass={result.checks?.blockchainValid} />
                </div>
              </div>
            </>
          )}
        </section>
      )}
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="space-y-0.5">
      <div className="flex items-center gap-1.5">
        <Icon size={11} className="text-slate-400" />
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
      </div>
      <p className="text-sm font-semibold text-slate-800 pl-4">{value || "—"}</p>
    </div>
  );
}

function CheckRow({ label, pass }) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-slate-50 border border-slate-200 px-3 py-2">
      {pass
        ? <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0" />
        : <XCircle      size={14} className="text-red-500 flex-shrink-0" />
      }
      <span className="text-xs font-semibold text-slate-700">{label}</span>
      <span className={`ml-auto text-[10px] font-bold ${pass ? "text-emerald-600" : "text-red-500"}`}>
        {pass ? "PASS" : "FAIL"}
      </span>
    </div>
  );
}
