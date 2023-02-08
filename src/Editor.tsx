import Controls from './Controls';
import ColorPallet from './ColorPallet';
import CanvasWrapper from './CanvasWrapper';
import Interpreter from './Interpreter';
import { Env } from './Utils';
import { Input, Output } from './IO';



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
          <div id='wrapper-io'>
            <Input
            setEnv={(f:(e:Env)=>Env)=>setEnv(f)}
            />
            <Output
            env={env}
            />
          </div>
        </div>
        {/* <img src="../logo512.png" alt="temp" /> */}
      </div>
    </div>
  );
}
