import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JobCard, { JobTypeBadge } from "@/components/JobCard";
import { SITE_URL, getJobBySlug, getJobs, getRelatedJobs } from "@/lib/db";
import { isExpired } from "@/lib/types";

export async function generateStaticParams() {
  const jobs = await getJobs();
  return jobs.map((job) => ({ slug: job.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const job = await getJobBySlug(params.slug);
  if (!job) return { title: "Job nahi mili" };
  const title = `${job.title} — ${job.org}, ${job.city}`;
  const description = `${job.org} (${job.city}, ${job.province}) mein ${job.title}. Last date: ${job.lastDate}. Verified info — bina fee, bina sifarish.`;
  const url = `/job/${job.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "article" },
    twitter: { card: "summary", title, description },
  };
}

export default async function JobPage({ params }: { params: { slug: string } }) {
  const job = await getJobBySlug(params.slug);
  if (!job) notFound();
  const related = await getRelatedJobs(job);
  const expired = isExpired(job);
  const jobUrl = `${SITE_URL}/job/${job.slug}`;

  const jobPosting: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: `${job.description}\n\nRequirements: ${job.requirements.join(" ")}\n\nHow to apply: ${job.howToApply}`,
    datePosted: job.postedDate,
    hiringOrganization: { "@type": "Organization", name: job.org },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.city,
        addressRegion: job.province,
        addressCountry: "PK",
      },
    },
    employmentType: job.jobType === "full-time" ? "FULL_TIME" : job.jobType === "part-time" ? "PART_TIME" : job.jobType === "contract" ? "CONTRACTOR" : job.jobType === "internship" ? "INTERN" : "OTHER",
  };
  if (job.lastDateISO) jobPosting.validThrough = job.lastDateISO;
  if (job.salary) jobPosting.baseSalary = { "@type": "MonetaryAmount", currency: "PKR", value: job.salary };

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "All Jobs", item: `${SITE_URL}/jobs` },
      { "@type": "ListItem", position: 3, name: job.title, item: jobUrl },
    ],
  };

  const shareText = encodeURIComponent(`${job.title} — ${job.org}, ${job.city}. Last date: ${job.lastDate}`);
  const shareUrl = encodeURIComponent(jobUrl);

  return (
    <article className="mx-auto max-w-4xl px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPosting) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <nav aria-label="Breadcrumb" className="text-sm text-slate-500 dark:text-slate-400">
        <Link href="/">Home</Link> / <Link href="/jobs">All Jobs</Link> /{" "}
        <span aria-current="page">{job.title}</span>
      </nav>

      {expired && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 font-bold text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          ⚠️ Job expired — is job ki last date guzar chuki hai. Neeche milti-julti active jobs dekhein.
        </div>
      )}

      <h1 className="mt-4 text-3xl font-extrabold leading-tight text-slate-900 dark:text-white">
        {job.title}
      </h1>
      <p className="mt-1 text-lg font-semibold text-brand-700 dark:text-brand-100">{job.org}</p>

      <dl className="mt-6 grid gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">City</dt>
          <dd className="mt-1 font-semibold">📍 {job.city}, {job.province}</dd>
        </div>
        <div>
          <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">Job type</dt>
          <dd className="mt-1"><JobTypeBadge jobType={job.jobType} /></dd>
        </div>
        <div>
          <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">Category</dt>
          <dd className="mt-1 font-semibold">{job.category}</dd>
        </div>
        <div>
          <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">Salary</dt>
          <dd className="mt-1 font-semibold">{job.salary ?? "Ad mein salary nahi likhi — official ad dekhein."}</dd>
        </div>
        <div>
          <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">Posted date</dt>
          <dd className="mt-1 font-semibold">{job.postedDate}</dd>
        </div>
        <div>
          <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">Last date to apply</dt>
          <dd className="mt-1 font-bold text-red-600 dark:text-red-400">{job.lastDate}</dd>
        </div>
      </dl>

      <section className="mt-8">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Job description</h2>
        <p className="mt-2 text-slate-700 dark:text-slate-200">{job.description}</p>
      </section>

      {job.responsibilities.length > 0 && (
        <section className="mt-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Responsibilities</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700 dark:text-slate-200">
            {job.responsibilities.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </section>
      )}

      {job.requirements.length > 0 && (
        <section className="mt-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Requirements</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700 dark:text-slate-200">
            {job.requirements.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </section>
      )}

      {job.benefits.length > 0 && (
        <section className="mt-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Benefits</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700 dark:text-slate-200">
            {job.benefits.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-6 rounded-xl border border-brand-100 bg-brand-50 p-5 dark:border-slate-700 dark:bg-slate-800">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">How to apply</h2>
        <p className="mt-2 font-semibold text-slate-800 dark:text-slate-100">{job.howToApply}</p>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          Source: {job.source}. Apply karne se pehle official ad zaroor parhein.{" "}
          <strong>Kisi ko fee mat dein — government jobs ke liye koi paisa nahi lagta.</strong>
        </p>
      </section>

      <section className="mt-6" aria-label="Share this job">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Share karein</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          <a
            href={`https://wa.me/?text=${shareText}%20${shareUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-[#25D366] px-4 py-2 text-sm font-bold text-white"
          >
            WhatsApp
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-[#1877F2] px-4 py-2 text-sm font-bold text-white"
          >
            Facebook
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-[#0A66C2] px-4 py-2 text-sm font-bold text-white"
          >
            LinkedIn
          </a>
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Related jobs</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {related.map((r) => (
              <JobCard key={r.slug} job={r} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
