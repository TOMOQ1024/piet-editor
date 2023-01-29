import { Key, useEffect, useState } from 'react';
import DebugButton from './DebugButton';
import { Colors, Env, isInCanvas, Operations, Point, Size } from './Utils';
import './App.css';

interface Buttons {
  [key: string]: Function
}

export default function Interpreter(
  { env, setEnv }: {
    env: Env;
    setEnv: (f: (e: Env) => Env) => void;
  }
) {
  const buttons: Buttons = {
    reset: reset,
    run: run,
    step: step,
    stop: stop,
  }

  function reset(): Env{
    return {
      ...env,
      crnt: { x: 0, y: 0 },
      next: { x: -1, y: -1 },
      stuck: 0,
      halted: false,
      stack: [],
      dp: 0,
      cc: 0,
    };
  }

  function run(): Env{
    let e = env;
    for(let i=0; i<100 && !e.halted; i++){
      e = step();
    }
    return step();
  }

  function step(e:Env = env): Env{
    if (e.next.x === -1) {
      // 開始
      e = getNextCodel(e);
    }
    else if (e.next.x === -2) {
      // 終了
      return e;
    }
    
    e = updateStack(e);
    e.crnt = Object.assign({}, e.next);
    e = getNextCodel(e);
    return Object.assign({}, e);
  }

  function stop(): Env{
    console.log('-stop-');
    return env;
  }

  return (
    <div className='InterpreterControls'>
      {Object.keys(buttons).map(name => (
        <DebugButton
          key={name}
          name={name}
    func={() => {let e = buttons[name](); setEnv(_ => e);}}
        />
      ))}
    </div>
  )
}


// Env.nextを設定する
function getNextCodel(e: Env): Env {
  e.block = getColorBlock(e.crnt, e.size, e.code, true);
  let ec: Point;
  const black = Colors.indexOf('#000000');
  let d: Point;
  e.stuck = 0;
  while (e.stuck < 8) {
    d = [
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: -1, y: 0 },
      { x: 0, y: -1 },
    ][e.dp % 4];
    e.crnt = ec = getEdgeCodel(e);
    if (isInCanvas(e.size, ec.x + d.x, ec.y + d.y) && e.code[ec.y + d.y][ec.x + d.x] !== black) {
      e.next = {
        x: ec.x + d.x,
        y: ec.y + d.y,
      };
      return e;
    }
    else {
      if (e.stuck % 2 === 0) ++e.cc;
      else ++e.dp;
      ++e.stuck;
    }
  }
  return { ...e, next: { x: -2, y: -2 }, halted: true };
}

// カラーブロッック端のコーデル取得
function getEdgeCodel(e: Env): Point {
  const block = e.block;
  let edge: Point[] = [];
  let bound: number;
  // console.log(`dp:${e.dp}, cc:${e.cc}`);
  // console.log('block: ');
  // console.log(block);
  switch (e.dp % 4) {
    case 0:// 右
      bound = -1;
      for (let i = 0; i < block.length; i++) {
        if (bound < block[i].x) {
          edge = [block[i]];
          bound = block[i].x;
        }
        else if (bound === block[i].x) {
          edge.push(block[i]);
        }
      }
      break;
    case 1:// 下
      bound = -1;
      for (let i = 0; i < block.length; i++) {
        if (bound < block[i].y) {
          edge = [block[i]];
          bound = block[i].y;
        }
        else if (bound === block[i].y) {
          edge.push(block[i]);
        }
      }
      break;
    case 2:// 左
      bound = e.size.w;
      for (let i = 0; i < block.length; i++) {
        if (bound > block[i].x) {
          edge = [block[i]];
          bound = block[i].x;
        }
        else if (bound === block[i].x) {
          edge.push(block[i]);
        }
      }
      break;
    case 3:// 上
      bound = e.size.h;
      for (let i = 0; i < block.length; i++) {
        if (bound > block[i].y) {
          edge = [block[i]];
          bound = block[i].y;
        }
        else if (bound === block[i].y) {
          edge.push(block[i]);
        }
      }
      break;
  }
  // console.log('edge: ');
  // console.log(edge);
  const d = e.dp + (e.cc % 2 === 0 ? -1 : 1);
  let rtn = { x: -1, y: -1 };
  switch ((d % 4 + 4) % 4) {
    case 0:// 右
      bound = -1;
      for (let i = 0; i < edge.length; i++) {
        if (bound < edge[i].x) {
          rtn = edge[i];
          bound = edge[i].x;
        }
      }
      break;
    case 1:// 下
      bound = -1;
      for (let i = 0; i < edge.length; i++) {
        if (bound < edge[i].y) {
          rtn = edge[i];
          bound = edge[i].y;
        }
      }
      break;
    case 2:// 左
      bound = e.size.w;
      for (let i = 0; i < edge.length; i++) {
        if (bound > edge[i].x) {
          rtn = edge[i];
          bound = edge[i].x;
        }
      }
      break;
    case 3:// 上
      bound = e.size.h;
      for (let i = 0; i < edge.length; i++) {
        if (bound > edge[i].y) {
          rtn = edge[i];
          bound = edge[i].y;
        }
      }
      break;
  }
  // console.log('return: ');
  // console.log(rtn);
  return rtn;
}

