import {PageShell} from '@/components/page-shell';import {seo} from '@/lib/seo';
export const metadata=seo('Contact Numivra Math','Contact the Numivra Math team about notes, corrections or feedback.','/contact');
export default function Contact(){return <PageShell title="Contact Numivra Math" path="/contact" type="ContactPage" intro="Found a mistake in a note, or want to share feedback? Send us an email.">
<h2>Email</h2>
<p><a href="mailto:zyqorbusiness@gmail.com">zyqorbusiness@gmail.com</a></p>
<h2>What to include</h2>
<p>Please mention the class, subject and chapter or page, and describe the problem. This helps us fix it faster.</p>
<p>We cannot promise a reply time.</p>
</PageShell>}
