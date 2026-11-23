-- Gamifikasi: streak / XP / level / target harian sebagai agregat monotonic.
-- Jalankan setelah 0001_init.sql.

create table if not exists public.gamification (
  profile_id uuid primary key references public.profiles (id) on delete cascade,
  xp integer not null default 0,
  level integer not null default 1,
  streak_count integer not null default 0,
  best_streak integer not null default 0,
  last_active_day text not null default '',
  daily_goal integer not null default 10,
  goal_claimed_day text not null default '',
  harian jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.gamification enable row level security;
revoke all on public.gamification from anon, authenticated;

-- Upsert monotonic: xp/best tidak pernah turun; streak mengikuti hari terbaru;
-- harian digabung per-tanggal dengan nilai maksimum.
create or replace function public.save_gamification(
  p_profile uuid,
  p_xp integer,
  p_level integer,
  p_streak integer,
  p_best integer,
  p_last_day text,
  p_goal integer,
  p_claimed text,
  p_harian jsonb
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  lama public.gamification%rowtype;
  gabung jsonb;
begin
  select * into lama from public.gamification where profile_id = p_profile;
  if not found then
    insert into public.gamification (
      profile_id, xp, level, streak_count, best_streak,
      last_active_day, daily_goal, goal_claimed_day, harian
    ) values (
      p_profile, p_xp, p_level, p_streak, p_best,
      p_last_day, p_goal, p_claimed, coalesce(p_harian, '{}'::jsonb)
    );
    return;
  end if;

  select coalesce(jsonb_object_agg(
    k,
    jsonb_build_object(
      'soal', greatest(
        coalesce((lama.harian -> k ->> 'soal')::int, 0),
        coalesce((p_harian -> k ->> 'soal')::int, 0)
      ),
      'xp', greatest(
        coalesce((lama.harian -> k ->> 'xp')::int, 0),
        coalesce((p_harian -> k ->> 'xp')::int, 0)
      )
    )
  ), '{}'::jsonb)
  into gabung
  from (
    select jsonb_object_keys(coalesce(lama.harian, '{}'::jsonb)) as k
    union
    select jsonb_object_keys(coalesce(p_harian, '{}'::jsonb)) as k
  ) keys;

  update public.gamification set
    xp = greatest(lama.xp, p_xp),
    level = greatest(lama.level, p_level),
    best_streak = greatest(lama.best_streak, p_best),
    streak_count = case when p_last_day >= lama.last_active_day then p_streak else lama.streak_count end,
    last_active_day = greatest(lama.last_active_day, p_last_day),
    daily_goal = p_goal,
    goal_claimed_day = case when p_last_day >= lama.last_active_day then p_claimed else lama.goal_claimed_day end,
    harian = gabung,
    updated_at = now()
  where profile_id = p_profile;
end;
$$;

-- get_learning_state: sertakan gamifikasi (coalesce default untuk profil lama).
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
    ), '{}'::jsonb),
    'gamifikasi', coalesce((
      select jsonb_build_object(
        'xp', g.xp, 'level', g.level, 'streakCount', g.streak_count, 'bestStreak', g.best_streak,
        'lastActiveDay', g.last_active_day, 'dailyGoal', g.daily_goal,
        'goalClaimedDay', g.goal_claimed_day, 'harian', g.harian
      ) from gamification g where g.profile_id = p_profile
    ), jsonb_build_object(
      'xp', 0, 'level', 1, 'streakCount', 0, 'bestStreak', 0,
      'lastActiveDay', '', 'dailyGoal', 10, 'goalClaimedDay', '', 'harian', '{}'::jsonb
    ))
  );
end;
$$;

-- record_attempt: terima p_id agar ID remote == ID lokal (hindari double-count).
drop function if exists public.record_attempt(uuid, uuid, text, text, text, text, text, text, boolean, numeric, integer);

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
  p_durasi integer,
  p_id uuid default gen_random_uuid()
) returns void
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
    p_id, p_profile, p_sesi, p_soal, p_topik, p_level, p_tipe, p_modul, p_bab,
    p_benar, p_skor, p_durasi
  )
  on conflict (id) do nothing;
end;
$$;

revoke all on function public.save_gamification(uuid, integer, integer, integer, integer, text, integer, text, jsonb) from public;
revoke all on function public.record_attempt(uuid, uuid, text, text, text, text, text, text, boolean, numeric, integer, uuid) from public;
grant execute on function public.save_gamification(uuid, integer, integer, integer, integer, text, integer, text, jsonb) to anon, authenticated;
grant execute on function public.record_attempt(uuid, uuid, text, text, text, text, text, text, boolean, numeric, integer, uuid) to anon, authenticated;