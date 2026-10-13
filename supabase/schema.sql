-- Pakistan Job Hub — Supabase schema (Phase 1)
-- Run this in the Supabase SQL editor (Dashboard -> SQL Editor -> New query).
-- Requires Postgres with pgcrypto (default on Supabase).

create extension if not exists "pgcrypto";

-- ------------------------------------------------------------------
-- Jobs (core table)
-- last_date is the display text exactly as in the ad (e.g. "26 Oct 2026"
-- or "Ad ke 15 din ke andar"). last_date_iso is a parseable date when the
-- ad gives one, used for expiry + JobPosting validThrough. It is NULL
-- when the ad only gives a relative deadline.
-- ------------------------------------------------------------------
create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  org text not null,
  city text not null,
  province text not null,
  category text not null,
  job_type text not null check (job_type in ('full-time','part-time','remote','internship','contract')),
  salary text,
  description text not null default '',
  responsibilities text[] not null default '{}',
  requirements text[] not null default '{}',
  benefits text[] not null default '{}',
  how_to_apply text not null default '',
  posted_date date not null default current_date,
  last_date text not null default '',
  last_date_iso date,
  source text not null default '',
  is_featured boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists jobs_slug_idx on public.jobs (slug);
create index if not exists jobs_city_idx on public.jobs (city);
create index if not exists jobs_province_idx on public.jobs (province);
create index if not exists jobs_category_idx on public.jobs (category);
create index if not exists jobs_posted_date_idx on public.jobs (posted_date desc);
create index if not exists jobs_active_idx on public.jobs (is_active) where is_active = true;

-- ------------------------------------------------------------------
-- Lookup tables (Phase 2: city / category / company pages)
-- ------------------------------------------------------------------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.cities (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  province text not null,
  description text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  logo_url text,
  website text,
  description text not null default '',
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------------
-- Blog (Phase 2)
-- ------------------------------------------------------------------
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  content text not null default '',
  cover_image_url text,
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists blog_posts_slug_idx on public.blog_posts (slug);
create index if not exists blog_posts_published_idx on public.blog_posts (is_published, published_at desc);

-- ------------------------------------------------------------------
-- User features (Phase 2: Supabase Auth)
-- ------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  display_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.saved_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  job_id uuid not null references public.jobs (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, job_id)
);

create table if not exists public.job_alerts (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  keyword text,
  city text,
  category text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists job_alerts_email_idx on public.job_alerts (email);

-- ------------------------------------------------------------------
-- Row Level Security
-- Public (anon) may READ active jobs, published blog posts, categories,
-- cities, companies. All writes go through the service-role key only
-- (the app server), which bypasses RLS. No anon write policies.
-- ------------------------------------------------------------------
alter table public.jobs enable row level security;
alter table public.categories enable row level security;
alter table public.cities enable row level security;
alter table public.companies enable row level security;
alter table public.blog_posts enable row level security;
alter table public.profiles enable row level security;
alter table public.saved_jobs enable row level security;
alter table public.job_alerts enable row level security;

drop policy if exists "Public read active jobs" on public.jobs;
create policy "Public read active jobs" on public.jobs
  for select using (is_active = true);

drop policy if exists "Public read categories" on public.categories;
create policy "Public read categories" on public.categories
  for select using (true);

drop policy if exists "Public read cities" on public.cities;
create policy "Public read cities" on public.cities
  for select using (true);

drop policy if exists "Public read companies" on public.companies;
create policy "Public read companies" on public.companies
  for select using (true);

drop policy if exists "Public read published blog posts" on public.blog_posts;
create policy "Public read published blog posts" on public.blog_posts
  for select using (is_published = true);

-- Service role bypasses RLS, so no write policies are needed.
-- Saved jobs / alerts are managed server-side only in Phase 1.

-- ------------------------------------------------------------------
-- updated_at trigger
-- ------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists jobs_touch_updated_at on public.jobs;
create trigger jobs_touch_updated_at
  before update on public.jobs
  for each row execute function public.touch_updated_at();

drop trigger if exists blog_posts_touch_updated_at on public.blog_posts;
create trigger blog_posts_touch_updated_at
  before update on public.blog_posts
  for each row execute function public.touch_updated_at();
