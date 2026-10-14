import Link from 'next/link';
import {PageShell} from '@/components/page-shell';
import {classes,subjects,content} from '@/lib/data';
import {seo,subjectPath,contentPath} from '@/lib/seo';
export const metadata=seo('Free Maths Notes and গণিত সমাধান | Numivra Math','Read free mathematics notes on Numivra Math, formerly Math Zone. Browse the published Class 5 and 6 notes by lesson, page range and K.D reference.','/free-math-notes');
export const dynamic='force-dynamic';
export default async function MathsNotes(){const [cl,sub,items]=await Promise.all([classes(),subjects(),content({limit:1000})]);const math=sub.filter(s=>/math|গণিত/i.test(s.name));const ids=new Set(math.map(s=>s.id));const notes=items.filter(c=>c.type!=='video'&&!c.premium&&ids.has(c.subject_id));return <PageShell title="Free maths notes" path="/free-math-notes" intro="Numivra Math, formerly Math Zone, brings the existing mathematics notes into one place. Read the published lessons below without an account or payment.">
<h2>Published mathematics notes</h2><p>{notes.length} resources are currently listed. Some use Bengali lesson titles (গণিত সমাধান). Page ranges and K.D references come from each original resource.</p>
{notes.length?<ul>{notes.map(n=><li key={n.id}><Link href={contentPath(n)}>{n.title}</Link>{n.topic?` - ${n.topic}`:''}</li>)}</ul>:<p>No mathematics notes are published yet.</p>}
<h2>Browse by class</h2><ul>{math.filter(s=>notes.some(n=>n.subject_id===s.id)).map(s=>{const c=cl.find(c=>c.id===s.class_id);return c?<li key={s.id}><Link href={subjectPath(c,s)}>{c.name} {s.name} notes</Link></li>:null})}</ul>
<h2>How to find the right lesson</h2><p>Choose the matching class first, then compare the title and page range with your book. A K.D reference is shown only where the original note provides one. We do not claim that every chapter or textbook is covered.</p>
<h2>Reading and downloads</h2><p>Open a lesson to read its available PDF or notebook photos. Download links appear only when downloading is enabled for that resource. If a document does not load, use its open-document option where available.</p>
<h2>Are the notes free?</h2><p>The published resources listed here are free to read and need no sign-up. Other class sections may still be empty while material is added.</p><p><Link href="/free-notes">Browse all free school notes</Link> or <Link href="/search">search the library</Link>. For a correction, use the <Link href="/contact">contact page</Link>.</p>
</PageShell>}
