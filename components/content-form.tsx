'use client';
import {useState,type ReactNode,type FormEvent} from 'react';
import {createBrowserClient} from '@supabase/ssr';
import {saveContent} from '@/lib/actions';

const accepted=new Set(['application/pdf','image/jpeg','image/png','image/webp','video/mp4','application/vnd.openxmlformats-officedocument.wordprocessingml.document']);
export function ContentForm({children,className,style}:{children:ReactNode;className?:string;style?:React.CSSProperties}){
  const [percent,setPercent]=useState<number|null>(null),[busy,setBusy]=useState(false),[error,setError]=useState('');
  async function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault();if(busy)return;setBusy(true);setPercent(null);setError('');const form=e.currentTarget;const data=new FormData(form);const file=data.get('file');let path='';
    try{
      if(file instanceof File&&file.size){
        if(!accepted.has(file.type)||file.size>50*1024*1024)throw Error('Use a PDF, JPG, PNG, WebP, MP4 or DOCX under 50 MB.');
        const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if(!url||!key)throw Error('Storage is not configured.');
        const client=createBrowserClient(url,key);const {data:{user},error:authError}=await client.auth.getUser();
        if(authError||!user)throw Error('Please sign in again before uploading.');
        path=`content/${crypto.randomUUID()}/${file.name.replace(/[^a-zA-Z0-9._-]/g,'_')}`;
        const {data:{session}}=await client.auth.getSession();if(!session)throw Error('Your session expired. Sign in again.');
        const {data:signed,error:signError}=await client.storage.from('materials').createSignedUploadUrl(path);
        if(signError||!signed)throw Error('Could not prepare upload. Check your admin access.');
        await new Promise<void>((resolve,reject)=>{
          const xhr=new XMLHttpRequest();xhr.open('PUT',signed.signedUrl);
          xhr.setRequestHeader('Content-Type',file.type);xhr.setRequestHeader('apikey',key);xhr.setRequestHeader('Authorization',`Bearer ${session.access_token}`);
          xhr.upload.onprogress=ev=>{if(ev.lengthComputable)setPercent(Math.round(ev.loaded/ev.total*100))};
          xhr.onload=()=>xhr.status>=200&&xhr.status<300?resolve():reject(Error(`Upload failed (${xhr.status}). Please try again.`));
          xhr.onerror=()=>reject(Error('Upload connection failed. Please try again.'));
          xhr.send(file);
        });
        data.delete('file');data.set('file_url',path);setPercent(100);
      }
      await saveContent(data);window.location.assign('/admin/content?saved=1');
    }catch(e){setError(e instanceof Error?e.message:'Could not save content. Please retry.');setBusy(false)}
  }
  return <form onSubmit={submit} className={className} style={style} encType="multipart/form-data" aria-busy={busy}>{children}{busy&&<p role="status" className="wide" style={{margin:0}}> {percent===null?'Saving content...':percent<100?`Uploading file: ${percent}%`:'Upload complete. Saving content...'}</p>}{percent!==null&&busy&&<progress className="wide" max={100} value={percent} style={{width:'100%'}}/>}{error&&<p role="alert" className="wide" style={{color:'#b4393e',margin:0}}>{error}</p>}</form>;
}
