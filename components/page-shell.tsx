import Link from 'next/link';
import {JsonLd,crumbs,absolute} from '@/lib/seo';
export function PageShell({title,intro,path,children,type='WebPage'}:{title:string;intro:string;path:string;children:React.ReactNode;type?:string}){
 return <article className="container" style={{paddingBlock:'clamp(40px,6vw,80px)',maxWidth:820}}>
  <JsonLd data={crumbs([{name:'Home',path:'/'},{name:title,path}])}/>
  <JsonLd data={{'@context':'https://schema.org','@type':type,name:title,url:absolute(path),description:intro,isPartOf:{'@type':'WebSite',name:'Numivra Math',url:absolute('/')}}}/>
  <nav aria-label="Breadcrumb" style={{fontSize:14,marginBottom:18}}><Link href="/">Home</Link> / <span>{title}</span></nav>
  <h1 style={{fontSize:'clamp(34px,5vw,56px)',margin:'0 0 16px'}}>{title}</h1>
  <p className="pageshell-intro" style={{fontSize:18,lineHeight:1.7,color:'#3c4066'}}>{intro}</p>
  <style>{`.prose-mz h2{font-size:26px;margin:36px 0 10px;letter-spacing:-.03em;line-height:1.2}.prose-mz p{margin:0 0 14px}.prose-mz ul{margin:0 0 14px;padding-left:22px;list-style:disc}.prose-mz li{margin:6px 0}.prose-mz a{color:#2a2470;text-decoration:underline;text-underline-offset:3px;font-weight:600}.prose-mz a:hover{color:#211c5c}.pageshell-intro{margin:0 0 8px}`}</style><div className="prose-mz" style={{lineHeight:1.75,fontSize:16}}>{children}</div>
 </article>
}
