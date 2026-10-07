-- Minflix Events: festival waitlist, public directory and network counts.
-- Run once in Supabase → SQL Editor (or `supabase db push`).

create extension if not exists pgcrypto;

create table if not exists public.festivals (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamptz not null default now(),
  slug              text not null unique check (slug ~ '^[a-z0-9-]{2,80}$'),
  ref_code          text not null unique check (ref_code ~ '^[a-z0-9-]{4,90}$'), -- festival name + 4-char code, used in invite links
  edit_token        uuid not null default gen_random_uuid(),   -- lets the joiner answer the follow-up question
  email             text not null unique check (email ~* '^[^\s@]+@[^\s@]+\.[^\s@]+$'),
  festival_name     text not null check (char_length(festival_name) between 2 and 120),
  country_code      text not null check (country_code ~ '^[A-Z]{2}$'),
  logo_url          text,
  festival_type     text check (char_length(festival_type) <= 40),
  films_per_edition text check (char_length(films_per_edition) <= 40),
  next_edition      text check (char_length(next_edition) <= 40),
  website           text check (char_length(website) <= 200),
  headache          text check (char_length(headache) <= 40),
  referred_by       text,                                       -- ref_code of the festival whose invite link was used
  listed            boolean not null default true                -- show in the public directory
);

create index if not exists festivals_created_at_idx on public.festivals (created_at desc);
create index if not exists festivals_country_idx on public.festivals (country_code);

-- Locked down: the site reads and writes only from the server with the service-role key.
-- No anon policies means the public key can neither read emails nor write rows.
alter table public.festivals enable row level security;

-- Festivals per country, for the network leaderboard.
create or replace view public.festival_country_counts with (security_invoker = true) as
  select country_code, count(*)::int as festivals
  from public.festivals
  where listed
  group by country_code;

revoke all on public.festival_country_counts from anon, authenticated;

-- Public bucket for festival logos (2 MB, images only).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('festival-logos', 'festival-logos', true, 2097152, array['image/png', 'image/jpeg', 'image/webp'])
on conflict (id) do nothing;
