import Link from "next/link";
import type { Job } from "@/lib/types";
import { isExpired } from "@/lib/types";

export function JobTypeBadge({ jobType }: { jobType: Job["jobType"] }) {
  const labels: Record<Job["jobType"], string> = {
    "full-time": "Full-time",
    "part-time": "Part-time",
    remote: "Remote",
    internship: "Internship",
    contract: "Contract",
  };
  return (
    <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-800 dark:bg-slate-700 dark:text-brand-100">
      {labels[jobType]}
    </span>
  );
}

export default function JobCard({ job }: { job: Job }) {
  const expired = isExpired(job);
  return (
    <article className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <h3 className="text-lg font-bold leading-snug text-slate-900 dark:text-white">
        <Link href={`/job/${job.slug}`}>{job.title}</Link>
      </h3>
      <p className="mt-1 text-sm font-semibold text-brand-700 dark:text-brand-100">{job.org}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
          📍 {job.province} • {job.city}
        </span>
        <JobTypeBadge jobType={job.jobType} />
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
          {job.category}
        </span>
      </div>
      <p className="mt-3 flex-1 text-sm text-slate-600 dark:text-slate-300">{job.description}</p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {expired ? (
          <span className="rounded-lg bg-red-100 px-3 py-2 text-sm font-bold text-red-700 dark:bg-red-900 dark:text-red-200">
            Job expired
          </span>
        ) : (
          <span className="text-sm font-semibold text-red-600 dark:text-red-400">
            ⏰ Last date: {job.lastDate}
          </span>
        )}
        <Link
          href={`/job/${job.slug}`}
          className="ml-auto rounded-lg bg-brand-600 px-4 py-2 text-sm font-bold text-white hover:bg-brand-700"
        >
          Details dekhein →
        </Link>
      </div>
    </article>
  );
}
