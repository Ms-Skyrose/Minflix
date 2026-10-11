-- Minflix Events: consent, listing review flags, signup sources, visitor counting and rate limits.
-- Run after 0001 (Supabase → SQL Editor, or `supabase db push`).

-- 1. Festivals: consent record, review flag and where the signup came from
alter table public.festivals
  add column if not exists consent_at        timestamptz,
  add column if not exists consent_version   text,
  add column if not exists flag_reason       text,          -- why a listing is held back (e.g. 'reserved-name'); null = clean
  add column if not exists utm_source        text check (char_length(utm_source) <= 100),
  add column if not exists utm_medium        text check (char_length(utm_medium) <= 100),
  add column if not exists utm_campaign      text check (char_length(utm_campaign) <= 100),
  add column if not exists referrer_host     text check (char_length(referrer_host) <= 200),
  add column if not exists landing_path      text check (char_length(landing_path) <= 300);

-- 2. Visits: one row per page view. No cookies; the visitor id is a daily-rotating hash, never an IP.
create table if not exists public.page_views (
  id            bigint generated always as identity primary key,
  created_at    timestamptz not null default now(),
  day           date not null default (now() at time zone 'Africa/Lagos')::date,
  path          text not null check (char_length(path) <= 300),
  visitor       text not null check (char_length(visitor) = 24),  -- hash(ip + browser + day), rotates daily
  referrer_host text check (char_length(referrer_host) <= 200),
  utm_source    text check (char_length(utm_source) <= 100),
  utm_medium    text check (char_length(utm_medium) <= 100),
  utm_campaign  text check (char_length(utm_campaign) <= 100),
  ref_code      text check (char_length(ref_code) <= 90),
  country       text check (char_length(country) <= 2)
);
create index if not exists page_views_day_idx on public.page_views (day);
alter table public.page_views enable row level security;

-- 3. Signup attempts, for rate limiting (hashed; the app deletes rows older than 7 days)
create table if not exists public.signup_attempts (
  id         bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  client     text not null check (char_length(client) = 24),
  ok         boolean not null default false
);
create index if not exists signup_attempts_client_idx on public.signup_attempts (client, created_at desc);
alter table public.signup_attempts enable row level security;

-- 4. Daily numbers for the team (Lagos time): visitors, page views, signups, conversion
create or replace view public.daily_stats with (security_invoker = true) as
with v as (
  select day, count(distinct visitor) as visitors, count(*) as page_views
  from public.page_views group by day
), s as (
  select (created_at at time zone 'Africa/Lagos')::date as day, count(*) as signups
  from public.festivals group by 1
)
select coalesce(v.day, s.day) as day,
       coalesce(v.visitors, 0)   as visitors,
       coalesce(v.page_views, 0) as page_views,
       coalesce(s.signups, 0)    as signups,
       case when coalesce(v.visitors, 0) > 0 then round(100.0 * coalesce(s.signups, 0) / v.visitors, 1) end as conversion_pct
from v full join s on s.day = v.day
order by 1 desc;

-- 5. Where signups came from (UTM source, invite link, or the site that linked them)
create or replace view public.signup_sources with (security_invoker = true) as
select coalesce(utm_source,
                case when referred_by is not null then 'festival invite' end,
                referrer_host,
                'direct') as source,
       count(*) as signups,
       max(created_at) as latest
from public.festivals
group by 1
order by 2 desc;

-- 6. Which festivals bring in others through their invite link
create or replace view public.top_referrers with (security_invoker = true) as
select r.festival_name, r.ref_code, count(f.id) as festivals_invited
from public.festivals r
join public.festivals f on f.referred_by = r.ref_code
group by r.festival_name, r.ref_code
order by 3 desc;

revoke all on public.daily_stats, public.signup_sources, public.top_referrers from anon, authenticated;

-- 7. Keep the logo bucket in line with the 3 MB upload cap (stored logos are resized, so they stay small)
update storage.buckets set file_size_limit = 3145728 where id = 'festival-logos';
