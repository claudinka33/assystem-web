-- VPC (redna prodajna cena iz Vasca) za B2B cene; B2C ostane na spletni ceni (cena_vasco).
alter table artikli add column if not exists cena_vpc numeric;
