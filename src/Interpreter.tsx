import { Key, useEffect, useState } from 'react';
import DebugButton from './DebugButton';
import { Colors, Env, isInCanvas, Point, Size } from './Utils';
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

  function reset() {
    setEnv(e => ({
      ...e,
      crnt: { x: 0, y: 0 },
      next: { x: -1, y: -1 },
      dp: 0,
      cc: 0,
    }));
  }

  function run() {
    console.log('-run-');
  }

  function step() {
    // console.log('step');
    // setEnv(e=>{
    //     return Object.assign({}, e);
    // })
    // return;
    let e = Object.assign({}, env);
    // console.log('step enter');
    // console.log(...Object.values(e.crnt));
    // console.log(...Object.values(e.next));
    if (e.next.x === -1) {
      // 開始
      e = getNextCodel(e);
    }
    else if (e.next.x === -2) {
      console.log('halted');
      return e;
    }
    e.crnt = Object.assign({}, e.next);
    // console.log('----');
    e = getNextCodel(e);
    // console.log('step leave');
    // console.log(...Object.values(e.crnt));
    // console.log(...Object.values(e.next));
    //props.setEnv(Object.assign({}, e));
    setEnv(_ => e);
    console.log('%cENV SET', 'color:#ff0000;font-size:200%;');
  }

  function stop() {
    console.log('-stop-');
  }

  return (
    <div className='InterpreterControls'>
      {Object.keys(buttons).map(name => (
        <DebugButton
          key={name}
          name={name}
          func={() => buttons[name]()}
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
    console.log(ec.x + d.x, ec.y + d.y);
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
  return { ...e, next: { x: -2, y: -2 } };
}

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

export function getColorBlock(from: Point, size: Size, code: number[][], separateWhite: boolean): Point[] {
  console.log(`crnt: ${from.x},${from.y}`);
  let newBlock: Point[] = [];
  let search: Point[] = [from];

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
