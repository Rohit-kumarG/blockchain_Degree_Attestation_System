import React from "react";
import { useNavigate } from "react-router-dom";
import {
  GraduationCap,
  ShieldCheck,
  Cpu,
  Layers,
  Search,
  ArrowRight,
  Lock,
  FileCheck,
  CheckCircle,
  FileText,
  ExternalLink,
  Sparkles,
  Zap,
  Globe
} from "lucide-react";

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans relative overflow-x-hidden selection:bg-blue-600 selection:text-white">
      {/* Background decoration elements - Soft Ambient Lights */}
      <div className="absolute top-[10%] left-[5%] w-[450px] h-[450px] bg-gradient-to-tr from-blue-400/15 to-cyan-300/5 rounded-full blur-[110px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-gradient-to-br from-indigo-400/15 via-purple-300/5 to-transparent rounded-full blur-[130px] pointer-events-none"></div>

      {/* Main Container mirroring the official portal look */}
      <div className="max-w-6xl w-full mx-auto px-0 sm:px-4 md:my-6 flex-1 flex flex-col bg-white/70 backdrop-blur-xl md:rounded-3xl md:shadow-2xl border border-white/60 overflow-hidden">

        {/* Top Header Banner Picture - Full Width style */}
        <div className="w-full bg-white border-b border-slate-200">
          <img
            src="/iqra3.PNG"
            alt="Iqra University Portal Banner"
            className="w-full h-auto block"
          />
        </div>

        {/* Blue Navigation Bar */}
        <div className="bg-gradient-to-r from-[#2176AE] via-[#0B3C5D] to-[#0B3C5D] text-white py-3 px-6 flex items-center justify-between shadow-md text-xs sm:text-sm font-bold uppercase tracking-wider">
          <div className="flex items-center gap-6">
            <span
              onClick={() => navigate("/")}
              className="cursor-pointer hover:text-blue-200 transition-colors"
            >
              Home
            </span>
            <a href="#how-it-works" className="hover:text-blue-200 transition-colors">How It Works</a>
            <a href="#showcase" className="hover:text-blue-200 transition-colors">Gallery</a>
          </div>
          <div className="flex items-center gap-4">
            <span
              onClick={() => navigate("/login", { state: { mode: "signin" } })}
              className="cursor-pointer hover:text-blue-200 transition-colors"
            >
              Sign In
            </span>
            <span
              onClick={() => navigate("/login", { state: { mode: "signup" } })}
              className="cursor-pointer hover:text-blue-200 transition-colors"
            >
              Sign Up
            </span>
          </div>
        </div>

        {/* Alert/Announcement Bar */}
        <div className="bg-[#8B0000] text-white px-6 py-3.5 text-center text-xs sm:text-sm font-bold shadow-inner">
          Important: Please ensure all uploaded transcripts and degrees are clear, high-resolution scans for AI OCR attestation processing.
        </div>

        {/* Main Attestation Body */}
        <main className="p-6 sm:p-8 flex-1 space-y-10">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pb-4 border-b-2 border-[#0B3C5D]/20">
            <div className="h-14 w-14 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-md">
              <GraduationCap size={28} />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B3C5D] tracking-tight">Student Information & Attestation</h1>
              <p className="text-xs sm:text-sm text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Iqra University Decentralized Verification System</p>
            </div>
          </div>

          {/* Grid of Attestation Services */}
          <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Service 1: Apply for Attestation */}
            <div
              onClick={() => navigate("/login", { state: { mode: "signin" } })}
              className="group cursor-pointer bg-white/80 border border-slate-200 hover:border-blue-500/40 rounded-2xl p-6 text-center shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 backdrop-blur-md flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="h-14 w-14 bg-blue-100 group-hover:bg-blue-500 group-hover:text-white rounded-xl flex items-center justify-center text-blue-600 mx-auto transition-colors duration-300 border border-blue-200/50">
                  <FileText size={24} />
                </div>
                <h4 className="font-bold text-slate-900 text-sm tracking-wide">Apply Attestation</h4>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Submit degrees, CNIC, and transcript copies online for secure verification.
                </p>
              </div>
              <div className="pt-4 text-xs font-bold text-blue-600 group-hover:text-blue-800 flex items-center justify-center gap-1.5">
                <span>Start Application</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Service 2: Verify Credentials */}
            <div
              onClick={() => navigate("/verify")}
              className="group cursor-pointer bg-white/80 border border-slate-200 hover:border-blue-500/40 rounded-2xl p-6 text-center shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 backdrop-blur-md flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="h-14 w-14 bg-emerald-100 group-hover:bg-emerald-500 group-hover:text-white rounded-xl flex items-center justify-center text-emerald-600 mx-auto transition-colors duration-300 border border-emerald-200/50">
                  <Search size={24} />
                </div>
                <h4 className="font-bold text-slate-900 text-sm tracking-wide">Verify Credentials</h4>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Instantly verify degrees and credentials using secure blockchain ledger lookups.
                </p>
              </div>
              <div className="pt-4 text-xs font-bold text-emerald-600 group-hover:text-emerald-800 flex items-center justify-center gap-1.5">
                <span>Open Verification</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Service 3: Sign In */}
            <div
              onClick={() => navigate("/login", { state: { mode: "signin" } })}
              className="group cursor-pointer bg-white/80 border border-slate-200 hover:border-blue-500/40 rounded-2xl p-6 text-center shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 backdrop-blur-md flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="h-14 w-14 bg-purple-100 group-hover:bg-purple-500 group-hover:text-white rounded-xl flex items-center justify-center text-purple-600 mx-auto transition-colors duration-300 border border-purple-200/50">
                  <Lock size={24} />
                </div>
                <h4 className="font-bold text-slate-900 text-sm tracking-wide">Student Sign In</h4>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Access your existing attestation profile, track requests, and check logs.
                </p>
              </div>
              <div className="pt-4 text-xs font-bold text-purple-600 group-hover:text-purple-800 flex items-center justify-center gap-1.5">
                <span>Sign In</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Service 4: Register */}
            <div
              onClick={() => navigate("/login", { state: { mode: "signup" } })}
              className="group cursor-pointer bg-white/80 border border-slate-200 hover:border-blue-500/40 rounded-2xl p-6 text-center shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 backdrop-blur-md flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="h-14 w-14 bg-pink-100 group-hover:bg-pink-500 group-hover:text-white rounded-xl flex items-center justify-center text-pink-600 mx-auto transition-colors duration-300 border border-pink-200/50">
                  <ShieldCheck size={24} />
                </div>
                <h4 className="font-bold text-slate-900 text-sm tracking-wide">Portal Registration</h4>
                <p className="text-slate-500 text-xs leading-relaxed">
                  New student? Register an account to initiate degree validations.
                </p>
              </div>
              <div className="pt-4 text-xs font-bold text-pink-600 group-hover:text-pink-800 flex items-center justify-center gap-1.5">
                <span>Create Account</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </section>


          {/* About Attestation Project Details Section */}
          <section className="py-8 border-t border-slate-200 grid md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-7 space-y-4 text-left">
              <h3 className="text-lg font-bold text-[#0B3C5D]">About the Attestation Portal</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                The **Iqra University Decentralized Degree & Transcript Attestation system** is a state-of-the-art secure platform designed to safeguard academic accomplishments. By pairing Ethereum smart contracts with IPFS storage, we register cryptographic proof of degrees that remains permanently secure, immutable, and easily shareable.
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                Our verification workflow integrates **Tesseract OCR** for automated data extraction and a **YOLO Object Detection model** to confirm registrar seals and authenticity stamps. This eliminates manual bureaucracy and prevents academic credential forgery.
              </p>
            </div>
            
            <div className="md:col-span-5 grid grid-cols-2 gap-4">
              <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-xl shadow-sm text-center">
                <div className="text-blue-600 mb-2 flex justify-center"><Cpu size={24} /></div>
                <h5 className="font-bold text-slate-800 text-xs">AI Automation</h5>
                <p className="text-[10px] text-slate-500 mt-1">OCR scans & visual stamp audits in seconds.</p>
              </div>
              <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-xl shadow-sm text-center">
                <div className="text-indigo-600 mb-2 flex justify-center"><Layers size={24} /></div>
                <h5 className="font-bold text-slate-800 text-xs">Web3 Ledger</h5>
                <p className="text-[10px] text-slate-500 mt-1">Degrees are permanently minted to blockchain.</p>
              </div>
            </div>
          </section>

          {/* Process Workflow Section */}
          <section id="how-it-works" className="py-8 border-t border-slate-200">
            <h3 className="text-lg font-bold text-[#0B3C5D] mb-6">Attestation Process Steps</h3>
            <div className="grid sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                { step: "01", icon: <FileText size={18} />, title: "Upload Info", desc: "Attach CNIC, degrees and transcript details." },
                { step: "02", icon: <Cpu size={18} />, title: "AI OCR Read", desc: "Automated verification extraction of fields." },
                { step: "03", icon: <FileCheck size={18} />, title: "Visual Audit", desc: "Detection of registrars stamps and seals." },
                { step: "04", icon: <Layers size={18} />, title: "Portal Fee", desc: "Pay attestation validation charges." },
                { step: "05", icon: <ShieldCheck size={18} />, title: "Mint Record", desc: "Block hash registration with secure QR." }
              ].map((item, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200/70 p-4 rounded-xl space-y-2">
                  <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{item.step}</span>
                  <div className="flex items-center gap-2">
                    <div className="text-blue-600 bg-blue-50 p-1.5 rounded-lg">{item.icon}</div>
                    <h5 className="font-bold text-slate-800 text-xs">{item.title}</h5>
                  </div>
                  <p className="text-slate-500 text-[11px] leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Gallery Showcase Section */}
          <section id="showcase" className="py-8 border-t border-slate-200">
            <h3 className="text-lg font-bold text-[#0B3C5D] mb-6">Portal Reference Files</h3>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { src: "/iqra_banner.png", title: "Degree Verification Banner", desc: "Verification stamp reference detection." },
                { src: "/iqra2.png", title: "Credential Layout Template", desc: "CNIC ID verification data structures." },
                { src: "/iqra3.PNG", title: "Transcript Processing Model", desc: "OCR processing target fields mapping." }
              ].map((item, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
                  <div className="aspect-[4/3] bg-slate-100 relative">
                    <img src={item.src} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4 bg-white border-t border-slate-200">
                    <h6 className="font-bold text-slate-800 text-xs">{item.title}</h6>
                    <p className="text-slate-500 text-[11px] mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* Footer inside the Portal Container */}
        <footer className="bg-slate-900 text-slate-400 py-8 px-8 border-t border-slate-800 mt-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <div className="flex items-center gap-3">
            <img src="/logoiqra.png" alt="Iqra Logo" className="h-6 w-auto brightness-0 invert opacity-75" />
            <span className="font-bold text-slate-200 uppercase tracking-widest">Iqra University Attestation Center</span>
          </div>
          <div className="text-center sm:text-right text-slate-500">
            <p>© {new Date().getFullYear()} Iqra University. All rights reserved.</p>
            <p className="mt-0.5">Powered by Ethereum Smart Contracts & IPFS Storage</p>
          </div>
        </footer>

      </div>
    </div>
  );
}
