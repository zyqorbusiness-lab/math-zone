import Link from 'next/link';import {PageShell} from '@/components/page-shell';import {seo} from '@/lib/seo';import {classes} from '@/lib/data';
export const metadata=seo('Free Notes for Class 5-10 Maths and School Subjects | Numivra Math','Free notes for Classes 5 to 10 on Numivra Math. Browse mathematics and school subject notes by class, subject and chapter.','/free-notes');
export const dynamic='force-dynamic';
export default async function FreeNotes(){const cl=await classes();return <PageShell title="Free Notes for Classes 5-10" path="/free-notes" intro="Numivra Math, formerly Math Zone, has free notes for Classes 5 to 10. Pick your class, then a subject and a chapter.">
<h2>Choose your class</h2>
<ul>{cl.map(c=><li key={c.id}><Link href={`/classes/${c.slug}`}>{c.name} notes</Link></li>)}</ul>
<h2>How the notes are organised</h2>
<p>Each class has subjects, and each subject has chapters. Mathematics comes first. Class 5 notes are grouped by page range. Classes 6 to 10 can use page ranges or K.D chapter numbers, so you can match a note to your textbook.</p>
<h2>Free, with no ads</h2>
<p>All notes are free to read. No sign-up is needed. Some notes include a PDF or photos you can read in the page.</p>
<h2>Find a topic fast</h2>
<p>Use <Link href="/search">search</Link> to find notes by topic, or browse <Link href="/classes">all classes</Link>. New notes are added by teachers Sabuj and Farhan, so some chapters may still be empty. Read more <Link href="/about">about Numivra Math</Link>.</p>
</PageShell>}
