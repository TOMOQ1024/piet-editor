import { useState } from "react";
import Editor from "./Editor";
import Export from "./Export";
import Import from "./Import";
import SideMenu from "./SideMenu";
import { Display, Env, Size } from "./Utils";

export default function App(
  {code, size}: {
    code: number[][],
    size: Size
  }
) {
  const [env, setEnv] = useState<Env>(
    {
      crnt: {x:0,y:0},
      next: {x:-1,y:-1},
      size: size,
      code: code,
      dp: 0,
      cc: 0,
      block: [],
      stuck: 0,
      halted: false,
      stack: [],
      input: '',
      output: '',
      baseColor: 0,
      fillColor0: 0,
      ctrl: 'draw',
    }
  );

  const [dis, setDis] = useState<Display>('editor');

  return (
    <div id='App'>
      <SideMenu
      dis={dis}
      setDis={(f:(e:Display)=>Display)=>setDis(f)}
      />
      {(()=>{
        switch(dis){
          case 'editor':
            return (
              <Editor
              env={env}
              setEnv={(f:(e:Env)=>Env)=>setEnv(f)}
              />
            );
          case 'export':
            return (
              <Export/>
            );
          case 'import':
            return (
              <Import/>
            );
        }
      })()}
    </div>
  )
}