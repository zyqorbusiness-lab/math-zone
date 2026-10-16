import type {MetadataRoute} from 'next';
export default function manifest():MetadataRoute.Manifest{
  return{
    name:'Numivra Math - Free Class 5-10 Notes',
    short_name:'Numivra Math',
    description:'Free notes, chapters and lessons for Classes 5-10 with Sabuj and Farhan.',
    start_url:'/',
    display:'standalone',
    background_color:'#fbf6ec',
    theme_color:'#2a2470',
    icons:[
      {src:'/icon.png',sizes:'512x512',type:'image/png'},
      {src:'/apple-icon.png',sizes:'180x180',type:'image/png'},
    ],
  };
}
