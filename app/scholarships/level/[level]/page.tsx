import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FilteredScholarshipList, MIN_INDEXABLE, introFor } from "../../_shared";
import { getScholarshipLevels, searchScholarships } from "@/lib/db";
import { SCHOLARSHIP_LEVELS, slugify } from "@/lib/types";

export async function generateStaticParams() {
  return SCHOLARSHIP_LEVELS.map((l) => ({ level: slugify(l) }));
}

function resolveLevel(slug: string): string | null {
  return SCHOLARSHIP_LEVELS.find((l) => slugify(l) === slug) ?? null;
}

function levelLabel(level: string): string {
  return level === "PhD" ? "PhD" : level;
}

export async function generateMetadata({ params }: { params: { level: string } }): Promise<Metadata> {
  const level = resolveLevel(params.level);
  if (!level) return { title: "Scholarships" };
  const { scholarships } = await searchScholarships({ level, perPage: 100 });
  const title = `${levelLabel(level)} Scholarships for Pakistani Students 2026 | Pakistan Job Hub`;
  const description = `${level} level ke liye ${scholarships.length} verified scholarships Pakistani students ke liye — official links ke saath.`.slice(0, 160);
  const url = `/scholarships/level/${params.level}`;
  const robots = scholarships.length < MIN_INDEXABLE ? { index: false, follow: true } : undefined;
  return {
    title,
    description,
    robots,
    alternates: { canonical: url },
    openGraph: { title, description, url },
  };
}

export default async function LevelScholarshipsPage({ params }: { params: { level: string } }) {
  const level = resolveLevel(params.level);
  if (!level) notFound();
  const { scholarships } = await searchScholarships({ level, perPage: 100 });
  return (
    <FilteredScholarshipList
      heading={`${levelLabel(level)} Scholarships for Pakistani Students 2026`}
      intro={introFor("level", params.level, level)}
      breadcrumb={[
        { label: "Home", href: "/" },
        { label: "Scholarships", href: "/scholarships" },
        { label: "Levels", href: "/scholarships/levels" },
        { label: level, href: `/scholarships/level/${params.level}` },
      ]}
      scholarships={scholarships}
    />
  );
}
