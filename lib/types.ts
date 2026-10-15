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

/* ------------------------------------------------------------------ */
/* Scholarships                                                        */
/* ------------------------------------------------------------------ */

export interface Scholarship {
  id: string;
  slug: string;
  title: string;
  provider: string;
  country: string;
  levels: string[]; // e.g. ["Bachelors", "Masters", "PhD"]
  type: string; // e.g. "Fully funded", "Partially funded", "Need-based", "Merit-based"
  field: string;
  summary: string;
  covers: string;
  eligibility: string[];
  documents: string[];
  howToApply: string;
  deadline: string | null; // display text exactly as announced, e.g. "15 Jan 2027"
  deadlineISO: string | null; // parseable ISO date when known, else null
  officialUrl: string;
  officialName: string;
  source: string;
  isFeatured: boolean;
  isActive: boolean;
  updatedAt: string; // ISO date of last content update
}

export interface ScholarshipFilters {
  q?: string;
  country?: string;
  level?: string;
  type?: string;
  sort?: "deadline" | "newest";
  page?: number;
  perPage?: number;
}

export const SCHOLARSHIP_LEVELS = ["Intermediate", "Bachelors", "Masters", "PhD", "Diploma"];

export const SCHOLARSHIP_TYPES = [
  "Fully funded",
  "Partially funded",
  "Merit-based",
  "Need-based",
];

/** True when the scholarship has a known deadline that has passed. */
export function isScholarshipExpired(s: Scholarship, now = new Date()): boolean {
  if (!s.deadlineISO) return false;
  const end = new Date(s.deadlineISO + "T23:59:59");
  return end.getTime() < now.getTime();
}

/** True when the deadline is within the next `days` days (default 15). */
export function isClosingSoon(s: Scholarship, days = 15, now = new Date()): boolean {
  if (!s.deadlineISO || isScholarshipExpired(s, now)) return false;
  const end = new Date(s.deadlineISO + "T23:59:59").getTime();
  const diffDays = (end - now.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= days;
}

export function scholarshipSlugify(text: string): string {
  return slugify(text);
}
