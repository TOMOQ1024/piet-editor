import { useEffect } from 'react';
import { getColorBlock } from './Interpreter';
import { Colors, Env, isInCanvas, Point } from './Utils';

const codelScale = 40;

export default function Canvas(
  { env, setEnv }: {
    env: Env;
    setEnv: (f: (e: Env) => Env) => void;
  }
) {
  useEffect(()=>{
    RenderCanvas();
  }, [env]);

  useEffect(() => {
    const cvs = document.getElementById("canvas") as HTMLCanvasElement;
    cvs.addEventListener('setcodel', SetCodel);
    cvs.addEventListener('fillcodel', FillCodel);
    cvs.addEventListener('pickcolor', PickColor);
    return () => {
      cvs.removeEventListener('setcodel', SetCodel);
      cvs.removeEventListener('fillcodel', FillCodel);
      cvs.removeEventListener('pickcolor', PickColor);
    }
  }, [env, setEnv]);

  function SetCodel(e: Event){
    const cvs = document.getElementById("canvas") as HTMLCanvasElement;
    if(!cvs)return;
    const ctx = cvs.getContext('2d') as CanvasRenderingContext2D;
    const x = Math.floor((e as CustomEvent).detail.x / codelScale);
    const y = Math.floor((e as CustomEvent).detail.y / codelScale);
    if (!isInCanvas(env.size, x, y)) return;
    setEnv(ev => {
      ev.code[y][x] = ev.fillColor0;
      return Object.assign({}, ev);
    })
    RenderCodel(ctx, { x: x, y: y });
  }

  function FillCodel(e: Event){
    const pos: Point = {
      x: Math.floor((e as CustomEvent).detail.x / codelScale),
      y: Math.floor((e as CustomEvent).detail.y / codelScale),
    };
    if (!isInCanvas(env.size, pos.x, pos.y)) return;
    const block = getColorBlock(pos, env.size, env.code, false);
    setEnv(ev => {
      block.forEach(b=>{
        ev.code[b.y][b.x] = ev.fillColor0;
      })
      return Object.assign({}, ev);
    })
    RenderCanvas();
  }

  function PickColor(e: Event){
    const pos: Point = {
      x: Math.floor((e as CustomEvent).detail.x / codelScale),
      y: Math.floor((e as CustomEvent).detail.y / codelScale),
    };
    if (!isInCanvas(env.size, pos.x, pos.y)) return;
    
    setEnv(ev => {
      console.log(ev.code[pos.y][pos.x]);
      return {...ev, fillColor0: ev.code[pos.y][pos.x]};
    });
  }

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
    ctx.fillStyle = env.code[pos.y][pos.x];
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
        width={env.size.w * 40 + 1}
        height={env.size.h * 40 + 1}
      />
  )
}