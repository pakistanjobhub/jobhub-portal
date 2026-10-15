import Link from "next/link";
import JobCard from "@/components/JobCard";
import ScholarshipCard from "@/components/ScholarshipCard";
import JobAlertForm from "@/components/JobAlertForm";
import {
  getCategories,
  getCities,
  getClosingSoonScholarships,
  getFeaturedJobs,
  getFeaturedScholarships,
  getJobs,
  getScholarships,
  getStats,
} from "@/lib/db";

export const metadata = {
  title: "Pakistan Job Hub — Government Jobs Pakistan",
  description:
    "Poore Pakistan ki verified government jobs. Bina fee, bina sifarish. Roz taaza jobs — akhbar ke ishtihar aur official portals se.",
};

export default async function HomePage() {
  const [jobs, featured, cities, categories, stats, featuredSch, closingSoon, scholarships] =
    await Promise.all([
      getJobs(),
      getFeaturedJobs(),
      getCities(),
      getCategories(),
      getStats(),
      getFeaturedScholarships(),
      getClosingSoonScholarships(),
      getScholarships(),
    ]);
  const latest = jobs.slice(0, 6);
  const latestSch = scholarships.slice(0, 4);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Hero search */}
      <section className="rounded-2xl bg-gradient-to-br from-brand-800 to-brand-600 px-6 py-10 text-center text-white">
        <h1 className="text-3xl font-extrabold sm:text-4xl">Pakistan ki verified government jobs</h1>
        <p className="mx-auto mt-3 max-w-xl text-base opacity-95">
          Poore Pakistan ki taaza government jobs — bina fee, bina sifarish. Search karein aur official
          tareeqe se apply karein.
        </p>
        <form
          action="/jobs"
          method="get"
          className="mx-auto mt-6 flex max-w-2xl flex-wrap gap-2"
          role="search"
        >
          <label className="sr-only" htmlFor="hero-q">Keyword</label>
          <input
            id="hero-q"
            name="q"
            type="search"
            placeholder="Search karo: Clerk, Driver, Court…"
            className="min-w-0 flex-1 rounded-lg border border-white/30 bg-white px-4 py-3 text-slate-900"
          />
          <label className="sr-only" htmlFor="hero-city">City</label>
          <select
            id="hero-city"
            name="city"
            className="rounded-lg border border-white/30 bg-white px-3 py-3 text-slate-900"
            defaultValue=""
          >
            <option value="">Tamam Cities</option>
            {cities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <label className="sr-only" htmlFor="hero-cat">Category</label>
          <select
            id="hero-cat"
            name="category"
            className="rounded-lg border border-white/30 bg-white px-3 py-3 text-slate-900"
            defaultValue=""
          >
            <option value="">Tamam Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-lg bg-white px-6 py-3 font-bold text-brand-800 hover:bg-brand-50"
          >
            Search
          </button>
        </form>
      </section>

      {/* Stats */}
      <section aria-label="Stats" className="mt-8 grid grid-cols-3 gap-3 text-center">
        {[
          { value: stats.totalJobs, label: "Active Jobs" },
          { value: stats.cities, label: "Cities" },
          { value: stats.categories, label: "Categories" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-slate-200 bg-white px-2 py-5 shadow-sm dark:border-slate-700 dark:bg-slate-900"
          >
            <p className="text-3xl font-extrabold text-brand-700 dark:text-brand-100">{s.value}</p>
            <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400 sm:text-sm">{s.label}</p>
          </div>
        ))}
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="mt-10">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Featured jobs</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {featured.map((job) => (
              <JobCard key={job.slug} job={job} />
            ))}
          </div>
        </section>
      )}

      {/* Latest */}
      <section className="mt-10">
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Latest jobs</h2>
          <Link href="/jobs" className="text-sm font-bold">Sab jobs dekhein →</Link>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {latest.map((job) => (
            <JobCard key={job.slug} job={job} />
          ))}
        </div>
      </section>

      {/* Closing soon scholarships */}
      {closingSoon.length > 0 && (
        <section className="mt-10 rounded-xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900 dark:bg-amber-950">
          <div className="flex items-baseline justify-between">
            <h2 className="text-2xl font-extrabold text-amber-800 dark:text-amber-200">
              ⏰ Closing soon — Scholarships
            </h2>
            <Link href="/scholarships" className="text-sm font-bold">Sab dekhein →</Link>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {closingSoon.slice(0, 2).map((s) => (
              <ScholarshipCard key={s.slug} scholarship={s} />
            ))}
          </div>
        </section>
      )}

      {/* Featured scholarships */}
      {featuredSch.length > 0 && (
        <section className="mt-10">
          <div className="flex items-baseline justify-between">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Featured scholarships
            </h2>
            <Link href="/scholarships" className="text-sm font-bold">Sab scholarships dekhein →</Link>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {featuredSch.slice(0, 4).map((s) => (
              <ScholarshipCard key={s.slug} scholarship={s} />
            ))}
          </div>
        </section>
      )}

      {/* Latest scholarships */}
      {latestSch.length > 0 && (
        <section className="mt-10">
          <div className="flex items-baseline justify-between">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Latest scholarships</h2>
            <Link href="/scholarships" className="text-sm font-bold">Sab dekhein →</Link>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {latestSch.map((s) => (
              <ScholarshipCard key={s.slug} scholarship={s} />
            ))}
          </div>
        </section>
      )}

      {/* Browse by city / category */}
      <section className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Browse by city</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {cities.map((c) => (
              <li key={c}>
                <Link
                  href={`/jobs?city=${encodeURIComponent(c)}`}
                  className="inline-block rounded-full bg-brand-50 px-3 py-1.5 text-sm font-semibold text-brand-800 hover:bg-brand-100 dark:bg-slate-800 dark:text-brand-100"
                >
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Browse by category</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {categories.map((c) => (
              <li key={c}>
                <Link
                  href={`/jobs?category=${encodeURIComponent(c)}`}
                  className="inline-block rounded-full bg-brand-50 px-3 py-1.5 text-sm font-semibold text-brand-800 hover:bg-brand-100 dark:bg-slate-800 dark:text-brand-100"
                >
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Job alert signup */}
      <section className="mt-10">
        <JobAlertForm />
      </section>

      {/* Fake-job warning */}
      <section className="mt-10 rounded-xl border border-red-200 bg-red-50 p-5 dark:border-red-900 dark:bg-red-950">
        <h2 className="text-lg font-bold text-red-700 dark:text-red-300">⚠️ Fake jobs se bacho</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-red-900 dark:text-red-100">
          <li>Agar koi WhatsApp/SMS par “fee bhej do, naukri pakki” kahe — 100% fraud hai.</li>
          <li>Official ad ke baghair kisi link par CNIC ya bank details mat bhejo.</li>
          <li>Shak ho to hamare Facebook page par pooch lo — jawab mil jayega.</li>
        </ul>
      </section>
    </div>
  );
}
