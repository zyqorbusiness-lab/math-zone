'use client';
import {useEffect,useRef,useState} from 'react';
import {usePathname} from 'next/navigation';

const reduced=()=>typeof window!=='undefined'&&matchMedia('(prefers-reduced-motion: reduce)').matches;

let ac:AudioContext|null=null;
function audio(){
  if(!ac){try{ac=new (window.AudioContext||(window as unknown as {webkitAudioContext:typeof AudioContext}).webkitAudioContext)()}catch{return null}}
  if(ac&&ac.state==='suspended'){ac.resume()}
  return ac;
}
function tick(){
  const w=window as unknown as {__sfxA?:HTMLAudioElement};
  if(!w.__sfxA){w.__sfxA=new Audio('data:audio/mpeg;base64,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');w.__sfxA.preload='auto'}
  const a=w.__sfxA;
  try{a.currentTime=0;a.volume=.30;const p=a.play();if(p&&p.catch)p.catch(()=>{})}catch{}
}

export default function MotionPack(){
  const [boot,setBoot]=useState(true);
  const [lift,setLift]=useState(false);
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
    return()=>document.removeEventListener('pointerdown',h);
  },[]);

  useEffect(()=>{
    if(reduced()||!('IntersectionObserver' in window))return;
    const io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){en.target.classList.add('mz-in');io.unobserve(en.target)}}),{threshold:.08});
    const arm=()=>{document.querySelectorAll('.card,.tile,.section-heading,.empty').forEach(el=>{
      if(!el.classList.contains('mz-in')&&!el.classList.contains('mz-reveal')){el.classList.add('mz-reveal');io.observe(el)}})};
    const t1=setTimeout(arm,80);const t2=setTimeout(arm,700);
    return()=>{clearTimeout(t1);clearTimeout(t2);io.disconnect()};
  },[pathname]);

  if(!boot)return null;
  return <div className={'mz-boot'+(lift?' mz-boot-lift':'')} role="status" aria-label="Loading Math Zone">
    <p className="mz-boot-kick">CLASSES 5–10 · NOTES · VIDEOS</p>
    <p className="mz-boot-mark">Math Zone<span>.</span></p>
    <div className="mz-boot-bar"><i/></div>
  </div>;
}
