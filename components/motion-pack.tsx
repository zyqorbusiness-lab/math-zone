'use client';
import {useEffect,useRef,useState} from 'react';
import {usePathname} from 'next/navigation';

const reduced=()=>typeof window!=='undefined'&&matchMedia('(prefers-reduced-motion: reduce)').matches;

function tick(){
  const w=window as unknown as {__sfxA?:HTMLAudioElement};
  if(!w.__sfxA){w.__sfxA=new Audio('data:audio/wav;base64,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');w.__sfxA.preload='auto'}
  const a=w.__sfxA;
  try{a.currentTime=0;a.volume=.30;const p=a.play();if(p&&p.catch)p.catch(()=>{})}catch{}
}

export default function MotionPack(){
  const [boot,setBoot]=useState(true);
  const [lift,setLift]=useState(false);
  const [navLoad,setNavLoad]=useState(false);
  const pathname=usePathname();
  const started=useRef(0);

  useEffect(()=>{
    started.current=performance.now();let done=false;let cap:ReturnType<typeof setTimeout>|undefined;
    const hide=()=>{if(done)return;done=true;const wait=Math.max(0,950-(performance.now()-started.current));
      setTimeout(()=>{if(reduced()){setBoot(false);return}setLift(true);setTimeout(()=>setBoot(false),850)},wait)};
    if(document.readyState==='complete'){hide()}
    else{window.addEventListener('load',hide);cap=setTimeout(hide,2000)}
    return()=>{window.removeEventListener('load',hide);if(cap)clearTimeout(cap)};
  },[]);

  useEffect(()=>{
    let last=0;
    const h=(e:PointerEvent)=>{
      if(typeof e.button==='number'&&e.button!==0)return;
      const n=performance.now();if(n-last<60)return;
      const t=e.target as HTMLElement|null;
      const el=t&&t.closest?t.closest('a,button,summary,[role="button"],input[type="checkbox"],input[type="radio"],select,label'):null;
      if(!el)return;last=n;tick();
    };
    document.addEventListener('click',h,{passive:true});
    return()=>document.removeEventListener('click',h);
  },[]);

  // Show a loading overlay the moment an internal link is clicked, so slow
  // navigations (e.g. subject pages) give instant feedback. It clears as soon
  // as the new route commits (pathname change) or after a safety timeout.
  useEffect(()=>{
    const h=(e:MouseEvent)=>{
      if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
      const t=e.target as HTMLElement|null;
      const a=t&&t.closest?t.closest('a'):null;
      if(!a)return;
      const href=a.getAttribute('href')||'';
      if(a.target==='_blank'||!href.startsWith('/')||href.startsWith('//'))return;
      if(href===window.location.pathname)return;
      setNavLoad(true);
    };
    document.addEventListener('click',h);
    return()=>document.removeEventListener('click',h);
  },[]);

  useEffect(()=>{setNavLoad(false)},[pathname]);
  useEffect(()=>{if(!navLoad)return;const t=setTimeout(()=>setNavLoad(false),9000);return()=>clearTimeout(t)},[navLoad]);

  useEffect(()=>{
    if(reduced()||!('IntersectionObserver' in window))return;
    const io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){en.target.classList.add('mz-in');io.unobserve(en.target)}}),{threshold:.08});
    const arm=()=>{document.querySelectorAll('.card,.tile,.section-heading,.empty').forEach(el=>{
      if(!el.classList.contains('mz-in')&&!el.classList.contains('mz-reveal')){el.classList.add('mz-reveal');io.observe(el)}})};
    const t1=setTimeout(arm,80);const t2=setTimeout(arm,700);
    return()=>{clearTimeout(t1);clearTimeout(t2);io.disconnect()};
  },[pathname]);

  return <>
    {boot&&<div className={'mz-boot'+(lift?' mz-boot-lift':'')} role="status" aria-label="Loading Math Zone">
      <p className="mz-boot-kick">CLASSES 5–10 · NOTES · VIDEOS</p>
      <p className="mz-boot-mark">Math Zone<span>.</span></p>
      <div className="mz-boot-bar"><i/></div>
    </div>}
    {navLoad&&<div className="mz-navload" role="status" aria-label="Loading page">
      <p className="mz-boot-kick">MATH ZONE</p>
      <p className="mz-boot-mark mz-navload-mark">Loading<span>.</span></p>
      <div className="mz-boot-bar"><i/></div>
    </div>}
  </>;
}
