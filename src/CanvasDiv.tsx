import { useEffect, useState } from "react";
import Canvas from "./Canvas";
import { Env } from "./Utils";

export default function CanvasDiv(
  { env, setEnv, style }: {
    env: Env;
    setEnv: (f: (e: Env) => Env) => void;
    style: React.CSSProperties
  }
){
  return (
    <div id='canvasdiv' style={{
      ...style,
      width: env.size.w * 40 + 1,
      height: env.size.h * 40 + 1,
    }}>
      <Canvas
      env={env}
      setEnv={(f:(e:Env)=>Env)=>setEnv(f)}
      />
    </div>
  )
}