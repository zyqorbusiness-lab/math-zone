'use client';
import {useEffect,useRef,useState} from 'react';

// Renders a PDF inline, page by page, so readers see the content directly on the
// page instead of a browser PDF frame (which often fails on mobile).
const PDFJS='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.8.69';

export default function PdfReader({src,title,pageStart=1,openHref}:{src:string;title:string;pageStart?:number;openHref:string}){
  const host=useRef<HTMLDivElement>(null);
  const [state,setState]=useState<'loading'|'ready'|'error'>('loading');
  const [total,setTotal]=useState(0);
  useEffect(()=>{
    let cancelled=false;
    (async()=>{
      try{
        const url=`${PDFJS}/pdf.min.mjs`;
        const pdfjs=await import(/* webpackIgnore: true */url) as {
          GlobalWorkerOptions:{workerSrc:string};
          getDocument:(u:string)=>{promise:Promise<{
            numPages:number;
            getPage:(n:number)=>Promise<{
              getViewport:(o:{scale:number})=>{width:number;height:number};
              render:(o:{canvasContext:CanvasRenderingContext2D;viewport:{width:number;height:number}})=>{promise:Promise<void>};
            }>;
          }>};
        };
        pdfjs.GlobalWorkerOptions.workerSrc=`${PDFJS}/pdf.worker.min.mjs`;
        const doc=await pdfjs.getDocument(src).promise;
        if(cancelled)return;
        const el=host.current;
        if(!el)return;
        setTotal(doc.numPages);
        for(let p=1;p<=doc.numPages;p++){
          const page=await doc.getPage(p);
          if(cancelled)return;
          const fig=document.createElement('figure');
          fig.className='notebook-page';
          const cap=document.createElement('figcaption');
          cap.textContent=`Page ${pageStart+p-1} · PDF page ${p} of ${doc.numPages}`;
          const cv=document.createElement('canvas');
          cv.setAttribute('role','img');
          cv.setAttribute('aria-label',`${title}, PDF page ${p}`);
          fig.appendChild(cap);fig.appendChild(cv);el.appendChild(fig);
          const base=page.getViewport({scale:1});
          const cssWidth=Math.min(el.clientWidth||720,860);
          const dpr=Math.min(window.devicePixelRatio||1,2);
          const scale=(cssWidth/base.width)*dpr;
          const vp=page.getViewport({scale});
          cv.width=Math.floor(vp.width);cv.height=Math.floor(vp.height);
          cv.style.width='100%';cv.style.height='auto';cv.style.display='block';
          const ctx=cv.getContext('2d');
          if(!ctx)throw new Error('no canvas context');
          await page.render({canvasContext:ctx,viewport:vp}).promise;
        }
        if(!cancelled)setState('ready');
      }catch{
        if(!cancelled)setState('error');
      }
    })();
    return()=>{cancelled=true};
  },[src,title,pageStart]);
  return <div className="pdf-reader">
    {state==='loading'&&<p className="muted" role="status">Loading the document{total?` (${total} pages)`:''}…</p>}
    <div ref={host}/>
    {state==='error'&&<div>
      <p className="muted">The inline reader could not load this document here.</p>
      <iframe title={`${title} document`} src={src} style={{width:'100%',height:600,border:'1px solid var(--line)',borderRadius:12}} loading="lazy"/>
      <p><a href={openHref} target="_blank" rel="noopener noreferrer">Open document in new tab ↗</a></p>
    </div>}
  </div>;
}
