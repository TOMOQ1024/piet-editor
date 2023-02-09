import { useEffect, useState } from "react";
import Editor from "./Editor";
import Export from "./Export";
import Import from "./Import";
import SideMenu from "./SideMenu";
import './App.scss';
import { Display, Env, env_init, Size } from "./Utils";
import { Decode, Encode, UpdateURL } from "./Compressor";

export default function App(
  {env0}: {
    env0: Env
  }
) {
  const [env, setEnv] = useState<Env>(env0);

  const [dis, setDis] = useState<Display>('editor');

  // URLの自動更新
  useEffect(()=>{
    const saver = setInterval(()=>{
      UpdateURL(env);
    }, 10000);
    return () => {
      clearInterval(saver);
    }
  }, []);

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
              <Export env={env}/>
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