-- Prevodi spletne strani v angleščino (/en) in nemščino (/de).
-- Vsako slovensko besedilo, ki se izriše na tuji različici strani, dobi tu
-- svoj prevod (naredi ga Claude prek Anthropic API). Ko se slovensko besedilo
-- spremeni, ima nov ključ (vir_hash) in prevod se naredi sam.
-- Ročno popravljeni prevodi (rocno = true) se nikoli ne prepišejo.
-- Zaženi v SQL Editorju (assystem-web). Varno za ponovni zagon.

create table if not exists prevodi (
  id bigint generated always as identity primary key,
  jezik text not null check (jezik in ('en', 'de')),
  vir_hash text not null,            -- sha256 slovenskega besedila (prvih 40 znakov)
  vir text not null,                 -- slovensko besedilo
  prevod text not null,
  vrsta text not null default 'besedilo', -- besedilo | html
  izvor text,                        -- stran | odjemalec | metapodatki
  rocno boolean not null default false,   -- ročno popravljeno v adminu
  ustvarjeno timestamptz not null default now(),
  posodobljeno timestamptz not null default now(),
  unique (jezik, vir_hash)
);

create index if not exists prevodi_jezik_idx on prevodi (jezik, posodobljeno desc);

-- Dostop samo s strežnika (tajni ključ); javni ključ do tabele nima dostopa.
alter table prevodi enable row level security;

-- Iskanje več prevodov naenkrat (POST, zato ni omejitve dolžine naslova).
create or replace function prevodi_poisci(p_jezik text, p_hashi text[])
returns table (vir_hash text, prevod text)
language sql stable
security definer
set search_path = public
as $$
  select p.vir_hash, p.prevod from prevodi p
  where p.jezik = p_jezik and p.vir_hash = any(p_hashi);
$$;

revoke all on function prevodi_poisci(text, text[]) from public, anon, authenticated;
grant execute on function prevodi_poisci(text, text[]) to service_role;
