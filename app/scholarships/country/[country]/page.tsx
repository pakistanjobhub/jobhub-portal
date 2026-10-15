import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FilteredScholarshipList, MIN_INDEXABLE, introFor } from "../../_shared";
import { SITE_URL, getScholarshipCountries, searchScholarships } from "@/lib/db";
import { slugify } from "@/lib/types";

export async function generateStaticParams() {
  const countries = await getScholarshipCountries();
  return countries.map((c) => ({ country: slugify(c) }));
}

async function resolveCountry(slug: string): Promise<string | null> {
  const countries = await getScholarshipCountries();
  return countries.find((c) => slugify(c) === slug) ?? null;
}

export async function generateMetadata({ params }: { params: { country: string } }): Promise<Metadata> {
  const country = await resolveCountry(params.country);
  if (!country) return { title: "Scholarships" };
  const { scholarships } = await searchScholarships({ country, perPage: 100 });
  const title = `Scholarships in ${country} for Pakistani Students 2026 | Pakistan Job Hub`;
  const description = `${country} mein Pakistani students ke liye ${scholarships.length} verified scholarships — fully funded aur partial. Official links ke saath.`.slice(0, 160);
  const url = `/scholarships/country/${params.country}`;
  const robots = scholarships.length < MIN_INDEXABLE ? { index: false, follow: true } : undefined;
  return {
    title,
    description,
    robots,
    alternates: { canonical: url },
    openGraph: { title, description, url },
  };
}

export default async function CountryScholarshipsPage({ params }: { params: { country: string } }) {
  const country = await resolveCountry(params.country);
  if (!country) notFound();
  const { scholarships } = await searchScholarships({ country, perPage: 100 });
  return (
    <FilteredScholarshipList
      heading={`Scholarships in ${country} for Pakistani Students 2026`}
      intro={introFor("country", params.country, country)}
      breadcrumb={[
        { label: "Home", href: "/" },
        { label: "Scholarships", href: "/scholarships" },
        { label: "Countries", href: "/scholarships/countries" },
        { label: country, href: `/scholarships/country/${params.country}` },
      ]}
      scholarships={scholarships}
    />
  );
}
