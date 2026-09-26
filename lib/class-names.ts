import {cache} from 'react';
import {classes} from './data';
export const classNames=cache(async()=>Object.fromEntries((await classes()).map(c=>[c.id,c.name])));
