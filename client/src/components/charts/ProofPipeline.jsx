import { CheckCircle2 } from "lucide-react";

const steps = ["Metadata", "CID", "Hash", "Transaction", "Verification"];

export function ProofPipeline() {
  return (
    <div className="border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold">Proof Pipeline</h3>
        <span className="bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-900">End-to-end</span>
      </div>
      <div className="mt-6 grid gap-3 md:grid-cols-5">
        {steps.map((step, index) => (
          <div key={step} className="relative border border-stone-200 bg-stone-50 p-4">
            {index < steps.length - 1 ? (
              <div className="absolute -right-3 top-1/2 hidden h-px w-6 bg-emerald-500 md:block" />
            ) : null}
            <CheckCircle2 className="text-emerald-700" size={22} />
            <p className="mt-3 text-sm font-semibold">{step}</p>
            <p className="mt-1 text-xs text-stone-500">Step {index + 1}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

