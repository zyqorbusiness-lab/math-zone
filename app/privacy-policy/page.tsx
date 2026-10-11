import {PageShell} from '@/components/page-shell';import {seo} from '@/lib/seo';
export const metadata=seo('Privacy Policy | Math Zone','How Math Zone handles information when you browse free notes for Classes 5-10.','/privacy-policy');
export default function Privacy(){return <PageShell title="Privacy Policy" path="/privacy-policy" intro="This page explains what information Math Zone handles. Last updated: 11 October 2026.">
<h2>Browsing</h2>
<p>You can read all public notes without an account and without giving us personal details. We do not ask students to sign up.</p>
<h2>Search</h2>
<p>When you search, your query is used to show matching notes.</p>
<h2>Hosting and technical data</h2>
<p>The site is hosted on Vercel and its data is stored with Supabase. Like most hosts, these services may process technical data such as IP address and browser type to deliver the site and keep it secure.</p>
<h2>Admin accounts</h2>
<p>Teachers and site admins sign in to upload notes. Admin login details are used only for that purpose.</p>
<h2>Email</h2>
<p>If you email us, we use your message only to respond to it.</p>
<h2>Ads and selling data</h2>
<p>Math Zone shows no ads and does not sell personal information.</p>
<h2>Changes</h2>
<p>We may update this policy. The date above shows the latest update. Questions: see the <a href="/contact">contact page</a>.</p>
</PageShell>}
