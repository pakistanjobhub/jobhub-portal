import Link from "next/link";
import type { Metadata } from "next";
import { searchScholarships } from "@/lib/db";
import { SCHOLARSHIP_LEVELS, slugify } from "@/lib/types";

export const metadata: Metadata = {
  title: "Scholarships by Study Level — Pakistan Job Hub",
  description: "Pakistani students ke liye study level ke hisaab se scholarships — Intermediate, Bachelors, Masters, PhD, Diploma.",
  alternates: { canonical: "/scholarships/levels" },
};

export default async function LevelsPage() {
  const counts = await Promise.all(
    SCHOLARSHIP_LEVELS.map(async (level) => {
      const { total } = await searchScholarships({ level, perPage: 1 });
      return { level, count: total };
    }),
  );
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <nav aria-label="Breadcrumb" className="text-sm text-slate-500 dark:text-slate-400">
        <Link href="/">Home</Link> / <Link href="/scholarships">Scholarships</Link> /{" "}
        <span aria-current="page">Levels</span>
      </nav>
      <h1 className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white">
        Scholarships by Study Level
      </h1>
      <p className="mt-2 max-w-3xl text-sm text-slate-600 dark:text-slate-300">
        Apne study level ke mutabiq scholarships dekhein — Intermediate se PhD tak.
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {counts.map(({ level, count }) => (
          <Link
            key={level}
            href={`/scholarships/level/${slugify(level)}`}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow dark:border-slate-700 dark:bg-slate-900"
          >
            <p className="text-lg font-bold text-slate-900 dark:text-white">🎓 {level}</p>
            <p className="mt-1 text-sm font-semibold text-brand-700 dark:text-brand-100">
              {count} {count === 1 ? "scholarship" : "scholarships"}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
