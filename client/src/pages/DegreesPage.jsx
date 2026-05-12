import { FilePlus2, GraduationCap } from "lucide-react";
import { useEffect, useState } from "react";
import { StatusMessage } from "../components/StatusMessage.jsx";
import { apiRequest } from "../services/api.js";

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
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[460px_1fr]">
      <section className="border border-stone-200 bg-white p-5">
        <div className="mb-5 flex items-center gap-3">
          <FilePlus2 className="text-emerald-700" />
          <div>
            <h2 className="text-xl font-semibold">Issue Degree</h2>
            <p className="text-sm text-stone-500">Creates MongoDB record, hash, and QR data.</p>
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
                className="focus-ring w-full border border-stone-300 px-3 py-2"
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
              className="focus-ring w-full border border-stone-300 px-3 py-2"
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

          <button className="focus-ring inline-flex h-11 items-center gap-2 bg-emerald-700 px-4 font-semibold text-white hover:bg-emerald-800">
            <GraduationCap size={18} />
            Issue
          </button>
        </form>
      </section>

      <section className="border border-stone-200 bg-white">
        <div className="border-b border-stone-200 p-5">
          <h2 className="text-xl font-semibold">Issued Degrees</h2>
        </div>
        <div className="divide-y divide-stone-200">
          {degrees.map((degree) => (
            <div key={degree._id} className="grid gap-3 p-5 xl:grid-cols-[1fr_120px]">
              <div>
                <p className="font-semibold">{degree.studentName}</p>
                <p className="text-sm text-stone-500">{degree.degreeTitle} · {degree.department}</p>
                <p className="mt-2 break-all text-xs text-stone-600">{degree.degreeHash}</p>
                <p className="mt-1 text-sm text-stone-500">ID: {degree._id}</p>
              </div>
              {degree.qrCodeDataUrl ? (
                <img className="h-28 w-28 border border-stone-200" src={degree.qrCodeDataUrl} alt="Degree verification QR code" />
              ) : null}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

