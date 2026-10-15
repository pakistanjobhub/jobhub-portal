import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { SEED_JOBS } from "./seed-jobs";
import { SEED_SCHOLARSHIPS } from "./seed-scholarships";
import type { Job, JobAlert, JobFilters, JobType, Scholarship, ScholarshipFilters } from "./types";
import { isClosingSoon, isExpired, isScholarshipExpired, slugify } from "./types";

export const DATA_SOURCE = process.env.DATA_SOURCE === "supabase" ? "supabase" : "seed";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://pakistanjobhub.github.io/Pakistan-job-hub";

/* ------------------------------------------------------------------ */
/* Supabase clients (only when env vars are present)                   */
/* ------------------------------------------------------------------ */

let readClient: SupabaseClient | null | undefined;
let writeClient: SupabaseClient | null | undefined;

function getReadClient(): SupabaseClient | null {
  if (readClient !== undefined) return readClient;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  readClient = url && anon ? createClient(url, anon) : null;
  return readClient;
}

function getWriteClient(): SupabaseClient | null {
  if (writeClient !== undefined) return writeClient;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  writeClient = url && service ? createClient(url, service) : null;
  return writeClient;
}

/** True when Supabase mode is selected AND credentials exist. Otherwise seed. */
export function isSupabaseLive(): boolean {
  return DATA_SOURCE === "supabase" && getReadClient() !== null;
}

/* ------------------------------------------------------------------ */
/* Row mapping (Supabase <-> Job)                                      */
/* ------------------------------------------------------------------ */

interface JobRow {
  id: string;
  slug: string;
  title: string;
  org: string;
  city: string;
  province: string;
  category: string;
  job_type: string;
  salary: string | null;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  how_to_apply: string;
  posted_date: string;
  last_date: string;
  last_date_iso: string | null;
  source: string;
  is_featured: boolean;
  is_active: boolean;
}

function rowToJob(row: JobRow): Job {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    org: row.org,
    city: row.city,
    province: row.province,
    category: row.category,
    jobType: row.job_type as JobType,
    salary: row.salary,
    description: row.description,
    responsibilities: row.responsibilities ?? [],
    requirements: row.requirements ?? [],
    benefits: row.benefits ?? [],
    howToApply: row.how_to_apply,
    postedDate: row.posted_date,
    lastDate: row.last_date,
    lastDateISO: row.last_date_iso,
    source: row.source,
    isFeatured: row.is_featured,
    isActive: row.is_active,
  };
}

function jobToRow(job: Partial<Job> & { slug: string }): Record<string, unknown> {
  const row: Record<string, unknown> = { slug: job.slug };
  if (job.title !== undefined) row.title = job.title;
  if (job.org !== undefined) row.org = job.org;
  if (job.city !== undefined) row.city = job.city;
  if (job.province !== undefined) row.province = job.province;
  if (job.category !== undefined) row.category = job.category;
  if (job.jobType !== undefined) row.job_type = job.jobType;
  if (job.salary !== undefined) row.salary = job.salary;
  if (job.description !== undefined) row.description = job.description;
  if (job.responsibilities !== undefined) row.responsibilities = job.responsibilities;
  if (job.requirements !== undefined) row.requirements = job.requirements;
  if (job.benefits !== undefined) row.benefits = job.benefits;
  if (job.howToApply !== undefined) row.how_to_apply = job.howToApply;
  if (job.postedDate !== undefined) row.posted_date = job.postedDate;
  if (job.lastDate !== undefined) row.last_date = job.lastDate;
  if (job.lastDateISO !== undefined) row.last_date_iso = job.lastDateISO;
  if (job.source !== undefined) row.source = job.source;
  if (job.isFeatured !== undefined) row.is_featured = job.isFeatured;
  if (job.isActive !== undefined) row.is_active = job.isActive;
  return row;
}

/* ------------------------------------------------------------------ */
/* Seed-mode admin overrides (dev only)                                */
/*                                                                     */
/* In seed mode the admin panel writes to lib/seed-overrides.json,    */
/* a local file that is merged over SEED_JOBS. This only persists in  */
/* local dev — on Vercel the filesystem is read-only/ephemeral, so    */
/* seed-mode edits do NOT persist there. Use Supabase for real edits.  */
/* ------------------------------------------------------------------ */

interface SeedOverrides {
  upserted: Job[];
  deleted: string[];
}

