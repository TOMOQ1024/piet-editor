import { useEffect } from "react";
import { Colors, Env } from "./Utils";

export default function Export(
  {env}: {
    env: Env
  }
) {
  useEffect(()=>{
    const cvs = document.getElementById('canvas-export') as HTMLCanvasElement;
    if(cvs){
      cvs.width = 10 * env.size.w;
      cvs.height = 10 * env.size.h;
      const ctx = cvs.getContext('2d')!;
      ctx.imageSmoothingEnabled = false;
      for(let y=0; y<env.size.h; y++){
        for(let x=0; x<env.size.w; x++){
          ctx.fillStyle = Colors[env.code[y][x]];
          ctx.fillRect(x*10, y*10, 10, 10);
        }
      }
    }
  }, [env.code]);
  return (
    <div id='Export'>
      <canvas id='canvas-export'/>
    </div>
  );
}