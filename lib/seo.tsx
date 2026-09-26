import type {Metadata} from 'next';
import type {Class,Subject,Chapter,Content} from './data';
export const SITE='https://mathzone1.vercel.app';
export const absolute=(path:string)=>new URL(path,SITE).toString();
export const plain=(text:string)=>text.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
export const description=(text:string,fallback:string)=>plain(text||fallback).slice(0,155);
export function seo(title:string,summary:string,path:string):Metadata{
 const url=absolute(path),desc=description(summary,`${title} for Classes 5-10 on Math Zone. Learn with Sabuj and Farhan.`);
 return {title:{absolute:title},description:desc,alternates:{canonical:url},openGraph:{type:'website',url,siteName:'Math Zone',title,description:desc,locale:'en_IN'},twitter:{card:'summary',title,description:desc}};
}
export const classPath=(c:Class)=>`/classes/${c.slug}`;
export const subjectPath=(c:Class,s:Subject)=>`${classPath(c)}/${s.slug}`;
export const chapterPath=(c:Class,s:Subject,ch:Chapter)=>`${subjectPath(c,s)}/${ch.slug}`;
export const contentPath=(c:Content)=>`${c.type==='video'?'/videos':'/notes'}/${c.slug}`;
export function JsonLd({data}:{data:Record<string,unknown>}){return <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(data).replace(/</g,'\\u003c')}}/>}
export const crumbs=(items:{name:string;path:string}[])=>({'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:items.map((x,i)=>({'@type':'ListItem',position:i+1,name:x.name,item:absolute(x.path)}))});
export const organization={'@context':'https://schema.org','@type':'EducationalOrganization',name:'Math Zone',url:SITE,description:'Free educational notes and lessons for Classes 5-10 with Sabuj and Farhan.'};
export const course=(name:string,desc:string,path:string)=>({'@context':'https://schema.org','@type':'Course',name,description:description(desc,name),url:absolute(path),provider:{'@type':'EducationalOrganization',name:'Math Zone',url:SITE},isAccessibleForFree:true});
export const resource=(c:Content,cl:Class,s:Subject)=>({'@context':'https://schema.org','@type':'LearningResource',name:c.title,description:description(c.description||'',`${cl.name} ${s.name} ${c.topic||'notes'}`),url:absolute(contentPath(c)),educationalLevel:cl.name,about:s.name,inLanguage:'en',isAccessibleForFree:!c.premium,dateModified:c.updated_at});
