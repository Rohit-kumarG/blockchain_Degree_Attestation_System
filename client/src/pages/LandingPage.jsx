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
  FileText,
  Zap,
  Globe,
  CheckCircle,
  Award,
  Users,
  Building2,
  Clock,
  Star,
  ChevronRight,
  Shield,
  Database,
  Eye,
  BadgeCheck,
} from "lucide-react";

export function LandingPage() {
  const navigate = useNavigate();

  const stats = [
    { label: "Degrees Verified", value: "10,000+", icon: FileCheck },
    { label: "Universities Onboarded", value: "25+", icon: Building2 },
    { label: "Avg. Processing Time", value: "< 48 hrs", icon: Clock },
    { label: "System Accuracy", value: "99.8%", icon: Star },
  ];

  const features = [
    {
      icon: Cpu,
      color: "from-blue-500 to-cyan-400",
      title: "AI-Powered OCR Extraction",
      desc: "Tesseract OCR automatically reads and extracts data from transcripts, marksheets, and CNIC documents — eliminating manual data entry errors.",
    },
    {
      icon: Eye,
      color: "from-violet-500 to-purple-400",
      title: "YOLO Stamp Detection",
      desc: "Our trained YOLO object detection model identifies and verifies official university registrar seals, stamps and authenticity marks on documents.",
    },
    {
      icon: Shield,
      color: "from-emerald-500 to-green-400",
      title: "Blockchain Immutability",
      desc: "Every attested degree is permanently hashed and recorded on Ethereum smart contracts — tamper-proof, transparent, and globally verifiable.",
    },
    {
      icon: Database,
      color: "from-orange-500 to-amber-400",
      title: "IPFS Decentralized Storage",
      desc: "Document files are stored on the InterPlanetary File System — distributed, censorship-resistant, and permanently accessible.",
    },
    {
      icon: BadgeCheck,
      color: "from-pink-500 to-rose-400",
      title: "Instant Employer Verification",
      desc: "Employers can verify any attested degree in seconds by entering the unique credential hash — no calls, no paperwork needed.",
    },
    {
      icon: Globe,
      color: "from-teal-500 to-cyan-400",
      title: "Globally Accessible Portal",
      desc: "Students abroad can apply and track their attestation requests in real-time from anywhere in the world via our secure online portal.",
    },
  ];

  const steps = [
    { step: "01", icon: FileText, title: "Submit Application", desc: "Upload your CNIC (front & back), degree certificate, transcripts and marksheets through our secure portal." },
    { step: "02", icon: Cpu, title: "AI Scans Documents", desc: "Tesseract OCR automatically reads and validates your academic data. YOLO model checks for official university seals." },
    { step: "03", icon: FileCheck, title: "Admin Review", desc: "Iqra University administrators verify the extracted data, cross-examine documents side by side, and approve the request." },
    { step: "04", icon: Layers, title: "Pay Attestation Fee", desc: "Receive your unique consumer number and pay the attestation processing fee through your bank portal." },
    { step: "05", icon: Shield, title: "Blockchain Minting", desc: "Your degree is cryptographically hashed and minted onto the Ethereum blockchain — permanently secured." },
    { step: "06", icon: BadgeCheck, title: "Receive Certificate", desc: "Download your blockchain-backed degree certificate with a QR code for instant verification by employers worldwide." },
  ];

  const faqs = [
    {
      q: "Who can apply for degree attestation?",
      a: "Any current or past student of Iqra University who has obtained a degree, diploma, or certificate from the university can apply for attestation through this portal."
    },
    {
      q: "What documents are required?",
      a: "You need your CNIC (front and back), original degree certificate, all academic marksheets (Matric, Intermediate), university transcript, and a clear payment slip."
    },
    {
      q: "How long does the process take?",
      a: "The AI verification runs instantly. Admin review typically takes 24-48 business hours. Once approved, blockchain minting takes under a minute."
    },
    {
      q: "How can employers verify my degree?",
      a: "Employers can visit our verification portal and enter your unique degree hash or scan the QR code on your certificate. The result is displayed instantly from the blockchain."
    },
    {
      q: "Is my data secure?",
      a: "Yes. All documents are stored on IPFS — a distributed, encrypted file system. Your degree hash is stored on the Ethereum blockchain which is immutable and transparent."
    },
    {
      q: "What is the attestation fee?",
      a: "The attestation fee is calculated based on your degree level and is displayed before payment. Fees vary for Matric, Intermediate, Bachelor, Master, and PhD levels."
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans overflow-x-hidden selection:bg-blue-600 selection:text-white">

      {/* ── Ambient Background Blobs ─────────────────────────────────────── */}
      <div className="fixed top-[10%] left-[5%] w-[500px] h-[500px] bg-gradient-to-tr from-blue-400/10 to-cyan-300/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[20%] right-[10%] w-[500px] h-[500px] bg-gradient-to-br from-indigo-400/10 to-transparent rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl w-full mx-auto px-0 sm:px-4 md:my-6 flex-1 flex flex-col bg-white/80 backdrop-blur-xl md:rounded-3xl md:shadow-2xl border border-white/60 overflow-hidden">

        {/* ── Top Banner Image ──────────────────────────────────────────── */}
        <div className="w-full bg-white border-b border-slate-200">
          <img src="/iqra3.PNG" alt="Iqra University Portal Banner" className="w-full h-auto block" />
        </div>

        {/* ── Blue Navigation Bar ───────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-[#2176AE] via-[#0B3C5D] to-[#0B3C5D] text-white py-3 px-6 flex items-center justify-between shadow-md text-xs sm:text-sm font-bold uppercase tracking-wider">
          <div className="flex items-center gap-6">
            <span onClick={() => navigate("/")} className="cursor-pointer hover:text-blue-200 transition-colors">Home</span>
            <a href="#how-it-works" className="hover:text-blue-200 transition-colors">How It Works</a>
            <a href="#features" className="hover:text-blue-200 transition-colors">Features</a>
            <a href="#faq" className="hover:text-blue-200 transition-colors">FAQ</a>
          </div>
          <div className="flex items-center gap-4">
            <span onClick={() => navigate("/login", { state: { mode: "signin" } })} className="cursor-pointer hover:text-blue-200 transition-colors">Sign In</span>
            <span
              onClick={() => navigate("/login", { state: { mode: "signup" } })}
              className="cursor-pointer bg-white text-[#0B3C5D] px-3 py-1 rounded-lg hover:bg-blue-100 transition-colors font-extrabold"
            >
              Sign Up
            </span>
          </div>
        </div>

        <main className="flex-1 space-y-0">

          {/* ── Hero Section ─────────────────────────────────────────────── */}
          <section className="p-8 sm:p-10 space-y-8 border-b border-slate-200">
            <div className="flex flex-col sm:flex-row items-center gap-4 pb-4 border-b border-[#0B3C5D]/10">
              <div className="h-14 w-14 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                <GraduationCap size={28} />
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B3C5D] tracking-tight">Student Information & Attestation</h1>
                <p className="text-xs sm:text-sm text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Iqra University Decentralized Verification System</p>
              </div>
            </div>

            {/* 4 Service Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { icon: FileText, color: "blue", label: "Apply Attestation", desc: "Submit degrees, CNIC, and transcript copies online for secure blockchain verification.", cta: "Start Application", to: "/login", mode: "signin" },
                { icon: Search, color: "emerald", label: "Verify Credentials", desc: "Instantly verify degrees and credentials using secure blockchain ledger lookups.", cta: "Open Verification", to: "/verify", mode: null },
                { icon: Lock, color: "purple", label: "Student Sign In", desc: "Access your existing attestation profile, track requests, and check status logs.", cta: "Sign In", to: "/login", mode: "signin" },
                { icon: ShieldCheck, color: "pink", label: "Portal Registration", desc: "New student? Register an account to initiate degree attestation validations.", cta: "Create Account", to: "/login", mode: "signup" },
              ].map(({ icon: Icon, color, label, desc, cta, to, mode }) => (
                <div
                  key={label}
                  onClick={() => navigate(to, mode ? { state: { mode } } : undefined)}
                  className={`group cursor-pointer bg-white border border-slate-200 hover:border-${color}-400/50 rounded-2xl p-6 text-center shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between`}
                >
                  <div className="space-y-3">
                    <div className={`h-14 w-14 bg-${color}-100 group-hover:bg-${color}-500 group-hover:text-white rounded-xl flex items-center justify-center text-${color}-600 mx-auto transition-all duration-300 border border-${color}-200/50`}>
                      <Icon size={24} />
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">{label}</h4>
                    <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
                  </div>
                  <div className={`pt-4 text-xs font-bold text-${color}-600 flex items-center justify-center gap-1.5`}>
                    <span>{cta}</span>
                    <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Stats Banner ──────────────────────────────────────────────── */}
          <section className="bg-gradient-to-r from-[#0B3C5D] via-[#1a5276] to-[#0B3C5D] px-8 py-10">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              {stats.map(({ label, value, icon: Icon }) => (
                <div key={label} className="text-white space-y-2">
                  <div className="flex justify-center">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
                      <Icon size={18} className="text-cyan-300" />
                    </div>
                  </div>
                  <p className="text-3xl font-black text-white">{value}</p>
                  <p className="text-xs font-semibold text-blue-200 uppercase tracking-wider">{label}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── About Section ─────────────────────────────────────────────── */}
          <section className="p-8 sm:p-10 bg-white border-b border-slate-200">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-full">
                  <Zap size={13} className="text-blue-600" />
                  <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">About the Portal</span>
                </div>
                <h2 className="text-2xl font-extrabold text-[#0B3C5D] leading-tight">
                  Pakistan's First Blockchain-Powered Degree Attestation System
                </h2>
                <p className="text-slate-600 text-sm leading-relaxed">
                  The Iqra University Decentralized Degree & Transcript Attestation system is a state-of-the-art secure platform designed to safeguard academic accomplishments. By pairing Ethereum smart contracts with IPFS distributed storage, we register cryptographic proof of degrees that remains permanently secure, immutable, and globally shareable.
                </p>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Our verification workflow integrates <strong>Tesseract OCR</strong> for automated data extraction and a trained <strong>YOLO Object Detection model</strong> to confirm registrar seals and authenticity stamps — eliminating manual bureaucracy and preventing academic credential forgery.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  {["Ethereum Blockchain", "IPFS Storage", "Tesseract OCR", "YOLO AI", "MongoDB"].map(tag => (
                    <span key={tag} className="text-[10px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Cpu, title: "AI Automation", desc: "OCR scans & visual stamp audits completed in seconds with high accuracy." },
                  { icon: Layers, title: "Web3 Ledger", desc: "Degrees permanently minted to Ethereum blockchain — immutable forever." },
                  { icon: Users, title: "Multi-Role Access", desc: "Separate portals for students, university admins, and auditors." },
                  { icon: Globe, title: "Global Verification", desc: "Employers worldwide can verify credentials instantly via QR or hash." },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-2 hover:shadow-md transition">
                    <div className="w-9 h-9 bg-[#0B3C5D] rounded-lg flex items-center justify-center">
                      <Icon size={16} className="text-white" />
                    </div>
                    <h5 className="font-bold text-slate-800 text-xs">{title}</h5>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Features Grid ─────────────────────────────────────────────── */}
          <section id="features" className="p-8 sm:p-10 bg-slate-50 border-b border-slate-200">
            <div className="text-center mb-8 space-y-2">
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-full mb-2">
                <Star size={13} className="text-blue-600" />
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Platform Features</span>
              </div>
              <h2 className="text-2xl font-extrabold text-[#0B3C5D]">Why Choose Our Attestation Portal?</h2>
              <p className="text-sm text-slate-500 max-w-xl mx-auto">A comprehensive suite of AI, blockchain and security technologies working together to ensure your credentials are authentic, verifiable, and tamper-proof.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map(({ icon: Icon, color, title, desc }) => (
                <div key={title} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-sm`}>
                    <Icon size={20} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">{title}</h4>
                    <p className="text-[12px] text-slate-500 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── How It Works Steps ────────────────────────────────────────── */}
          <section id="how-it-works" className="p-8 sm:p-10 bg-white border-b border-slate-200">
            <div className="text-center mb-8 space-y-2">
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-full mb-2">
                <CheckCircle size={13} className="text-blue-600" />
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Step-by-Step Process</span>
              </div>
              <h2 className="text-2xl font-extrabold text-[#0B3C5D]">Attestation Process — How It Works</h2>
              <p className="text-sm text-slate-500 max-w-xl mx-auto">From document submission to blockchain minting — here is exactly how your degree attestation request is processed.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {steps.map(({ step, icon: Icon, title, desc }, idx) => (
                <div key={step} className="relative bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3 hover:shadow-md transition group">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-extrabold text-white bg-[#0B3C5D] w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0">{step}</span>
                    <div className="w-8 h-8 bg-blue-100 group-hover:bg-blue-600 group-hover:text-white rounded-lg flex items-center justify-center text-blue-600 transition-colors duration-300">
                      <Icon size={16} />
                    </div>
                    <h5 className="font-bold text-slate-800 text-sm">{title}</h5>
                  </div>
                  <p className="text-slate-500 text-xs leading-relaxed pl-[calc(28px+12px+8px)]">{desc}</p>
                  {idx < steps.length - 1 && (
                    <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                      <ChevronRight size={20} className="text-slate-300" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ── Technology Stack Section ──────────────────────────────────── */}
          <section className="p-8 sm:p-10 bg-gradient-to-br from-[#0B3C5D] to-[#0a2a42] text-white border-b border-slate-700">
            <div className="text-center mb-8 space-y-2">
              <h2 className="text-2xl font-extrabold text-white">Powered By Cutting-Edge Technology</h2>
              <p className="text-sm text-blue-200 max-w-xl mx-auto">Enterprise-grade, battle-tested technologies forming the backbone of our attestation infrastructure.</p>
            </div>
            <div className="grid sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                { name: "Ethereum", sub: "Smart Contracts", color: "#8B5CF6" },
                { name: "IPFS", sub: "Distributed Storage", color: "#06B6D4" },
                { name: "Tesseract", sub: "OCR Engine", color: "#10B981" },
                { name: "YOLO v8", sub: "Stamp Detection AI", color: "#F59E0B" },
                { name: "MongoDB", sub: "Document Database", color: "#22C55E" },
              ].map(({ name, sub, color }) => (
                <div key={name} className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center hover:bg-white/10 transition">
                  <div className="w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ background: `${color}22`, border: `1.5px solid ${color}44` }}>
                    <span className="text-xs font-black" style={{ color }}>{name[0]}</span>
                  </div>
                  <p className="text-sm font-black text-white">{name}</p>
                  <p className="text-[10px] text-blue-300 mt-0.5">{sub}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Gallery Showcase ──────────────────────────────────────────── */}
          <section id="showcase" className="p-8 sm:p-10 bg-white border-b border-slate-200">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-extrabold text-[#0B3C5D]">Portal Reference Files</h2>
              <p className="text-sm text-slate-500 mt-1">Visual examples of documents used in the attestation process.</p>
            </div>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { src: "/iqra_banner.png", title: "Degree Verification Banner", desc: "Verification stamp reference detection for YOLO AI model." },
                { src: "/iqra2.png", title: "Credential Layout Template", desc: "CNIC ID verification data structures and field mapping." },
                { src: "/iqra3.PNG", title: "Transcript Processing Model", desc: "OCR processing target fields and percentage extraction." },
              ].map((item, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition group">
                  <div className="aspect-[4/3] bg-slate-100 overflow-hidden">
                    <img src={item.src} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-4 bg-white border-t border-slate-200">
                    <h6 className="font-bold text-slate-800 text-xs">{item.title}</h6>
                    <p className="text-slate-500 text-[11px] mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── FAQ Section ───────────────────────────────────────────────── */}
          <section id="faq" className="p-8 sm:p-10 bg-slate-50 border-b border-slate-200">
            <div className="text-center mb-8 space-y-2">
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-full mb-2">
                <Award size={13} className="text-blue-600" />
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Frequently Asked Questions</span>
              </div>
              <h2 className="text-2xl font-extrabold text-[#0B3C5D]">Got Questions? We Have Answers.</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4 max-w-5xl mx-auto">
              {faqs.map(({ q, a }, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2 hover:shadow-md transition">
                  <div className="flex gap-3 items-start">
                    <span className="w-6 h-6 flex-shrink-0 bg-[#0B3C5D] text-white text-[10px] font-black rounded-full flex items-center justify-center mt-0.5">Q</span>
                    <p className="text-sm font-bold text-slate-800 leading-snug">{q}</p>
                  </div>
                  <div className="flex gap-3 items-start pl-0">
                    <span className="w-6 h-6 flex-shrink-0 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-full flex items-center justify-center mt-0.5">A</span>
                    <p className="text-xs text-slate-500 leading-relaxed">{a}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── CTA Banner ────────────────────────────────────────────────── */}
          <section className="p-8 sm:p-12 bg-white text-center space-y-5 border-b border-slate-200">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B3C5D]">Ready to Get Your Degree Attested?</h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto">Join thousands of Iqra University graduates who have already secured their credentials on the blockchain.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate("/login", { state: { mode: "signup" } })}
                className="bg-[#0B3C5D] hover:bg-[#0a2a42] text-white font-bold px-8 py-3 rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <GraduationCap size={16} /> Apply Now
              </button>
              <button
                onClick={() => navigate("/verify")}
                className="border-2 border-[#0B3C5D] text-[#0B3C5D] hover:bg-[#0B3C5D] hover:text-white font-bold px-8 py-3 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Search size={16} /> Verify a Degree
              </button>
            </div>
          </section>

        </main>

        {/* ── Footer ────────────────────────────────────────────────────── */}
        <footer className="relative text-white overflow-hidden">
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/campus_footer.png')" }}
          />
          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-[#0B3C5D]/85 backdrop-blur-[1px]" />

          <div className="relative z-10 px-8 py-10">
            {/* Footer top grid */}
            <div className="grid sm:grid-cols-3 gap-8 mb-8 pb-8 border-b border-white/20">
              <div className="space-y-3">
                <img src="/logoiqra.png" alt="Iqra Logo" className="h-10 w-auto brightness-0 invert opacity-90" />
                <p className="text-sm font-bold text-white">Iqra University</p>
                <p className="text-xs text-blue-200 leading-relaxed">Attestation & Credential Verification Center — Karachi, Pakistan</p>
              </div>
              <div className="space-y-3">
                <p className="text-xs font-black text-blue-200 uppercase tracking-widest">Quick Links</p>
                <div className="space-y-2 text-xs text-blue-100">
                  <p className="hover:text-white cursor-pointer transition">Student Portal</p>
                  <p className="hover:text-white cursor-pointer transition">Verify a Degree</p>
                  <p className="hover:text-white cursor-pointer transition">How It Works</p>
                  <p className="hover:text-white cursor-pointer transition">FAQ</p>
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-xs font-black text-blue-200 uppercase tracking-widest">Technology Stack</p>
                <div className="space-y-2 text-xs text-blue-100">
                  <p>Ethereum Smart Contracts</p>
                  <p>IPFS Distributed Storage</p>
                  <p>Tesseract OCR Engine</p>
                  <p>YOLO Object Detection</p>
                </div>
              </div>
            </div>

            {/* Footer bottom */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-blue-300">
              <p>© {new Date().getFullYear()} Iqra University. All rights reserved.</p>
              <p className="text-center">Powered by Ethereum Smart Contracts & IPFS Storage</p>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}
