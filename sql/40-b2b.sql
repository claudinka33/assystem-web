-- B2B trgovina na assystem.si (Supabase projekt assystem-web)
-- Zaženi v SQL Editorju. Varno za ponovni zagon.

-- Poslovni kupci (prijava prek Supabase Auth)
create table if not exists b2b_kupci (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) on delete cascade,
  email text not null,
  ime text not null,
  telefon text,
  podjetje text not null,
  davcna text not null,
  naslov text,
  posta text,
  kraj text,
  -- nov -> preverjanje (as-terminal išče partnerja v Vascu) -> aktiven | caka_odobritev | zavrnjen
  status text not null default 'preverjanje'
    check (status in ('preverjanje', 'caka_odobritev', 'aktiven', 'zavrnjen')),
  odobreno_rocno boolean not null default false,
  -- podatki iz Vasca (izpolni as-terminal)
  vasco_partner bigint,
  vasco_naziv text,
  vasco_naslov text,
  vasco_posta text,
  rok_placila int,
  rabat numeric default 0,
  ustavljena_prodaja boolean not null default false,
  vasco_emaili text[],
  vasco_sync_ob timestamptz,
  vasco_sporocilo text,
  opomba_interna text,
  ustvarjeno timestamptz not null default now(),
  posodobljeno timestamptz not null default now()
);
create index if not exists b2b_kupci_status on b2b_kupci (status);
create index if not exists b2b_kupci_partner on b2b_kupci (vasco_partner);

-- Poslovalnice (prodajalne) partnerja iz Vasca
create table if not exists b2b_prodajalne (
  vasco_partner bigint not null,
  sifra int not null,
  naziv text,
  naziv2 text,
  naslov text,
  posta text,
  primary key (vasco_partner, sifra)
);

-- Posebne cene iz Vasca (cena na Vasco enoto, brez DDV, rabat v %)
create table if not exists b2b_cene (
  vasco_partner bigint not null,
  sifra text not null,
  cena numeric not null,
  rabat numeric not null default 0,
  primary key (vasco_partner, sifra)
);

-- Naročila: povezava na B2B kupca in partnerja v Vascu
alter table narocila
  add column if not exists b2b_kupec_id uuid references b2b_kupci(id),
  add column if not exists vasco_partner bigint,
  add column if not exists prodajalna int;

-- Dostop samo prek strežnika (secret key). Brskalnik nima dostopa.
alter table b2b_kupci enable row level security;
alter table b2b_prodajalne enable row level security;
alter table b2b_cene enable row level security;
