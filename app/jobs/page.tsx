import { Suspense } from "react";
import Link from "next/link";
import JobCard from "@/components/JobCard";
import FilterBar from "@/components/FilterBar";
import { getCategories, getCities, searchJobs } from "@/lib/db";
import type { JobType } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "All Jobs — Pakistan Job Hub",
  description:
    "Pure Pakistan ki verified government jobs — city, province, category aur job type ke hisaab se filter karein.",
};

const PER_PAGE = 10;

function pageLink(params: Record<string, string | undefined>, page: number) {
  const next = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v) next.set(k, v);
  }
  next.set("page", String(page));
  return `/jobs?${next.toString()}`;
}

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const q = typeof searchParams.q === "string" ? searchParams.q : undefined;
  const province = typeof searchParams.province === "string" ? searchParams.province : undefined;
  const city = typeof searchParams.city === "string" ? searchParams.city : undefined;
  const category = typeof searchParams.category === "string" ? searchParams.category : undefined;
  const jobType =
    typeof searchParams.jobType === "string" ? (searchParams.jobType as JobType) : undefined;
  const sort = searchParams.sort === "lastDate" ? "lastDate" : "newest";
  const page = Math.max(1, parseInt(typeof searchParams.page === "string" ? searchParams.page : "1", 10) || 1);

  const [result, cities, categories] = await Promise.all([
    searchJobs({ q, province, city, category, jobType, sort, page, perPage: PER_PAGE }),
    getCities(),
    getCategories(),
  ]);

  const totalPages = Math.max(1, Math.ceil(result.total / PER_PAGE));
  const baseParams: Record<string, string | undefined> = { q, province, city, category, jobType, sort };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">All Jobs</h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        Pure Pakistan ki verified government jobs. Filter lagayein aur official tareeqe se apply karein.
      </p>

      <div className="mt-6">
        <Suspense>
          <FilterBar cities={cities} categories={categories} />
        </Suspense>
      </div>

      <p className="mt-4 text-sm text-slate-500 dark:text-slate-400" role="status">
        {result.total} {result.total === 1 ? "job mili." : "jobs mili."}
      </p>

      {result.jobs.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-400">
          Koi job nahi mili. Search ya filter badal kar dekhein.
        </div>
      ) : (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {result.jobs.map((job) => (
            <JobCard key={job.slug} job={job} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav aria-label="Pagination" className="mt-8 flex items-center justify-center gap-2">
          {page > 1 && (
            <Link
              href={pageLink(baseParams, page - 1)}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold dark:border-slate-600 dark:bg-slate-800"
            >
              ← Pichhla
            </Link>
          )}
          <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
            Page {page} / {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={pageLink(baseParams, page + 1)}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold dark:border-slate-600 dark:bg-slate-800"
            >
              Agla →
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
