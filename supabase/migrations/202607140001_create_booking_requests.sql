create extension if not exists pgcrypto;
create extension if not exists btree_gist;

create table if not exists public.booking_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  consultant_slug text not null check (char_length(consultant_slug) between 2 and 80),
  service_id text not null check (service_id in ('decision-session', 'strategy-intensive', 'advisory-fit')),
  start_at timestamptz not null check (start_at > created_at),
  timezone text not null check (char_length(timezone) between 1 and 64),
  duration_minutes integer not null check (duration_minutes between 15 and 480),
  price_cents integer not null check (price_cents >= 0),
  currency text not null default 'USD' check (currency = 'USD'),
  client_name text not null check (char_length(client_name) between 2 and 100),
  client_email text not null check (char_length(client_email) between 3 and 254),
  company text check (company is null or char_length(company) <= 120),
  challenge text not null check (char_length(challenge) between 20 and 400),
  consent_to_contact boolean not null check (consent_to_contact = true),
  status text not null default 'requested' check (status in ('requested', 'pending_payment', 'confirmed', 'cancelled', 'completed')),
  source text not null default 'public_booking' check (source in ('public_booking'))
);

create unique index if not exists booking_requests_active_slot_unique
  on public.booking_requests (consultant_slug, start_at)
  where status in ('requested', 'pending_payment', 'confirmed');

create index if not exists booking_requests_consultant_created_idx
  on public.booking_requests (consultant_slug, created_at desc);

do $$
begin
  alter table public.booking_requests
    add constraint booking_requests_no_active_overlap
    exclude using gist (
      consultant_slug with =,
      tstzrange(
        start_at,
        start_at + (duration_minutes * interval '1 minute'),
        '[)'
      ) with &&
    )
    where (status in ('requested', 'pending_payment', 'confirmed'));
exception
  when duplicate_object then null;
end
$$;

alter table public.booking_requests enable row level security;

revoke all on table public.booking_requests from anon, authenticated;
grant all on table public.booking_requests to service_role;

comment on table public.booking_requests is
  'Server-created booking requests. Public clients never receive direct table access.';
