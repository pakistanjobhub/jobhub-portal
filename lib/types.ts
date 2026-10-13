export type JobType = "full-time" | "part-time" | "remote" | "internship" | "contract";

export interface Job {
  id: string;
  slug: string;
  title: string;
  org: string;
  city: string;
  province: string;
  category: string;
  jobType: JobType;
  salary: string | null;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  howToApply: string;
  postedDate: string; // ISO date, e.g. "2026-10-12"
  lastDate: string; // display text exactly as in the ad, e.g. "26 Oct 2026"
  lastDateISO: string | null; // parseable ISO date when the ad gives one, else null
  source: string; // newspaper / portal the ad appeared in
  isFeatured: boolean;
  isActive: boolean;
}

export interface JobFilters {
  q?: string;
  province?: string;
  city?: string;
  category?: string;
  jobType?: JobType;
  sort?: "newest" | "lastDate";
  page?: number;
  perPage?: number;
}

export interface JobAlert {
  email: string;
  keyword?: string;
  city?: string;
  category?: string;
}

export const JOB_TYPES: { value: JobType; label: string }[] = [
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "remote", label: "Remote" },
  { value: "internship", label: "Internship" },
  { value: "contract", label: "Contract" },
];

export const PROVINCES = ["KPK", "Punjab", "Sindh", "Balochistan", "Islamabad", "Gilgit-Baltistan", "AJK"];

export function isExpired(job: Job, now = new Date()): boolean {
  if (!job.lastDateISO) return false;
  const end = new Date(job.lastDateISO + "T23:59:59");
  return end.getTime() < now.getTime();
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
