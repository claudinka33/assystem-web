-- Baza kontaktov za mailinge (panoge iz Vasca). Zaženi v SQL Editorju (assystem-web). Varno za ponovni zagon.

create table if not exists baza_panoge (
  sifra int primary key,            -- šifra panoge v Vascu (SIFRANT5 / rabatne skupine)
  ime text not null,
  vrstni_red int not null default 0
);
alter table baza_panoge enable row level security;

insert into baza_panoge (sifra, ime, vrstni_red) values
  (22, 'Trgovec pritrdilna tehnika, orodje', 1),
  (21, 'Trgovec ostali program', 2),
  (23, 'Trgovina ni mailinga', 3),
  (6,  'Inštalater', 10),
  (2,  'Elektro inštalater', 11),
  (7,  'Klimatizacija', 12),
  (18, 'Sončne elektrarne', 13),
  (14, 'Monter', 14),
  (10, 'Krovstvo in tesarstvo', 20),
  (12, 'Lesene, montažne hiše', 21),
  (20, 'Suhomontaža', 30),
  (25, 'Zaključna dela v gradbeništvu', 31),
  (5,  'Gradbeništvo', 32),
  (9,  'Kovinske konstrukcije', 40),
  (8,  'Ključavničarstvo / obdelava kovin', 41),
  (15, 'Ograje', 42),
  (13, 'Mizarstvo, lesna dejavnost', 50),
  (19, 'Stavbno pohištvo', 51),
  (11, 'Lesna embalaža / palete', 52),
  (17, 'Proizvodnja', 60),
  (24, 'Tujina', 70),
  (3,  'EX YU', 71),
  (4,  'Fizična stranka', 80),
  (26, 'Dobavitelj', 90),
  (1,  'AS system', 91)
on conflict (sifra) do update set ime = excluded.ime, vrstni_red = excluded.vrstni_red;
-- 16 »Ostalo« namenoma ni panoga: taki kontakti so »Nerazvrščeni«, dokler jih ne razvrstimo.

create table if not exists baza_kontakti (
  email text primary key,
  ime text,
  podjetje text,
  telefon text,
  davcna text,
  vasco_partner bigint,
  panoge int[] not null default '{}',      -- šifre iz baza_panoge; prazno = nerazvrščen
  vir text not null default 'ročno',        -- Vasco, e-novice, povpraševanje, pop-up, B2B, naročilo, ročno, Resend
  soglasje boolean not null default false,  -- izrecna prijava na e-novice
  odjavljen boolean not null default false,
  opomba text,
  ustvarjeno timestamptz not null default now(),
  posodobljeno timestamptz not null default now()
);
create index if not exists baza_kontakti_panoge on baza_kontakti using gin (panoge);
create index if not exists baza_kontakti_vir on baza_kontakti (vir);
alter table baza_kontakti enable row level security;

-- (dodano) več podatkov o kontaktu: poslovalnica in kraj
alter table baza_kontakti add column if not exists poslovalnica text;
alter table baza_kontakti add column if not exists kraj text;
