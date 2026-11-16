-- Zgodovina odgovorov pri povpraševanjih (admin → Povpraševanja)
alter table povprasevanja add column if not exists odgovori jsonb not null default '[]'::jsonb;
