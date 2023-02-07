import './App.css';
import Controls from './Controls';
import ColorPallet from './ColorPallet';
import CanvasWrapper from './CanvasWrapper';
import Interpreter from './Interpreter';
import { useEffect, useState } from 'react';
import { Env, Point } from './Utils';



export default function Editor(
  { env, setEnv }: {
    env: Env;
    setEnv: (f: (e: Env) => Env) => void;
  }
) {
  return (
    <div id="Editor">
      <Controls
      env={env}
      setEnv={(f:(e:Env)=>Env)=>setEnv(f)}
      />
      <div className='wrapper-main'>
        <ColorPallet
        env={env}
        setEnv={(f:(e:Env)=>Env)=>setEnv(f)}
        />
        <div className='wrapper-mid'>
          <CanvasWrapper
          env={env}
          setEnv={(f:(e:Env)=>Env)=>setEnv(f)}
          />
          <Interpreter
          env={env}
          setEnv={(f:(e:Env)=>Env)=>setEnv(f)}
          />
        </div>
        <img src="../logo512.png" alt="temp" />
      </div>
    </div>
  );
}
