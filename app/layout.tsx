import './globals.css';import type {Metadata} from 'next';import {Nav,Footer} from '@/components/nav';
export const metadata:Metadata={title:{default:'Math Zone | Learn with clarity',template:'%s | Math Zone'},description:'Beautifully organized notes, chapters and video lessons for every learner.',openGraph:{title:'Math Zone | Learn with clarity',description:'A calmer, clearer way to learn.'}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body><Nav/><main>{children}</main><Footer/></body></html>}
