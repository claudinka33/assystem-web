-- B2B: računi iz Vasca v B2B računu kupca. Zaženi v SQL Editorju (assystem-web). Varno za ponovni zagon.

-- Podjetja (Vasco partnerji), ki jim v adminu vklopimo »Računi v B2B«
create table if not exists b2b_racuni_partnerji (
  vasco_partner bigint primary key,
  vklopljeno_ob timestamptz not null default now(),
  prvi_prenos_ob timestamptz,
  zadnji_prenos_ob timestamptz
);
alter table b2b_racuni_partnerji enable row level security;

-- Računi (glava + postavke z neto cenami), polni jih as-terminal (vasco_web_racuni.py)
create table if not exists b2b_racuni (
  leto int not null,
  stevilka int not null,
  vasco_partner bigint not null,
  prodajalna int,
  datum date,
  neto numeric,
  znesek numeric,          -- končni znesek z DDV
  odprto numeric,          -- še neplačano
  postavke jsonb not null default '[]'::jsonb,
  sinhronizirano timestamptz default now(),
  primary key (leto, stevilka)
);
create index if not exists b2b_racuni_partner on b2b_racuni (vasco_partner, prodajalna, datum desc);
alter table b2b_racuni enable row level security;
