import Link from 'next/link';import {PageShell} from '@/components/page-shell';import {seo} from '@/lib/seo';
export const metadata=seo('About Math Zone | Free Notes for Classes 5-10','Math Zone is a free notes website for Classes 5-10, run with teachers Sabuj and Farhan.','/about');
export default function About(){return <PageShell title="About Math Zone" path="/about" type="AboutPage" intro="Math Zone is a free website for school notes, chapters and lessons for Classes 5 to 10, made with teachers Sabuj and Farhan.">
<h2>What you can find here</h2>
<p>Notes are organised by class, subject and chapter. Mathematics comes first, with other school subjects alongside it. Class 5 notes are grouped by page range. Classes 6 to 10 can be grouped by page range or K.D chapter number.</p>
<h2>Free to use</h2>
<p>Math Zone is free. There are no ads and no paywall.</p>
<h2>Content status</h2>
<p>Teachers add notes through an admin panel, so the library grows over time. Some classes and subjects may have few notes or none yet. We only list what is actually published.</p>
<h2>Start learning</h2>
<p><Link href="/classes">Browse all classes</Link>, <Link href="/free-notes">see free notes for Classes 5-10</Link> or <Link href="/search">search notes</Link>.</p>
</PageShell>}
