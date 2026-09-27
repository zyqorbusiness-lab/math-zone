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
  const c=audio();if(!c)return;const t=c.currentTime;
  const o=c.createOscillator(),g=c.createGain();
  o.type='sine';o.frequency.setValueAtTime(2100,t);o.frequency.exponentialRampToValueAtTime(680,t+.055);
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.05,t+.006);g.gain.exponentialRampToValueAtTime(.0001,t+.085);
  o.connect(g);g.connect(c.destination);o.start(t);o.stop(t+.09);
  const o2=c.createOscillator(),g2=c.createGain();
  o2.type='triangle';o2.frequency.setValueAtTime(330,t);o2.frequency.exponentialRampToValueAtTime(205,t+.07);
  g2.gain.setValueAtTime(.0001,t);g2.gain.exponentialRampToValueAtTime(.04,t+.009);g2.gain.exponentialRampToValueAtTime(.0001,t+.11);
  o2.connect(g2);g2.connect(c.destination);o2.start(t);o2.stop(t+.12);
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
    document.addEventListener('pointerdown',h,{passive:true});
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
