import type {MetadataRoute} from 'next';import {classes,subjects,chapters} from '@/lib/data';import {configured,db} from '@/lib/supabase';import {absolute,classPath,subjectPath,chapterPath,contentPath} from '@/lib/seo';import type {Content} from '@/lib/data';
export const dynamic='force-dynamic';
export default async function sitemap():Promise<MetadataRoute.Sitemap>{
 const out:MetadataRoute.Sitemap=['/','/classes','/videos','/free-notes','/free-math-notes','/about','/contact','/privacy-policy','/terms'].map(p=>({url:absolute(p),changeFrequency:'weekly',priority:p==='/'?1:.6}));
 const [cls,subs,chs]=await Promise.all([classes(),subjects(),chapters()]);
 const rows:Pick<Content,'slug'|'type'|'updated_at'|'subject_id'|'chapter_id'>[]=[];
 if(configured()){const client=await db();for(let start=0;start<10000;start+=500){const {data,error}=await client.from('content').select('slug,type,updated_at,subject_id,chapter_id').eq('status','published').order('id').range(start,start+499);if(error||!data)break;rows.push(...(data as typeof rows));if(data.length<500)break}}
 const subWith=new Set(rows.map(r=>r.subject_id)),chWith=new Set(rows.map(r=>r.chapter_id));
 const byClass=new Map(cls.map(x=>[x.id,x])),bySubject=new Map(subs.map(x=>[x.id,x]));
 for(const c of cls)out.push({url:absolute(classPath(c)),changeFrequency:'weekly',priority:.8});
 for(const s of subs){if(!subWith.has(s.id))continue;const c=byClass.get(s.class_id);if(c)out.push({url:absolute(subjectPath(c,s)),changeFrequency:'weekly',priority:.8})}
 for(const ch of chs){if(!chWith.has(ch.id))continue;const s=bySubject.get(ch.subject_id),c=s&&byClass.get(s.class_id);if(c&&s)out.push({url:absolute(chapterPath(c,s,ch)),changeFrequency:'weekly',priority:.7})}
 for(const c of rows)out.push({url:absolute(contentPath(c as Content)),lastModified:c.updated_at,changeFrequency:'monthly',priority:.7});
 return out;
}
