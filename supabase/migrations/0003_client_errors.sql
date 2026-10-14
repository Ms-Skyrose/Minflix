-- Anonymous error reports from browsers (e.g. a join that failed to send). No form contents, no IP.
-- The app deletes reports older than 30 days.
create table if not exists public.client_errors (
  id         bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  stage      text check (char_length(stage) <= 40),
  message    text check (char_length(message) <= 500),
  name       text check (char_length(name) <= 60),
  path       text check (char_length(path) <= 200),
  user_agent text check (char_length(user_agent) <= 300)
);
create index if not exists client_errors_created_idx on public.client_errors (created_at desc);
alter table public.client_errors enable row level security;

-- Read them in Supabase → SQL Editor:
--   select created_at at time zone 'Africa/Lagos', stage, message, user_agent from client_errors order by created_at desc limit 50;
