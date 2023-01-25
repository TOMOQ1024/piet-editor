import { useEffect, useState } from 'react';
import './App.css';
import { Colors, Env } from './Utils';

const codelScale = 20;
let first = true;

export default function Canvas(
  { env, setEnv }: {
    env: Env;
    setEnv: (f: (e: Env) => Env) => void;
  }
) {
  console.log('%ccanvas component rendered', 'color:#ff00ff');

  useEffect(() => {
    console.log(`env update detected at Canvas.tsx`);

    RenderCanvas();
    if (first) {
      const cvs = document.getElementById("canvas") as HTMLCanvasElement;
      if (cvs === null) {
        console.log('canvas not found at useEffect');
        return;
      }
      cvs.addEventListener('setcodel', e => {
        const cvs = document.getElementById("canvas") as HTMLCanvasElement;
        if (cvs === null) return;
        const ctx = cvs.getContext('2d') as CanvasRenderingContext2D;
        const x = Math.floor((e as CustomEvent).detail.x / codelScale);
        const y = Math.floor((e as CustomEvent).detail.y / codelScale);
        if (x < 0 || y < 0 || env.size.w <= x || env.size.h <= y) return;
        setEnv(e => {
          e.code[y][x] = e.fillColor0;
          return Object.assign({}, e);
        })
        RenderCodel(ctx, { x: x, y: y });
        // console.log((e as CustomEvent).detail.x, (e as CustomEvent).detail.y)
      });
      // console.log('event listener added');
      first = false;
    }
  }, [env]);

  function RenderCanvas() {
    const cvs = document.getElementById("canvas") as HTMLCanvasElement;
    if (cvs === null) return;
    const ctx = cvs.getContext('2d') as CanvasRenderingContext2D;
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = "black";
    ctx.fillRect(
      0, 0,
      codelScale * env.size.w + 1,
      codelScale * env.size.h + 1
    );
    let pos = { x: 0, y: 0 };
    for (let y = 0; y < env.size.h; y++) {
      for (let x = 0; x < env.size.w; x++) {
        RenderCodel(ctx, { x: x, y: y });
      }
    }


  }

  function RenderCodel(
    ctx: CanvasRenderingContext2D,
    pos: { x: number, y: number }
  ) {
    ctx.fillStyle = Colors[env.code[pos.y][pos.x]];
    ctx.fillRect(
      pos.x * codelScale + 1,
      pos.y * codelScale + 1,
      codelScale - 1,
      codelScale - 1,
    )

    // PP・DPの描画
    if (env.crnt.x === pos.x && env.crnt.y === pos.y) {
      ctx.strokeStyle = 'black';
      ctx.lineWidth = codelScale / 10;
      ctx.lineCap = ctx.lineJoin = 'round';
      ctx.imageSmoothingEnabled = true;
      ctx.beginPath();
      ctx.save();
      ctx.scale(codelScale, codelScale);
      ctx.translate(env.crnt.x + .5, env.crnt.y + .5);
      ctx.rotate(Math.PI * .5 * (env.dp + (env.cc%2*2-1) * .1));
      ctx.translate(-.5, -.5);
      [0, 1].forEach(i => {
        ctx.moveTo(.3 * i + .25, .3);
        ctx.lineTo(.3 * i + .5, .5);
        ctx.lineTo(.3 * i + .25, .7);
      });
      ctx.restore();
      ctx.stroke();
    }
  }

  return (
    <canvas
      id="canvas"
      width={env.size.w * 20 + 1}
      height={env.size.h * 20 + 1}
    // onClick={e=>HandleClick(e)}
    />
  )
}