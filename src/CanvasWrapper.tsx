import { useEffect, useState } from 'react';
import './App.css';
import Canvas from './Canvas';
import { Env, Point } from './Utils';

// メインのキャンバスの移動やサイズ制御を行う
export default function CanvasWrapper(
  { env, setEnv }: {
    env: Env;
    setEnv: (f: (e: Env) => Env) => void;
  }
) {
  const [MouseDownPos, setMouseDownPos] = useState<Point>({x:0,y:0});
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState<Point>({x:0, y:0});

  useEffect(()=>{
    const self = document.getElementById('CanvasWrapper');
    if(self === null){
      console.log('%cself is null', 'color:#c00000');
      return;
    }
    self.addEventListener('wheel', HandleWheel, {passive:false});
    return (() => {
      self.removeEventListener('wheel', HandleWheel);
    });
  }, []);

  function HandleMouseDown(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if(env.ctrl === 'move'){
      const self = document.getElementById('CanvasWrapper');
      const cvs = document.getElementById('canvas');
      if (self === null || cvs === null) return;
      setMouseDownPos({
        x: e.clientX - self.getBoundingClientRect().x - 2 - Number(cvs.style.translate.replace(/px/g, "").split(' ')[0]),
        y: e.clientY - self.getBoundingClientRect().y - 2 - Number(cvs.style.translate.replace(/px/g, "").split(' ')[1]),
      })
    }else{
      HandleMouseMove(e);
    }
  }

  function HandleMouseMove(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (!(e.buttons & 0b1 || e.buttons & 0b10)) return;
    const cvs = document.getElementById('canvas');
    const self = document.getElementById('CanvasWrapper');
    if (self === null) return;
    const X = e.clientX - self.getBoundingClientRect().x - 2;
    const Y = e.clientY - self.getBoundingClientRect().y - 2;
    
    if (cvs === null) {
      console.log("cvs is null");
      return;
    }
    
    const x = X - Number(cvs.style.left.replace(/[a-z]/g, ""));
    const y = Y - Number(cvs.style.top.replace(/[a-z]/g, ""));
    
    switch(env.ctrl){
      case 'move':
        // cvsへはイベントを起こさない
        const delta: Point = {
          x: X - MouseDownPos.x,
          y: Y - MouseDownPos.y,
        };
        cvs.style.left = `${X - MouseDownPos.x}px`;
        cvs.style.top = `${Y - MouseDownPos.y}px`;
        break;
      case 'draw':
        cvs?.dispatchEvent(new CustomEvent('setcodel', {detail: {x:x, y:y}}));
        break;
      case 'fill':
        cvs?.dispatchEvent(new CustomEvent('fillcodel', {detail: {x:X, y:y}}));
        break;
    }
  }

  function HandleWheel(e: WheelEvent) {
    e.preventDefault();
    if(e.ctrlKey){
      // ズーム
      setScale(s=>s*(e.shiftKey ? .999 : .99) ** e.deltaY);
    }
    else if(e.shiftKey){
      // 横方向移動
      setTranslate(({x:x,y:y})=>({
        x:x-e.deltaY*0.5,
        y:y-e.deltaX*0.5,
      }));
    }
    else{
      // 縦方向移動
      setTranslate(({x:x,y:y})=>({
        x:x-e.deltaX*0.5,
        y:y-e.deltaY*0.5,
      }));
    }
  }

  function HandleContextMenu(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.preventDefault();
  }

  return (
    <div
      id='CanvasWrapper'
      onMouseDown={e => HandleMouseDown(e)}
      onMouseMove={e => HandleMouseMove(e)}
      onContextMenu={e => HandleContextMenu(e)}
    >
      <Canvas
        env={env}
        setEnv={(f:(e:Env)=>Env)=>setEnv(f)}
        style={{
          scale: `${scale}`,
          translate: `${translate.x}px ${translate.y}px`,
        }}
      />
    </div>
  )
}