// カラーブロックの取得
export function getColorBlock(from: Point, size: Size, code: number[][], separateWhite: boolean): Point[] {
  let newBlock: Point[] = [];

  const col = code[from.y][from.x];
  if (separateWhite && Colors[col] === '#ffffff') {
    return [from];
  }
  let buf: number[][] = [];
  for (let y = 0; y < size.h; y++) {
    buf.push([]);
    for (let x = 0; x < size.w; x++) {
      buf[y].push(code[y][x]);
    }
  }
  let s0: Point, s: Point;
  const d = [
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
    { x: 0, y: -1 },
  ];

  function fill(p: Point){
    buf[p.y][p.x] = -1;
    d.forEach(d0 => {
      s = {x:p.x+d0.x, y:p.y+d0.y};
      // 進めるコーデルか
      if (isInCanvas(size, s.x, s.y)) {
        // 同じ色のコーデルか
        if (buf[s.y][s.x] === col) {
          fill(s);
        }
      }
    });
  }

  fill(from);
  for (let y = 0; y < size.h; y++) {
    for (let x = 0; x < size.w; x++) {
      buf[y].push(code[y][x]);
      if(buf[y][x] < 0){
        newBlock.push({x:x, y:y});
      }
    }
  }
  return newBlock;
}

// スタック命令の読み取り・スタックの更新
function updateStack(e: Env): Env{
  const n = e.code[e.next.y][e.next.x];
  const c = e.code[e.crnt.y][e.crnt.x];
  const w = Colors.indexOf('#ffffff');
  if(n === w || c === w)return e;
  const op = ((((Math.floor(n/3)-Math.floor(c/3))%6+6)%6*3+((n%3-c%3)%3+3)%3)%18+18)%18;
  console.log(Operations[op]);
  switch(op){
    case 1:// push
      e.stack.push(e.block.length);
      break;
    case 2:// pop
      e.stack.pop();
      break;
    case 3:// add
      if(2 <= e.stack.length){
        e.stack[e.stack.length-2] += e.stack.pop()!;
      }
      break;
    case 4:// sub
      if(2 <= e.stack.length){
        e.stack[e.stack.length-2] -= e.stack.pop()!;
      }
      break;
    case 5:// mul
      if(2 <= e.stack.length){
        e.stack[e.stack.length-2] *= e.stack.pop()!;
      }
      break;
    case 6:// div
      if(2 <= e.stack.length){
        e.stack[e.stack.length-2] = Math.floor(e.stack[e.stack.length-2] / e.stack.pop()!);
      }
      break;
    case 7:// mod
      if(2 <= e.stack.length){
        let f = e.stack.pop()!;
        let s = e.stack.pop()!;
        if(f === 0){
          // devide by 0 error
          break;
        }
        e.stack.push((s%f+f)%f);
      }
      break;
    case 8:// not
      if(1 <= e.stack.length){
        e.stack.push(e.stack.pop()?0:1);
      }
      break;
    case 9:// greater
      if(2 <= e.stack.length){
        e.stack.push(e.stack.pop()! < e.stack.pop()! ? 1 : 0);
      }
      break;
    case 10:// pointer
      if(1 <= e.stack.length){
        e.dp += (e.stack.pop()! % 4 + 4) % 4;
      }
      break;
    case 11:// switch
      if(1 <= e.stack.length){
        e.cc += (e.stack.pop()! % 4 + 4) % 4;
      }
      break;
    case 12:// duplicate
      if(1 <= e.stack.length){
        e.stack.push(e.stack[e.stack.length-1]);
      }
      break;
    case 13:// roll
      if(2 <= e.stack.length){
        let n = e.stack.pop()!;
        let depth = e.stack.pop()!;
        let p: number;
        if(depth < 0 || e.stack.length < depth){
          // このときどうすればいいのかわからん
          // とりあえず戻しとく
          e.stack.push(depth);
          e.stack.push(n);
          break;
        }
        n = (n%depth + depth) % depth;
        for(let i=0; i<n; i++){
          p = e.stack.pop()!;
          e.stack.splice(e.stack.length-depth,0,p);
        }
      }
      break;
    case 14:// in(num)
      console.log('in(n)');
      break;
    case 15:// in(char)
      console.log('in(c)');
      break;
    case 16:// out(num)
      if(1 <= e.stack.length){
        console.log(`%c${e.stack.pop()}`, 'color:#ff8000; font-size:20px;');
      }
      break;
    case 17:// out(char)
      if(1 <= e.stack.length){
        console.log(`%c${String.fromCodePoint(e.stack.pop()!)}`, 'color:#ffff00; font-size:20px;');
      }
      break;
  }
  console.log(e.stack);
  return e;
}
