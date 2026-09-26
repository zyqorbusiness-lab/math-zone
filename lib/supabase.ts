import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import {cache} from 'react';
export const db=cache(async function db() {
  const jar=await cookies();
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,{cookies:{getAll(){return jar.getAll()},setAll(items:{name:string;value:string;options?:Record<string,unknown>}[]){try{items.forEach(({name,value,options})=>jar.set(name,value,options))}catch{}}}});
});
export function configured(){return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL&&process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)}
export const admin=cache(async function admin(){if(!configured())return false;const s=await db();const {data:{user}}=await s.auth.getUser();if(!user)return false;const {data}=await s.from('profiles').select('role').eq('id',user.id).single();return data?.role==='admin'});
