-- Zaposleni z omejenim dostopom do administracije (prijava z Microsoftom).
-- Polni admini ostanejo v admin_uporabniki.
create table if not exists public.admin_dostopi (
  email text primary key check (email = lower(email)),
  ime text,
  dovoljenja text[] not null default '{}',
  aktiven boolean not null default true,
  dodal text,
  ustvarjeno timestamptz not null default now(),
  posodobljeno timestamptz not null default now()
);

-- Brez politik: tabelo bere in piše samo strežnik s tajnim ključem.
alter table public.admin_dostopi enable row level security;
