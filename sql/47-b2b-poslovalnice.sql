-- B2B: uporabnik pripada poslovalnici + košarica na strežniku (3 dni). Zaženi v SQL Editorju (assystem-web). Varno za ponovni zagon.

-- Poslovalnica uporabnika (šifra iz b2b_prodajalne). NULL = sedež / vse poslovalnice.
alter table b2b_kupci add column if not exists prodajalna int;

-- Košarica prijavljenega B2B uporabnika (velja 3 dni od zadnje spremembe)
create table if not exists b2b_kosarice (
  kupec_id uuid primary key references b2b_kupci(id) on delete cascade,
  postavke jsonb not null default '[]'::jsonb,
  posodobljeno timestamptz not null default now()
);
alter table b2b_kosarice enable row level security;
