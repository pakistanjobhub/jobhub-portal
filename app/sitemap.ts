import type { MetadataRoute } from "next";
import { SITE_URL, getJobs } from "@/lib/db";

const STATIC_PAGES = ["", "/jobs", "/about", "/contact", "/privacy", "/terms", "/disclaimer", "/faq"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const jobs = await getJobs();
  const statics: MetadataRoute.Sitemap = STATIC_PAGES.map((p) => ({
    url: `${SITE_URL}${p || "/"}`,
    lastModified: new Date(),
    changeFrequency: p === "" || p === "/jobs" ? "daily" : "monthly",
    priority: p === "" ? 1 : p === "/jobs" ? 0.9 : 0.5,
  }));
  const jobPages: MetadataRoute.Sitemap = jobs.map((job) => ({
    url: `${SITE_URL}/job/${job.slug}`,
    lastModified: new Date(job.postedDate),
    changeFrequency: "weekly",
    priority: 0.8,
  }));
  return [...statics, ...jobPages];
}
