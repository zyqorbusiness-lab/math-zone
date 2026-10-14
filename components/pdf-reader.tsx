'use client';
import {useEffect,useRef,useState} from 'react';
const PDFJS='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.8.69';
export default function PdfReader({src,title,pageStart=1,openHref}:{src:string;title:string;pageStart?:number;openHref:string}){
 const host=useRef<HTMLDivElement>(null);
 const [state,setState]=useState<'loading'|'ready'|'error'>('loading');
 const [total,setTotal]=useState(0);
 useEffect(()=>{
  let cancelled=false;let observer:IntersectionObserver|undefined;let destroy:(()=>void)|undefined;
  setState('loading');setTotal(0);host.current?.replaceChildren();
  (async()=>{try{
   const pdfjs=await import(/* webpackIgnore: true */`${PDFJS}/pdf.min.mjs`) as {GlobalWorkerOptions:{workerSrc:string};getDocument:(o:{url:string;rangeChunkSize:number})=>{promise:Promise<{numPages:number;destroy:()=>Promise<void>;getPage:(n:number)=>Promise<{getViewport:(o:{scale:number})=>{width:number;height:number};render:(o:{canvasContext:CanvasRenderingContext2D;viewport:{width:number;height:number}})=>{promise:Promise<void>}}>}>}};
   pdfjs.GlobalWorkerOptions.workerSrc=`${PDFJS}/pdf.worker.min.mjs`;
   const doc=await pdfjs.getDocument({url:src,rangeChunkSize:65536}).promise;destroy=()=>{void doc.destroy()};if(cancelled)return;
   const el=host.current;if(!el)return;setTotal(doc.numPages);
   const render=async(n:number,fig:HTMLElement)=>{if(cancelled||fig.dataset.rendered)return;fig.dataset.rendered='1';try{const page=await doc.getPage(n);if(cancelled)return;const base=page.getViewport({scale:1});const cssWidth=Math.min(el.clientWidth||720,860);const dpr=Math.min(window.devicePixelRatio||1,1.5);const vp=page.getViewport({scale:(cssWidth/base.width)*dpr});const cv=document.createElement('canvas');cv.setAttribute('role','img');cv.setAttribute('aria-label',`${title}, PDF page ${n}`);cv.width=Math.floor(vp.width);cv.height=Math.floor(vp.height);cv.style.cssText='width:100%;height:auto;display:block';const ctx=cv.getContext('2d');if(!ctx)throw Error('canvas');await page.render({canvasContext:ctx,viewport:vp}).promise;if(cancelled)return;fig.querySelector('.pdf-page-placeholder')?.remove();fig.appendChild(cv);if(n===1)setState('ready');}catch{if(!cancelled){fig.dataset.rendered='';const note=fig.querySelector('.pdf-page-placeholder');if(note)note.textContent='This page could not load. Use Open document below.';if(n===1)setState('error')}}};
   const figures:HTMLElement[]=[];for(let n=1;n<=doc.numPages;n++){const fig=document.createElement('figure');fig.className='notebook-page';const cap=document.createElement('figcaption');cap.textContent=`Page ${pageStart+n-1} · PDF page ${n} of ${doc.numPages}`;const placeholder=document.createElement('div');placeholder.className='pdf-page-placeholder';placeholder.style.cssText='min-height:360px;padding:24px;color:#53675a';placeholder.textContent=n===1?'Opening first page…':'Scroll to load this page';fig.append(cap,placeholder);el.appendChild(fig);figures.push(fig)}
   await render(1,figures[0]);if(cancelled)return;
   if('IntersectionObserver'in window){observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){observer?.unobserve(entry.target);void render(figures.indexOf(entry.target as HTMLElement)+1,entry.target as HTMLElement)}},{rootMargin:'700px 0px'});figures.slice(1).forEach(fig=>observer!.observe(fig))}else{for(let n=2;n<=doc.numPages;n++)await render(n,figures[n-1])}
  }catch{if(!cancelled)setState('error')}})();
  return()=>{cancelled=true;observer?.disconnect();destroy?.()};
 },[src,title,pageStart]);
 return <div className="pdf-reader"><p><a href={openHref} target="_blank" rel="noopener noreferrer">Open document in new tab ↗</a></p>{state==='loading'&&<p className="muted" role="status">Opening the first page{total?` of ${total}`:''}…</p>}{state==='ready'&&<p className="muted">{total} pages available. More pages load as you scroll.</p>}<div ref={host}/>{state==='error'&&<div><p className="muted">The inline reader could not load this document here. Use the open-document link above.</p><iframe title={`${title} document`} src={src} style={{width:'100%',height:600,border:'1px solid var(--line)',borderRadius:12}} loading="lazy"/></div>}</div>;
}
