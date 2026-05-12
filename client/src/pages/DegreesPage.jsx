import { FilePlus2, GraduationCap, Link2 } from "lucide-react";
import { useEffect, useState } from "react";
import { PageHeader } from "../components/PageHeader.jsx";
import { StatusMessage } from "../components/StatusMessage.jsx";
import { apiRequest } from "../services/api.js";
import { issueDegreeOnChain } from "../services/web3.js";

const emptyForm = {
  studentName: "",
  studentEmail: "",
  studentWallet: "",
  degreeTitle: "",
  department: "",
  graduationYear: new Date().getFullYear(),
  universityId: "",
};

export function DegreesPage({ token }) {
  const [degrees, setDegrees] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);

  async function loadData() {
    const [degreeData, universityData] = await Promise.all([
      apiRequest("/degrees", { token }),
      apiRequest("/universities", { token }),
    ]);
    setDegrees(degreeData.degrees);
    setUniversities(universityData.universities);
  }

  useEffect(() => {
    loadData().catch((err) => setError(err.message));
  }, [token]);

  async function handleIssue(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setBusy(true);

    try {
      await apiRequest("/degrees", {
        method: "POST",
        token,
        body: { ...form, graduationYear: Number(form.graduationYear) },
      });
      setForm(emptyForm);
      setSuccess("Degree issued off-chain with hash and QR code.");
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleIssueOnChain(degree) {
    setError("");
    setSuccess("");
    setBusy(true);

    try {
      const receipt = await issueDegreeOnChain({
        degreeHash: degree.degreeHash,
        studentWallet: degree.studentWallet,
        ipfsCID: degree.ipfsCID,
      });

      await apiRequest(`/degrees/${degree._id}/blockchain-confirmation`, {
        method: "PATCH",
        token,
        body: {
          blockchainTxHash: receipt.txHash,
          contractAddress: receipt.contractAddress,
          chainId: receipt.chainId,
        },
      });

      setSuccess(`Degree issued on-chain. Tx: ${receipt.txHash}`);
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Credential Issuance"
        title="Degrees"
        description="Create degree metadata, generate a deterministic hash, produce QR verification data, and optionally write proof to the smart contract."
      />

      <div className="grid gap-6 xl:grid-cols-[460px_1fr]">
      <section className="border border-stone-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center bg-emerald-700 text-white">
            <FilePlus2 size={22} />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Issue Degree</h2>
            <p className="text-sm text-stone-500">Creates record, hash, IPFS CID, and QR data.</p>
          </div>
        </div>

        <form onSubmit={handleIssue} className="space-y-4">
          <StatusMessage error={error} success={success} />

          {[
            ["studentName", "Student name"],
            ["studentEmail", "Student email"],
            ["studentWallet", "Student wallet"],
            ["degreeTitle", "Degree title"],
            ["department", "Department"],
            ["graduationYear", "Graduation year"],
          ].map(([name, label]) => (
            <label key={name} className="block">
              <span className="mb-1 block text-sm font-medium text-stone-700">{label}</span>
              <input
                className="focus-ring min-h-11 w-full border border-stone-300 bg-stone-50 px-3"
                type={name === "graduationYear" ? "number" : "text"}
                value={form[name]}
                onChange={(event) => setForm({ ...form, [name]: event.target.value })}
                required
              />
            </label>
          ))}

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-stone-700">University</span>
            <select
              className="focus-ring min-h-11 w-full border border-stone-300 bg-stone-50 px-3"
              value={form.universityId}
              onChange={(event) => setForm({ ...form, universityId: event.target.value })}
              required
            >
              <option value="">Select university</option>
              {universities.map((university) => (
                <option key={university._id} value={university._id}>
                  {university.name}
                </option>
              ))}
            </select>
          </label>

          <button disabled={busy} type="submit" className="focus-ring inline-flex h-11 w-full items-center justify-center gap-2 bg-emerald-700 px-4 font-semibold text-white hover:bg-emerald-800 disabled:opacity-60">
            <GraduationCap size={18} />
            {busy ? "Working..." : "Issue"}
          </button>
        </form>
      </section>

      <section className="border border-stone-200 bg-white shadow-sm">
        <div className="border-b border-stone-200 p-5">
          <h2 className="text-xl font-semibold">Issued Degrees</h2>
        </div>
        <div className="divide-y divide-stone-200">
          {degrees.map((degree) => (
            <div key={degree._id} className="grid gap-4 p-5 xl:grid-cols-[1fr_120px]">
              <div>
                <p className="font-semibold">{degree.studentName}</p>
                <p className="text-sm text-stone-500">{degree.degreeTitle} · {degree.department}</p>
                <p className="mt-2 break-all text-xs text-stone-600">{degree.degreeHash}</p>
                <p className="mt-1 text-sm text-stone-500">ID: {degree._id}</p>
                {degree.blockchainTxHash ? (
                  <p className="mt-2 break-all text-xs font-medium text-emerald-800">
                    On-chain tx: {degree.blockchainTxHash}
                  </p>
                ) : (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => handleIssueOnChain(degree)}
                    className="focus-ring mt-3 inline-flex h-10 items-center gap-2 border border-stone-300 bg-white px-3 text-sm font-medium hover:bg-stone-100 disabled:opacity-60"
                  >
                    <Link2 size={16} />
                    Issue on-chain
                  </button>
                )}
              </div>
              {degree.qrCodeDataUrl ? (
                <img className="h-28 w-28 border border-stone-200" src={degree.qrCodeDataUrl} alt="Degree verification QR code" />
              ) : null}
            </div>
          ))}
          {degrees.length === 0 ? (
            <p className="p-5 text-sm text-stone-500">No degrees yet. Issue the first credential from the form.</p>
          ) : null}
        </div>
      </section>
      </div>
    </div>
  );
}
