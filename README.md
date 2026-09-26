# Math Zone

A responsive Next.js and Supabase starter for a teacher's educational notes site. The name and initial design follow the owner's request. This is a working starter, **not a live published product**.

## Run locally

1. `npm install`
2. `cp .env.example .env.local`
3. For a visual demo, leave the Supabase fields blank and run `npm run dev`. Demo class, chapter and note content is hard-coded and labeled by this README only; admin sign-in stays disabled.
4. To connect a teacher-owned Supabase project, paste its URL and public anon key in `.env.local` (never commit this file). Run `supabase/migrations/001_schema.sql` in Supabase SQL editor.
5. Create the first admin in Supabase Auth, then set `profiles.role='admin'` for that user's ID via the SQL editor. Do not add public admin signup. Protect the Supabase project with MFA.
6. Set `NEXT_PUBLIC_SITE_URL` to the final URL and deploy Next.js to a teacher-approved host.

## Teachers and curriculum

Sabuj and Farhan are named by the owner as the teachers. Classes 5-10 and subject ordering are chosen by the owner; the live database still needs these records inserted. Teacher accounts and individual lesson authorship have not been established.

## Included

- Student home, classes, subjects, chapters, notes, video library, premium landing, filters, responsive mobile navigation.
- Admin email/password login, server-side role checks, overview, content creation, status change, deletion, class/subject/chapter creation, editing and deletion.
- Private Supabase Storage bucket with browser upload for PDF, image, video and DOCX, client-side file type/size checks and upload progress. Storage bucket limits repeat type/size checks. Document links are signed briefly, checked against publication and premium access.
- SQL schema, relational constraints, RLS and starter indexes.

## Limits before production

- Draft duplication, admin-only preview and browser-to-storage upload progress are implemented but still need live authenticated testing. Rich-text editing, student auth/favorites sync, analytics and payment integration remain to be built. Bookmarking is device-local only.
- Search currently filters content titles; chapter, subject, class text search and large catalog pagination need work.
- Content demonstration is illustrative, not a teacher's actual curriculum. Replace it with approved material. No real student count is claimed.
- Never upload paid documents to a public bucket. Premium access is locked until a real subscription system exists. Payment buttons are deliberately disabled.
- PDF iframe behavior differs across phones; include a fallback open link. DOCX documents may need preview conversion.
- Do not put teacher credentials in frontend code or chat. Confirm ownership and hosting before deployment.
