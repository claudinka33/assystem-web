-- E-novice: kampanje (osnutki, načrtovane, poslane, predloge)
-- Zaženi v Supabase SQL Editorju projekta assystem-web.

create table if not exists public.enovice_kampanje (
  id bigint generated always as identity primary key,
  naziv text,                              -- interno ime (neobvezno)
  zadeva text not null default '',
  predogled text,                          -- predogledno besedilo v nabiralniku
  posiljatelj text,
  nacin text not null default 'html' check (nacin in ('html', 'bloki')),
  html text,                               -- končni HTML (pri blokih se zgradi samodejno)
  bloki jsonb,                             -- vsebina iz blok urejevalnika
  segment_id text,
  segment_ime text,
  status text not null default 'osnutek'
    check (status in ('osnutek', 'nacrtovano', 'poslano', 'predloga')),
  nacrtovano_za timestamptz,
  poslano_ob timestamptz,
  resend_broadcast_id text,
  nadrejena_id bigint references public.enovice_kampanje(id) on delete set null, -- "ponovno neodprtim"
  statistika jsonb,                        -- zadnji povzetek iz Resenda
  statistika_ob timestamptz,
  ustvaril text,
  ustvarjeno timestamptz not null default now(),
  posodobljeno timestamptz not null default now()
);

create index if not exists enovice_kampanje_status_idx on public.enovice_kampanje (status, posodobljeno desc);

-- Dostop samo prek strežnika (service role obide RLS); javno nič.
alter table public.enovice_kampanje enable row level security;
