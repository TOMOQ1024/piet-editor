import { Env, env_init } from "./Utils";

function HtoB (h:string): string {
  let rtn = '';
  if(h.match(/[^0-9a-f]/)){
    console.error('invalid argumant');
    return '';
  }
  for(let i=h.length; i%2; i++) h += '0';
  return String.fromCharCode(...h.match(/.{2}/g)!.map(v=>parseInt(v,16)));
}

function BtoH (b:string): string {
  const cc = b.split('').map(v=>v.charCodeAt(0));
  if(cc.filter(v=>v<0||256<=v).length){
    console.error('invalid argumant');
    return '';
  }
  return cc.map(v=>v.toString(16).padStart(2,'0')).join('');
}

export function Encode(e:Env): string {
  let i: number;
  let c: string;
  let colors: string[] = [];
  let arr: number[] = [];
  let result: string = '';
  for(let y=0; y<e.size.h; y++){
    for(let x=0; x<e.size.w; x++){
      c = e.code[y][x].replace(/^#/, '');
      i = colors.indexOf(c);
      if(i < 0){
        arr.push(colors.length);
        colors.push(c);
      }
      else {
        arr.push(i);
      }
    }
  }
  let l = Math.ceil(Math.log2(colors.length)/4) || 1;
  result = `${e.size.w}f${e.size.h}f${colors.length}f${colors.join('')}${arr.map(i=>i.toString(16).padStart(l,'0')).join('')}`;
  // console.log('encode');
  // console.log(result);
  // console.log(HtoB(result));
  // console.log(btoa(HtoB(result)));
  // console.log(atob(btoa(HtoB(result))));
  // console.log(BtoH(atob(btoa(HtoB(result)))));
  return btoa(HtoB(result)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=/g,'A');
}

export function Decode(rawdata: string): Env|null {
  // console.log('decode');
  // console.log(rawdata.replace(/-/g,'+').replace(/_/g,'/'));
  // console.log(atob(rawdata.replace(/-/g,'+').replace(/_/g,'/')));
  // console.log(BtoH(atob(rawdata.replace(/-/g,'+').replace(/_/g,'/'))));
  let data = BtoH(atob(rawdata.replace(/-/g,'+').replace(/_/g,'/')));
  // console.log(data);
  if(!data.match(/\d+f\d+f\d+f[0-9a-f]+/))return null;

  const w = parseInt(data.match(/^\d+/)![0]);
  data = data.replace(/^\d+f/,'');
  const h = parseInt(data.match(/^\d+/)![0]);
  data = data.replace(/^\d+f/,'');
  const c = parseInt(data.match(/^\d+/)![0]);
  data = data.replace(/^\d+f/,'');
  let l = Math.ceil(Math.log2(c)/4) || 1;

  let colors: string[] = [];
  let code: string[][] = [];
  try {
    for(let i=0; i<c; i++){
      colors.push(data.match(/^[0-9a-f]{6}/)![0]);
      data = data.replace(/^[0-9a-f]{6}/,'');
    }

    let arr = data.match(new RegExp(`.{1,${l}}`, 'g'))!.map(v=>parseInt(v,16));
  
    for(let y=0; y<h; y++){
      code.push([]);
      for(let x=0; x<w; x++){
        code[y].push(`#${colors[arr[x+y*w]]}`);
      }
    }
    // console.log(code);
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

const updateQueryParams = (newKey:string, newValue:string, replace:boolean) => {
  const searchParams = new URLSearchParams(window.location.search);
  const nextQueryParams:{[key:string]:string} = {};
  searchParams.forEach((value, key) => {
    nextQueryParams[key] = value;
  });
  nextQueryParams[newKey] = newValue;
  if(replace){
    window.history.replaceState(null, document.title, `?${stringify(nextQueryParams)}`);
  } else {
    window.history.pushState(null, document.title, `?${stringify(nextQueryParams)}`);
  }
}

export function UpdateURL(e: Env, replace=true) {
  updateQueryParams('content', Encode(e), replace);
  // console.log('Saved automatically!');
}

export function LoadURL(): Env {
  const url = new URL(window.location.href);
  const rawdata = url.searchParams.get('content');
  if(!rawdata)return env_init;
  const e = Decode(rawdata);
  if(!e)return env_init;
  return e;
}