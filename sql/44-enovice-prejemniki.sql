-- E-novice: sledljivost po prejemnikih (kdo je prejel, odprl, kliknil, se odjavil …)
-- Podatki se osvežijo iz Resenda (gumb »Osveži statistiko« ali samodejno ob ogledu).

create table if not exists public.enovice_prejemniki (
  kampanja_id bigint not null references public.enovice_kampanje(id) on delete cascade,
  email text not null,
  contact_id text,
  dostavljeno boolean not null default false,
  odprl integer not null default 0,        -- število odprtij
  kliknil integer not null default 0,      -- število klikov
  povezave jsonb,                          -- [{url, clicks}]
  odbit text,                              -- tip odboja (permanent/transient/…) ali null
  pritozba boolean not null default false, -- označil kot spam
  odjavljen boolean not null default false,
  zavrnjen boolean not null default false, -- na seznamu blokiranih (suppressed)
  primary key (kampanja_id, email)
);

create index if not exists enovice_prejemniki_email_idx on public.enovice_prejemniki (email);

alter table public.enovice_prejemniki enable row level security;
