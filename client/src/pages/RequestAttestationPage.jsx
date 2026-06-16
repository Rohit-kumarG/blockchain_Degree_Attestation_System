import React, { useState, useEffect } from "react";
import { PageHeader } from "../components/PageHeader.jsx";
import { StatusMessage } from "../components/StatusMessage.jsx";
import { apiRequest, API_BASE_URL } from "../services/api.js";
import { payAttestationFeeOnChain } from "../services/web3.js";
import { 
  UploadCloud, 
  CheckCircle, 
  Wallet, 
  FileText, 
  Loader2, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowRight,
  RefreshCw,
  Coins,
  Check,
  CreditCard,
  User,
  GraduationCap,
  Calendar,
  Layers,
  FileCheck,
  Plus,
  Trash2,
  Printer
} from "lucide-react";
import { printDegreeCertificate } from "../services/printHelper.js";

const emptyForm = {
  universityId: "",
  degreeTitle: "",
  department: "",
  graduationYear: new Date().getFullYear(),
  studentWallet: "",
  rollNumber: "",
  metricPercentage: "",
  interPercentage: "",
  cgpa: "",
  nicExpiryDate: "",
  paymentMethod: "ONELINK", 
  bitcoinTxHash: "",
  
  fatherName: "",
  dob: "",
  gender: "Male",
  maritalStatus: "Single",
  address: "",
  attestDegree: true,
  attestTranscript: false,
};

