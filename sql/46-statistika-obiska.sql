-- Statistika obiska assystem.si — lastno merjenje BREZ piškotkov.
-- Vsak ogled strani in dogodek (povpraševanje, košarica, nakup …) je ena vrstica.
-- Obiskovalec = anonimen odtis (IP + brskalnik + dnevna sol), ki se vsak dan zamenja,
-- zato ne hranimo IP-jev in ne moremo slediti osebi čez dneve.
-- RLS vklopljen BREZ politik → piše in bere samo strežnik s tajnim ključem.

create table if not exists public.obiski (
  id bigint generated always as identity primary key,
  cas timestamptz not null default now(),
  obiskovalec text not null,
  ime text not null default 'ogled',          -- 'ogled' = ogled strani, sicer ime dogodka
  pot text not null,
  naslov text,
  vir_host text,
  vir text,                                    -- Google, LinkedIn, E-pošta, chatgpt.com …
  kanal text,                                  -- Iskalniki, Plačani oglasi, Družbena omrežja, E-pošta, AI asistenti, Napotitve, Direktno, Interno
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  drzava text,                                 -- ISO koda (SI, HR, DE …)
  regija text,
  mesto text,
  trg text,                                    -- Slovenija, Hrvaška, EX-YU, DACH, Skandinavija, Baltik, Vzhodna Evropa …
  jezik text,
  naprava text,
  brskalnik text,
  os text,
  zaslon int,
  vrednost numeric,
  podatki jsonb
);

create index if not exists obiski_cas_idx on public.obiski (cas);
create index if not exists obiski_obiskovalec_idx on public.obiski (obiskovalec, cas);

alter table public.obiski enable row level security;
revoke all on public.obiski from anon, authenticated;

-- Vse številke za administracijo v enem klicu.
-- p_od / p_do = lokalna datuma (Ljubljana), oba vključno.
create or replace function public.statistika_obiska(
  p_od date,
  p_do date,
  p_drzava text default null,
  p_trg text default null,
  p_kanal text default null,
  p_kampanja text default null
) returns jsonb
language sql stable security definer set search_path = public
as $$
with e as (
  select o.*, (o.cas at time zone 'Europe/Ljubljana') as lcas
  from obiski o
  where o.cas >= (p_od::timestamp at time zone 'Europe/Ljubljana')
    and o.cas <  ((p_do + 1)::timestamp at time zone 'Europe/Ljubljana')
),
seje as (
  select distinct on (obiskovalec)
    obiskovalec, pot as vstop, drzava, regija, mesto, coalesce(trg, 'Neznano') as trg,
    naprava, brskalnik, os, jezik
  from e order by obiskovalec, cas
),
izvor as (
  select distinct on (obiskovalec)
    obiskovalec, vir, kanal, utm_source, utm_medium, utm_campaign
  from e where kanal is distinct from 'Interno'
  order by obiskovalec, cas
),
s as (
  select se.*,
    coalesce(i.kanal, 'Direktno') as kanal,
    coalesce(i.vir, 'Direktno') as vir,
    i.utm_source, i.utm_medium, i.utm_campaign
  from seje se left join izvor i using (obiskovalec)
  where (p_drzava is null or se.drzava = p_drzava)
    and (p_trg is null or se.trg = p_trg)
    and (p_kanal is null or coalesce(i.kanal, 'Direktno') = p_kanal)
    and (p_kampanja is null or i.utm_campaign = p_kampanja)
),
f as (select e.* from e join s using (obiskovalec)),
sm as (
  select obiskovalec,
    count(*) filter (where ime = 'ogled') as ogledi,
    count(*) filter (where ime not in ('ogled', 'cas_na_strani')) as dogodki,
    bool_or(ime = 'ogled' and pot like '/program/%/%') as izdelek,
    bool_or(ime = 'add_to_cart') as kosarica,
    bool_or(ime = 'begin_checkout') as blagajna,
    bool_or(ime = 'purchase') as nakup,
    bool_or(ime = 'povprasevanje_poslano') as povp,
    bool_or(ime in ('povprasevanje_poslano', 'purchase', 'b2b_registracija', 'prijava_novice', 'prijava_zaposlitev')) as konv,
    coalesce(sum(vrednost) filter (where ime = 'purchase'), 0) as promet,
    coalesce(sum(vrednost) filter (where ime = 'cas_na_strani'), 0) as sekunde
  from f group by obiskovalec
),
x as (select s.*, sm.ogledi, sm.dogodki, sm.izdelek, sm.kosarica, sm.blagajna, sm.nakup, sm.povp, sm.konv, sm.promet, sm.sekunde
      from s join sm using (obiskovalec))
