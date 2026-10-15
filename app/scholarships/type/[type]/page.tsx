import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FilteredScholarshipList, MIN_INDEXABLE, introFor } from "../../_shared";
import { getScholarshipTypes, searchScholarships } from "@/lib/db";
import { SCHOLARSHIP_TYPES, slugify } from "@/lib/types";

export async function generateStaticParams() {
  return SCHOLARSHIP_TYPES.map((t) => ({ type: slugify(t) }));
}

function resolveType(slug: string): string | null {
  return SCHOLARSHIP_TYPES.find((t) => slugify(t) === slug) ?? null;
}

export async function generateMetadata({ params }: { params: { type: string } }): Promise<Metadata> {
  const type = resolveType(params.type);
  if (!type) return { title: "Scholarships" };
  const { scholarships } = await searchScholarships({ type, perPage: 100 });
  const title = `${type} Scholarships for Pakistani Students 2026 | Pakistan Job Hub`;
  const description = `${type} scholarships: ${scholarships.length} verified options Pakistani students ke liye — official links ke saath.`.slice(0, 160);
  const url = `/scholarships/type/${params.type}`;
  const robots = scholarships.length < MIN_INDEXABLE ? { index: false, follow: true } : undefined;
  return {
    title,
    description,
    robots,
    alternates: { canonical: url },
    openGraph: { title, description, url },
  };
}

export default async function TypeScholarshipsPage({ params }: { params: { type: string } }) {
  const type = resolveType(params.type);
  if (!type) notFound();
  const { scholarships } = await searchScholarships({ type, perPage: 100 });
  return (
    <FilteredScholarshipList
      heading={`${type} Scholarships for Pakistani Students 2026`}
      intro={introFor("type", params.type, type)}
      breadcrumb={[
        { label: "Home", href: "/" },
        { label: "Scholarships", href: "/scholarships" },
        { label: type, href: `/scholarships/type/${params.type}` },
      ]}
      scholarships={scholarships}
    />
  );
}
