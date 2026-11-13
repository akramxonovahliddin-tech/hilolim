-- Hilolim: qabul arizalari jadvali
create table if not exists public.arizalar (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  ism text not null check (char_length(ism) between 1 and 50),
  familiya text not null check (char_length(familiya) between 1 and 50),
  telefon text not null check (char_length(telefon) between 9 and 20),
  kurs text not null check (kurs in ('fonetika', 'grammatika')),
  telegram_user_id bigint
);
alter table public.arizalar enable row level security;
revoke all on table public.arizalar from anon, authenticated;
create index if not exists arizalar_created_at_idx on public.arizalar (created_at desc);