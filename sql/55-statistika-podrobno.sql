-- Podrobna statistika obiska: B2B kupci po podjetjih, iskanje na strani, obrazci, kliki, globina branja.
-- Zaženi v Supabase SQL Editorju (assystem-web). Varno za ponovni zagon.

-- Prijavljen B2B kupec ob obisku (samo za prijavljene poslovne uporabnike)
alter table public.obiski add column if not exists b2b_kupec uuid;
alter table public.obiski add column if not exists b2b_podjetje text;
create index if not exists obiski_b2b_idx on public.obiski (b2b_kupec, cas) where b2b_kupec is not null;
create index if not exists obiski_ime_cas_idx on public.obiski (ime, cas);

create or replace function public.statistika_podrobno(p_od date, p_do date)
returns jsonb
language sql stable security definer set search_path = public
as $$
with f as (
  select o.*
  from obiski o
  where o.cas >= (p_od::timestamp at time zone 'Europe/Ljubljana')
    and o.cas <  ((p_do + 1)::timestamp at time zone 'Europe/Ljubljana')
),
-- B2B: aktivnost po podjetjih
b2b as (
  select b2b_kupec,
         max(b2b_podjetje) as podjetje,
         max(cas) as zadnji,
         count(distinct (cas at time zone 'Europe/Ljubljana')::date) as dni,
         count(*) filter (where ime = 'ogled') as ogledi,
         count(*) filter (where ime = 'ogled' and pot ~ '^(/(en|de|hr))?/program/[^/]+/[^/]+') as izdelki,
         count(*) filter (where ime = 'add_to_cart') as kosarica,
         count(*) filter (where ime = 'purchase') as nakupi,
         coalesce(sum(vrednost) filter (where ime = 'purchase'), 0) as promet,
         coalesce(sum(vrednost) filter (where ime = 'cas_na_strani'), 0) as sekunde
  from f where b2b_kupec is not null
  group by b2b_kupec
),
b2b_izd as (
  select b2b_kupec, naslov, count(*) as n,
         row_number() over (partition by b2b_kupec order by count(*) desc, max(cas) desc) as r
  from f
  where b2b_kupec is not null and ime = 'ogled' and pot ~ '^(/(en|de|hr))?/program/[^/]+/[^/]+' and naslov is not null
  group by b2b_kupec, naslov
),
-- odprte B2B košarice (artikli v košarici, naročilo še ni oddano)
kos as (
  select k.id, coalesce(k.vasco_naziv, k.podjetje) as podjetje, k.ime, k.email, k.telefon,
         jsonb_array_length(c.postavke) as artiklov, c.posodobljeno
  from b2b_kosarice c join b2b_kupci k on k.id = c.kupec_id
  where jsonb_array_length(c.postavke) > 0
    and k.email !~* '@as-system\.si$'
),
isk as (
  select lower(trim(podatki->>'q')) as q,
         count(*) as n,
         count(distinct obiskovalec) as o,
         round(avg(nullif(podatki->>'zadetki', '')::numeric), 1) as zadetki
  from f where ime = 'iskanje' and coalesce(podatki->>'q', '') <> ''
  group by 1
),
obr as (
  select podatki->>'obrazec' as obrazec,
         count(distinct obiskovalec) filter (where ime = 'obrazec_zacet') as zaceli,
         count(distinct obiskovalec) filter (where ime = 'obrazec_oddan') as oddali
  from f where ime in ('obrazec_zacet', 'obrazec_oddan') and podatki ? 'obrazec'
  group by 1
),
obr_polje as (
  select podatki->>'obrazec' as obrazec, podatki->>'polje' as polje, count(*) as n,
         row_number() over (partition by podatki->>'obrazec' order by count(*) desc) as r
  from f where ime = 'obrazec_opuscen' and coalesce(podatki->>'polje', '') <> ''
  group by 1, 2
),
kl as (
  select case ime when 'klik_telefon' then 'telefon' when 'klik_email' then 'email'
                  when 'katalog_prenos' then 'pdf' else coalesce(podatki->>'vrsta', 'drugo') end as vrsta,
         coalesce(case ime when 'klik_email' then podatki->>'naslov'
                           when 'katalog_prenos' then podatki->>'datoteka'
                           when 'klik_telefon' then pot
                           else podatki->>'cilj' end, '—') as cilj,
         count(*) as n, count(distinct obiskovalec) as o
  from f where ime in ('klik_telefon', 'klik_email', 'katalog_prenos', 'klik')
  group by 1, 2
),
glob as (
  -- največja globina na obiskovalca in stran, nato povprečje po straneh
  select pot, max(naslov) as naslov, count(*) as o, round(avg(g)) as globina, round(avg(s)) as sekunde,
         round(100.0 * count(*) filter (where g >= 75) / nullif(count(*), 0)) as do_konca
  from (
    select c.obiskovalec, c.pot, max((c.podatki->>'globina')::int) as g, sum(c.vrednost) as s,
           (select max(n.naslov) from f n where n.ime = 'ogled' and n.pot = c.pot) as naslov
    from f c
    where c.ime = 'cas_na_strani' and c.podatki ? 'globina'
    group by c.obiskovalec, c.pot
  ) t
  group by pot
)
select jsonb_build_object(
  'b2b', (select coalesce(jsonb_agg(jsonb_build_object(
            'id', b.b2b_kupec, 'podjetje', b.podjetje, 'zadnji', b.zadnji, 'dni', b.dni, 'ogledi', b.ogledi,
            'izdelki', b.izdelki, 'kosarica', b.kosarica, 'nakupi', b.nakupi, 'promet', b.promet, 'sekunde', b.sekunde,
            'top', (select coalesce(jsonb_agg(i.naslov order by i.r), '[]') from b2b_izd i where i.b2b_kupec = b.b2b_kupec and i.r <= 3),
            'email', k.email, 'telefon', k.telefon, 'ime', k.ime
          ) order by b.zadnji desc), '[]')
          from b2b b left join b2b_kupci k on k.id = b.b2b_kupec),
  'kosarice', (select coalesce(jsonb_agg(to_jsonb(kos) order by kos.posodobljeno desc), '[]') from kos),
  'iskanje', (select coalesce(jsonb_agg(to_jsonb(t) order by t.n desc), '[]') from (select * from isk order by n desc limit 30) t),
  'brez_zadetkov', (select coalesce(jsonb_agg(to_jsonb(t) order by t.n desc), '[]') from (select * from isk where zadetki = 0 order by n desc limit 20) t),
  'obrazci', (select coalesce(jsonb_agg(jsonb_build_object(
                'obrazec', o.obrazec, 'zaceli', o.zaceli, 'oddali', o.oddali,
                'polje', (select p.polje from obr_polje p where p.obrazec = o.obrazec and p.r = 1),
                'polje_n', (select p.n from obr_polje p where p.obrazec = o.obrazec and p.r = 1)
              ) order by o.zaceli desc), '[]') from obr o),
  'kliki', (select coalesce(jsonb_agg(to_jsonb(t) order by t.n desc), '[]') from (select * from kl order by n desc limit 40) t),
  'globina', (select coalesce(jsonb_agg(to_jsonb(t) order by t.o desc), '[]') from (select * from glob order by o desc limit 20) t)
);
$$;

revoke all on function public.statistika_podrobno(date, date) from public, anon, authenticated;
