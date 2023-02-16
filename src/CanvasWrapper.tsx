import { useEffect, useState } from 'react';
import CanvasDiv from './CanvasDiv';
import { Env, isInCanvas, Point, Size } from './Utils';

// メインのキャンバスの移動やサイズ制御を行う
export default function CanvasWrapper(
  { env, setEnv }: {
    env: Env;
    setEnv: (f: (e: Env) => Env) => void;
  }
) {
  const [MouseDownPos, setMouseDownPos] = useState<Point>({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState<Point>({ x: 0, y: 0 });
  const [translateOnMouseDown, setTranslateOnMouseDown] = useState<Point>({ x: 0, y: 0 });

  useEffect(() => {
    // 各イベントの追加
    const self = document.querySelector('#CanvasWrapper');
    document.addEventListener('wheel', HandleWheel, { passive: false });
    document.addEventListener('mousedown', HandleMouseDown, { passive: false });
    document.addEventListener('mousemove', HandleMouseMove, { passive: false });
    document.addEventListener('contextmenu', HandleContextMenu, { passive: false });
    if(self){
      self.addEventListener('dragover', HandleDragOver, { passive: false });
      self.addEventListener('drop', HandleDrop, { passive: false });
    }    
    return (() => {
      document.removeEventListener('wheel', HandleWheel);
      document.removeEventListener('mousedown', HandleMouseDown);
      document.removeEventListener('mousemove', HandleMouseMove);
      document.removeEventListener('contextmenu', HandleContextMenu);
      if(self){
        self.removeEventListener('dragover', HandleDragOver);
        self.removeEventListener('drop', HandleDrop);
      }    
    });
  }, [env, MouseDownPos, scale, translate, translateOnMouseDown]);

  function HandleMouseDown(e: MouseEvent) {
    const self = document.getElementById('CanvasWrapper');
    const cdiv = document.getElementById('canvasdiv');
    if (self === null || cdiv === null) return;
    const s: Size = {
      w: self.getBoundingClientRect().width,
      h: self.getBoundingClientRect().height,
    };
    const X0 = e.clientX;
    const Y0 = e.clientY;
    const X = X0 - self.getBoundingClientRect().left - 2;
    const Y = Y0 - self.getBoundingClientRect().top - 2;
    setMouseDownPos({
      x: X0,
      y: Y0,
    });
    setTranslateOnMouseDown(t => ({
      x: translate.x,
      y: translate.y
    }));
    if (!isInCanvas(s, X, Y)) return;
    if (env.ctrl !== 'move') {
      HandleMouseMove(e);
    }
  }

  function HandleMouseMove(e: MouseEvent) {
    if (!(e.buttons & 0b1 || e.buttons & 0b10)) return;
    const self = document.getElementById('CanvasWrapper');
    const cdiv = document.getElementById('canvasdiv');
    const cvs = document.getElementById('canvas');
    if (self === null || cvs === null || cdiv === null) return;
    const s: Size = {
      w: self.getBoundingClientRect().width,
      h: self.getBoundingClientRect().height,
    };
    const m: Point = {
      x: e.clientX - self.getBoundingClientRect().x - 2,
      y: e.clientY - self.getBoundingClientRect().y - 2,
    }
    const d: Point = {
      x: MouseDownPos.x - self.getBoundingClientRect().x - 2,
      y: MouseDownPos.y - self.getBoundingClientRect().y - 2,
    }
    const x = (m.x - translate.x) / scale;
    const y = (m.y - translate.y) / scale;
    const downOutside = !isInCanvas(s, d.x, d.y);
    const moveOutside = !isInCanvas(s, m.x, m.y);

    // cdiv.dispatchEvent(new CustomEvent('mm', {detail: {x:X,y:y}}));

    switch (env.ctrl) {
      case 'move':
        if (downOutside && moveOutside) return;
        const delta: Point = {
          x: e.clientX - MouseDownPos.x,
          y: e.clientY - MouseDownPos.y,
        };
        setTranslate(t => ({
          x: translateOnMouseDown.x + delta.x,
          y: translateOnMouseDown.y + delta.y,
        }))
        break;
      case 'draw':
        if (moveOutside) return;
        cvs?.dispatchEvent(new CustomEvent('setcodel', { detail: { x: x, y: y } }));
        break;
      case 'pick':
        if(moveOutside)return;
        cvs?.dispatchEvent(new CustomEvent('pickcolor', {detail: {x: x, y: y}}));
        break;
      case 'fill':
        if (moveOutside) return;
        cvs?.dispatchEvent(new CustomEvent('fillcodel', { detail: { x: x, y: y } }));
        break;
    }
  }

  function HandleWheel(e: WheelEvent) {
    e.preventDefault();
    // Wrapper外の場合無視
    const self = document.getElementById('CanvasWrapper');
    if (self === null) return;
    const s: Size = {
      w: self.getBoundingClientRect().width,
      h: self.getBoundingClientRect().height,
    };
    const d: Point = {
      x: e.clientX - self.getBoundingClientRect().x - 2,
      y: e.clientY - self.getBoundingClientRect().y - 2,
    }
    if (!isInCanvas(s, d.x, d.y)) return;
    if (e.ctrlKey) {
      // ズーム(canvas上のマウス位置が変わらないようにズームする)
      const isPinch = !!(e.deltaY % 1);
      const a = (e.shiftKey ? .999 : .99) ** (e.deltaY * (isPinch ? 1 : .1));// scale変更の係数
      const self = document.getElementById('CanvasWrapper');
      if (self === null) return;
      const p: Point = {
        x: e.clientX - self.getBoundingClientRect().x - 2,
        y: e.clientY - self.getBoundingClientRect().y - 2,
      }
      setTranslate(t => ({
        x: p.x - (p.x - t.x) * a,
        y: p.y - (p.y - t.y) * a,
      }));
      setScale(s => a * s);
    }
    else if (e.shiftKey) {
      // 横方向移動
      setTranslate(t => ({
        x: t.x - e.deltaY * 0.5,
        y: t.y - e.deltaX * 0.5,
      }));
    }
    else {
      // 縦方向移動
      setTranslate(t => ({
        x: t.x - e.deltaX * 0.5,
        y: t.y - e.deltaY * 0.5,
      }));
    }
  }

  function HandleContextMenu(e: MouseEvent) {
    e.preventDefault();
  }

  function HandleDragOver(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    const dt = (e as unknown as DragEvent).dataTransfer!;
    dt.dropEffect = 'copy';
    console.log(e);
  }

  function HandleDrop(e: Event) {
    e.stopPropagation();
    e.preventDefault();
    const reader = new FileReader();
    const file = (e as unknown as DragEvent).dataTransfer!.files[0];
    reader.onload = function (e) {
      // document.getElementById('preview').src = e.target.result;
      console.log(e.target?.result);
    }
    if(file && file.type.match('image.*')){
      reader.readAsDataURL(file);
    }
    else {
      console.log(e);
    }
  };

  return (
    <div
      id='CanvasWrapper'
    >
      {
        //
      }
      <CanvasDiv
        env={env}
        setEnv={(f: (e: Env) => Env) => setEnv(f)}
        style={{
          scale: `${scale}`,
          left: `${translate.x}px`,
          top: `${translate.y}px`,
        }}
      />
    </div>
  )
}