import { useEffect, useState } from "react";
import Editor from "./Editor";
import Export from "./Export";
import Import from "./Import";
import SideMenu from "./SideMenu";
import './App.scss';
import { Display, Env } from "./Utils";
import { UpdateURL } from "./Compressor";

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
    }, 1000);
    return () => {
      clearInterval(saver);
    }
  }, [env.size]);

  return (
    <div id='App'>
      <SideMenu
      dis={dis}
      setDis={(f:(e:Display)=>Display)=>setDis(f)}
      />
      <div id='Contents'>
        <Editor
        env={env}
        setEnv={(f:(e:Env)=>Env)=>setEnv(f)}
        display={dis==='editor'}
        />
        <Import env={env} setEnv={(f:(e:Env)=>Env)=>setEnv(f)} display={dis==='import'}/>
        <Export env={env} display={dis==='export'}/>
      </div>
    </div>
  )
}