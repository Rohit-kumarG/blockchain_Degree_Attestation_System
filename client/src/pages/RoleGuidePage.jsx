import { Building2, GraduationCap, History, SearchCheck, ShieldCheck } from "lucide-react";
import { PageHeader } from "../components/PageHeader.jsx";

const roleCards = [
  {
    title: "Admin",
    icon: ShieldCheck,
    options: "Dashboard, Universities, Degrees, Verify, Audit Logs, Role Guide",
    work: "Admin controls the system. Admin creates universities, issues and revokes degrees, checks analytics, and reviews audit history.",
  },
  {
    title: "University Staff",
    icon: Building2,
    options: "Dashboard, Degrees, Verify, Role Guide",
    work: "University staff issues degrees for their own university. They cannot approve other universities or see full platform controls.",
  },
  {
    title: "Student",
    icon: GraduationCap,
    options: "Degrees, Verify, Role Guide",
    work: "Student sees only their own issued degrees and can share degree ID or QR with employers. Student cannot create universities or issue degrees.",
  },
  {
    title: "Employer",
    icon: SearchCheck,
    options: "Verify, Role Guide",
    work: "Employer verifies a degree using the degree ID or QR link. Employer does not manage universities, students, or degree records.",
  },
  {
    title: "Auditor",
    icon: History,
    options: "Dashboard, Verify, Audit Logs, Role Guide",
    work: "Auditor checks system activity: logins, university creation, degree issuance, revocations, and verification attempts.",
  },
];

export function RoleGuidePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Project Explanation"
        title="User Roles and Responsibilities"
        description="Use this page during your presentation to explain what each user can see and do."
      />

      <section className="grid gap-4 lg:grid-cols-2">
        {roleCards.map((role) => (
          <div key={role.title} className="border border-stone-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center bg-emerald-700 text-white">
                <role.icon size={22} />
              </div>
              <h3 className="text-xl font-semibold">{role.title}</h3>
            </div>
            <p className="mt-4 text-sm leading-6 text-stone-700">{role.work}</p>
            <div className="mt-4 border border-stone-200 bg-stone-50 p-3">
              <p className="text-xs font-semibold uppercase text-stone-500">Visible Menu Options</p>
              <p className="mt-1 text-sm font-medium text-stone-800">{role.options}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
