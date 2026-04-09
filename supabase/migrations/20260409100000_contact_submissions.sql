create table if not exists contact_submissions (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  phone text,
  message text not null,
  created_at timestamptz default now()
);

create table if not exists seo_test_leads (
  id uuid default gen_random_uuid() primary key,
  email text not null,
  url text not null,
  created_at timestamptz default now()
);

alter table contact_submissions enable row level security;
alter table seo_test_leads enable row level security;
