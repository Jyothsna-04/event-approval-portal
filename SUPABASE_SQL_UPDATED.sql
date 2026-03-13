-- ============================================================
-- GSSS Event Approval Portal — Supabase Schema
-- Run this in Supabase → SQL Editor → New Query
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── Profiles table (extends Supabase Auth users) ──────────────
create table if not exists profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text not null,
  email text,
  role text not null check (role in ('admin','organiser','social_media_admin','staff','principal')),
  department text,
  employee_id text,
  student_id text,
  social_handle text,
  created_at timestamptz default now()
);

-- Auto-create profile row when user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, role, department)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'New User'),
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'organiser'),
    new.raw_user_meta_data->>'department'
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── Events table ──────────────────────────────────────────────
create table if not exists events (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  organiser_id uuid references profiles(id) on delete set null,
  department text not null,
  college text default 'GSSS Institute of Engineering and Technology for Women',
  venue text not null,
  room_number text,
  start_date timestamptz not null,
  end_date timestamptz not null,
  expected_attendees int default 0,
  media_route text default 'both' check (media_route in ('admin','social_media_admin','both')),
  brochure_name text,
  brochure_data text, -- base64
  status text default 'pending' check (status in ('pending','approved','rejected','awaiting_media','media_uploaded','media_posted','website_updated','completed')),
  rejection_reason text,
  rejection_comment text,
  social_platforms text[] default '{}',
  post_description text,            -- social media post caption/description
  post_links jsonb default '[]',     -- [{platform, url}] shared social links
  approved_at timestamptz,
  media_deadline timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ── Notifications table ────────────────────────────────────────
create table if not exists notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade,
  event_id uuid references events(id) on delete cascade,
  type text not null,
  title text not null,
  message text,
  is_read boolean default false,
  created_at timestamptz default now()
);

-- ── Audit log table ────────────────────────────────────────────
create table if not exists event_audit_log (
  id uuid default uuid_generate_v4() primary key,
  event_id uuid references events(id) on delete cascade,
  user_id uuid references profiles(id) on delete set null,
  action text not null,
  note text,
  created_at timestamptz default now()
);

-- ── Row Level Security ─────────────────────────────────────────
alter table profiles enable row level security;
alter table events enable row level security;
alter table notifications enable row level security;
alter table event_audit_log enable row level security;

-- Profiles: users can read all, update their own
create policy "profiles_read_all" on profiles for select using (true);
create policy "profiles_update_own" on profiles for update using (auth.uid() = id);
create policy "profiles_insert_own" on profiles for insert with check (auth.uid() = id);
create policy "profiles_delete_admin" on profiles for delete using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Events: all authenticated users can read, organisers can insert, admins can update
create policy "events_read_authenticated" on events for select using (auth.uid() is not null);
create policy "events_insert_organiser" on events for insert with check (auth.uid() = organiser_id);
create policy "events_update_all" on events for update using (auth.uid() is not null);

-- Notifications: users see only their own
create policy "notifs_own" on notifications for all using (auth.uid() = user_id);
create policy "notifs_insert" on notifications for insert with check (auth.uid() is not null);

-- Audit log: all authenticated users can read and insert
create policy "audit_read" on event_audit_log for select using (auth.uid() is not null);
create policy "audit_insert" on event_audit_log for insert with check (auth.uid() is not null);

-- ── Enable Realtime ────────────────────────────────────────────
alter publication supabase_realtime add table events;
alter publication supabase_realtime add table notifications;

-- ── Done! ─────────────────────────────────────────────────────
-- Your database is ready for the GSSS Event Approval Portal.
