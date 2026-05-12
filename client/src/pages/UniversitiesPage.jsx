import { Building2, Link2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { PageHeader } from "../components/PageHeader.jsx";
import { StatusMessage } from "../components/StatusMessage.jsx";
import { apiRequest } from "../services/api.js";
import { approveUniversityOnChain } from "../services/web3.js";

const emptyForm = { name: "", code: "", walletAddress: "" };

export function UniversitiesPage({ token }) {
  const [universities, setUniversities] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);

  async function loadUniversities() {
    const data = await apiRequest("/universities", { token });
    setUniversities(data.universities);
  }

  useEffect(() => {
    loadUniversities().catch((err) => setError(err.message));
  }, [token]);

  async function handleCreate(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setBusy(true);

    try {
      await apiRequest("/universities", { method: "POST", token, body: form });
      setForm(emptyForm);
      setSuccess("University created.");
      await loadUniversities();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleApproveOnChain(university) {
    setError("");
    setSuccess("");
    setBusy(true);

    try {
      const receipt = await approveUniversityOnChain({
        universityWallet: university.walletAddress,
        name: university.name,
      });

      await apiRequest(`/universities/${university._id}/blockchain-confirmation`, {
        method: "PATCH",
        token,
        body: { approvedTxHash: receipt.txHash },
      });

      setSuccess(`University approved on-chain. Tx: ${receipt.txHash}`);
      await loadUniversities();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Institution Control"
        title="Universities"
        description="Register institutions, track issuer wallet addresses, and approve trusted universities on the smart contract."
      />

      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
      <section className="border border-stone-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center bg-emerald-700 text-white">
            <Building2 size={22} />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Create University</h2>
            <p className="text-sm text-stone-500">Registers an institution in MongoDB.</p>
          </div>
        </div>

        <form onSubmit={handleCreate} className="space-y-4">
          <StatusMessage error={error} success={success} />
          {[
            ["name", "University name"],
            ["code", "Code"],
            ["walletAddress", "Issuer wallet address"],
          ].map(([name, label]) => (
            <label key={name} className="block">
              <span className="mb-1 block text-sm font-medium text-stone-700">{label}</span>
              <input
                className="focus-ring min-h-11 w-full border border-stone-300 bg-stone-50 px-3"
                value={form[name]}
                onChange={(event) => setForm({ ...form, [name]: event.target.value })}
                required
              />
            </label>
          ))}
          <button disabled={busy} type="submit" className="focus-ring inline-flex h-11 w-full items-center justify-center gap-2 bg-emerald-700 px-4 font-semibold text-white hover:bg-emerald-800 disabled:opacity-60">
            <Plus size={18} />
            {busy ? "Working..." : "Create"}
          </button>
        </form>
      </section>

      <section className="border border-stone-200 bg-white shadow-sm">
        <div className="border-b border-stone-200 p-5">
          <h2 className="text-xl font-semibold">Registered Universities</h2>
        </div>
        <div className="divide-y divide-stone-200">
          {universities.map((university) => (
            <div key={university._id} className="grid gap-2 p-5 md:grid-cols-[1fr_auto]">
              <div>
                <p className="font-semibold">{university.name}</p>
                <p className="text-sm text-stone-500">{university.code}</p>
                <p className="mt-1 break-all text-sm text-stone-600">{university.walletAddress}</p>
                {university.approvedTxHash ? (
                  <p className="mt-2 break-all text-xs font-medium text-emerald-800">
                    On-chain tx: {university.approvedTxHash}
                  </p>
                ) : null}
              </div>
              <div className="flex items-start gap-2">
                <span className={`h-fit px-3 py-1 text-sm font-medium ${university.active ? "bg-emerald-100 text-emerald-900" : "bg-stone-100 text-stone-700"}`}>
                  {university.active ? "Active" : "Inactive"}
                </span>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => handleApproveOnChain(university)}
                  className="focus-ring inline-flex h-10 items-center gap-2 border border-stone-300 bg-white px-3 text-sm font-medium hover:bg-stone-100 disabled:opacity-60"
                >
                  <Link2 size={16} />
                  On-chain
                </button>
              </div>
            </div>
          ))}
          {universities.length === 0 ? (
            <p className="p-5 text-sm text-stone-500">No universities yet. Create one from the form.</p>
          ) : null}
        </div>
      </section>
      </div>
    </div>
  );
}
