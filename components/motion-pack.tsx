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
  try{a.currentTime=0;a.volume=.55;const p=a.play();if(p&&p.catch)p.catch(()=>{})}catch{}
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
