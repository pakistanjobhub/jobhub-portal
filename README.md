# Pakistan Job Hub — Job Portal (Phase 1)

Professional, SEO-optimized job portal covering verified government jobs across all of Pakistan.

**Phase 1 includes:** Home (hero search, latest + featured jobs, browse by city/category, stats,
job-alert signup) · All Jobs (filters, sorting, pagination) · Single Job pages (JobPosting JSON-LD,
share buttons, related jobs) · Static pages (About, Contact, Privacy, Terms, Disclaimer, FAQ) ·
Admin panel (add / edit / delete jobs) · Dynamic sitemap + robots.txt · Dark mode.

**Phase 1 does NOT include** (Phase 2): city / category / combo pages, company pages, blog,
employer posting, job-seeker accounts, saved jobs. See “Phase 2” below.

> **Live site note:** the current live site (a single-file static page) stays up until this portal
> is deployed. Nothing in this repo touches it.

## Quick start (no credentials needed)

```bash
npm install
cp .env.example .env.local   # DATA_SOURCE=seed is the default — no keys needed
npm run dev                  # http://localhost:3000
```

Seed mode serves the 10 real, verified jobs in `lib/seed-jobs.ts` (newspaper ads + official
portals, 12–13 Oct 2026). No job data is invented.

## Connect Supabase

1. Create a free project at [supabase.com](https://supabase.com).
2. In the Supabase dashboard, open **SQL Editor → New query**, paste `supabase/schema.sql`, and run it.
   It creates `jobs`, `categories`, `cities`, `companies`, `blog_posts`, `saved_jobs`,
   `job_alerts`, `profiles` with indexes + RLS (public read on active jobs; writes via service role only).
3. In **Project Settings → API**, copy the Project URL, anon key, and service-role key.
4. In `.env.local`:
   ```bash
   DATA_SOURCE=supabase
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```
5. Restart the dev server. Reads use the anon key; admin writes use the service-role key.
   If Supabase is unreachable or keys are missing, the app falls back to the seed jobs so the
   site never breaks.

## Admin panel

- Open `/admin`. Log in with the `ADMIN_KEY` env var value.
- Dashboard shows total + active jobs. Add / edit / delete jobs from the table.
- **Phase-1 dev-only auth:** login is a simple `ADMIN_KEY` password check stored in an httpOnly
  cookie. This is NOT real authentication — do not expose the admin panel publicly without
  replacing it. Phase 2 replaces it with Supabase Auth (see below).
- **Seed mode:** admin edits are saved to `lib/seed-overrides.json` (local file merged over the
  seed jobs). This works in local dev only — on Vercel the filesystem is ephemeral, so seed-mode
  edits do NOT persist there. Use Supabase mode for real edits.
- **Jobs auto-expire:** a job with a parseable `last_date_iso` in the past shows “Job expired”
  and is excluded from main listings. Jobs whose ad only says “within X days of the ad” keep
  `last_date_iso = null` and never auto-expire — the ad text is shown as-is.

## Deploy (Vercel)

1. Push this repo to GitHub.
2. Import it in [Vercel](https://vercel.com) — it auto-detects Next.js. No build settings to change.
3. Set the env vars from `.env.example` in Vercel → Project → Settings → Environment Variables
   (`DATA_SOURCE`, Supabase keys if used, `ADMIN_KEY`, `NEXT_PUBLIC_SITE_URL`).
4. Deploy. Then update `NEXT_PUBLIC_SITE_URL` to the real domain so canonical tags + sitemap
   point at the right URL.
5. After deploy: submit the sitemap (`/sitemap.xml`) in Google Search Console and check a job
   page in the Rich Results Test for the JobPosting schema.

## Project structure

```
app/                 App Router pages (home, /jobs, /job/[slug], static pages, /admin)
app/api/             API routes (alerts, admin login/logout, admin jobs CRUD)
components/          Header, Footer, JobCard, FilterBar, JobAlertForm, AdminPanel, …
lib/
  types.ts           Job type, filters, expiry helper
  seed-jobs.ts       The 10 real seed jobs (only job data in Phase 1)
  seed-overrides.json  Seed-mode admin edits (local dev only)
  db.ts              Data layer: getJobs / getJobBySlug / searchJobs / createJob /
                     updateJob / deleteJob / saveJobAlert — seed or Supabase by DATA_SOURCE
  admin-auth.ts      Phase-1 admin check (ADMIN_KEY cookie)
supabase/schema.sql  Full database schema (Phase 1 tables + Phase 2 tables)
```

## Content rules (do not break)

- **Never invent jobs.** Every listing must come from a real ad (newspaper / official portal)
  with its source recorded. Salary / responsibilities / benefits stay empty when the ad does
  not state them — never fill them with guesses.
- **Disclaimer on every page:** “Verified info Only: We do not hire or charge fees.” Never claim
  jobs are guaranteed.
- **No AI imagery, no copied content** from other job sites.
- **No zoom/shake animations** anywhere.

## Phase 2 (planned)

- City pages (`/jobs-in-lahore`), category pages (`/jobs/it-jobs`), category + city combos
  (`/it-jobs-in-lahore`) with short unique intro text each.
- Company pages (profile + all open jobs).
- Blog (CV tips, interview questions, salary guides, career advice).
- Supabase Auth: job-seeker signup/login, saved jobs, job alerts by email; employer login to
  post jobs (pending admin approval). This replaces the Phase-1 `ADMIN_KEY` admin check.
- Bulk job upload (CSV) + rich-text editor in the admin panel.
