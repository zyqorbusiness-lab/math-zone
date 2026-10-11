import Link from 'next/link';
import {JsonLd,crumbs,absolute} from '@/lib/seo';
export function PageShell({title,intro,path,children,type='WebPage'}:{title:string;intro:string;path:string;children:React.ReactNode;type?:string}){
 return <article className="container" style={{paddingBlock:'clamp(40px,6vw,80px)',maxWidth:820}}>
  <JsonLd data={crumbs([{name:'Home',path:'/'},{name:title,path}])}/>
  <JsonLd data={{'@context':'https://schema.org','@type':type,name:title,url:absolute(path),description:intro,isPartOf:{'@type':'WebSite',name:'Math Zone',url:absolute('/')}}}/>
  <nav aria-label="Breadcrumb" style={{fontSize:14,marginBottom:18}}><Link href="/">Home</Link> / <span>{title}</span></nav>
  <h1 style={{fontSize:'clamp(34px,5vw,56px)',margin:'0 0 16px'}}>{title}</h1>
  <p style={{fontSize:18,lineHeight:1.7,color:'#53675a'}}>{intro}</p>
  <div style={{lineHeight:1.75,fontSize:16}}>{children}</div>
 </article>
}
