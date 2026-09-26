-- One time: a note can belong to a chapter or directly to a subject's pages.
alter table public.content alter column chapter_id drop not null;
create index if not exists content_subject_pages_idx on public.content(subject_id,status,created_at desc) where chapter_id is null;
