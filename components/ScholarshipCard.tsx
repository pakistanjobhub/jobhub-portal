import Link from "next/link";
import type { Scholarship } from "@/lib/types";
import { isClosingSoon, isScholarshipExpired } from "@/lib/types";

export function FundingBadge({ type }: { type: string }) {
  const funded = type.toLowerCase().includes("fully");
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        funded
          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
          : "bg-brand-50 text-brand-800 dark:bg-slate-700 dark:text-brand-100"
      }`}
    >
      {type}
    </span>
  );
}

export default function ScholarshipCard({ scholarship: s }: { scholarship: Scholarship }) {
  const expired = isScholarshipExpired(s);
  const closing = isClosingSoon(s);
  return (
    <article className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <h3 className="text-lg font-bold leading-snug text-slate-900 dark:text-white">
        <Link href={`/scholarship/${s.slug}`}>{s.title}</Link>
      </h3>
      <p className="mt-1 text-sm font-semibold text-brand-700 dark:text-brand-100">{s.provider}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
          🌍 {s.country}
        </span>
        <FundingBadge type={s.type} />
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
          {s.levels.join(" • ")}
        </span>
      </div>
      <p className="mt-3 flex-1 text-sm text-slate-600 dark:text-slate-300">{s.summary}</p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {expired ? (
          <span className="rounded-lg bg-red-100 px-3 py-2 text-sm font-bold text-red-700 dark:bg-red-900 dark:text-red-200">
            Expired
          </span>
        ) : closing ? (
          <span className="rounded-lg bg-amber-100 px-3 py-2 text-sm font-bold text-amber-800 dark:bg-amber-900 dark:text-amber-200">
            ⏰ Closing soon{s.deadline ? `: ${s.deadline}` : ""}
          </span>
        ) : s.deadline ? (
          <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
            🗓 Deadline: {s.deadline}
          </span>
        ) : (
          <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
            🔁 Yearly cycle — official site dekhein
          </span>
        )}
        <Link
          href={`/scholarship/${s.slug}`}
          className="ml-auto rounded-lg bg-brand-600 px-4 py-2 text-sm font-bold text-white hover:bg-brand-700"
        >
          Details dekhein →
        </Link>
      </div>
    </article>
  );
}
