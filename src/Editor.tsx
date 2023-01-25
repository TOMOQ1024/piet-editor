import './App.css';
import Controls from './Controls';
import ColorPallet from './ColorPallet';
import CanvasWrapper from './CanvasWrapper';
import Interpreter from './Interpreter';
import { useEffect, useState } from 'react';
import { Env, Point } from './Utils';



export default function Editor(
  props: {
    code: number[][],
    size: {
      w: number,
      h: number,
    }
  }
) {
  console.log('%ceditor component rendered', 'color:#0000ff');
  const [env, setEnv] = useState<Env>(
    {
      crnt: {x:0,y:0},
      next: {x:-1,y:-1},
      size: props.size,
      code: props.code,
      dp: 0,
      cc: 0,
      block: [],
      stuck: 0,
      stack: [],
      input: '',
      output: '',
      fillColor0: 0,
    }
  );

  return (
    <div className="Editor">
      <Controls/>
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
      </div>
    </div>
  );
}
