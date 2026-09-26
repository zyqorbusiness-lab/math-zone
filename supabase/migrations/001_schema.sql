-- Run in a Supabase project owned by the teacher. Bootstrap the first admin through SQL after creating their Auth account.
create extension if not exists pgcrypto;
create table public.profiles(id uuid primary key references auth.users(id) on delete cascade,name text,role text not null default 'student' check(role in ('student','admin')),created_at timestamptz default now());
create table public.classes(id uuid primary key default gen_random_uuid(),name text not null,slug text not null unique,description text,thumbnail_url text,sort_order integer not null default 0,created_at timestamptz default now());
create table public.subjects(id uuid primary key default gen_random_uuid(),class_id uuid not null references public.classes on delete cascade,name text not null,slug text not null,description text,icon text,sort_order integer not null default 0,created_at timestamptz default now(),unique(class_id,slug));
create table public.chapters(id uuid primary key default gen_random_uuid(),subject_id uuid not null references public.subjects on delete cascade,title text not null,slug text not null,description text,thumbnail_url text,sort_order integer not null default 0,created_at timestamptz default now(),unique(subject_id,slug));
create table public.content(id uuid primary key default gen_random_uuid(),title text not null,slug text not null unique,description text,type text not null check(type in ('note','video','image','resource')),class_id uuid not null references public.classes on delete cascade,subject_id uuid not null references public.subjects on delete cascade,chapter_id uuid not null references public.chapters on delete cascade,topic text,thumbnail_url text,file_url text,video_url text,status text not null default 'draft' check(status in ('draft','published')),featured boolean default false,premium boolean default false,allow_download boolean default true,views integer not null default 0 check(views>=0),duration_seconds integer,tags text[],created_at timestamptz not null default now(),updated_at timestamptz not null default now());
create table public.favorites(user_id uuid references auth.users on delete cascade,content_id uuid references public.content on delete cascade,primary key(user_id,content_id));
create table public.premium_access(user_id uuid primary key references auth.users on delete cascade,plan text not null,status text not null check(status in ('active','expired','cancelled')),started_at timestamptz,expires_at timestamptz);
create table public.activity(id bigint generated always as identity primary key,actor_id uuid references auth.users on delete set null,action text not null,entity_type text not null,entity_id uuid,created_at timestamptz default now());
create index content_public_idx on public.content(status,created_at desc);create index content_chapter_idx on public.content(chapter_id,status);create index content_search_idx on public.content using gin(to_tsvector('english',coalesce(title,'')||' '||coalesce(description,'')));
create or replace function public.is_admin() returns boolean language sql stable security definer set search_path=public as $$ select exists(select 1 from public.profiles where id=(select auth.uid()) and role='admin') $$;
create or replace function public.has_premium() returns boolean language sql stable security definer set search_path=public as $$select exists(select 1 from public.premium_access where user_id=(select auth.uid()) and status='active' and (expires_at is null or expires_at>now()))$$;
create or replace function public.touch_updated() returns trigger language plpgsql as $$ begin new.updated_at=now();return new;end $$;
create trigger touch_content before update on public.content for each row execute function public.touch_updated();
-- Public catalog exposes metadata only. File links for premium content must be stored in a PRIVATE bucket and signed server-side after access verification. This starter does not serve premium files.
alter table public.profiles enable row level security;alter table public.classes enable row level security;alter table public.subjects enable row level security;alter table public.chapters enable row level security;alter table public.content enable row level security;alter table public.favorites enable row level security;alter table public.premium_access enable row level security;alter table public.activity enable row level security;
create policy profile_self_read on public.profiles for select to authenticated using (id=(select auth.uid()) or public.is_admin());
create policy profile_admin_write on public.profiles for all to authenticated using(public.is_admin()) with check(public.is_admin());
create policy classes_read on public.classes for select to anon,authenticated using(true);
create policy subjects_read on public.subjects for select to anon,authenticated using(true);
create policy chapters_read on public.chapters for select to anon,authenticated using(true);
create policy content_read on public.content for select to anon,authenticated using(status='published' or public.is_admin());
create policy favorites_own on public.favorites for all to authenticated using(user_id=(select auth.uid())) with check(user_id=(select auth.uid()));
create policy premium_own on public.premium_access for select to authenticated using(user_id=(select auth.uid()) or public.is_admin());
create policy premium_admin_write on public.premium_access for all to authenticated using(public.is_admin()) with check(public.is_admin());
create policy activity_admin_read on public.activity for select to authenticated using(public.is_admin());
create policy activity_admin_write on public.activity for insert to authenticated with check(public.is_admin());
create policy classes_admin on public.classes for all to authenticated using(public.is_admin()) with check(public.is_admin());
create policy subjects_admin on public.subjects for all to authenticated using(public.is_admin()) with check(public.is_admin());
create policy chapters_admin on public.chapters for all to authenticated using(public.is_admin()) with check(public.is_admin());
create policy content_admin on public.content for all to authenticated using(public.is_admin()) with check(public.is_admin());
-- Storage bucket is private to prevent guessing file URLs. Admin writes; signed access must be implemented before student documents are served.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values ('materials','materials',false,52428800,array['application/pdf','image/jpeg','image/png','image/webp','video/mp4','application/vnd.openxmlformats-officedocument.wordprocessingml.document']) on conflict(id) do nothing;
create policy materials_admin_insert on storage.objects for insert to authenticated with check(bucket_id='materials' and public.is_admin());
create policy materials_admin_select on storage.objects for select to authenticated using(bucket_id='materials' and public.is_admin());
create policy materials_admin_update on storage.objects for update to authenticated using(bucket_id='materials' and public.is_admin()) with check(bucket_id='materials' and public.is_admin());
create policy materials_admin_delete on storage.objects for delete to authenticated using(bucket_id='materials' and public.is_admin());
-- Prevent students changing privileged records via service-role APIs. Never expose the service-role key in the browser.

create policy materials_public_free on storage.objects for select to anon,authenticated using(bucket_id='materials' and exists(select 1 from public.content c where c.status='published' and c.premium=false and c.file_url=name));
create policy materials_premium_member on storage.objects for select to authenticated using(bucket_id='materials' and public.has_premium() and exists(select 1 from public.content c where c.status='published' and c.premium=true and c.file_url=name));
