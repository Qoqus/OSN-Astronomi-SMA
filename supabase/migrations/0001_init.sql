-- Profil berbasis nama: tabel tertutup untuk anon, akses hanya lewat RPC SECURITY DEFINER.
-- Jalankan di Supabase SQL Editor (atau `supabase db push`).

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  normalized_name text not null unique,
  display_name text not null,
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

create table if not exists public.chapter_progress (
  profile_id uuid not null references public.profiles (id) on delete cascade,
  bab_id text not null,
  dibuka_pada timestamptz not null default now(),
  refleksi jsonb not null default '{}'::jsonb,
  checkpoint jsonb not null default '{}'::jsonb,
  sub_bab_selesai text[] not null default '{}',
  primary key (profile_id, bab_id)
);

create table if not exists public.attempts (
  id uuid primary key,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  sesi_id uuid not null,
  soal_id text not null,
  topik text not null,
  level text not null,
  tipe text not null,
  modul text not null,
  bab_id text,
  benar boolean not null,
  skor numeric(4, 2) not null,
  durasi_ms integer,
  created_at timestamptz not null default now()
);

create index if not exists attempts_profil_waktu
  on public.attempts (profile_id, created_at desc);

create table if not exists public.achievement_unlocks (
  profile_id uuid not null references public.profiles (id) on delete cascade,
  achievement_id text not null,
  unlocked_at timestamptz not null default now(),
  primary key (profile_id, achievement_id)
);

alter table public.profiles enable row level security;
alter table public.chapter_progress enable row level security;
alter table public.attempts enable row level security;
alter table public.achievement_unlocks enable row level security;

-- Tanpa policy: anon tidak bisa membaca/menulis tabel langsung.
revoke all on public.profiles from anon, authenticated;
revoke all on public.chapter_progress from anon, authenticated;
revoke all on public.attempts from anon, authenticated;
revoke all on public.achievement_unlocks from anon, authenticated;

create or replace function public.login_or_create_profile(p_nama text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tampil text;
  v_norm text;
  v_id uuid;
begin
  v_tampil := btrim(regexp_replace(p_nama, '\s+', ' ', 'g'));
  if length(v_tampil) < 2 then
    raise exception 'Nama minimal dua huruf';
  end if;
  v_norm := lower(v_tampil);

  insert into profiles (normalized_name, display_name)
  values (v_norm, v_tampil)
  on conflict (normalized_name) do update
    set last_seen_at = now()
  returning id into v_id;

  return jsonb_build_object(
    'id', v_id,
    'display_name', (select p.display_name from profiles p where p.id = v_id)
  );
end;
$$;

create or replace function public.get_learning_state(p_profile uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  return jsonb_build_object(
    'bab', coalesce((
      select jsonb_object_agg(cp.bab_id, jsonb_build_object(
        'dibukaPada', (extract(epoch from cp.dibuka_pada) * 1000)::bigint,
        'refleksi', cp.refleksi,
        'checkpoint', cp.checkpoint,
        'subBabSelesai', to_jsonb(cp.sub_bab_selesai)
      ))
      from chapter_progress cp
      where cp.profile_id = p_profile
    ), '{}'::jsonb),
    'attempts', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id,
        'sesiId', a.sesi_id,
        'soalId', a.soal_id,
        'topik', a.topik,
        'level', a.level,
        'tipe', a.tipe,
        'modul', a.modul,
        'babId', a.bab_id,
        'saat', (extract(epoch from a.created_at) * 1000)::bigint,
        'benar', a.benar,
        'skor', a.skor,
        'durasiMs', a.durasi_ms
      ) order by a.created_at)
      from (
        select * from attempts
        where profile_id = p_profile
        order by created_at desc
        limit 500
      ) a
    ), '[]'::jsonb),
    'achievements', coalesce((
      select jsonb_object_agg(
        au.achievement_id,
        (extract(epoch from au.unlocked_at) * 1000)::bigint
      )
      from achievement_unlocks au
      where au.profile_id = p_profile
    ), '{}'::jsonb)
  );
end;
$$;

create or replace function public.record_attempt(
  p_profile uuid,
  p_sesi uuid,
  p_soal text,
  p_topik text,
  p_level text,
  p_tipe text,
  p_modul text,
  p_bab text,
  p_benar boolean,
  p_skor numeric,
  p_durasi integer
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (select 1 from profiles where id = p_profile) then
    raise exception 'Profil tidak dikenal';
  end if;

  insert into attempts (
    id, profile_id, sesi_id, soal_id, topik, level, tipe, modul, bab_id,
    benar, skor, durasi_ms
  ) values (
    gen_random_uuid(), p_profile, p_sesi, p_soal, p_topik, p_level, p_tipe, p_modul, p_bab,
    p_benar, p_skor, p_durasi
  );
end;
$$;

create or replace function public.save_chapter_progress(
  p_profile uuid,
  p_bab text,
  p_refleksi jsonb,
  p_checkpoint jsonb,
  p_subbab text[]
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (select 1 from profiles where id = p_profile) then
    raise exception 'Profil tidak dikenal';
  end if;

  insert into chapter_progress (
    profile_id, bab_id, dibuka_pada, refleksi, checkpoint, sub_bab_selesai
  ) values (
    p_profile, p_bab, now(), coalesce(p_refleksi, '{}'::jsonb),
    coalesce(p_checkpoint, '{}'::jsonb), coalesce(p_subbab, '{}')
  )
  on conflict (profile_id, bab_id) do update
    set dibuka_pada = now(),
        refleksi = excluded.refleksi,
        checkpoint = excluded.checkpoint,
        sub_bab_selesai = excluded.sub_bab_selesai;
end;
$$;

create or replace function public.unlock_achievement(
  p_profile uuid,
  p_capaian text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (select 1 from profiles where id = p_profile) then
    raise exception 'Profil tidak dikenal';
  end if;

  insert into achievement_unlocks (profile_id, achievement_id)
  values (p_profile, p_capaian)
  on conflict (profile_id, achievement_id) do nothing;
end;
$$;

revoke all on function public.login_or_create_profile(text) from public;
revoke all on function public.get_learning_state(uuid) from public;
revoke all on function public.record_attempt(uuid, uuid, text, text, text, text, text, text, boolean, numeric, integer) from public;
revoke all on function public.save_chapter_progress(uuid, text, jsonb, jsonb, text[]) from public;
revoke all on function public.unlock_achievement(uuid, text) from public;

grant execute on function public.login_or_create_profile(text) to anon, authenticated;
grant execute on function public.get_learning_state(uuid) to anon, authenticated;
grant execute on function public.record_attempt(uuid, uuid, text, text, text, text, text, text, boolean, numeric, integer) to anon, authenticated;
grant execute on function public.save_chapter_progress(uuid, text, jsonb, jsonb, text[]) to anon, authenticated;
grant execute on function public.unlock_achievement(uuid, text) to anon, authenticated;
