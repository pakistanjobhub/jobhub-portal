import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ScholarshipCard, { FundingBadge } from "@/components/ScholarshipCard";
import { SITE_URL, getRelatedScholarships, getScholarshipBySlug, getScholarships } from "@/lib/db";
import { isClosingSoon, isScholarshipExpired } from "@/lib/types";

export async function generateStaticParams() {
  const list = await getScholarships();
  return list.map((s) => ({ slug: s.slug }));
}

function deadlineYear(s: { deadlineISO: string | null; updatedAt: string }): string {
  if (s.deadlineISO) return s.deadlineISO.slice(0, 4);
  return s.updatedAt.slice(0, 4);
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const s = await getScholarshipBySlug(params.slug);
  if (!s) return { title: "Scholarship nahi mili" };
  const year = deadlineYear(s);
  const funded = s.type.toLowerCase().includes("fully") ? "Fully Funded" : s.type;
  const title = `${s.title} ${year} – ${funded}${s.deadline ? `, Deadline ${s.deadline}` : ""} | Pakistan Job Hub`;
  const description = `${s.provider} (${s.country}) — ${s.levels.join(", ")} ke liye ${s.type.toLowerCase()} scholarship. ${s.summary}`.slice(0, 160);
  const url = `/scholarship/${s.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "article" },
    twitter: { card: "summary", title, description },
  };
}

export default async function ScholarshipPage({ params }: { params: { slug: string } }) {
  const s = await getScholarshipBySlug(params.slug);
  if (!s) notFound();
  const related = await getRelatedScholarships(s);
  const expired = isScholarshipExpired(s);
  const closing = isClosingSoon(s);
  const url = `${SITE_URL}/scholarship/${s.slug}`;

  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: s.title,
    description: s.summary,
    author: { "@type": "Organization", name: "Pakistan Job Hub" },
    publisher: { "@type": "Organization", name: "Pakistan Job Hub", url: SITE_URL },
    datePublished: s.updatedAt,
    dateModified: s.updatedAt,
    mainEntityOfPage: url,
  };

  const faqs = [
    {
      q: `${s.title} ke liye kaun apply kar sakta hai?`,
      a: s.eligibility.join(" "),
    },
    {
      q: "Scholarship mein kya kya cover hota hai?",
      a: s.covers,
    },
    {
      q: "Apply kaise karein?",
      a: s.howToApply,
    },
  ];
  if (s.deadline) {
    faqs.push({
      q: "Last date kya hai?",
      a: `Application deadline: ${s.deadline}. Dates har saal badal sakti hain — official website par confirm karein.`,
    });
  }

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Scholarships", item: `${SITE_URL}/scholarships` },
      { "@type": "ListItem", position: 3, name: s.title, item: url },
    ],
  };

  const shareText = encodeURIComponent(`${s.title} — ${s.type}, ${s.country}.${s.deadline ? ` Deadline: ${s.deadline}.` : ""}`);
  const shareUrl = encodeURIComponent(url);

  return (
    <article className="mx-auto max-w-4xl px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />

      <nav aria-label="Breadcrumb" className="text-sm text-slate-500 dark:text-slate-400">
        <Link href="/">Home</Link> / <Link href="/scholarships">Scholarships</Link> /{" "}
        <span aria-current="page">{s.title}</span>
      </nav>

      {expired && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 font-bold text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          ⚠️ Ye scholarship expired hai (deadline guzar chuki). Page reference ke liye live hai — neeche active scholarships dekhein.
        </div>
      )}
      {closing && !expired && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 font-bold text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300">
          ⏰ Closing soon — deadline {s.deadline} hai. Jaldi apply karein!
        </div>
      )}

      <h1 className="mt-4 text-3xl font-extrabold leading-tight text-slate-900 dark:text-white">
        {s.title}
      </h1>
      <p className="mt-1 text-lg font-semibold text-brand-700 dark:text-brand-100">{s.provider}</p>

      <dl className="mt-6 grid gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">Country</dt>
          <dd className="mt-1 font-semibold">🌍 {s.country}</dd>
        </div>
        <div>
          <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">Funding type</dt>
          <dd className="mt-1"><FundingBadge type={s.type} /></dd>
        </div>
        <div>
          <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">Study level</dt>
          <dd className="mt-1 font-semibold">{s.levels.join(" • ")}</dd>
        </div>
        <div>
          <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">Field of study</dt>
          <dd className="mt-1 font-semibold">{s.field}</dd>
        </div>
        <div>
          <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">Deadline</dt>
          <dd className="mt-1 font-bold text-red-600 dark:text-red-400">
            {s.deadline ?? "Yearly cycle — official site dekhein"}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">Last updated</dt>
          <dd className="mt-1 font-semibold">{s.updatedAt}</dd>
        </div>
      </dl>

      <section className="mt-8">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Summary</h2>
        <p className="mt-2 text-slate-700 dark:text-slate-200">{s.summary}</p>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Kya cover hota hai</h2>
        <p className="mt-2 text-slate-700 dark:text-slate-200">{s.covers}</p>
      </section>

      {s.eligibility.length > 0 && (
        <section className="mt-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Eligibility</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700 dark:text-slate-200">
            {s.eligibility.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </section>
      )}

      {s.documents.length > 0 && (
        <section className="mt-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Required documents</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700 dark:text-slate-200">
            {s.documents.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-6 rounded-xl border border-brand-100 bg-brand-50 p-5 dark:border-slate-700 dark:bg-slate-800">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">How to apply</h2>
        <p className="mt-2 font-semibold text-slate-800 dark:text-slate-100">{s.howToApply}</p>
        <a
          href={s.officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-700"
        >
          Official website: {s.officialName} →
        </a>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          Source: {s.source}. Hamesha official website se apply karein.{" "}
          <strong>Hum koi fee nahi lete — kisi ko paisa mat dein.</strong>
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">FAQs</h2>
        <div className="mt-3 space-y-3">
          {faqs.map((f) => (
            <details
              key={f.q}
              className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
            >
              <summary className="cursor-pointer font-bold text-slate-900 dark:text-white">{f.q}</summary>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-6" aria-label="Share this scholarship">
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
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Related scholarships</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {related.map((r) => (
              <ScholarshipCard key={r.slug} scholarship={r} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
