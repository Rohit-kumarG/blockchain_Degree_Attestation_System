import { Building2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { StatusMessage } from "../components/StatusMessage.jsx";
import { apiRequest } from "../services/api.js";

const emptyForm = { name: "", code: "", walletAddress: "" };

export function UniversitiesPage({ token }) {
  const [universities, setUniversities] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

    try {
      await apiRequest("/universities", { method: "POST", token, body: form });
      setForm(emptyForm);
      setSuccess("University created.");
      await loadUniversities();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
      <section className="border border-stone-200 bg-white p-5">
        <div className="mb-5 flex items-center gap-3">
          <Building2 className="text-emerald-700" />
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
                className="focus-ring w-full border border-stone-300 px-3 py-2"
                value={form[name]}
                onChange={(event) => setForm({ ...form, [name]: event.target.value })}
                required
              />
            </label>
          ))}
          <button className="focus-ring inline-flex h-11 items-center gap-2 bg-emerald-700 px-4 font-semibold text-white hover:bg-emerald-800">
            <Plus size={18} />
            Create
          </button>
        </form>
      </section>

      <section className="border border-stone-200 bg-white">
        <div className="border-b border-stone-200 p-5">
          <h2 className="text-xl font-semibold">Universities</h2>
        </div>
        <div className="divide-y divide-stone-200">
          {universities.map((university) => (
            <div key={university._id} className="grid gap-2 p-5 md:grid-cols-[1fr_auto]">
              <div>
                <p className="font-semibold">{university.name}</p>
                <p className="text-sm text-stone-500">{university.code}</p>
                <p className="mt-1 break-all text-sm text-stone-600">{university.walletAddress}</p>
              </div>
              <span className={`h-fit px-3 py-1 text-sm font-medium ${university.active ? "bg-emerald-100 text-emerald-900" : "bg-stone-100 text-stone-700"}`}>
                {university.active ? "Active" : "Inactive"}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

