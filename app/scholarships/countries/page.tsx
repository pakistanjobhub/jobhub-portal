import Link from "next/link";
import type { Metadata } from "next";
import { getScholarshipCountries, searchScholarships } from "@/lib/db";
import { slugify } from "@/lib/types";

export const metadata: Metadata = {
  title: "Scholarships by Country — Pakistan Job Hub",
  description: "Pakistani students ke liye mulk ke hisaab se scholarships — UK, USA, China, Türkiye, Germany aur Pakistan.",
  alternates: { canonical: "/scholarships/countries" },
};

export default async function CountriesPage() {
  const countries = await getScholarshipCountries();
  const counts = await Promise.all(
    countries.map(async (c) => {
      const { total } = await searchScholarships({ country: c, perPage: 1 });
      return { country: c, count: total };
    }),
  );
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <nav aria-label="Breadcrumb" className="text-sm text-slate-500 dark:text-slate-400">
        <Link href="/">Home</Link> / <Link href="/scholarships">Scholarships</Link> /{" "}
        <span aria-current="page">Countries</span>
      </nav>
      <h1 className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white">
        Scholarships by Country
      </h1>
      <p className="mt-2 max-w-3xl text-sm text-slate-600 dark:text-slate-300">
        Apne pasandeeda mulk ka intekhab karein — har country page par us mulk ki tamam active
        scholarships, unki deadlines aur official apply links hain.
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {counts.map(({ country, count }) => (
          <Link
            key={country}
            href={`/scholarships/country/${slugify(country)}`}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow dark:border-slate-700 dark:bg-slate-900"
          >
            <p className="text-lg font-bold text-slate-900 dark:text-white">🌍 {country}</p>
            <p className="mt-1 text-sm font-semibold text-brand-700 dark:text-brand-100">
              {count} {count === 1 ? "scholarship" : "scholarships"}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
