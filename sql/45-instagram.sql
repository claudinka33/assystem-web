-- Zasebna tabela za Instagram žeton (@assystem.si).
-- RLS vklopljen BREZ politik → bere in piše samo tajni ključ (strežnik).
create table if not exists public.instagram_zeton (
  id int primary key default 1 check (id = 1),
  token text not null,
  osvezen timestamptz not null default now()
);
alter table public.instagram_zeton enable row level security;
revoke all on public.instagram_zeton from anon, authenticated;

-- Žeton prilepi med enojna narekovaja:
insert into public.instagram_zeton (id, token, osvezen)
values (1, 'PRILEPI_ZETON_TUKAJ', now())
on conflict (id) do update set token = excluded.token, osvezen = now();
