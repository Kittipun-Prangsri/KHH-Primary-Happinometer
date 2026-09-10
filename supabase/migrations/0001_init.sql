-- KHH Primary Happinometer — initial schema (replaces Firestore).
-- Run this once in the Supabase project's SQL Editor (or via `supabase db push`).

create extension if not exists pgcrypto;

-- Anonymous survey submissions. No login required to submit.
create table if not exists public.happinometer_responses (
  id uuid primary key default gen_random_uuid(),
  department text not null,
  personnel_type text not null,
  answers jsonb not null,
  is_anonymous boolean not null default true,
  submitted_at timestamptz not null default now()
);

alter table public.happinometer_responses enable row level security;

-- Anyone can submit anonymously — the survey has no login.
create policy "anyone can submit responses"
  on public.happinometer_responses for insert
  to anon, authenticated
  with check (true);

-- Only an authenticated, approved admin/superadmin (custom claims minted by
-- the MOPH Provider ID login backend) can read aggregate responses.
create policy "admins can read responses"
  on public.happinometer_responses for select
  to authenticated
  using (
    coalesce((auth.jwt() -> 'app_metadata' ->> 'approved')::boolean, false) = true
    and (auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'superadmin')
  );

-- Powers DashboardView's live subscription.
alter publication supabase_realtime add table public.happinometer_responses;

-- Staff synced from MOPH Provider ID / Health ID OAuth login.
-- id == the Supabase Auth user id (auth.users.id) created for this staff
-- member by the backend, so RLS can just compare against auth.uid().
create table if not exists public.khh_staff (
  id uuid primary key references auth.users (id) on delete cascade,
  provider_id text not null unique,
  profile jsonb not null,
  approved boolean not null default true,
  role text not null default 'admin',
  updated_at timestamptz not null default now()
);

alter table public.khh_staff enable row level security;

-- A signed-in staff member may read only their own record (e.g. to see
-- pending/approved status). All writes happen from the backend via the
-- service_role key, which bypasses RLS entirely.
create policy "staff can read own record"
  on public.khh_staff for select
  to authenticated
  using (id = auth.uid());