export function RequestAttestationPage({ token }) {
  const [requests, setRequests] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);
  
  // Qualifications array
  const [qualifications, setQualifications] = useState([
    { level: "Matric", degreeTitle: "", boardOrUniversity: "", campus: "N/A", session: "", rollNumber: "", duration: "2 Years" },
    { level: "Intermediate", degreeTitle: "", boardOrUniversity: "", campus: "N/A", session: "", rollNumber: "", duration: "2 Years" }
  ]);

  // Multi-file state
  const [files, setFiles] = useState({
    document: null,
    metricMarksheet: null,
    interMarksheet: null,
    transcript: null,
    nicFront: null,
    nicBack: null,
    paymentSlip: null,
  });

  const [previews, setPreviews] = useState({
    document: "",
    metricMarksheet: "",
    interMarksheet: "",
    transcript: "",
    nicFront: "",
    nicBack: "",
    paymentSlip: "",
  });

  // Real-time OCR Scanning states
  const [ocrScanning, setOcrScanning] = useState({
    metricMarksheet: false,
    interMarksheet: false,
    transcript: false,
    nicFront: false,
    nicBack: false,
  });

  const [ocrPassed, setOcrPassed] = useState({
    metricMarksheet: false,
    interMarksheet: false,
    transcript: false,
    nicFront: false,
    nicBack: false,
  });

  // Final flow step: 1 = Form/Uploads, 2 = MetaMask payment, 3 = Success
  const [step, setStep] = useState(1);
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [currentRequest, setCurrentRequest] = useState(null);

  async function loadData() {
    try {
      const [reqData, univData] = await Promise.all([
        apiRequest("/degree-requests/my-requests", { token }),
        apiRequest("/universities", { token }),
      ]);
      setRequests(reqData.requests || []);
      setUniversities(univData.universities || []);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadData();
  }, [token]);

  // Dynamic qualification table actions
  function addQualification() {
    setQualifications([
      ...qualifications,
      { level: "Bachelor", degreeTitle: "", boardOrUniversity: "", campus: "", session: "", rollNumber: "", duration: "4 Years" }
    ]);
  }

  function removeQualification(index) {
    setQualifications(qualifications.filter((_, i) => i !== index));
  }

  function handleQualChange(index, field, value) {
    const updated = qualifications.map((q, i) => {
      if (i === index) {
        return { ...q, [field]: value };
      }
      return q;
    });
    setQualifications(updated);
  }

  // Handle file changes and trigger real-time OCR auto-fill
  async function handleFileChange(field, e) {
    const file = e.target.files[0];
    if (!file) return;

    setFiles(prev => ({ ...prev, [field]: file }));
    setPreviews(prev => ({ ...prev, [field]: URL.createObjectURL(file) }));

    const ocrMap = {
      metricMarksheet: "metric",
      interMarksheet: "inter",
      transcript: "transcript",
      nicFront: "nic",
      nicBack: "nic",
    };

    const type = ocrMap[field];
    if (!type) return;

    setOcrPassed(prev => ({ ...prev, [field]: false }));
    setOcrScanning(prev => ({ ...prev, [field]: true }));
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);

      const res = await fetch(`${API_BASE_URL}/degree-requests/ocr-preview`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to scan document via OCR");
      }

      if (data.value !== null && data.value !== undefined) {
        if (field === "metricMarksheet") {
          setForm(prev => ({ ...prev, metricPercentage: data.value }));
          setOcrPassed(prev => ({ ...prev, metricMarksheet: true }));
        } else if (field === "interMarksheet") {
          setForm(prev => ({ ...prev, interPercentage: data.value }));
          setOcrPassed(prev => ({ ...prev, interMarksheet: true }));
        } else if (field === "transcript") {
          setForm(prev => ({ ...prev, cgpa: data.value }));
          setOcrPassed(prev => ({ ...prev, transcript: true }));
        } else if (field === "nicFront" || field === "nicBack") {
          if (data.value && typeof data.value === "object") {
            setForm(prev => ({
              ...prev,
              nicExpiryDate: data.value.nicExpiryDate || prev.nicExpiryDate,
              dob: data.value.dob || prev.dob,
              fatherName: data.value.fatherName || prev.fatherName,
              gender: data.value.gender || prev.gender,
              address: data.value.address || prev.address
            }));
          } else {
            setForm(prev => ({ ...prev, nicExpiryDate: data.value || "" }));
          }
          setOcrPassed(prev => ({ ...prev, [field]: true }));
        }
      }
    } catch (err) {
      console.error("OCR auto-fill failed:", err);
    } finally {
      setOcrScanning(prev => ({ ...prev, [field]: false }));
    }
  }

  function removeFile(field) {
    setFiles(prev => ({ ...prev, [field]: null }));
    setPreviews(prev => ({ ...prev, [field]: "" }));
    setOcrPassed(prev => ({ ...prev, [field]: false }));
    
    if (field === "metricMarksheet") setForm(prev => ({ ...prev, metricPercentage: "" }));
    if (field === "interMarksheet") setForm(prev => ({ ...prev, interPercentage: "" }));
    if (field === "transcript") setForm(prev => ({ ...prev, cgpa: "" }));
    if (field === "nicFront" || field === "nicBack") setForm(prev => ({ ...prev, nicExpiryDate: "" }));
  }

  async function handleSubmitRequest(e) {
    e.preventDefault();
    setError("");

    if (!form.universityId || !form.degreeTitle || !form.department || !form.rollNumber || !form.studentWallet) {
      setError("Please fill in all basic details in Section 3.");
      return;
    }

    if (!form.fatherName || !form.dob || !form.address) {
      setError("Please fill in all personal details.");
      return;
    }

    if (!form.attestDegree && !form.attestTranscript) {
      setError("Please select at least one document for attestation.");
      return;
    }

    if (!files.metricMarksheet || !files.interMarksheet) {
      setError("Please upload both Metric and Intermediate marksheets.");
      return;
    }

    if (!files.transcript) {
      setError("Please upload your university transcript.");
      return;
    }

    if (!files.nicFront || !files.nicBack) {
      setError("Please upload both Front and Back sides of your NIC.");
      return;
    }

    if (form.paymentMethod === "ONELINK" && !files.paymentSlip) {
      setError("Please upload your OneLink / 1-Bill Bank Transfer Slip.");
      return;
    }

    if (form.paymentMethod === "BITCOIN" && !form.bitcoinTxHash) {
      setError("Please enter your Bitcoin Transaction Hash.");
      return;
    }

    setBusy(true);
    setScanning(true);
    setScanProgress(15);

    const progressInterval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 15;
      });
    }, 300);

    try {
      const formData = new FormData();
      if (files.document) {
        formData.append("document", files.document);
      }
      formData.append("metricMarksheet", files.metricMarksheet);
      formData.append("interMarksheet", files.interMarksheet);
      formData.append("transcript", files.transcript);
      formData.append("nicFront", files.nicFront);
      formData.append("nicBack", files.nicBack);
      if (files.paymentSlip) {
        formData.append("paymentSlip", files.paymentSlip);
      }

      formData.append("universityId", form.universityId);
      formData.append("degreeTitle", form.degreeTitle);
      formData.append("department", form.department);
      formData.append("graduationYear", form.graduationYear);
      formData.append("studentWallet", form.studentWallet);
      formData.append("rollNumber", form.rollNumber);
      
      // HEC fields
      formData.append("fatherName", form.fatherName);
      formData.append("dob", form.dob);
      formData.append("gender", form.gender);
      formData.append("maritalStatus", form.maritalStatus);
      formData.append("address", form.address);
      formData.append("attestDegree", form.attestDegree);
      formData.append("attestTranscript", form.attestTranscript);
      formData.append("qualifications", JSON.stringify(qualifications));

      // Autofilled/Manual attributes
      formData.append("metricPercentage", form.metricPercentage || 0);
      formData.append("interPercentage", form.interPercentage || 0);
      formData.append("cgpa", form.cgpa || 0);
      formData.append("nicExpiryDate", form.nicExpiryDate || "");
      formData.append("paymentMethod", form.paymentMethod);
      formData.append("bitcoinTxHash", form.bitcoinTxHash);

      const res = await fetch(`${API_BASE_URL}/degree-requests`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      clearInterval(progressInterval);

      if (!res.ok) {
        throw new Error(data.message || "Failed to create attestation request");
      }

      setScanProgress(100);
      setCurrentRequest(data.degreeRequest);
      
      await new Promise(r => setTimeout(r, 600));
      setScanning(false);
      
      if (form.paymentMethod === "METAMASK") {
        setStep(2); 
      } else {
        setSuccess(`Application submitted successfully! status: ${data.degreeRequest.status}`);
        setStep(3);
      }
      loadData();
    } catch (err) {
      clearInterval(progressInterval);
      setScanning(false);
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handlePayment() {
    if (!currentRequest) return;
    setError("");
    setSuccess("");
    setBusy(true);

    try {
      const receipt = await payAttestationFeeOnChain({
        degreeHash: currentRequest.degreeHash,
      });

      await apiRequest(`/degree-requests/${currentRequest._id}/pay`, {
        method: "PATCH",
        token,
        body: { paymentTxHash: receipt.txHash, paymentMethod: "METAMASK" },
      });

      setSuccess("Payment successful! MetaMask transaction registered.");
      setStep(3);
      loadData();
    } catch (err) {
      setError(err.message || "Payment failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  function resetFlow() {
    setForm(emptyForm);
    setFiles({
      document: null,
      metricMarksheet: null,
      interMarksheet: null,
      transcript: null,
      nicFront: null,
      nicBack: null,
      paymentSlip: null,
    });
    setPreviews({
      document: "",
      metricMarksheet: "",
      interMarksheet: "",
      transcript: "",
      nicFront: "",
      nicBack: "",
      paymentSlip: "",
    });
    setOcrPassed({
      metricMarksheet: false,
      interMarksheet: false,
      transcript: false,
      nicFront: false,
      nicBack: false,
    });
    setStep(1);
    setCurrentRequest(null);
    setError("");
    setSuccess("");
  }

  // Calculate live fee
  const liveFee = (form.attestDegree ? 3000 : 0) + (form.attestTranscript ? 3000 : 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <PageHeader
        eyebrow="IU Attestation Portal"
        title="Iqra University Degree & Transcript Attestation"
        description="Verify your qualifications, upload academic marksheets, review AI OCR validations, and process your attestation fees."
      />

      <StatusMessage error={error} success={success} />

      {step === 1 && (
        <form onSubmit={handleSubmitRequest} className="max-w-4xl mx-auto space-y-8">
          
          {/* Part 1: Personal Profile */}
          <div className="bg-white border border-stone-200 shadow-sm rounded-2xl p-6 space-y-6">
            <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-3">
              <User size={18} className="text-blue-800" />
              1. Personal Information
            </h3>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-stone-700 uppercase tracking-wide">Father's Name</span>
                <input
                  className="min-h-11 w-full border border-stone-300 bg-stone-50 px-3 rounded-lg focus:ring-2 focus:ring-blue-600 transition text-sm"
                  type="text"
                  placeholder="Enter Father's Name"
                  value={form.fatherName}
                  onChange={(e) => setForm({ ...form, fatherName: e.target.value })}
                  required
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-stone-700 uppercase tracking-wide">Date of Birth</span>
                <input
                  className="min-h-11 w-full border border-stone-300 bg-stone-50 px-3 rounded-lg focus:ring-2 focus:ring-blue-600 transition text-sm"
                  type="date"
                  value={form.dob}
                  onChange={(e) => setForm({ ...form, dob: e.target.value })}
                  required
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-stone-700 uppercase tracking-wide">Gender</span>
                <select
                  className="min-h-11 w-full border border-stone-300 bg-stone-50 px-3 rounded-lg focus:ring-2 focus:ring-blue-600 transition text-sm font-medium"
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-stone-700 uppercase tracking-wide">Marital Status</span>
                <select
                  className="min-h-11 w-full border border-stone-300 bg-stone-50 px-3 rounded-lg focus:ring-2 focus:ring-blue-600 transition text-sm font-medium"
                  value={form.maritalStatus}
                  onChange={(e) => setForm({ ...form, maritalStatus: e.target.value })}
                >
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                </select>
              </label>

              <label className="block lg:col-span-2">
                <span className="mb-1.5 block text-xs font-bold text-stone-700 uppercase tracking-wide">Current Residential Address</span>
                <input
                  className="min-h-11 w-full border border-stone-300 bg-stone-50 px-3 rounded-lg focus:ring-2 focus:ring-blue-600 transition text-sm"
                  type="text"
                  placeholder="Enter current home address"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  required
                />
              </label>
            </div>
          </div>

          {/* Part 2: Dynamic Qualifications History */}
          <div className="bg-white border border-stone-200 shadow-sm rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                <GraduationCap size={18} className="text-blue-800" />
                2. Educational History
              </h3>
              <button
                type="button"
                onClick={addQualification}
                className="flex items-center gap-1 bg-blue-800 hover:bg-blue-900 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition"
              >
                <Plus size={14} /> Add Qualification
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-stone-200 text-sm text-left">
                <thead className="bg-stone-50 text-stone-700 font-bold uppercase tracking-wide text-xs">
                  <tr>
                    <th className="p-3">Level</th>
                    <th className="p-3">Degree Title</th>
                    <th className="p-3">Board / University</th>
                    <th className="p-3">Campus</th>
                    <th className="p-3">Session</th>
                    <th className="p-3">Roll Number</th>
                    <th className="p-3">Duration</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 bg-white">
                  {qualifications.map((qual, idx) => (
                    <tr key={idx} className="hover:bg-stone-50/50">
                      <td className="p-2">
                        <select
                          className="border border-stone-300 bg-stone-50 p-2 rounded-md text-xs w-32 focus:ring-1 focus:ring-blue-800"
                          value={qual.level}
                          onChange={(e) => handleQualChange(idx, "level", e.target.value)}
                        >
                          <option value="Matric">Matric</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Bachelor">Bachelor</option>
                          <option value="Master">Master</option>
                          <option value="PhD">PhD</option>
                        </select>
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          placeholder="e.g. BSCS"
                          className="border border-stone-300 p-2 rounded-md text-xs w-32"
                          value={qual.degreeTitle}
                          onChange={(e) => handleQualChange(idx, "degreeTitle", e.target.value)}
                          required
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          placeholder="University/Board name"
                          className="border border-stone-300 p-2 rounded-md text-xs w-48"
                          value={qual.boardOrUniversity}
                          onChange={(e) => handleQualChange(idx, "boardOrUniversity", e.target.value)}
                          required
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          placeholder="Main Campus"
                          className="border border-stone-300 p-2 rounded-md text-xs w-28"
                          value={qual.campus}
                          onChange={(e) => handleQualChange(idx, "campus", e.target.value)}
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          placeholder="2020-2024"
                          className="border border-stone-300 p-2 rounded-md text-xs w-24"
                          value={qual.session}
                          onChange={(e) => handleQualChange(idx, "session", e.target.value)}
                          required
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          placeholder="Roll No"
                          className="border border-stone-300 p-2 rounded-md text-xs w-28"
                          value={qual.rollNumber}
                          onChange={(e) => handleQualChange(idx, "rollNumber", e.target.value)}
                          required
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          placeholder="Duration"
                          className="border border-stone-300 p-2 rounded-md text-xs w-24"
                          value={qual.duration}
                          onChange={(e) => handleQualChange(idx, "duration", e.target.value)}
                        />
                      </td>
                      <td className="p-2 text-center">
                        {qualifications.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeQualification(idx)}
                            className="text-rose-600 hover:text-rose-800 p-1 transition"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Part 3: Program & Institution Details */}
          <div className="bg-white border border-stone-200 shadow-sm rounded-2xl p-6 space-y-6">
            <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-3">
              <Layers size={18} className="text-blue-800" />
              3. Attestation Degree Details
            </h3>
            
            <div className="grid gap-6 md:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-stone-700 uppercase tracking-wide">Target Attestation University</span>
                <select
                  className="min-h-11 w-full border border-stone-300 bg-stone-50 px-3 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition text-sm font-medium"
                  value={form.universityId}
                  onChange={(e) => setForm({ ...form, universityId: e.target.value })}
                  required
                >
                  <option value="">Choose university...</option>
                  {universities.map((u) => (
                    <option key={u._id} value={u._id}>{u.name}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-stone-700 uppercase tracking-wide">Target Degree Program Title</span>
                <input
                  className="min-h-11 w-full border border-stone-300 bg-stone-50 px-3 rounded-lg focus:ring-2 focus:ring-blue-600 transition text-sm"
                  type="text"
                  placeholder="Bachelor of Science in Computer Science"
                  value={form.degreeTitle}
                  onChange={(e) => setForm({ ...form, degreeTitle: e.target.value })}
                  required
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-stone-700 uppercase tracking-wide">Department</span>
                <input
                  className="min-h-11 w-full border border-stone-300 bg-stone-50 px-3 rounded-lg focus:ring-2 focus:ring-blue-600 transition text-sm"
                  type="text"
                  placeholder="Computer Science"
                  value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                  required
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-stone-700 uppercase tracking-wide">Graduation Year</span>
                <input
                  className="min-h-11 w-full border border-stone-300 bg-stone-50 px-3 rounded-lg focus:ring-2 focus:ring-blue-600 transition text-sm"
                  type="number"
                  value={form.graduationYear}
                  onChange={(e) => setForm({ ...form, graduationYear: Number(e.target.value) })}
                  required
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-stone-700 uppercase tracking-wide">Student Wallet Address</span>
                <input
                  className="min-h-11 w-full border border-stone-300 bg-stone-50 px-3 rounded-lg focus:ring-2 focus:ring-blue-600 transition text-sm font-mono text-stone-700"
                  type="text"
                  placeholder="0x..."
                  value={form.studentWallet}
                  onChange={(e) => setForm({ ...form, studentWallet: e.target.value })}
                  required
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-stone-700 uppercase tracking-wide">Roll Number / Student ID</span>
                <input
                  className="min-h-11 w-full border border-stone-300 bg-stone-50 px-3 rounded-lg focus:ring-2 focus:ring-blue-600 transition text-sm"
                  type="text"
                  placeholder="FA20-BCS-045"
                  value={form.rollNumber}
                  onChange={(e) => setForm({ ...form, rollNumber: e.target.value })}
                  required
                />
              </label>
            </div>
          </div>

          {/* Part 4: Required Academic & Identity Files */}
          <div className="bg-white border border-stone-200 shadow-sm rounded-2xl p-6 space-y-6">
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-3">
              <FileText size={18} className="text-blue-800" />
              4. Upload Supporting Documents
            </h3>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Metric Marksheet */}
              <div className="border border-stone-200 rounded-xl p-4 bg-stone-50/50 flex flex-col justify-between min-h-[200px] relative overflow-hidden">
                {ocrScanning.metricMarksheet && (
                  <div className="absolute inset-0 bg-white/85 backdrop-blur-xs flex flex-col items-center justify-center z-10">
                    <Loader2 className="animate-spin text-blue-800 mb-1" size={24} />
                    <span className="text-xs font-bold text-stone-800">AI Scanning...</span>
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-xs text-stone-700 flex justify-between items-center mb-2">
                    <span>METRIC MARKSHEET</span>
                    {ocrPassed.metricMarksheet && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                        ✓ Auto-Filled
                      </span>
                    )}
                  </h4>
                  {previews.metricMarksheet ? (
                    <div className="relative aspect-[16/9] border border-stone-200 rounded-lg overflow-hidden bg-white">
                      <img src={previews.metricMarksheet} alt="Metric" className="object-contain w-full h-full" />
                    </div>
                  ) : (
                    <div className="border border-dashed border-stone-300 rounded-lg p-6 flex flex-col items-center justify-center bg-white text-center hover:bg-stone-50 transition cursor-pointer relative h-[100px]">
                      <UploadCloud size={24} className="text-stone-400 mb-1" />
                      <p className="text-[11px] font-bold text-stone-700">Upload Marksheet</p>
                      <input type="file" onChange={(e) => handleFileChange("metricMarksheet", e)} accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                  )}
                </div>
                {previews.metricMarksheet && (
                  <button type="button" onClick={() => removeFile("metricMarksheet")} className="mt-2 text-xs font-bold text-rose-600 hover:text-rose-800 text-left">
                    Remove file
                  </button>
                )}
              </div>

              {/* Inter Marksheet */}
              <div className="border border-stone-200 rounded-xl p-4 bg-stone-50/50 flex flex-col justify-between min-h-[200px] relative overflow-hidden">
                {ocrScanning.interMarksheet && (
                  <div className="absolute inset-0 bg-white/85 backdrop-blur-xs flex flex-col items-center justify-center z-10">
                    <Loader2 className="animate-spin text-blue-800 mb-1" size={24} />
                    <span className="text-xs font-bold text-stone-800">AI Scanning...</span>
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-xs text-stone-700 flex justify-between items-center mb-2">
                    <span>INTERMEDIATE MARKSHEET</span>
                    {ocrPassed.interMarksheet && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                        ✓ Auto-Filled
                      </span>
                    )}
                  </h4>
                  {previews.interMarksheet ? (
                    <div className="relative aspect-[16/9] border border-stone-200 rounded-lg overflow-hidden bg-white">
                      <img src={previews.interMarksheet} alt="Inter" className="object-contain w-full h-full" />
                    </div>
                  ) : (
                    <div className="border border-dashed border-stone-300 rounded-lg p-6 flex flex-col items-center justify-center bg-white text-center hover:bg-stone-50 transition cursor-pointer relative h-[100px]">
                      <UploadCloud size={24} className="text-stone-400 mb-1" />
                      <p className="text-[11px] font-bold text-stone-700">Upload Marksheet</p>
                      <input type="file" onChange={(e) => handleFileChange("interMarksheet", e)} accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                  )}
                </div>
                {previews.interMarksheet && (
                  <button type="button" onClick={() => removeFile("interMarksheet")} className="mt-2 text-xs font-bold text-rose-600 hover:text-rose-800 text-left">
                    Remove file
                  </button>
                )}
              </div>

              {/* Transcript */}
              <div className="border border-stone-200 rounded-xl p-4 bg-stone-50/50 flex flex-col justify-between min-h-[200px] relative overflow-hidden">
                {ocrScanning.transcript && (
                  <div className="absolute inset-0 bg-white/85 backdrop-blur-xs flex flex-col items-center justify-center z-10">
                    <Loader2 className="animate-spin text-blue-800 mb-1" size={24} />
                    <span className="text-xs font-bold text-stone-800">AI Scanning...</span>
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-xs text-stone-700 flex justify-between items-center mb-2">
                    <span>OFFICIAL TRANSCRIPT</span>
                    {ocrPassed.transcript && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                        ✓ Auto-Filled
                      </span>
                    )}
                  </h4>
                  {previews.transcript ? (
                    <div className="relative aspect-[16/9] border border-stone-200 rounded-lg overflow-hidden bg-white">
                      <img src={previews.transcript} alt="Transcript" className="object-contain w-full h-full" />
                    </div>
                  ) : (
                    <div className="border border-dashed border-stone-300 rounded-lg p-6 flex flex-col items-center justify-center bg-white text-center hover:bg-stone-50 transition cursor-pointer relative h-[100px]">
                      <UploadCloud size={24} className="text-stone-400 mb-1" />
                      <p className="text-[11px] font-bold text-stone-700">Upload Transcript</p>
                      <input type="file" onChange={(e) => handleFileChange("transcript", e)} accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                  )}
                </div>
                {previews.transcript && (
                  <button type="button" onClick={() => removeFile("transcript")} className="mt-2 text-xs font-bold text-rose-600 hover:text-rose-800 text-left">
                    Remove file
                  </button>
                )}
              </div>

              {/* NIC Front/Back */}
              <div className="border border-stone-200 rounded-xl p-4 bg-stone-50/50 flex flex-col justify-between min-h-[200px] relative overflow-hidden">
                {(ocrScanning.nicFront || ocrScanning.nicBack) && (
                  <div className="absolute inset-0 bg-white/85 backdrop-blur-xs flex flex-col items-center justify-center z-10">
                    <Loader2 className="animate-spin text-blue-800 mb-1" size={24} />
                    <span className="text-xs font-bold text-stone-800">AI Scanning CNIC...</span>
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-xs text-stone-700 flex justify-between items-center mb-2">
                    <span>NATIONAL IDENTITY CARD (CNIC)</span>
                    {(ocrPassed.nicFront || ocrPassed.nicBack) && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                        ✓ Auto-Filled
                      </span>
                    )}
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {previews.nicFront ? (
                      <div className="relative aspect-[3/2] border border-stone-200 rounded-lg overflow-hidden bg-white">
                        <img src={previews.nicFront} alt="NIC Front" className="object-contain w-full h-full" />
                        <button type="button" onClick={() => removeFile("nicFront")} className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full text-[9px]">✕</button>
                      </div>
                    ) : (
                      <div className="border border-dashed border-stone-300 rounded-lg p-2 flex flex-col items-center justify-center bg-white text-center hover:bg-stone-50 transition cursor-pointer relative h-[80px]">
                        <UploadCloud size={16} className="text-stone-400" />
                        <span className="text-[9px] font-bold text-stone-600 font-medium">CNIC Front</span>
                        <input type="file" onChange={(e) => handleFileChange("nicFront", e)} accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" />
                      </div>
                    )}

                    {previews.nicBack ? (
                      <div className="relative aspect-[3/2] border border-stone-200 rounded-lg overflow-hidden bg-white">
                        <img src={previews.nicBack} alt="NIC Back" className="object-contain w-full h-full" />
                        <button type="button" onClick={() => removeFile("nicBack")} className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full text-[9px]">✕</button>
                      </div>
                    ) : (
                      <div className="border border-dashed border-stone-300 rounded-lg p-2 flex flex-col items-center justify-center bg-white text-center hover:bg-stone-50 transition cursor-pointer relative h-[80px]">
                        <UploadCloud size={16} className="text-stone-400" />
                        <span className="text-[9px] font-bold text-stone-600 font-medium">CNIC Back</span>
                        <input type="file" onChange={(e) => handleFileChange("nicBack", e)} accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Part 5: Verify Extracted Metrics */}
          <div className="bg-white border border-stone-200 shadow-sm rounded-2xl p-6 space-y-6">
            <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-3">
              <ShieldCheck size={18} className="text-blue-800" />
              5. Verify Extracted Metrics (Editable)
            </h3>
            <p className="text-sm text-stone-500">
              These values are automatically filled when you upload your documents. If a document is pending or incorrect, feel free to manually edit/input the values.
            </p>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-stone-700 uppercase tracking-wide">Metric Percentage (%)</span>
                <div className="relative">
                  <input
                    className="min-h-11 w-full border border-stone-300 bg-stone-50 px-3 rounded-lg focus:ring-2 focus:ring-blue-600 transition text-sm font-semibold"
                    type="number"
                    step="0.01"
                    placeholder="e.g. 78.5"
                    value={form.metricPercentage}
                    onChange={(e) => setForm({ ...form, metricPercentage: e.target.value })}
                  />
                  {ocrPassed.metricMarksheet && (
                    <span className="absolute right-2 top-3 text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">Auto-filled</span>
                  )}
                </div>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-stone-700 uppercase tracking-wide">Intermediate Percentage (%)</span>
                <div className="relative">
                  <input
                    className="min-h-11 w-full border border-stone-300 bg-stone-50 px-3 rounded-lg focus:ring-2 focus:ring-blue-600 transition text-sm font-semibold"
                    type="number"
                    step="0.01"
                    placeholder="e.g. 65.2"
                    value={form.interPercentage}
                    onChange={(e) => setForm({ ...form, interPercentage: e.target.value })}
                  />
                  {ocrPassed.interMarksheet && (
                    <span className="absolute right-2 top-3 text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">Auto-filled</span>
                  )}
                </div>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-stone-700 uppercase tracking-wide">Transcript CGPA</span>
                <div className="relative">
                  <input
                    className="min-h-11 w-full border border-stone-300 bg-stone-50 px-3 rounded-lg focus:ring-2 focus:ring-blue-600 transition text-sm font-semibold"
                    type="number"
                    step="0.01"
                    placeholder="e.g. 3.42"
                    value={form.cgpa}
                    onChange={(e) => setForm({ ...form, cgpa: e.target.value })}
                  />
                  {ocrPassed.transcript && (
                    <span className="absolute right-2 top-3 text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">Auto-filled</span>
                  )}
                </div>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-stone-700 uppercase tracking-wide">NIC Expiration Date</span>
                <div className="relative">
                  <input
                    className="min-h-11 w-full border border-stone-300 bg-stone-50 px-3 rounded-lg focus:ring-2 focus:ring-blue-600 transition text-sm font-semibold"
                    type="date"
                    value={form.nicExpiryDate}
                    onChange={(e) => setForm({ ...form, nicExpiryDate: e.target.value })}
                  />
                  {(ocrPassed.nicFront || ocrPassed.nicBack) && (
                    <span className="absolute right-2 top-3 text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">Auto-filled</span>
                  )}
                </div>
              </label>
            </div>
          </div>

          {/* Part 6: Attestation Details & Payment Method */}
          <div className="bg-white border border-stone-200 shadow-sm rounded-2xl p-6 space-y-6">
            <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-3">
              <ShieldCheck size={18} className="text-blue-800" />
              6. Attestation Details & Payment
            </h3>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <span className="block text-xs font-bold text-stone-700 uppercase tracking-wider">Select Documents to Attest</span>
                <div className="space-y-2 text-xs font-semibold text-stone-850">
                  <label className="flex items-center gap-2.5 bg-stone-50 border border-stone-200 rounded-xl p-3 cursor-pointer hover:bg-stone-100/50 transition">
                    <input
                      type="checkbox"
                      className="rounded text-blue-800 focus:ring-blue-800 h-4 w-4"
                      checked={form.attestDegree}
                      onChange={(e) => setForm({ ...form, attestDegree: e.target.checked })}
                    />
                    <div>
                      <div>Degree Attestation</div>
                      <div className="text-[10px] text-stone-500 font-medium">PKR 3,000</div>
                    </div>
                  </label>
                  
                  <label className="flex items-center gap-2.5 bg-stone-50 border border-stone-200 rounded-xl p-3 cursor-pointer hover:bg-stone-100/50 transition">
                    <input
                      type="checkbox"
                      className="rounded text-blue-800 focus:ring-blue-800 h-4 w-4"
                      checked={form.attestTranscript}
                      onChange={(e) => setForm({ ...form, attestTranscript: e.target.checked })}
                    />
                    <div>
                      <div>Transcript Attestation</div>
                      <div className="text-[10px] text-stone-500 font-medium">PKR 3,000</div>
                    </div>
                  </label>
                </div>

                <div className="pt-4 border-t border-stone-100 flex justify-between items-center text-xs">
                  <span className="text-stone-500 font-semibold">Fee (Rs. 3000/doc):</span>
                  <span className="font-bold text-stone-950 text-base">PKR {liveFee.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-4">
                <span className="block text-xs font-bold text-stone-700 uppercase tracking-wider">Payment Method</span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "ONELINK", label: "1-Bill/Bank", icon: CreditCard },
                    { id: "METAMASK", label: "MetaMask", icon: Wallet },
                    { id: "BITCOIN", label: "Bitcoin", icon: Coins },
                  ].map((pm) => {
                    const IconComp = pm.icon;
                    const isSel = form.paymentMethod === pm.id;
                    return (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() => setForm({ ...form, paymentMethod: pm.id })}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition ${
                          isSel ? "border-blue-800 bg-blue-50/50 text-blue-900 font-bold" : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
                        }`}
                      >
                        <IconComp size={16} className={isSel ? "text-blue-800" : "text-stone-400"} />
                        <span className="text-[9px] mt-1">{pm.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* 1-Bill OneLink Bank Details */}
                {form.paymentMethod === "ONELINK" && (
                  <div className="p-3 border border-blue-200 rounded-xl bg-blue-50/10 space-y-3 text-[11px] text-stone-600">
                    <div className="bg-white p-2 border border-stone-200 rounded-lg space-y-1.5">
                      <div><span className="font-bold text-stone-500">1-Bill Consumer Number:</span></div>
                      <div className="font-mono font-bold text-blue-800 text-sm tracking-wider select-all">
                        100087450912
                      </div>
                      <div className="text-[9px] text-stone-400">Pay via ATM, Internet Banking or Mobile Apps using 1-Bill.</div>
                    </div>
                    <div>
                      <span className="mb-1 block font-bold text-stone-700 font-medium">Upload Receipt Slip</span>
                      {previews.paymentSlip ? (
                        <div className="flex items-center justify-between bg-white p-2 border border-stone-200 rounded">
                          <span className="truncate max-w-[120px]">{files.paymentSlip.name}</span>
                          <button type="button" onClick={() => removeFile("paymentSlip")} className="text-xs text-rose-600 font-bold">✕</button>
                        </div>
                      ) : (
                        <div className="border border-dashed border-stone-300 rounded p-2 text-center bg-white cursor-pointer relative">
                          <span className="text-[10px] font-bold text-stone-600">Upload Receipt</span>
                          <input type="file" onChange={(e) => handleFileChange("paymentSlip", e)} accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Bitcoin details */}
                {form.paymentMethod === "BITCOIN" && (
                  <div className="p-3 border border-orange-200 rounded-xl bg-orange-50/20 space-y-2 text-[11px] text-stone-600">
                    <p>Send equivalent BTC to address:</p>
                    <div className="bg-white p-2 border border-orange-200 rounded font-mono text-[10px] break-all select-all">
                      bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh
                    </div>
                    <label className="block mt-2">
                      <span className="mb-1 block font-bold text-stone-700">Tx Hash</span>
                      <input
                        className="h-8 w-full border border-stone-300 bg-white px-2 rounded-lg text-[10px] font-mono"
                        type="text"
                        placeholder="Paste transaction hash..."
                        value={form.bitcoinTxHash}
                        onChange={(e) => setForm({ ...form, bitcoinTxHash: e.target.value })}
                        required
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit Action Centered at the Bottom */}
          <div className="flex justify-center pt-6 pb-12">
            <button
              type="submit"
              disabled={busy || scanning}
              className="w-full max-w-md h-12 bg-blue-800 hover:bg-blue-900 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 transition disabled:opacity-60"
            >
              {scanning ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Processing ({scanProgress}%)
                </>
              ) : (
                <>
                  Submit Attestation Request
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* STEP 2: MetaMask Payment */}
      {step === 2 && currentRequest && (
        <div className="max-w-md mx-auto py-8 text-center bg-white border border-stone-200 shadow-xl rounded-2xl p-6 space-y-6">
          <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto text-blue-800 shadow">
            <Wallet size={32} />
          </div>
          <div>
            <h4 className="text-xl font-bold text-stone-800">Attestation Processing Fee</h4>
            <p className="text-sm text-stone-500 mt-1 font-medium">Verify blockchain credentials and commit MetaMask transaction.</p>
          </div>

          <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 text-left divide-y divide-stone-200 text-sm">
            <div className="pb-3 flex justify-between">
              <span className="text-stone-500">Degree Hash</span>
              <span className="font-mono text-stone-800 break-all max-w-[200px] text-xs">
                {currentRequest.degreeHash.slice(0, 16)}...
              </span>
            </div>
            <div className="py-3 flex justify-between">
              <span className="text-stone-500">Student Wallet</span>
              <span className="font-mono text-stone-800 break-all max-w-[200px] text-xs">
                {currentRequest.studentWallet}
              </span>
            </div>
            <div className="pt-3 flex justify-between items-center">
              <span className="font-bold text-stone-800">Amount Due</span>
              <span className="font-mono font-bold text-blue-800 text-lg">0.001 ETH</span>
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={busy}
            className="w-full h-12 bg-blue-800 hover:bg-blue-900 text-white font-bold rounded-xl shadow flex items-center justify-center gap-2 transition disabled:opacity-60"
          >
            {busy ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                Confirming Web3 transaction...
              </>
            ) : (
              <>
                <Wallet size={16} />
                Pay Attestation Fee with MetaMask
              </>
            )}
          </button>
        </div>
      )}

      {/* STEP 3: Completed State */}
      {step === 3 && (
        <div className="max-w-md mx-auto py-10 text-center bg-white border border-stone-200 shadow-xl rounded-2xl p-6 space-y-6">
          <div className="h-20 w-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-inner">
            <CheckCircle size={44} />
          </div>
          <div className="space-y-2">
            <h4 className="text-2xl font-bold text-stone-800">Application Submitted!</h4>
            <p className="text-sm text-stone-500 font-medium">
              Your academic files and payment are successfully registered. The university attestation department will review your documents.
            </p>
          </div>

          <div className="pt-4">
            <button
              onClick={resetFlow}
              className="px-6 h-12 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-xl transition shadow-sm"
            >
              Submit Another Request
            </button>
          </div>
        </div>
      )}

      {/* History Section at the bottom */}
      <div className="bg-white border border-stone-200 shadow-sm rounded-2xl p-6 space-y-4">
        <h4 className="font-bold text-stone-800 flex items-center gap-2 text-sm">
          <FileText size={18} className="text-blue-800" />
          Attestation History ({requests.length})
        </h4>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {requests.map((req) => (
            <div key={req._id} className="border border-stone-200 rounded-xl p-4 space-y-3 text-xs bg-stone-50/30 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-stone-850 text-sm">{req.degreeTitle}</p>
                    <p className="text-xs text-stone-500 font-medium">{req.university?.name}</p>
                  </div>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    req.status === "ISSUED" ? "bg-emerald-100 text-emerald-800" :
                    req.status === "PAID" ? "bg-cyan-100 text-cyan-800" :
                    req.status === "PENDING_PAYMENT" ? "bg-amber-100 text-amber-800" :
                    req.status === "REJECTED" ? "bg-rose-100 text-rose-800" :
                    "bg-stone-100 text-stone-600"
                  }`}>
                    {req.status.replace("_", " ")}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-1 text-[10px] text-stone-500 bg-white p-2 rounded-lg border border-stone-100">
                  <div>Roll: <span className="font-semibold">{req.rollNumber || "N/A"}</span></div>
                  <div>CGPA: <span className="font-semibold">{req.cgpa || "N/A"}</span></div>
                  <div>Fee: <span className="font-semibold">Rs. {req.calculatedFee || 3000}</span></div>
                  <div>Consumer No: <span className="font-semibold">{req.consumerNumber || "N/A"}</span></div>
                </div>

                {req.rejectionReason && (
                  <div className="p-2 border border-rose-100 rounded-lg bg-rose-50/50 text-[10px] text-rose-800">
                    <span className="font-bold">Reason:</span> {req.rejectionReason}
                  </div>
                )}

                {req.status === "ISSUED" && (
                  <button
                    type="button"
                    onClick={() => printDegreeCertificate(req)}
                    className="w-full mt-2 focus-ring inline-flex h-8 items-center justify-center gap-1.5 border border-blue-200 bg-blue-50/50 hover:bg-blue-100 text-blue-900 px-3 rounded-lg text-[11px] font-bold transition"
                  >
                    <Printer size={13} />
                    Print Attested Degree
                  </button>
                )}
              </div>

              <div className="flex justify-between text-[9px] text-stone-400 font-mono truncate pt-2 mt-2 border-t border-stone-100">
                <span>Method: {req.paymentMethod}</span>
                <span className="max-w-[120px] truncate">Hash: {req.degreeHash}</span>
              </div>
            </div>
          ))}
          {requests.length === 0 && (
            <p className="p-5 text-center text-xs text-stone-500 col-span-full">No requests submitted yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