async function readOverrides(): Promise<SeedOverrides> {
  try {
    const fs = await import("fs/promises");
    const path = await import("path");
    const raw = await fs.readFile(path.join(process.cwd(), "lib", "seed-overrides.json"), "utf-8");
    const parsed = JSON.parse(raw) as SeedOverrides;
    return { upserted: parsed.upserted ?? [], deleted: parsed.deleted ?? [] };
  } catch {
    return { upserted: [], deleted: [] };
  }
}

async function writeOverrides(overrides: SeedOverrides): Promise<void> {
  const fs = await import("fs/promises");
  const path = await import("path");
  await fs.writeFile(
    path.join(process.cwd(), "lib", "seed-overrides.json"),
    JSON.stringify(overrides, null, 2),
    "utf-8",
  );
}

async function getSeedJobs(): Promise<Job[]> {
  const overrides = await readOverrides();
  const byId = new Map<string, Job>();
  for (const job of SEED_JOBS) byId.set(job.id, job);
  for (const job of overrides.upserted) byId.set(job.id, job);
  for (const id of overrides.deleted) byId.delete(id);
  return [...byId.values()];
}

function applyFilters(jobs: Job[], filters: JobFilters): Job[] {
  let out = [...jobs];
  const q = filters.q?.trim().toLowerCase();
  if (q) {
    out = out.filter((j) =>
      [j.title, j.org, j.city, j.province, j.category, j.description]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }
  if (filters.province) out = out.filter((j) => j.province === filters.province);
  if (filters.city) out = out.filter((j) => j.city === filters.city);
  if (filters.category) out = out.filter((j) => j.category === filters.category);
  if (filters.jobType) out = out.filter((j) => j.jobType === filters.jobType);
  if (filters.sort === "lastDate") {
    out.sort((a, b) => (a.lastDateISO ?? "9999").localeCompare(b.lastDateISO ?? "9999"));
  } else {
    out.sort((a, b) => b.postedDate.localeCompare(a.postedDate));
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Public read API                                                     */
/* ------------------------------------------------------------------ */

/** Active, non-expired jobs (main listings). */
export async function getJobs(): Promise<Job[]> {
  if (isSupabaseLive()) {
    const client = getReadClient()!;
    const { data, error } = await client
      .from("jobs")
      .select("*")
      .eq("is_active", true)
      .order("posted_date", { ascending: false });
    if (error) {
      console.warn("Supabase getJobs failed, falling back to seed:", error.message);
      return getSeedJobs().then((jobs) => jobs.filter((j) => j.isActive && !isExpired(j)));
    }
    return (data as JobRow[]).map(rowToJob).filter((j) => !isExpired(j));
  }
  const jobs = await getSeedJobs();
  return jobs
    .filter((j) => j.isActive && !isExpired(j))
    .sort((a, b) => b.postedDate.localeCompare(a.postedDate));
}

/** All jobs including inactive/expired (admin only). */
export async function getAllJobs(): Promise<Job[]> {
  if (isSupabaseLive()) {
    const client = getWriteClient() ?? getReadClient()!;
    const { data, error } = await client.from("jobs").select("*").order("posted_date", { ascending: false });
    if (error) {
      console.warn("Supabase getAllJobs failed, falling back to seed:", error.message);
      return getSeedJobs();
    }
    return (data as JobRow[]).map(rowToJob);
  }
  return getSeedJobs();
}

export async function getJobBySlug(slug: string): Promise<Job | null> {
  if (isSupabaseLive()) {
    const client = getReadClient()!;
    const { data, error } = await client.from("jobs").select("*").eq("slug", slug).maybeSingle();
    if (error || !data) {
      const seed = (await getSeedJobs()).find((j) => j.slug === slug) ?? null;
      return seed;
    }
    return rowToJob(data as JobRow);
  }
  return (await getSeedJobs()).find((j) => j.slug === slug) ?? null;
}

export async function searchJobs(filters: JobFilters): Promise<{ jobs: Job[]; total: number }> {
  const all = await getJobs();
  const filtered = applyFilters(all, filters);
  const total = filtered.length;
  const perPage = filters.perPage ?? 10;
  const page = Math.max(1, filters.page ?? 1);
  const start = (page - 1) * perPage;
  return { jobs: filtered.slice(start, start + perPage), total };
}

export async function getFeaturedJobs(): Promise<Job[]> {
  const jobs = await getJobs();
  return jobs.filter((j) => j.isFeatured);
}

export async function getRelatedJobs(job: Job, limit = 4): Promise<Job[]> {
  const jobs = await getJobs();
  const sameCat = jobs.filter((j) => j.slug !== job.slug && j.category === job.category);
  const sameCity = jobs.filter(
    (j) => j.slug !== job.slug && j.category !== job.category && j.city === job.city,
  );
  return [...sameCat, ...sameCity].slice(0, limit);
}

export async function getCities(): Promise<string[]> {
  const jobs = await getJobs();
  return [...new Set(jobs.map((j) => j.city))].sort();
}

export async function getCategories(): Promise<string[]> {
  const jobs = await getJobs();
  return [...new Set(jobs.map((j) => j.category))].sort();
}

export async function getStats(): Promise<{ totalJobs: number; cities: number; categories: number }> {
  const jobs = await getJobs();
  return {
    totalJobs: jobs.length,
    cities: new Set(jobs.map((j) => j.city)).size,
    categories: new Set(jobs.map((j) => j.category)).size,
  };
}

/* ------------------------------------------------------------------ */
/* Writes (admin only)                                                 */
/* ------------------------------------------------------------------ */

export async function createJob(input: Omit<Job, "id" | "slug"> & { slug?: string }): Promise<Job> {
  const slug = (input.slug?.trim() || slugify(`${input.title} ${input.org} ${input.city}`)).replace(
    /^-+|-+$/g,
    "",
  );
  if (isSupabaseLive()) {
    const client = getWriteClient();
    if (!client) throw new Error("Supabase write client not configured.");
    const { data, error } = await client
      .from("jobs")
      .insert(jobToRow({ ...input, slug }))
      .select()
      .single();
    if (error) throw new Error(error.message);
    return rowToJob(data as JobRow);
  }
  const job: Job = { ...input, id: `seed-${Date.now()}`, slug };
  const overrides = await readOverrides();
  overrides.upserted = [...overrides.upserted.filter((j) => j.id !== job.id), job];
  await writeOverrides(overrides);
  return job;
}

export async function updateJob(slug: string, patch: Partial<Job>): Promise<Job | null> {
  if (isSupabaseLive()) {
    const client = getWriteClient();
    if (!client) throw new Error("Supabase write client not configured.");
    const { data, error } = await client
      .from("jobs")
      .update(jobToRow({ slug, ...patch }))
      .eq("slug", slug)
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data ? rowToJob(data as JobRow) : null;
  }
  const jobs = await getSeedJobs();
  const existing = jobs.find((j) => j.slug === slug);
  if (!existing) return null;
  const updated: Job = { ...existing, ...patch, slug };
  const overrides = await readOverrides();
  overrides.upserted = [...overrides.upserted.filter((j) => j.id !== updated.id), updated];
  await writeOverrides(overrides);
  return updated;
}

export async function deleteJob(slug: string): Promise<boolean> {
  if (isSupabaseLive()) {
    const client = getWriteClient();
    if (!client) throw new Error("Supabase write client not configured.");
    const { error } = await client.from("jobs").delete().eq("slug", slug);
    if (error) throw new Error(error.message);
    return true;
  }
  const jobs = await getSeedJobs();
  const existing = jobs.find((j) => j.slug === slug);
  if (!existing) return false;
  const overrides = await readOverrides();
  overrides.upserted = overrides.upserted.filter((j) => j.id !== existing.id);
  if (!overrides.deleted.includes(existing.id)) overrides.deleted.push(existing.id);
  await writeOverrides(overrides);
  return true;
}

export async function saveJobAlert(alert: JobAlert): Promise<{ stored: boolean }> {
  if (isSupabaseLive()) {
    const client = getWriteClient() ?? getReadClient()!;
    const { error } = await client.from("job_alerts").insert({
      email: alert.email,
      keyword: alert.keyword ?? null,
      city: alert.city ?? null,
      category: alert.category ?? null,
    });
    if (error) throw new Error(error.message);
    return { stored: true };
  }
  return { stored: false };
}

/* ------------------------------------------------------------------ */
/* Scholarships                                                        */
/* ------------------------------------------------------------------ */

interface ScholarshipRow {
  id: string;
  slug: string;
  title: string;
  provider: string;
  country: string;
  levels: string[];
  type: string;
  field: string;
  summary: string;
  covers: string;
  eligibility: string[];
  documents: string[];
  how_to_apply: string;
  deadline: string | null;
  deadline_iso: string | null;
  official_url: string;
  official_name: string;
  source: string;
  is_featured: boolean;
  is_active: boolean;
  updated_at: string;
}

function rowToScholarship(row: ScholarshipRow): Scholarship {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    provider: row.provider,
    country: row.country,
    levels: row.levels ?? [],
    type: row.type,
    field: row.field,
    summary: row.summary,
    covers: row.covers,
    eligibility: row.eligibility ?? [],
    documents: row.documents ?? [],
    howToApply: row.how_to_apply,
    deadline: row.deadline,
    deadlineISO: row.deadline_iso,
    officialUrl: row.official_url,
    officialName: row.official_name,
    source: row.source,
    isFeatured: row.is_featured,
    isActive: row.is_active,
    updatedAt: row.updated_at,
  };
}

function scholarshipToRow(
  s: Partial<Scholarship> & { slug: string },
): Record<string, unknown> {
  const row: Record<string, unknown> = { slug: s.slug };
  if (s.title !== undefined) row.title = s.title;
  if (s.provider !== undefined) row.provider = s.provider;
  if (s.country !== undefined) row.country = s.country;
  if (s.levels !== undefined) row.levels = s.levels;
  if (s.type !== undefined) row.type = s.type;
  if (s.field !== undefined) row.field = s.field;
  if (s.summary !== undefined) row.summary = s.summary;
  if (s.covers !== undefined) row.covers = s.covers;
  if (s.eligibility !== undefined) row.eligibility = s.eligibility;
  if (s.documents !== undefined) row.documents = s.documents;
  if (s.howToApply !== undefined) row.how_to_apply = s.howToApply;
  if (s.deadline !== undefined) row.deadline = s.deadline;
  if (s.deadlineISO !== undefined) row.deadline_iso = s.deadlineISO;
  if (s.officialUrl !== undefined) row.official_url = s.officialUrl;
  if (s.officialName !== undefined) row.official_name = s.officialName;
  if (s.source !== undefined) row.source = s.source;
  if (s.isFeatured !== undefined) row.is_featured = s.isFeatured;
  if (s.isActive !== undefined) row.is_active = s.isActive;
  if (s.updatedAt !== undefined) row.updated_at = s.updatedAt;
  return row;
}

async function getSeedScholarships(): Promise<Scholarship[]> {
  return [...SEED_SCHOLARSHIPS];
}

/** Active scholarships for main listings (excludes expired ones with known deadlines). */
export async function getScholarships(): Promise<Scholarship[]> {
  if (isSupabaseLive()) {
    const client = getReadClient()!;
    const { data, error } = await client
      .from("scholarships")
      .select("*")
      .eq("is_active", true)
      .order("updated_at", { ascending: false });
    if (error) {
      console.warn("Supabase getScholarships failed, falling back to seed:", error.message);
      return (await getSeedScholarships()).filter((s) => s.isActive && !isScholarshipExpired(s));
    }
    return (data as ScholarshipRow[]).map(rowToScholarship).filter((s) => !isScholarshipExpired(s));
  }
  const all = await getSeedScholarships();
  return all
    .filter((s) => s.isActive && !isScholarshipExpired(s))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

/** All scholarships including inactive/expired (admin only). */
export async function getAllScholarships(): Promise<Scholarship[]> {
  if (isSupabaseLive()) {
    const client = getWriteClient() ?? getReadClient()!;
    const { data, error } = await client
      .from("scholarships")
      .select("*")
      .order("updated_at", { ascending: false });
    if (error) {
      console.warn("Supabase getAllScholarships failed, falling back to seed:", error.message);
      return getSeedScholarships();
    }
    return (data as ScholarshipRow[]).map(rowToScholarship);
  }
  return getSeedScholarships();
}

export async function getScholarshipBySlug(slug: string): Promise<Scholarship | null> {
  if (isSupabaseLive()) {
    const client = getReadClient()!;
    const { data, error } = await client.from("scholarships").select("*").eq("slug", slug).maybeSingle();
    if (error || !data) {
      return (await getSeedScholarships()).find((s) => s.slug === slug) ?? null;
    }
    return rowToScholarship(data as ScholarshipRow);
  }
  return (await getSeedScholarships()).find((s) => s.slug === slug) ?? null;
}

function applyScholarshipFilters(list: Scholarship[], filters: ScholarshipFilters): Scholarship[] {
  let out = [...list];
  const q = filters.q?.trim().toLowerCase();
  if (q) {
    out = out.filter((s) =>
      [s.title, s.provider, s.country, s.field, s.summary, s.type, ...s.levels]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }
  if (filters.country) out = out.filter((s) => s.country === filters.country);
  if (filters.level) out = out.filter((s) => s.levels.includes(filters.level!));
  if (filters.type) out = out.filter((s) => s.type === filters.type);
  if (filters.sort === "deadline") {
    out.sort((a, b) => (a.deadlineISO ?? "9999").localeCompare(b.deadlineISO ?? "9999"));
  } else {
    out.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }
  return out;
}

export async function searchScholarships(
  filters: ScholarshipFilters,
): Promise<{ scholarships: Scholarship[]; total: number }> {
  const all = await getScholarships();
  const filtered = applyScholarshipFilters(all, filters);
  const total = filtered.length;
  const perPage = filters.perPage ?? 12;
  const page = Math.max(1, filters.page ?? 1);
  const start = (page - 1) * perPage;
  return { scholarships: filtered.slice(start, start + perPage), total };
}

export async function getFeaturedScholarships(): Promise<Scholarship[]> {
  const all = await getScholarships();
  return all.filter((s) => s.isFeatured);
}

export async function getClosingSoonScholarships(days = 15): Promise<Scholarship[]> {
  const all = await getScholarships();
  return all.filter((s) => isClosingSoon(s, days));
}

export async function getRelatedScholarships(s: Scholarship, limit = 3): Promise<Scholarship[]> {
  const all = await getScholarships();
  const sameCountry = all.filter((x) => x.slug !== s.slug && x.country === s.country);
  const sameLevel = all.filter(
    (x) =>
      x.slug !== s.slug &&
      x.country !== s.country &&
      x.levels.some((l) => s.levels.includes(l)),
  );
  return [...sameCountry, ...sameLevel].slice(0, limit);
}

export async function getScholarshipCountries(): Promise<string[]> {
  const all = await getScholarships();
  return [...new Set(all.map((s) => s.country))].sort();
}

export async function getScholarshipLevels(): Promise<string[]> {
  const all = await getScholarships();
  return [...new Set(all.flatMap((s) => s.levels))].sort();
}

export async function getScholarshipTypes(): Promise<string[]> {
  const all = await getScholarships();
  return [...new Set(all.map((s) => s.type))].sort();
}

export async function createScholarship(
  input: Omit<Scholarship, "id" | "slug"> & { slug?: string },
): Promise<Scholarship> {
  const slug = (input.slug?.trim() || slugify(input.title)).replace(/^-+|-+$/g, "");
  if (isSupabaseLive()) {
    const client = getWriteClient();
    if (!client) throw new Error("Supabase write client not configured.");
    const { data, error } = await client
      .from("scholarships")
      .insert(scholarshipToRow({ ...input, slug }))
      .select()
      .single();
    if (error) throw new Error(error.message);
    return rowToScholarship(data as ScholarshipRow);
  }
  throw new Error("Scholarships seed mode is read-only on this deployment. Connect Supabase to add scholarships.");
}

export async function updateScholarship(
  slug: string,
  patch: Partial<Scholarship>,
): Promise<Scholarship | null> {
  if (isSupabaseLive()) {
    const client = getWriteClient();
    if (!client) throw new Error("Supabase write client not configured.");
    const { data, error } = await client
      .from("scholarships")
      .update(scholarshipToRow({ slug, ...patch }))
      .eq("slug", slug)
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data ? rowToScholarship(data as ScholarshipRow) : null;
  }
  throw new Error("Scholarships seed mode is read-only on this deployment. Connect Supabase to edit scholarships.");
}

export async function deleteScholarship(slug: string): Promise<boolean> {
  if (isSupabaseLive()) {
    const client = getWriteClient();
    if (!client) throw new Error("Supabase write client not configured.");
    const { error } = await client.from("scholarships").delete().eq("slug", slug);
    if (error) throw new Error(error.message);
    return true;
  }
  throw new Error("Scholarships seed mode is read-only on this deployment. Connect Supabase to delete scholarships.");
}
