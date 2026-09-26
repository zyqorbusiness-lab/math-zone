import type {MetadataRoute} from 'next';import {classes,subjects,chapters} from '@/lib/data';import {configured,db} from '@/lib/supabase';import {absolute,classPath,subjectPath,chapterPath,contentPath} from '@/lib/seo';import type {Content} from '@/lib/data';
export const dynamic='force-dynamic';
export default async function sitemap():Promise<MetadataRoute.Sitemap>{
 const out:MetadataRoute.Sitemap=['/','/classes','/search','/videos'].map(p=>({url:absolute(p),changeFrequency:'weekly',priority:p==='/'?1:.6}));
 const [cls,subs,chs]=await Promise.all([classes(),subjects(),chapters()]);
 const byClass=new Map(cls.map(x=>[x.id,x])),bySubject=new Map(subs.map(x=>[x.id,x]));
 for(const c of cls)out.push({url:absolute(classPath(c)),changeFrequency:'weekly',priority:.8});
 for(const s of subs){const c=byClass.get(s.class_id);if(c)out.push({url:absolute(subjectPath(c,s)),changeFrequency:'weekly',priority:.8})}
 for(const ch of chs){const s=bySubject.get(ch.subject_id),c=s&&byClass.get(s.class_id);if(c&&s)out.push({url:absolute(chapterPath(c,s,ch)),changeFrequency:'weekly',priority:.7})}
 if(configured()){const client=await db();for(let start=0;start<10000;start+=500){const {data,error}=await client.from('content').select('slug,type,updated_at').eq('status','published').order('id').range(start,start+499);if(error||!data)break;for(const c of data as Pick<Content,'slug'|'type'|'updated_at'>[])out.push({url:absolute(contentPath(c as Content)),lastModified:c.updated_at,changeFrequency:'monthly',priority:.7});if(data.length<500)break}}
 return out;
}
