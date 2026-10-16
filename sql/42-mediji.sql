-- Videi izdelkov (YouTube) in dokumenti brez izdelka (katalogi, letaki, certifikati)
alter table public.izdelki add column if not exists videi jsonb not null default '[]'::jsonb;
alter table public.dokumenti alter column izdelek_id drop not null;
