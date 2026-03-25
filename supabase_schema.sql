-- =============================================================
-- SPENTREE — Supabase Database Schema
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard)
-- =============================================================

-- Drop existing tables (in reverse-dependency order) to start fresh
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();
drop table if exists public.user_badges cascade;
drop table if exists public.user_game_state cascade;
drop table if exists public.savings_goals cascade;
drop table if exists public.expenses cascade;
drop table if exists public.profiles cascade;

-- 1. PROFILES
-- Extends auth.users with app-specific fields
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  email text not null default '',
  forest_name text not null default '',
  daily_budget numeric not null default 0,
  tree_species text not null default 'banyan' check (tree_species in ('oak', 'banyan', 'peepal')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);


-- 2. EXPENSES
create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount numeric not null default 0,
  category text not null default 'other',
  note text not null default '',
  date date not null default current_date,
  created_at timestamptz not null default now()
);

create index idx_expenses_user_id on public.expenses(user_id);
create index idx_expenses_date on public.expenses(date);

alter table public.expenses enable row level security;

create policy "Users can view own expenses"
  on public.expenses for select
  using (auth.uid() = user_id);

create policy "Users can insert own expenses"
  on public.expenses for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own expenses"
  on public.expenses for delete
  using (auth.uid() = user_id);

create policy "Users can update own expenses"
  on public.expenses for update
  using (auth.uid() = user_id);


-- 3. SAVINGS GOALS
create table if not exists public.savings_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  target_amount numeric not null default 0,
  saved_amount numeric not null default 0,
  created_at timestamptz not null default now()
);

create index idx_savings_goals_user_id on public.savings_goals(user_id);

alter table public.savings_goals enable row level security;

create policy "Users can view own goals"
  on public.savings_goals for select
  using (auth.uid() = user_id);

create policy "Users can insert own goals"
  on public.savings_goals for insert
  with check (auth.uid() = user_id);

create policy "Users can update own goals"
  on public.savings_goals for update
  using (auth.uid() = user_id);

create policy "Users can delete own goals"
  on public.savings_goals for delete
  using (auth.uid() = user_id);


-- 4. USER GAME STATE (XP, Level, Streak, Locker)
create table if not exists public.user_game_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  xp integer not null default 0,
  level integer not null default 1,
  streak integer not null default 0,
  locker_amount numeric not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.user_game_state enable row level security;

create policy "Users can view own game state"
  on public.user_game_state for select
  using (auth.uid() = user_id);

create policy "Users can insert own game state"
  on public.user_game_state for insert
  with check (auth.uid() = user_id);

create policy "Users can update own game state"
  on public.user_game_state for update
  using (auth.uid() = user_id);


-- 5. USER BADGES
create table if not exists public.user_badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  badge_id text not null,
  earned_at timestamptz not null default now(),
  unique (user_id, badge_id)
);

create index idx_user_badges_user_id on public.user_badges(user_id);

alter table public.user_badges enable row level security;

create policy "Users can view own badges"
  on public.user_badges for select
  using (auth.uid() = user_id);

create policy "Users can insert own badges"
  on public.user_badges for insert
  with check (auth.uid() = user_id);


-- =============================================================
-- HELPER: Auto-create profile + game state on signup
-- =============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', ''),
    coalesce(new.email, '')
  );

  insert into public.user_game_state (user_id)
  values (new.id);

  return new;
end;
$$;

-- Trigger: fires after each new auth.users row
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
