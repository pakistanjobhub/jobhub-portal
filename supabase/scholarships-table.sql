-- Scholarships table for Pakistan Job Hub
-- Run this in the Supabase SQL editor (project: pakistan-job-hub)
-- https://supabase.com/dashboard/project/wcdjbnhyvosigstcowwp/sql

create table if not exists public.scholarships (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  provider text not null,
  country text not null,
  levels text[] not null default '{}',
  type text not null default 'Fully funded',
  field text not null default '',
  summary text not null default '',
  covers text not null default '',
  eligibility text[] not null default '{}',
  documents text[] not null default '{}',
  how_to_apply text not null default '',
  deadline text,
  deadline_iso date,
  official_url text not null default '',
  official_name text not null default '',
  source text not null default '',
  is_featured boolean not null default false,
  is_active boolean not null default true,
  updated_at date not null default current_date,
  created_at timestamptz not null default now()
);

-- Public read access (anon key)
alter table public.scholarships enable row level security;

drop policy if exists "Public read scholarships" on public.scholarships;
create policy "Public read scholarships"
  on public.scholarships for select
  using (true);

-- Writes go through the service-role key (bypasses RLS), same as the jobs table.
-- No additional write policies needed.

create index if not exists scholarships_slug_idx on public.scholarships (slug);
create index if not exists scholarships_country_idx on public.scholarships (country);
create index if not exists scholarships_active_idx on public.scholarships (is_active);