select jsonb_build_object(
  'povzetek', (select jsonb_build_object(
      'obiskovalci', count(*),
      'ogledi', coalesce(sum(ogledi), 0),
      'odbiti', count(*) filter (where ogledi <= 1 and dogodki = 0),
      'sekunde', coalesce(sum(sekunde), 0),
      'izdelek', count(*) filter (where izdelek),
      'kosarica', count(*) filter (where kosarica),
      'blagajna', count(*) filter (where blagajna),
      'nakupi', count(*) filter (where nakup),
      'povprasevanja', count(*) filter (where povp),
      'konverzije', count(*) filter (where konv),
      'promet', coalesce(sum(promet), 0)) from x),
  'zdaj', (select count(distinct obiskovalec) from obiski where cas > now() - interval '30 minutes'),
  'dnevi', (select coalesce(jsonb_agg(jsonb_build_object('d', d, 'o', o, 'g', g) order by d), '[]')
            from (select lcas::date as d, count(distinct obiskovalec) as o, count(*) filter (where ime = 'ogled') as g
                  from f group by 1) t),
  'ure', (select coalesce(jsonb_agg(jsonb_build_object('h', h, 'o', o) order by h), '[]')
          from (select extract(hour from lcas)::int as h, count(distinct obiskovalec) as o
                from f where ime = 'ogled' group by 1) t),
  'trgi', (select coalesce(jsonb_agg(to_jsonb(t) order by t.o desc), '[]') from (
      select trg as k, count(*) as o, sum(ogledi) as g, count(*) filter (where povp) as p,
             count(*) filter (where nakup) as n, sum(promet) as e, count(*) filter (where konv) as c
      from x group by trg) t),
  'drzave', (select coalesce(jsonb_agg(to_jsonb(t) order by t.o desc), '[]') from (
      select coalesce(drzava, '??') as k, max(trg) as trg, count(*) as o, sum(ogledi) as g,
             count(*) filter (where povp) as p, count(*) filter (where nakup) as n, sum(promet) as e,
             count(*) filter (where konv) as c, round(avg(sekunde)) as s
      from x group by 1) t),
  'mesta', (select coalesce(jsonb_agg(to_jsonb(t) order by t.o desc), '[]') from (
      select coalesce(drzava, '??') as d, coalesce(mesto, '—') as k, count(*) as o,
             count(*) filter (where konv) as c
      from x group by 1, 2 order by 3 desc limit 40) t),
  'kanali', (select coalesce(jsonb_agg(to_jsonb(t) order by t.o desc), '[]') from (
      select kanal as k, count(*) as o, sum(ogledi) as g, count(*) filter (where povp) as p,
             count(*) filter (where nakup) as n, sum(promet) as e, count(*) filter (where konv) as c
      from x group by 1) t),
  'viri', (select coalesce(jsonb_agg(to_jsonb(t) order by t.o desc), '[]') from (
      select vir as k, max(kanal) as kanal, count(*) as o, sum(ogledi) as g,
             count(*) filter (where povp) as p, count(*) filter (where nakup) as n,
             sum(promet) as e, count(*) filter (where konv) as c
      from x group by 1 order by 3 desc limit 30) t),
  'kampanje', (select coalesce(jsonb_agg(to_jsonb(t) order by t.o desc), '[]') from (
      select utm_campaign as k, string_agg(distinct coalesce(utm_source, '?') || ' / ' || coalesce(utm_medium, '?'), ', ') as vir,
             count(*) as o, sum(ogledi) as g, count(*) filter (where povp) as p,
             count(*) filter (where nakup) as n, sum(promet) as e, count(*) filter (where konv) as c,
             (select string_agg(dd, ', ') from (
                select coalesce(x2.drzava, '??') || ' ' || count(*) as dd from x x2
                where x2.utm_campaign = x.utm_campaign group by x2.drzava order by count(*) desc limit 5) z) as drzave
      from x where utm_campaign is not null group by utm_campaign) t),
  'vstopne', (select coalesce(jsonb_agg(to_jsonb(t) order by t.o desc), '[]') from (
      select vstop as k, count(*) as o, count(*) filter (where ogledi <= 1 and dogodki = 0) as b,
             count(*) filter (where konv) as c
      from x group by 1 order by 2 desc limit 25) t),
  'strani', (select coalesce(jsonb_agg(to_jsonb(t) order by t.g desc), '[]') from (
      select pot as k, max(naslov) as naslov,
             count(*) filter (where ime = 'ogled') as g,
             count(distinct obiskovalec) filter (where ime = 'ogled') as o,
             coalesce(sum(vrednost) filter (where ime = 'cas_na_strani'), 0) as s
      from f where ime in ('ogled', 'cas_na_strani') group by pot
      having count(*) filter (where ime = 'ogled') > 0
      order by 3 desc limit 40) t),
  'izdelki', (select coalesce(jsonb_agg(to_jsonb(t) order by t.g desc), '[]') from (
      select pot as k, max(naslov) as naslov,
             count(*) filter (where ime = 'ogled') as g,
             count(distinct obiskovalec) filter (where ime = 'ogled') as o,
             count(*) filter (where ime = 'add_to_cart') as a,
             count(distinct drzava) filter (where ime = 'ogled') as dr
      from f where pot like '/program/%/%' group by pot
      having count(*) filter (where ime = 'ogled') > 0
      order by 3 desc limit 40) t),
  'naprave', (select coalesce(jsonb_agg(to_jsonb(t) order by t.o desc), '[]') from (
      select coalesce(naprava, 'Neznano') as k, count(*) as o, count(*) filter (where konv) as c from x group by 1) t),
  'brskalniki', (select coalesce(jsonb_agg(to_jsonb(t) order by t.o desc), '[]') from (
      select coalesce(brskalnik, 'Drugo') as k, count(*) as o from x group by 1 order by 2 desc limit 10) t),
  'os', (select coalesce(jsonb_agg(to_jsonb(t) order by t.o desc), '[]') from (
      select coalesce(os, 'Drugo') as k, count(*) as o from x group by 1 order by 2 desc limit 10) t),
  'jeziki', (select coalesce(jsonb_agg(to_jsonb(t) order by t.o desc), '[]') from (
      select coalesce(lower(split_part(jezik, '-', 1)), '??') as k, count(*) as o, count(*) filter (where konv) as c
      from x group by 1 order by 2 desc limit 15) t),
  'dogodki', (select coalesce(jsonb_agg(to_jsonb(t) order by t.n desc), '[]') from (
      select ime as k, count(*) as n, count(distinct obiskovalec) as o, coalesce(sum(vrednost), 0) as e
      from f where ime not in ('ogled', 'cas_na_strani') group by 1) t)
);
$$;

revoke all on function public.statistika_obiska(date, date, text, text, text, text) from public, anon, authenticated;
