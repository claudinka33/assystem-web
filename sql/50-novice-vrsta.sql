-- Vrsta članka (Novost, Aktualno, How to, Nasvet)
alter table public.novice add column if not exists vrsta text not null default 'aktualno';
