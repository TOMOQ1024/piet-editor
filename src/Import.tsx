import { useEffect, useState } from "react";
import { Env, Size } from "./Utils";

export default function Import(
  { env, setEnv, display } : {
    env: Env;
    setEnv: (f: (e: Env) => Env) => void;
    display: boolean;
  }
) {
  const [codelSize, setCodelSize] = useState(10);

  function HandleFileChange(ev: InputEvent){
    const input = ev.target as HTMLInputElement;
    if(!input)return;
    if(!input.files || !input.files[0])return;
    console.log(input.files[0]);

    const previewCvs = document.getElementById('input-preview') as HTMLCanvasElement;
    var reader = new FileReader();
    reader.onload = function (e) {
      const img = new Image();
      img.src = e.target!.result as string;
      console.log(img.width);
      setTimeout(()=>{
        previewCvs.width = img.naturalWidth;
        previewCvs.height = img.naturalHeight;
        const previewCtx = previewCvs.getContext('2d', {
          willReadFrequently: true
        });
        previewCtx?.drawImage(img, 0, 0);
      }, 100);
    }
    reader.readAsDataURL(input.files[0]);
  }

  // canvasからデータを取得する
  function ImportImg(){
    const cvs = document.getElementById('input-preview') as HTMLCanvasElement;
    const ctx = cvs.getContext('2d')!;
    const pixel = ctx.getImageData(0, 0, cvs.width, cvs.height);
    const data = pixel.data;

    const newSize:Size = {
      w: Math.floor(cvs.width / codelSize),
      h: Math.floor(cvs.height / codelSize)
    }

    function dtox2(d: number){
      // 0x0000, 0x00c0, 0x00ff に丸める
      //      0,    192,    255
      return (d<96?0 : 224<d?255 : 192).toString(16).padStart(2, '0');
    }

    const newCode: string[][] = [];
    for(let y=0; y<newSize.h; y++){
      newCode.push([]);
      for(let x=0; x<newSize.w; x++){
        newCode[y].push(
          `#${
            dtox2(data[4*codelSize*(x+y*newSize.w*codelSize)+0])
          }${
            dtox2(data[4*codelSize*(x+y*newSize.w*codelSize)+1])
          }${
            dtox2(data[4*codelSize*(x+y*newSize.w*codelSize)+2])
          }`
        )
      }
    }
    setEnv(e=>({...e, size:newSize, code:newCode}))
    console.log(newCode);
  }

  return (
    <div id='Import' className={display?'contents-visible':'contents-hidden'}>
      <div>
        <code>CODEL SIZE: {codelSize.toString(10).padStart(4, '0')}</code>
        <input type='button' value='-' onClick={
          ()=>{setCodelSize(c=>c-1)}
        }/>
        <input type='button' value='+' onClick={
          ()=>{setCodelSize(c=>c+1)}
        }/>
      </div>
      <input type="file" onChange={e=>HandleFileChange(e as unknown as InputEvent)}/>
      <canvas id='input-preview'/>
      <input type='button' value='IMPORT IMAGE' onClick={
        ImportImg
      } />
    </div>
  )
}