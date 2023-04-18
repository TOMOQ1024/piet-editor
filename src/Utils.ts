import { useCallback, useState } from "react"

export const Colors = [
  "#ffc0c0", "#ff0000", "#c00000",
  "#ffffc0", "#ffff00", "#c0c000",
  "#c0ffc0", "#00ff00", "#00c000",
  "#c0ffff", "#00ffff", "#00c0c0",
  "#c0c0ff", "#0000ff", "#0000c0",
  "#ffc0ff", "#ff00ff", "#c000c0",
  "#ffffff", "#000000", "#ffc0c0"
]

export const Operations = [
  "*", "push", "pop",
  "add", "sub", "mul",
  "div", "mod", "not",
  "great", "point", "switch",
  "dup", "roll", "in(n)",
  "in(c)", "out(n)", "out(c)",
  "white", "black", ""
]

export interface Point {
  x: number;
  y: number;
}

export interface Size {
  w: number;
  h: number;
}

export const ctrls = [
  'move',
  'draw',
  'pick',
  'fill',
] as const;
export type Ctrl = typeof ctrls[number];

export const displays = [
  'editor',
  'import',
  'export',
] as const;
export type Display = typeof displays[number];

export interface Env {
  crnt: Point,
  next: Point,
  size: Size,
  code: string[][],
  codeHistory: string[][][],
  currentCodeAt: number,
  dp: number,
  cc: number,
  block: Point[],
  stuck: number,
  halted: boolean,
  stack: number[],
  input: string,
  output: string,
  baseColor: number,
  fillColor0: string,
  ctrl: Ctrl,
}

export const env_init: Env = {
  crnt: {x:0,y:0},
  next: {x:-1,y:-1},
  size: {w: 0, h: 0},
  code: [],
  codeHistory: [],
  currentCodeAt: 0,
  dp: 0,
  cc: 0,
  block: [],
  stuck: 0,
  halted: false,
  stack: [],
  input: '',
  output: '',
  baseColor: 0,
  fillColor0: Colors[0],
  ctrl: 'draw',
}

export function isInCanvas(
  s: Size,
  x: number,
  y: number
): boolean {
  return 0 <= x && 0 <= y && x < s.w && y < s.h;
}

export function useForceUpdate() {
  const [, newState] = useState({});
  return useCallback(() => newState({}), []);
}

export function IsSameCode(code0:string[][], code1:string[][]){
  const h = code0.length;
  if(!h)return code1.length === 0;
  const w = code0[0].length;
  if(code1.length !== h)return false;
  if(code1[0].length !== w)return false;
  for(let y=0; y<h; y++){
    for(let x=0; x<w; x++){
      if(code0[y][x] !== code1[y][x]){
        return false;
      }
    }
  }
  return true;
}

export function CopyCode(code:string[][]){
  let rtnCode: string[][] = [];
  for(let y=0; y<code.length; y++){
    rtnCode.push([]);
    for(let x=0; x<code[0].length; x++){
      rtnCode[y].push(code[y][x]);
    }
  }
  return rtnCode;
}
