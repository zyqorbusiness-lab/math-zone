import Link from 'next/link';

export const metadata = { title: 'Page not found' };

export default function NotFound() {
  return (
    <div className="container section" style={{ textAlign: 'center', paddingBlock: 'clamp(3rem,8vw,6rem)' }}>
      <span className="eyebrow">404</span>
      <h1 className="page-title">This page is not on the board.</h1>
      <p className="muted" style={{ maxWidth: '52ch', margin: '1rem auto 2rem' }}>
        The link may be old or the page may have moved. Browse notes by class, or head back home.
      </p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link className="btn" href="/">Back to home</Link>
        <Link className="btn btn-outline" href="/classes">Browse classes</Link>
      </div>
    </div>
  );
}
