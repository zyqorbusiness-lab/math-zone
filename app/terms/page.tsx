import {PageShell} from '@/components/page-shell';import {seo} from '@/lib/seo';
export const metadata=seo('Terms of Use | Numivra Math','Terms for using Numivra Math free notes and lessons for Classes 5-10.','/terms');
export default function Terms(){return <PageShell title="Terms of Use" path="/terms" intro="By using Numivra Math you agree to these simple terms. Last updated: 11 October 2026.">
<h2>Use of the notes</h2>
<p>Notes and lessons are provided free for personal study. Please do not copy them to sell, or present them as your own work.</p>
<h2>Accuracy</h2>
<p>We try to keep notes correct, but mistakes can happen. Notes support your school textbook and teacher. They do not replace them. Tell us about errors on the <a href="/contact">contact page</a>.</p>
<h2>Availability</h2>
<p>The site is free and may change, pause or remove content without notice.</p>
<h2>Admin area</h2>
<p>The admin area is only for authorised teachers and site owners.</p>
<h2>Links</h2>
<p>Some notes may link to outside sites such as videos. We do not control those sites.</p>
<h2>Changes</h2>
<p>We may update these terms. Continued use means you accept the current version.</p>
</PageShell>}
