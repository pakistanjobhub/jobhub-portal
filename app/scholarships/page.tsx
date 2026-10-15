import Link from "next/link";
import ScholarshipCard from "@/components/ScholarshipCard";
import {
  getClosingSoonScholarships,
  getScholarshipCountries,
  getScholarshipLevels,
  getScholarshipTypes,
  searchScholarships,
} from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Scholarships for Pakistani Students 2026 — Pakistan Job Hub",
  description:
    "Fully funded aur partial scholarships Pakistani students ke liye — HEC, Chevening, Fulbright, CSC, Türkiye Burslari, DAAD. Official links ke saath verified info.",
};

const PER_PAGE = 12;

function pageLink(params: Record<string, string | undefined>, page: number) {
  const next = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v) next.set(k, v);
  }
  next.set("page", String(page));
  return `/scholarships?${next.toString()}`;
}

export default async function ScholarshipsPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const q = typeof searchParams.q === "string" ? searchParams.q : undefined;
  const country = typeof searchParams.country === "string" ? searchParams.country : undefined;
  const level = typeof searchParams.level === "string" ? searchParams.level : undefined;
  const type = typeof searchParams.type === "string" ? searchParams.type : undefined;
  const sort = searchParams.sort === "deadline" ? "deadline" : "newest";
  const page = Math.max(1, parseInt(typeof searchParams.page === "string" ? searchParams.page : "1", 10) || 1);

  const [result, countries, levels, types, closingSoon] = await Promise.all([
    searchScholarships({ q, country, level, type, sort, page, perPage: PER_PAGE }),
    getScholarshipCountries(),
    getScholarshipLevels(),
    getScholarshipTypes(),
    getClosingSoonScholarships(),
  ]);

  const totalPages = Math.max(1, Math.ceil(result.total / PER_PAGE));
  const baseParams: Record<string, string | undefined> = { q, country, level, type, sort };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
        Scholarships for Pakistani Students
      </h1>
      <p className="mt-2 max-w-3xl text-sm text-slate-600 dark:text-slate-300">
        Pakistani students ke liye fully funded aur partial scholarships — HEC, Chevening, Fulbright,
        Chinese Government Scholarship, Türkiye Burslari, DAAD aur Commonwealth. Har scholarship official
        website se verified hai. Deadlines har saal badalti hain — apply karne se pehle official page
        zaroor check karein.
      </p>

      {/* Closing soon strip */}
      {closingSoon.length > 0 && (
        <section aria-label="Closing soon" className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900 dark:bg-amber-950">
          <h2 className="text-lg font-extrabold text-amber-800 dark:text-amber-200">
            ⏰ Closing soon
          </h2>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {closingSoon.slice(0, 4).map((s) => (
              <Link
                key={s.slug}
                href={`/scholarship/${s.slug}`}
                className="rounded-lg bg-white px-4 py-3 text-sm font-bold text-slate-900 shadow-sm hover:shadow dark:bg-slate-900 dark:text-white"
              >
                {s.title}
                <span className="block text-xs font-semibold text-red-600 dark:text-red-400">
                  Deadline: {s.deadline}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Filters */}
      <form action="/scholarships" method="get" className="mt-6 flex flex-wrap gap-2" role="search">
        <input
          name="q"
          type="search"
          defaultValue={q ?? ""}
          placeholder="Search karo…"
          className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
        />
        <select
          name="country"
          defaultValue={country ?? ""}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
        >
          <option value="">Tamam Countries</option>
          {countries.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          name="level"
          defaultValue={level ?? ""}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
        >
          <option value="">Tamam Levels</option>
          {levels.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
        <select
          name="type"
          defaultValue={type ?? ""}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
        >
          <option value="">Tamam Types</option>
          {types.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-700"
        >
          Filter
        </button>
      </form>

      <p className="mt-4 text-sm text-slate-500 dark:text-slate-400" role="status">
        {result.total} {result.total === 1 ? "scholarship mili." : "scholarships mili."}
      </p>

      {result.scholarships.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-400">
          Koi scholarship nahi mili. Search ya filter badal kar dekhein.
        </div>
      ) : (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {result.scholarships.map((s) => (
            <ScholarshipCard key={s.slug} scholarship={s} />
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
