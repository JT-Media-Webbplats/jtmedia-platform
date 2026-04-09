-- ============================================================
-- JT Media Platform — Initial Schema
-- Migration: 20260409000000_initial_schema
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- customers
-- ============================================================
create table if not exists customers (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  email       text not null unique,
  phone       text,
  company     text,
  notes       text,
  status      text not null default 'active'
                check (status in ('active', 'paused', 'inactive')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ============================================================
-- packages
-- ============================================================
create table if not exists packages (
  id            uuid primary key default uuid_generate_v4(),
  name          text not null,
  description   text,
  price_monthly numeric(10,2),
  currency      text not null default 'SEK',
  is_active     boolean not null default true,
  created_at    timestamptz not null default now()
);

-- ============================================================
-- customer_packages  (many-to-many: customer ↔ package)
-- ============================================================
create table if not exists customer_packages (
  id          uuid primary key default uuid_generate_v4(),
  customer_id uuid not null references customers(id) on delete cascade,
  package_id  uuid not null references packages(id) on delete restrict,
  started_at  date not null default current_date,
  ended_at    date,
  created_at  timestamptz not null default now(),
  unique (customer_id, package_id, started_at)
);

-- ============================================================
-- projects
-- ============================================================
create table if not exists projects (
  id           uuid primary key default uuid_generate_v4(),
  customer_id  uuid not null references customers(id) on delete cascade,
  name         text not null,
  description  text,
  status       text not null default 'active'
                 check (status in ('active', 'completed', 'paused', 'cancelled')),
  budget_hours numeric(8,2),
  started_at   date,
  ended_at     date,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ============================================================
-- time_entries
-- ============================================================
create table if not exists time_entries (
  id          uuid primary key default uuid_generate_v4(),
  project_id  uuid not null references projects(id) on delete cascade,
  user_id     uuid references auth.users(id) on delete set null,
  description text,
  hours       numeric(6,2) not null check (hours > 0),
  logged_on   date not null default current_date,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- billing_schedules
-- ============================================================
create table if not exists billing_schedules (
  id                uuid primary key default uuid_generate_v4(),
  customer_id       uuid not null references customers(id) on delete cascade,
  package_id        uuid references packages(id) on delete set null,
  amount            numeric(10,2) not null,
  currency          text not null default 'SEK',
  billing_day       int not null check (billing_day between 1 and 28),  -- day of month
  next_billing_date date not null,
  last_billed_date  date,
  is_active         boolean not null default true,
  notes             text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- ============================================================
-- Indexes
-- ============================================================
create index on customers(status);
create index on projects(customer_id);
create index on projects(status);
create index on time_entries(project_id);
create index on time_entries(logged_on);
create index on billing_schedules(customer_id);
create index on billing_schedules(next_billing_date) where is_active = true;

-- ============================================================
-- updated_at trigger helper
-- ============================================================
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger customers_updated_at
  before update on customers
  for each row execute function update_updated_at();

create trigger projects_updated_at
  before update on projects
  for each row execute function update_updated_at();

create trigger billing_schedules_updated_at
  before update on billing_schedules
  for each row execute function update_updated_at();

-- ============================================================
-- Row Level Security
-- ============================================================
alter table customers         enable row level security;
alter table packages          enable row level security;
alter table customer_packages enable row level security;
alter table projects          enable row level security;
alter table time_entries      enable row level security;
alter table billing_schedules enable row level security;

-- Admin-only access: service role bypasses RLS automatically.
-- Add permissive policies here if you need authenticated user access.
-- Example (uncomment and adapt as needed):
--
-- create policy "Authenticated users can read customers"
--   on customers for select
--   to authenticated
--   using (true);
