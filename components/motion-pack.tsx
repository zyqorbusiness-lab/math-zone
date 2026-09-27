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
  const n=Math.floor(c.sampleRate*.035),buf=c.createBuffer(1,n,c.sampleRate),d=buf.getChannelData(0);
  for(let i=0;i<n;i++){d[i]=(Math.random()*2-1)*Math.pow(1-i/n,2.4)}
  const src=c.createBufferSource();src.buffer=buf;
  const bp=c.createBiquadFilter();bp.type='bandpass';bp.frequency.value=2900;bp.Q.value=.8;
  const g=c.createGain();g.gain.setValueAtTime(.5,t);g.gain.exponentialRampToValueAtTime(.0001,t+.04);
  src.connect(bp);bp.connect(g);g.connect(c.destination);src.start(t);
  const o2=c.createOscillator(),g2=c.createGain();
  o2.type='sine';o2.frequency.setValueAtTime(220,t);o2.frequency.exponentialRampToValueAtTime(130,t+.028);
  g2.gain.setValueAtTime(.12,t);g2.gain.exponentialRampToValueAtTime(.0001,t+.035);
  o2.connect(g2);g2.connect(c.destination);o2.start(t);o2.stop(t+.04);
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
