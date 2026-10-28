-- 3 TESTNA B2B naročila za AS SYSTEM (claudia.seidl@as-system.si). NE gredo v Vasco (vasco_predracun = 'TEST').
-- Zaženi v SQL Editorju (assystem-web). Brisanje na dnu datoteke.
do $$
declare
  k record;
  n_id bigint;
  st int := 0;
  a1 record; a2 record; a3 record;
begin
  select * into k from b2b_kupci where email = 'claudia.seidl@as-system.si' limit 1;
  if k.id is null then raise exception 'B2B kupec claudia.seidl@as-system.si ne obstaja'; end if;
  select id, sifra, naziv, dimenzija into a1 from artikli where sifra = 'TXH708006010';
  select id, sifra, naziv, dimenzija into a2 from artikli where sifra = 'TXH708008510';
  select id, sifra, naziv, dimenzija into a3 from artikli where sifra = 'AFMTXH7080075';

  -- 1) sedež, odposlano
  insert into narocila (b2b_kupec_id, vasco_partner, prodajalna, tip, kontakt_ime, kontakt_email, kontakt_telefon,
    naslov_racun, naslov_dostava, neto, ddv, postnina, popust, skupaj, valuta, nacin_placila, status_placila, nacin_dostave,
    status, opomba_kupca, vasco_predracun, ustvarjeno)
  values (k.id, k.vasco_partner, null, 'B2B', k.ime, k.email, k.telefon,
    jsonb_build_object('naziv', k.vasco_naziv, 'ulica', k.vasco_naslov, 'posta', k.vasco_posta),
    jsonb_build_object('naziv', k.vasco_naziv, 'ulica', k.vasco_naslov, 'posta', k.vasco_posta),
    127.03, 27.95, 0, 0, 154.98, 'EUR', 'racun', 'neplačano', 'Dostava — Pošta Slovenije',
    'odposlano', 'TESTNO naročilo 1', 'TEST', now() - interval '12 days')
  returning id into n_id;
  update narocila set stevilka = 'TEST-' || lpad(n_id::text, 5, '0') where id = n_id;
  insert into narocilo_postavke (narocilo_id, artikel_id, sifra, naziv, kolicina, enota, cena_neto, ddv_stopnja, vrstica_neto) values
    (n_id, a1.id, a1.sifra, a1.naziv || ' ' || coalesce(a1.dimenzija, ''), 2, 'pak (100 kos)', 42.38, 22, 84.76),
    (n_id, a2.id, a2.sifra, a2.naziv || ' ' || coalesce(a2.dimenzija, ''), 1, 'pak (100 kos)', 42.27, 22, 42.27);

  -- 2) poslovalnica Bistrica ob Sotli, v pripravi
  insert into narocila (b2b_kupec_id, vasco_partner, prodajalna, tip, kontakt_ime, kontakt_email, kontakt_telefon,
    naslov_racun, naslov_dostava, neto, ddv, postnina, popust, skupaj, valuta, nacin_placila, status_placila, nacin_dostave,
    status, opomba_kupca, vasco_predracun, ustvarjeno)
  values (k.id, k.vasco_partner, 6, 'B2B', k.ime, k.email, k.telefon,
    jsonb_build_object('naziv', k.vasco_naziv, 'ulica', k.vasco_naslov, 'posta', k.vasco_posta),
    jsonb_build_object('naziv', 'PE BISTRICA OB SOTLI', 'ulica', 'HRASTJE OB BISTRICI 2', 'posta', '3256 Bistrica ob Sotli'),
    56.70, 12.47, 0, 0, 69.17, 'EUR', 'racun', 'neplačano', 'Dostava — Pošta Slovenije',
    'v pripravi', 'TESTNO naročilo 2 — naročilnica 4512', 'TEST', now() - interval '3 days')
  returning id into n_id;
  update narocila set stevilka = 'TEST-' || lpad(n_id::text, 5, '0') where id = n_id;
  insert into narocilo_postavke (narocilo_id, artikel_id, sifra, naziv, kolicina, enota, cena_neto, ddv_stopnja, vrstica_neto) values
    (n_id, a3.id, a3.sifra, a3.naziv || ' ' || coalesce(a3.dimenzija, ''), 10, 'pak (10 kos)', 5.67, 22, 56.70);

  -- 3) sedež, novo (danes)
  insert into narocila (b2b_kupec_id, vasco_partner, prodajalna, tip, kontakt_ime, kontakt_email, kontakt_telefon,
    naslov_racun, naslov_dostava, neto, ddv, postnina, popust, skupaj, valuta, nacin_placila, status_placila, nacin_dostave,
    status, opomba_kupca, vasco_predracun, ustvarjeno)
  values (k.id, k.vasco_partner, null, 'B2B', k.ime, k.email, k.telefon,
    jsonb_build_object('naziv', k.vasco_naziv, 'ulica', k.vasco_naslov, 'posta', k.vasco_posta),
    jsonb_build_object('naziv', k.vasco_naziv, 'ulica', k.vasco_naslov, 'posta', k.vasco_posta),
    423.80, 93.24, 0, 0, 517.04, 'EUR', 'racun', 'neplačano', 'Osebni prevzem — Šmarje pri Jelšah',
    'novo', 'TESTNO naročilo 3', 'TEST', now())
  returning id into n_id;
  update narocila set stevilka = 'TEST-' || lpad(n_id::text, 5, '0') where id = n_id;
  insert into narocilo_postavke (narocilo_id, artikel_id, sifra, naziv, kolicina, enota, cena_neto, ddv_stopnja, vrstica_neto) values
    (n_id, a1.id, a1.sifra, a1.naziv || ' ' || coalesce(a1.dimenzija, ''), 10, 'pak (100 kos)', 42.38, 22, 423.80);
end $$;

-- BRISANJE testnih naročil (ko ne rabiš več):
-- delete from narocilo_postavke where narocilo_id in (select id from narocila where vasco_predracun = 'TEST');
-- delete from narocila where vasco_predracun = 'TEST';
