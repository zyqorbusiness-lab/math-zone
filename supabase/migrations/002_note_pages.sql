-- Ordered scanned notebook pages, stored as private material paths. Run once in Supabase SQL Editor.
alter table public.content add column if not exists file_urls text[] not null default '{}';
-- Existing single-file notes remain available through file_url; new pages use the ordered array.
create policy materials_public_pages on storage.objects for select to anon,authenticated using(bucket_id='materials' and exists(select 1 from public.content c where c.status='published' and c.premium=false and name=any(c.file_urls)));
create policy materials_premium_pages on storage.objects for select to authenticated using(bucket_id='materials' and public.has_premium() and exists(select 1 from public.content c where c.status='published' and c.premium=true and name=any(c.file_urls)));
