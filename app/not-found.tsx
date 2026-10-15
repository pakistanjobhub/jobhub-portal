import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page nahi mili — Pakistan Job Hub",
  description: "Ye page mojood nahi hai. Jobs ya scholarships ki list dekhein.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <p className="text-7xl font-extrabold text-brand-700 dark:text-brand-100">404</p>
      <h1 className="mt-4 text-2xl font-extrabold text-slate-900 dark:text-white">
        Page nahi mili
      </h1>
      <p className="mt-3 text-slate-600 dark:text-slate-300">
        Lagta hai ye link purana hai ya ghalat likha gaya. Neeche se sahi page chun lein.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-lg bg-brand-600 px-6 py-3 text-sm font-bold text-white hover:bg-brand-700"
        >
          Home
        </Link>
        <Link
          href="/jobs"
          className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-800 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
        >
          All Jobs
        </Link>
        <Link
          href="/scholarships"
          className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-800 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
        >
          Scholarships
        </Link>
      </div>
    </div>
  );
}
