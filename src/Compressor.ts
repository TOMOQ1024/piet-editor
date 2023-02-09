import { Colors, Env, env_init } from "./Utils";

export function Encode(e:Env): string {
  let i: number;
  let c: string;
  let colors: string[] = [];
  let result: string = '';
  for(let y=0; y<e.size.h; y++){
    for(let x=0; x<e.size.w; x++){
      c = e.code[y][x].replace(/^#/, '');
      i = colors.indexOf(c);
      if(i < 0){
        result += `${colors.length}`;
        colors.push(c);
      }
      else {
        result += `${i}`;
      }
    }
  }
  console.log(`${e.size.w},${e.size.h},${colors.length},${colors.join(',')},`+result);
  return btoa(`${e.size.w},${e.size.h},${colors.length},${colors.join(',')},`+result);
}

export function Decode(rawdata: string): Env|null {
  let data = atob(rawdata);
  console.log(data);
  if(!data.match(/\d+,\d+,\d+,([0-9a-z]{6},)+\d+/))return null;

  const w = parseInt(data.match(/^\d+/)![0]);
  data = data.replace(/^\d+,/,'');
  const h = parseInt(data.match(/^\d+/)![0]);
  data = data.replace(/^\d+,/,'');
  const c = parseInt(data.match(/^\d+/)![0]);
  data = data.replace(/^\d+,/,'');

  let colors: string[] = [];
  let code: string[][] = [];
  try {
    for(let i=0; i<c; i++){
      colors.push(data.match(/^[0-9a-z]{6}/)![0]);
      data = data.replace(/^[0-9a-z]{6},/,'');
    }
  
    for(let y=0; y<h; y++){
      code.push([]);
      for(let x=0; x<w; x++){
        code[y].push(`#${colors[+data[x+y*w]]}`);
      }
    }
    console.log(code);
  }
  catch(er){
    console.error(er);
    return null;
  }
  return {...env_init, size:{w:w,h:h}, code:code};
}

const stringify = (targetObject: {[key:string]:string}) => {
  return Object.entries(targetObject).reduce((queries, current) => {
    const key = encodeURIComponent(current[0]);
    const value = encodeURIComponent(current[1]);
    return (queries += (queries === "" ? "" : "&") + `${key}=${value}`);
  }, "")
}

const updateQueryParams = (newKey:string, newValue:string) => {
  const searchParams = new URLSearchParams(window.location.search);
  const nextQueryParams:{[key:string]:string} = {};
  searchParams.forEach((value, key) => {
    nextQueryParams[key] = value;
  });
  nextQueryParams[newKey] = newValue;
  window.history.replaceState(null, document.title, `?${stringify(nextQueryParams)}`);
}

export function UpdateURL(e: Env) {
  updateQueryParams('content', Encode(e));
  console.log('Saved automatically!');
}

export function LoadURL(): Env {
  const url = new URL(window.location.href);
  const rawdata = url.searchParams.get('content');
  if(!rawdata)return env_init;
  const e = Decode(rawdata);
  if(!e)return env_init;
  return e;
}