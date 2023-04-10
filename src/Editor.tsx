import Controls from './Controls';
import ColorPallet from './ColorPallet';
import CanvasWrapper from './CanvasWrapper';
import Interpreter from './Interpreter';
import { Env } from './Utils';
import { Input, Output } from './IO';
import { StackHistory } from './StackHistory';



export default function Editor(
  { env, setEnv, display }: {
    env: Env;
    setEnv: (f: (e: Env) => Env) => void;
    display: boolean
  }
) {
  return (
    <div id="Editor" className={display?'contents-visible':'contents-hidden'}>
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
        <StackHistory
        env={env}
        setEnv={(f:(e:Env)=>Env)=>setEnv(f)}
        />
      </div>
    </div>
  );
}
