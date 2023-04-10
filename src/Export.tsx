import { useEffect, useState } from "react";
import { Colors, Env } from "./Utils";

export default function Export(
  {env}: {
    env: Env
  }
) {
  const [codelSize, setCodelSize] = useState(10);
  const [messages, setMessages] = useState({url:'',img:''});

  useEffect(()=>{
    const cvs = document.getElementById('canvas-export') as HTMLCanvasElement;
    if(cvs){
      cvs.width = codelSize * env.size.w;
      cvs.height = codelSize * env.size.h;
      const ctx = cvs.getContext('2d')!;
      ctx.imageSmoothingEnabled = false;
      for(let y=0; y<env.size.h; y++){
        for(let x=0; x<env.size.w; x++){
          ctx.fillStyle = env.code[y][x];
          ctx.fillRect(x*codelSize, y*codelSize, codelSize, codelSize);
        }
      }
    }
  }, [env.code, env.size, codelSize]);

  // クリップボードへコピー（コピーの処理）
  function copyURLToClipboard () {
    if (!navigator.clipboard) {
      setMessages(m=>({...m, url:`このブラウザは対応していません (${(new Date()).toLocaleString()})`}));
      return;
    }
  
    navigator.clipboard.writeText(window.location.href).then(
      () => {
        setMessages(m=>({...m, url:`文章をコピーしました (${(new Date()).toLocaleString()})`}));
      },
      () => {
        setMessages(m=>({...m, url:`コピーに失敗しました (${(new Date()).toLocaleString()})`}));
      });
  }
  function copyImgToClipboard () {
    if (!navigator.clipboard) {
      setMessages(m=>({...m, img:`このブラウザは対応していません (${(new Date()).toLocaleString()})`}));
      return;
    }
  
    (document.getElementById('canvas-export') as HTMLCanvasElement).toBlob(async (blob) => {
      // 画像データをクリップボードに書き込む
      if(!blob){
        setMessages(m=>({...m, img:`画像データの取得に失敗しました (${(new Date()).toLocaleString()})`}));
      }
      else{
        const item = new ClipboardItem({
          'image/png': blob
        });
        navigator.clipboard.write([item]).then(
          () => {
            setMessages(m=>({...m, img:`画像をコピーしました (${(new Date()).toLocaleString()})`}));
          },
          (reason) => {
            setMessages(m=>({...m, img:`コピーに失敗しました: {${reason}} (${(new Date()).toLocaleString()})`}));
          }
        )
      }
    });
  }

  // 画像の保存
  function saveImg(){
    (document.getElementById('canvas-export') as HTMLCanvasElement).toBlob(async (blob) => {
      if(!blob){
        setMessages(m=>({...m, img:`画像データの取得に失敗しました (${(new Date()).toLocaleString()})`}));
        return;
      }
      try {
        // fetchで画像データを取得
        const imageURL = URL.createObjectURL(blob);
  
        // 拡張子取得
        const mimeTypeArray = blob.type.split('/');
        const extension = mimeTypeArray[1];
  
        // ダウンロード
        const link = document.createElement('a');
        link.href = imageURL;
        link.download = `piet-editor-${(new Date()).toLocaleString()}.${extension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setMessages(m=>({...m, img:`画像を保存しました (${(new Date()).toLocaleString()})`}));
      } catch (error) {
        //throw new Error(`${error}.`);
        setMessages(m=>({...m, img:`画像の保存に失敗しました: {${error}} (${(new Date()).toLocaleString()})`}));
      }
    })
  }

  return (
    <div id='Export'>
      <div id='wrapper-url'>{window.location.href}</div>
      <div>
        <input type='button' value='COPY URL' onClick={
          copyURLToClipboard
        }/>
        <span>
          {messages.url}
        </span>
      </div>
      <div>
        <div>
          <code>CODEL SIZE: {codelSize.toString(10).padStart(4, '0')}</code>
          <input type='button' value='-' onClick={
            ()=>{setCodelSize(c=>c-1)}
          }/>
          <input type='button' value='+' onClick={
            ()=>{setCodelSize(c=>c+1)}
          }/>
        </div>
        <canvas id='canvas-export'/>
      </div>
      <div>
        <input type='button' value='COPY IMAGE' onClick={
          copyImgToClipboard
        } />
        <input type='button' value='SAVE IMAGE' onClick={
          saveImg
        } />
        <span>
          {messages.img}
        </span>
      </div>
    </div>
  );
}
