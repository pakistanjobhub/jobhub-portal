import type { MetadataRoute } from "next";
import { SITE_URL, getJobs, getScholarshipCountries, getScholarships } from "@/lib/db";
import { SCHOLARSHIP_LEVELS, SCHOLARSHIP_TYPES, slugify } from "@/lib/types";
import { MIN_INDEXABLE } from "./scholarships/_shared";

const STATIC_PAGES = ["", "/jobs", "/scholarships", "/scholarships/countries", "/scholarships/levels", "/about", "/contact", "/privacy", "/terms", "/disclaimer", "/faq"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [jobs, scholarships, countries] = await Promise.all([
    getJobs(),
    getScholarships(),
    getScholarshipCountries(),
  ]);

  const statics: MetadataRoute.Sitemap = STATIC_PAGES.map((p) => ({
    url: `${SITE_URL}${p || "/"}`,
    lastModified: new Date(),
    changeFrequency: p === "" || p === "/jobs" || p === "/scholarships" ? "daily" : "monthly",
    priority: p === "" ? 1 : p === "/jobs" || p === "/scholarships" ? 0.9 : 0.5,
  }));

  const jobPages: MetadataRoute.Sitemap = jobs.map((job) => ({
    url: `${SITE_URL}/job/${job.slug}`,
    lastModified: new Date(job.postedDate),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const scholarshipPages: MetadataRoute.Sitemap = scholarships.map((s) => ({
    url: `${SITE_URL}/scholarship/${s.slug}`,
    lastModified: new Date(s.updatedAt),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Country pages with >= MIN_INDEXABLE scholarships
  const countryPages: MetadataRoute.Sitemap = [];
  for (const country of countries) {
    const count = scholarships.filter((s) => s.country === country).length;
    if (count >= MIN_INDEXABLE) {
      countryPages.push({
        url: `${SITE_URL}/scholarships/country/${slugify(country)}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }

  // Level pages with >= MIN_INDEXABLE scholarships
  const levelPages: MetadataRoute.Sitemap = [];
  for (const level of SCHOLARSHIP_LEVELS) {
    const count = scholarships.filter((s) => s.levels.includes(level)).length;
    if (count >= MIN_INDEXABLE) {
      levelPages.push({
        url: `${SITE_URL}/scholarships/level/${slugify(level)}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }

  // Type pages with >= MIN_INDEXABLE scholarships
  const typePages: MetadataRoute.Sitemap = [];
  for (const type of SCHOLARSHIP_TYPES) {
    const count = scholarships.filter((s) => s.type === type).length;
    if (count >= MIN_INDEXABLE) {
      typePages.push({
        url: `${SITE_URL}/scholarships/type/${slugify(type)}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }

  return [...statics, ...jobPages, ...scholarshipPages, ...countryPages, ...levelPages, ...typePages];
}
