import React, { useEffect, useState } from "react";
import { PageHeader } from "../components/PageHeader.jsx";
import { StatusMessage } from "../components/StatusMessage.jsx";
import { apiRequest, API_BASE_URL } from "../services/api.js";
import { issueDegreeOnChain } from "../services/web3.js";
import { 
  CheckCircle, 
  ShieldAlert, 
  Image, 
  ShieldCheck, 
  Loader2, 
  FileText, 
  Calendar, 
  GraduationCap, 
  Coins, 
  CreditCard, 
  Wallet,
  XCircle,
  Download,
  Filter,
  Columns,
  Printer,
  Edit
} from "lucide-react";
import { printDegreeCertificate } from "../services/printHelper.js";
import { AdminAnalyticsDashboard } from "../components/charts/AdminAnalyticsDashboard.jsx";

export function AdminRequestsPage({ token }) {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  
  // Side-by-side view states
  const [leftDocPreview, setLeftDocPreview] = useState("");
  const [rightDocPreview, setRightDocPreview] = useState("");

  // Rejection state
  const [rejectionReason, setRejectionReason] = useState("");

  // Filters state
  const [filterUniversity, setFilterUniversity] = useState("");
  const [filterLevel, setFilterLevel] = useState("");
  const [filterDate, setFilterDate] = useState("");

  // Edit details states
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    studentName: "",
    fatherName: "",
    dob: "",
    gender: "",
    maritalStatus: "",
    address: "",
    degreeTitle: "",
    department: "",
    graduationYear: "",
    rollNumber: "",
    metricPercentage: "",
    interPercentage: "",
    cgpa: "",
    ocrStatus: "",
    yoloStatus: "",
    status: "",
    rejectionReason: "",
  });

  async function loadRequests() {
    try {
      const data = await apiRequest("/degree-requests/pending", { token });
      setRequests(data.requests || []);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadRequests();
  }, [token]);

  useEffect(() => {
    if (selectedRequest) {
      setLeftDocPreview(selectedRequest.documentUrl);
      setRightDocPreview(selectedRequest.nicFrontUrl || selectedRequest.documentUrl);
      setRejectionReason("");
      setIsEditing(false);
      setEditForm({
        studentName: selectedRequest.student?.name || "",
        fatherName: selectedRequest.fatherName || "",
        dob: selectedRequest.dob || "",
        gender: selectedRequest.gender || "Male",
        maritalStatus: selectedRequest.maritalStatus || "Single",
        address: selectedRequest.address || "",
        degreeTitle: selectedRequest.degreeTitle || "",
        department: selectedRequest.department || "",
        graduationYear: selectedRequest.graduationYear || "",
        rollNumber: selectedRequest.rollNumber || "",
        metricPercentage: selectedRequest.metricPercentage || "",
        interPercentage: selectedRequest.interPercentage || "",
        cgpa: selectedRequest.cgpa || "",
        ocrStatus: selectedRequest.ocrStatus || "PENDING",
        yoloStatus: selectedRequest.yoloStatus || "PENDING",
        status: selectedRequest.status || "PENDING_VERIFICATION",
        rejectionReason: selectedRequest.rejectionReason || "",
      });
    } else {
      setLeftDocPreview("");
      setRightDocPreview("");
      setIsEditing(false);
    }
  }, [selectedRequest]);

  async function handleUpdateRequest() {
    setError("");
    setSuccess("");
    setBusy(true);
    try {
      const data = await apiRequest(`/degree-requests/${selectedRequest._id}`, {
        method: "PATCH",
        token,
        body: editForm
      });
      setSuccess("Application details updated successfully!");
      setIsEditing(false);
      await loadRequests();
      setSelectedRequest(data.request);
    } catch (err) {
      setError(err.message || "Failed to update details");
    } finally {
      setBusy(false);
    }
  }

  // Handle Approve & Mint
  async function handleApproveAndMint(reqItem) {
    setError("");
    setSuccess("");
    setBusy(true);

    let receipt = null;
    let fallbackToOffchain = false;

    try {
      // 1. Try MetaMask mint transaction
      receipt = await issueDegreeOnChain({
        degreeHash: reqItem.degreeHash,
        studentWallet: reqItem.studentWallet,
        ipfsCID: reqItem.ipfsCID,
      });
    } catch (err) {
      console.warn("MetaMask issuance failed or not installed, falling back to off-chain:", err);
      fallbackToOffchain = true;
    }

    try {
      if (fallbackToOffchain || !receipt) {
        // Submit off-chain fallback confirmation to backend database
        await apiRequest(`/degree-requests/${reqItem._id}/approve-mint`, {
          method: "POST",
          token,
          body: {
            blockchainTxHash: "offchain_" + Math.random().toString(36).substring(2, 12),
            contractAddress: "0x0000000000000000000000000000000000000000",
            chainId: 0,
          },
        });
        setSuccess(`Degree attested successfully (Off-chain fallback)!`);
      } else {
        // Submit on-chain confirmation to backend database
        await apiRequest(`/degree-requests/${reqItem._id}/approve-mint`, {
          method: "POST",
          token,
          body: {
            blockchainTxHash: receipt.txHash,
            contractAddress: receipt.contractAddress,
            chainId: receipt.chainId,
          },
        });
        setSuccess(`Degree attested and minted successfully! Tx: ${receipt.txHash}`);
      }
      setSelectedRequest(null);
      await loadRequests();
    } catch (err) {
      setError(err.message || "Approval transaction failed");
    } finally {
      setBusy(false);
    }
  }

  // Handle Reject
  async function handleReject(reqItem) {
    if (!rejectionReason.trim()) {
      setError("Please provide a rejection reason.");
      return;
    }
    setError("");
    setSuccess("");
    setBusy(true);

    try {
      await apiRequest(`/degree-requests/${reqItem._id}/reject`, {
        method: "PATCH",
        token,
        body: { reason: rejectionReason }
      });
      setSuccess("Attestation request has been rejected.");
      setSelectedRequest(null);
      await loadRequests();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  // Helper to resolve document full URLs
  const getFullUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${API_BASE_URL.replace("/api", "")}${path}`;
  };

  // CSV Exporter for approved applications
  function exportApprovedCSV() {
    // Filter approved (ISSUED) applications
    const approved = requests.filter(r => r.status === "ISSUED");
    if (approved.length === 0) {
      alert("No approved attestation requests available to export.");
      return;
    }

    const headers = ["Student Name", "Email", "Roll Number", "University", "Degree Title", "CGPA", "Calculated Fee", "Consumer Number", "Blockchain Hash"];
    const rows = approved.map(r => [
      r.student?.name || "",
      r.student?.email || "",
      r.rollNumber || "",
      r.university?.name || "",
      r.degreeTitle || "",
      r.cgpa || "",
      r.calculatedFee || 3000,
      r.consumerNumber || "",
      r.degreeHash || ""
    ]);

    const csvContent = [headers.join(","), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Iqra_Approved_Attestations_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Filter Logic
  const filteredRequests = requests.filter(req => {
    // University Filter
    if (filterUniversity && !req.university?.name?.toLowerCase().includes(filterUniversity.toLowerCase())) {
      return false;
    }
    // Level Filter (checks highest qualification or qualifications array)
    if (filterLevel) {
      const hasQual = req.qualifications?.some(q => q.level.toLowerCase() === filterLevel.toLowerCase());
      if (!hasQual) return false;
    }
    // Date Filter (checks submission date matching)
    if (filterDate) {
      const subDate = new Date(req.createdAt).toISOString().split("T")[0];
      if (subDate !== filterDate) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        eyebrow="Iqra University Attestation Administration"
        title="Manage Attestation Applications"
        description="Verify document authenticity using OCR validations, cross-examine side-by-side files, and manage approvals."
      />

      {/* Visual Analytics Graphs */}
      <AdminAnalyticsDashboard requests={requests} />

      {/* Top Filter Bar & CSV Export Button */}
      <div className="bg-white border border-stone-200 shadow-sm rounded-xl p-5 flex flex-wrap gap-4 items-end justify-between">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">University</span>
            <input
              type="text"
              placeholder="Filter by university..."
              className="border border-stone-300 p-2 rounded-lg text-xs w-48 bg-stone-50"
              value={filterUniversity}
              onChange={(e) => setFilterUniversity(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Degree Level</span>
            <select
              className="border border-stone-300 p-2 rounded-lg text-xs w-36 bg-stone-50 font-medium"
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
            >
              <option value="">All Levels</option>
              <option value="Matric">Matric</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Bachelor">Bachelor</option>
              <option value="Master">Master</option>
              <option value="PhD">PhD</option>
            </select>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Submission Date</span>
            <input
              type="date"
              className="border border-stone-300 p-2 rounded-lg text-xs w-36 bg-stone-50"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </div>

          {(filterUniversity || filterLevel || filterDate) && (
            <button 
              onClick={() => { setFilterUniversity(""); setFilterLevel(""); setFilterDate(""); }}
              className="text-xs font-bold text-rose-600 hover:text-rose-800 self-end mb-2"
            >
              Clear Filters
            </button>
          )}
        </div>

        <button
          onClick={exportApprovedCSV}
          className="flex items-center gap-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 h-10 rounded-lg transition"
        >
          <Download size={14} /> Export Approved (CSV)
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_520px]">
        {/* Main List */}
        <section className="bg-white border border-stone-200 shadow-sm rounded-xl overflow-hidden self-start">
          <div className="p-5 border-b border-stone-200 bg-stone-50 flex justify-between items-center">
            <h2 className="text-sm font-bold text-stone-800">Applications List ({filteredRequests.length})</h2>
          </div>

          <div className="divide-y divide-stone-200">
            {filteredRequests.map((req) => (
              <div 
                key={req._id}
                onClick={() => setSelectedRequest(req)}
                className={`p-5 hover:bg-stone-50 cursor-pointer transition flex items-center justify-between ${
                  selectedRequest?._id === req._id ? "bg-stone-100/70 border-l-4 border-blue-800" : ""
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-stone-900 text-sm">{req.student?.name}</p>
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${
                      req.status === "ISSUED" ? "bg-emerald-100 text-emerald-800" :
                      req.status === "REJECTED" ? "bg-rose-100 text-rose-800" :
                      "bg-amber-100 text-amber-800"
                    }`}>
                      {req.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500">{req.university?.name}</p>
                  <p className="text-xs font-semibold text-stone-700">
                    {req.degreeTitle}
                  </p>
                  <div className="flex gap-2 mt-2 text-[9px] font-mono text-stone-500">
                    <span>Consumer: {req.consumerNumber || "N/A"}</span>
                    <span>Fee: Rs. {req.calculatedFee || 3000}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 text-[10px]">
                  <span className={`font-bold px-2 py-0.5 rounded ${
                    req.ocrStatus === "PASSED" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-rose-50 text-rose-700 border border-rose-200"
                  }`}>
                    OCR: {req.ocrStatus}
                  </span>
                  
                  <span className={`font-bold px-2 py-0.5 rounded ${
                    req.yoloStatus === "VERIFIED" ? "bg-blue-50 text-blue-700 border border-blue-200" : "bg-rose-50 text-rose-700 border border-rose-200"
                  }`}>
                    YOLO: {req.yoloStatus}
                  </span>
                </div>
              </div>
            ))}

            {filteredRequests.length === 0 && (
              <p className="p-6 text-center text-xs text-stone-500">No matching requests found.</p>
            )}
          </div>
        </section>

        {/* Selected Request Detail Panel */}
        <section className="bg-white border border-stone-200 shadow-sm rounded-xl p-6 self-start space-y-6">
          <div className="flex justify-between items-center border-b border-stone-100 pb-3">
            <h3 className="text-base font-bold text-stone-800">Iqra Document Evaluation</h3>
            {selectedRequest && !isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1 text-xs bg-blue-50 hover:bg-blue-100 text-blue-800 px-3 py-1.5 rounded-lg font-bold transition border border-blue-200 shadow-xs"
              >
                <Edit size={12} /> Edit Details
              </button>
            )}
          </div>
          <StatusMessage error={error} success={success} />

          {selectedRequest ? (
            <div className="space-y-6">
              {isEditing ? (
                <div className="space-y-4">
                  <h4 className="font-bold text-xs text-stone-700 uppercase tracking-wider">Edit Request Metadata</h4>
                  
                  <div className="space-y-3 text-xs">
                    <label className="block">
                      <span className="font-semibold text-stone-600 block mb-1">Student Name</span>
                      <input 
                        type="text" 
                        className="w-full border border-stone-300 p-2 rounded-lg bg-stone-50"
                        value={editForm.studentName}
                        onChange={(e) => setEditForm({ ...editForm, studentName: e.target.value })}
                      />
                    </label>

                    <div className="grid grid-cols-2 gap-3">
                      <label className="block">
                        <span className="font-semibold text-stone-600 block mb-1">Father's Name</span>
                        <input 
                          type="text" 
                          className="w-full border border-stone-300 p-2 rounded-lg bg-stone-50"
                          value={editForm.fatherName}
                          onChange={(e) => setEditForm({ ...editForm, fatherName: e.target.value })}
                        />
                      </label>
                      <label className="block">
                        <span className="font-semibold text-stone-600 block mb-1">DOB</span>
                        <input 
                          type="text" 
                          className="w-full border border-stone-300 p-2 rounded-lg bg-stone-50"
                          value={editForm.dob}
                          onChange={(e) => setEditForm({ ...editForm, dob: e.target.value })}
                        />
                      </label>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <label className="block">
                        <span className="font-semibold text-stone-600 block mb-1">Gender</span>
                        <select 
                          className="w-full border border-stone-300 p-2 rounded-lg bg-stone-50"
                          value={editForm.gender}
                          onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </label>
                      <label className="block">
                        <span className="font-semibold text-stone-600 block mb-1">Marital Status</span>
                        <select 
                          className="w-full border border-stone-300 p-2 rounded-lg bg-stone-50"
                          value={editForm.maritalStatus}
                          onChange={(e) => setEditForm({ ...editForm, maritalStatus: e.target.value })}
                        >
                          <option value="Single">Single</option>
                          <option value="Married">Married</option>
                        </select>
                      </label>
                    </div>

                    <label className="block">
                      <span className="font-semibold text-stone-600 block mb-1">Address</span>
                      <input 
                        type="text" 
                        className="w-full border border-stone-300 p-2 rounded-lg bg-stone-50"
                        value={editForm.address}
                        onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                      />
                    </label>

                    <div className="grid grid-cols-2 gap-3">
                      <label className="block">
                        <span className="font-semibold text-stone-600 block mb-1">Degree Title</span>
                        <input 
                          type="text" 
                          className="w-full border border-stone-300 p-2 rounded-lg bg-stone-50"
                          value={editForm.degreeTitle}
                          onChange={(e) => setEditForm({ ...editForm, degreeTitle: e.target.value })}
                        />
                      </label>
                      <label className="block">
                        <span className="font-semibold text-stone-600 block mb-1">Department</span>
                        <input 
                          type="text" 
                          className="w-full border border-stone-300 p-2 rounded-lg bg-stone-50"
                          value={editForm.department}
                          onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                        />
                      </label>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <label className="block">
                        <span className="font-semibold text-stone-600 block mb-1">Graduation Year</span>
                        <input 
                          type="number" 
                          className="w-full border border-stone-300 p-2 rounded-lg bg-stone-50"
                          value={editForm.graduationYear}
                          onChange={(e) => setEditForm({ ...editForm, graduationYear: e.target.value })}
                        />
                      </label>
                      <label className="block">
                        <span className="font-semibold text-stone-600 block mb-1">Roll Number</span>
                        <input 
                          type="text" 
                          className="w-full border border-stone-300 p-2 rounded-lg bg-stone-50"
                          value={editForm.rollNumber}
                          onChange={(e) => setEditForm({ ...editForm, rollNumber: e.target.value })}
                        />
                      </label>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <label className="block">
                        <span className="font-semibold text-stone-600 block mb-1">Metric %</span>
                        <input 
                          type="number" 
                          step="0.01"
                          className="w-full border border-stone-300 p-2 rounded-lg bg-stone-50"
                          value={editForm.metricPercentage}
                          onChange={(e) => setEditForm({ ...editForm, metricPercentage: e.target.value })}
                        />
                      </label>
                      <label className="block">
                        <span className="font-semibold text-stone-600 block mb-1">Inter %</span>
                        <input 
                          type="number" 
                          step="0.01"
                          className="w-full border border-stone-300 p-2 rounded-lg bg-stone-50"
                          value={editForm.interPercentage}
                          onChange={(e) => setEditForm({ ...editForm, interPercentage: e.target.value })}
                        />
                      </label>
                      <label className="block">
                        <span className="font-semibold text-stone-600 block mb-1">CGPA</span>
                        <input 
                          type="number" 
                          step="0.01"
                          className="w-full border border-stone-300 p-2 rounded-lg bg-stone-50"
                          value={editForm.cgpa}
                          onChange={(e) => setEditForm({ ...editForm, cgpa: e.target.value })}
                        />
                      </label>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <label className="block">
                        <span className="font-semibold text-stone-600 block mb-1">OCR Status Override</span>
                        <select 
                          className="w-full border border-stone-300 p-2 rounded-lg bg-stone-50 font-bold"
                          value={editForm.ocrStatus}
                          onChange={(e) => setEditForm({ ...editForm, ocrStatus: e.target.value })}
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="PASSED">PASSED</option>
                          <option value="FAILED">FAILED</option>
                        </select>
                      </label>
                      <label className="block">
                        <span className="font-semibold text-stone-600 block mb-1">YOLO Status Override</span>
                        <select 
                          className="w-full border border-stone-300 p-2 rounded-lg bg-stone-50 font-bold"
                          value={editForm.yoloStatus}
                          onChange={(e) => setEditForm({ ...editForm, yoloStatus: e.target.value })}
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="VERIFIED">VERIFIED</option>
                          <option value="FAILED">FAILED</option>
                        </select>
                      </label>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <label className="block col-span-2">
                        <span className="font-semibold text-stone-600 block mb-1">Overall Status</span>
                        <select 
                          className="w-full border border-stone-300 p-2 rounded-lg bg-stone-50 font-bold"
                          value={editForm.status}
                          onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                        >
                          <option value="PENDING_VERIFICATION">PENDING VERIFICATION</option>
                          <option value="VERIFICATION_FAILED">VERIFICATION FAILED</option>
                          <option value="PENDING_PAYMENT">PENDING PAYMENT</option>
                          <option value="PAID">PAID (Auto issue if verified)</option>
                          <option value="ISSUED">ISSUED</option>
                          <option value="REJECTED">REJECTED</option>
                        </select>
                      </label>
                    </div>

                    <label className="block">
                      <span className="font-semibold text-stone-600 block mb-1">Rejection / Log Reason</span>
                      <textarea 
                        className="w-full border border-stone-300 p-2 rounded-lg bg-stone-50 h-16"
                        value={editForm.rejectionReason}
                        onChange={(e) => setEditForm({ ...editForm, rejectionReason: e.target.value })}
                      />
                    </label>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="h-10 border border-stone-300 rounded-lg font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleUpdateRequest}
                        disabled={busy}
                        className="h-10 bg-blue-850 hover:bg-blue-900 text-white rounded-lg font-bold"
                      >
                        {busy ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Document Comparer View */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-xs text-stone-700 uppercase tracking-wider flex items-center gap-1">
                      <Columns size={14} /> Side-by-Side Visual Comparer
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="relative aspect-[3/4] border border-stone-200 bg-stone-900 rounded-lg overflow-hidden flex items-center justify-center p-1">
                        <img src={getFullUrl(leftDocPreview)} alt="Doc Left" className="max-h-56 object-contain rounded" />
                        <span className="absolute bottom-1 left-1 bg-stone-950/70 text-white text-[9px] px-1.5 py-0.5 rounded">Left View</span>
                      </div>

                      <div className="relative aspect-[3/4] border border-stone-200 bg-stone-900 rounded-lg overflow-hidden flex items-center justify-center p-1">
                        <img src={getFullUrl(rightDocPreview)} alt="Doc Right" className="max-h-56 object-contain rounded" />
                        <span className="absolute bottom-1 left-1 bg-stone-950/70 text-white text-[9px] px-1.5 py-0.5 rounded">Right View</span>
                      </div>
                    </div>
                  </div>

                  {/* Document select options for Left and Right preview */}
                  <div className="space-y-2 text-xs">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[10px] text-stone-500 block mb-1 font-bold">Left Preview Document</span>
                        <select 
                          className="border border-stone-300 bg-stone-50 p-1.5 rounded-lg w-full text-xs"
                          value={leftDocPreview}
                          onChange={(e) => setLeftDocPreview(e.target.value)}
                        >
                          <option value={selectedRequest.documentUrl}>Degree Certificate</option>
                          <option value={selectedRequest.metricMarksheetUrl}>Metric Marksheet</option>
                          <option value={selectedRequest.interMarksheetUrl}>Inter Marksheet</option>
                          <option value={selectedRequest.transcriptUrl}>Transcript</option>
                          <option value={selectedRequest.nicFrontUrl}>NIC Front</option>
                          <option value={selectedRequest.nicBackUrl}>NIC Back</option>
                          <option value={selectedRequest.paymentSlipUrl}>Payment Slip</option>
                        </select>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-500 block mb-1 font-bold">Right Preview Document</span>
                        <select 
                          className="border border-stone-300 bg-stone-50 p-1.5 rounded-lg w-full text-xs"
                          value={rightDocPreview}
                          onChange={(e) => setRightDocPreview(e.target.value)}
                        >
                          <option value={selectedRequest.nicFrontUrl}>NIC Front</option>
                          <option value={selectedRequest.nicBackUrl}>NIC Back</option>
                          <option value={selectedRequest.documentUrl}>Degree Certificate</option>
                          <option value={selectedRequest.metricMarksheetUrl}>Metric Marksheet</option>
                          <option value={selectedRequest.interMarksheetUrl}>Inter Marksheet</option>
                          <option value={selectedRequest.transcriptUrl}>Transcript</option>
                          <option value={selectedRequest.paymentSlipUrl}>Payment Slip</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Personal Details Profile */}
                  <div className="p-4 border border-stone-200 rounded-xl bg-stone-50/50 space-y-3 text-xs">
                    <h4 className="font-bold text-stone-800 text-xs border-b pb-1.5 uppercase tracking-wide">Applicant Profile</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-stone-500">Student Name</span>
                        <div className="font-bold text-stone-800">{selectedRequest.student?.name}</div>
                      </div>
                      <div>
                        <span className="text-stone-500">Father's Name</span>
                        <div className="font-bold text-stone-800">{selectedRequest.fatherName || "N/A"}</div>
                      </div>
                      <div>
                        <span className="text-stone-500">DOB / Gender</span>
                        <div className="font-bold text-stone-800">{selectedRequest.dob || "N/A"} ({selectedRequest.gender || "N/A"})</div>
                      </div>
                      <div>
                        <span className="text-stone-500">Address</span>
                        <div className="font-bold text-stone-800 truncate max-w-[200px]" title={selectedRequest.address}>{selectedRequest.address || "N/A"}</div>
                      </div>
                    </div>
                  </div>

                  {/* OCR Validation Alerts */}
                  <div className="p-4 border border-stone-200 rounded-xl bg-stone-50/50 space-y-2 text-xs">
                    <h4 className="font-bold text-stone-800 text-xs border-b pb-1.5 uppercase tracking-wide">OCR Validation Integrity Log</h4>
                    <div className="space-y-1.5">
                      <div className="flex justify-between">
                        <span>Metric Percentage:</span>
                        <span className="font-bold">{selectedRequest.metricPercentage}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Intermediate Percentage:</span>
                        <span className="font-bold">{selectedRequest.interPercentage}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Transcript CGPA:</span>
                        <span className="font-bold">{selectedRequest.cgpa}</span>
                      </div>
                      {selectedRequest.rejectionReason && (
                        <div className="p-2 border border-rose-100 bg-rose-50/20 text-rose-800 rounded-lg font-medium">
                          <span className="font-bold">Failure Log:</span> {selectedRequest.rejectionReason}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Qualifications History */}
                  <div className="p-4 border border-stone-200 rounded-xl bg-stone-50/50 space-y-3 text-xs">
                    <h4 className="font-bold text-stone-800 text-xs border-b pb-1.5 uppercase tracking-wide">Educational History Array</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {selectedRequest.qualifications?.map((q, i) => (
                        <div key={i} className="bg-white p-2 border border-stone-150 rounded-lg space-y-0.5">
                          <div className="font-bold text-stone-850">{q.level}: {q.degreeTitle}</div>
                          <div className="text-[10px] text-stone-500">{q.boardOrUniversity} ({q.session})</div>
                        </div>
                      ))}
                      {(!selectedRequest.qualifications || selectedRequest.qualifications.length === 0) && (
                        <p className="text-stone-400 text-center py-2">No qualification history attached.</p>
                      )}
                    </div>
                  </div>

                  {/* Reject / Approve actions */}
                  <div className="space-y-4 pt-4 border-t border-stone-200">
                    {selectedRequest.status === "REJECTED" ? (
                      <div className="p-3 bg-rose-50 text-rose-800 border border-rose-200 rounded-lg text-center font-bold text-xs">
                        This Request Has Been Rejected
                      </div>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide">IU Evaluation / Decision Reason</label>
                          <input 
                            type="text"
                            placeholder="Provide details or reasons for rejection/approvals..."
                            className="w-full border border-stone-300 p-2.5 rounded-lg text-xs"
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {selectedRequest.status !== "ISSUED" ? (
                            <>
                              <button
                                onClick={() => handleReject(selectedRequest)}
                                disabled={busy}
                                className="h-11 border border-rose-300 text-rose-700 bg-rose-50/20 hover:bg-rose-50 hover:text-rose-800 font-bold rounded-lg text-xs flex items-center justify-center gap-1 transition"
                              >
                                <XCircle size={14} /> Reject Attestation
                              </button>

                              <button
                                onClick={() => handleApproveAndMint(selectedRequest)}
                                disabled={busy}
                                className="h-11 bg-blue-800 hover:bg-blue-900 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1 transition"
                              >
                                {busy ? <Loader2 className="animate-spin" size={14} /> : <CheckCircle size={14} />} Approve & Mint
                              </button>
                            </>
                          ) : (
                            <div className="flex flex-col gap-2 w-full col-span-2">
                              <button
                                type="button"
                                onClick={() => printDegreeCertificate(selectedRequest)}
                                className="w-full h-11 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition"
                              >
                                <Printer size={14} /> Print Degree Certificate
                              </button>
                              <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-[10px] flex items-center justify-center p-2 text-center font-bold">
                                Already Issued & Verified
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          ) : (
            <p className="text-sm text-stone-400 text-center py-12">Select an application from the left list to evaluate documents.</p>
          )}
        </section>
      </div>
    </div>
  );
}
