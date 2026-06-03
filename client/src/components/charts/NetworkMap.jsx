import { Building2, Database, FileKey2, ShieldCheck } from "lucide-react";

const nodes = [
  { label: "Universities", icon: Building2, x: "12%", y: "18%" },
  { label: "MongoDB", icon: Database, x: "70%", y: "16%" },
  { label: "IPFS", icon: FileKey2, x: "16%", y: "70%" },
  { label: "Blockchain", icon: ShieldCheck, x: "68%", y: "68%" },
];

export function NetworkMap() {
  return (
    <div className="relative min-h-[340px] overflow-hidden border border-emerald-900/20 bg-[#071b15] p-6 text-white shadow-sm">
      <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(52,211,153,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(52,211,153,.12)_1px,transparent_1px)] [background-size:32px_32px]" />
      <div className="absolute left-1/2 top-1/2 h-60 w-60 -translate-x-1/2 -translate-y-1/2 bg-emerald-400/10 blur-3xl" />
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase text-emerald-200">System Network</p>
          <h3 className="mt-2 text-xl font-semibold">Trust Architecture Map</h3>
        </div>
        <span className="border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-emerald-50">
          Hybrid Web3
        </span>
      </div>

      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <line x1="22" y1="26" x2="74" y2="24" stroke="rgba(110,231,183,.45)" strokeWidth="0.5" />
        <line x1="22" y1="26" x2="24" y2="74" stroke="rgba(110,231,183,.45)" strokeWidth="0.5" />
        <line x1="24" y1="74" x2="74" y2="74" stroke="rgba(110,231,183,.45)" strokeWidth="0.5" />
        <line x1="74" y1="24" x2="74" y2="74" stroke="rgba(110,231,183,.45)" strokeWidth="0.5" />
        <line x1="22" y1="26" x2="74" y2="74" stroke="rgba(14,165,233,.35)" strokeWidth="0.5" />
      </svg>

      {nodes.map((node) => (
        <div
          key={node.label}
          className="absolute z-10 flex min-w-32 items-center gap-3 border border-white/15 bg-white/10 p-3 backdrop-blur"
          style={{ left: node.x, top: node.y }}
        >
          <div className="flex h-10 w-10 items-center justify-center bg-emerald-400 text-emerald-950">
            <node.icon size={20} />
          </div>
          <div>
            <p className="text-sm font-semibold">{node.label}</p>
            <p className="text-[11px] text-emerald-100">Connected</p>
          </div>
        </div>
      ))}
    </div>
  );
}

