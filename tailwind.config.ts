import type { Config } from 'tailwindcss';
export default {content:['./app/**/*.{ts,tsx}','./components/**/*.{ts,tsx}'],theme:{extend:{colors:{ink:'#17231e',muted:'#63736a',forest:'#164d3c',mint:'#dbefe3',surface:'#f6f8f5'},fontFamily:{sans:['Inter','Arial','sans-serif'],display:['Georgia','serif']}}},plugins:[]} satisfies Config;
