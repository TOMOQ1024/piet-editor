import { Env } from "./Utils";

export function Input(
  { setEnv } : {
    setEnv: (f: (e: Env) => Env) => void;
  }
) {
  return (
    <div>
      input<br/>
      <textarea
      onChange={e=>{
        setEnv(ev=>({...ev, input:e.target.value}));
      }}
      />
    </div>
  )
}

export function Output(
  { env } : {
    env: Env;
  }
) {
  return (
    <div>
      output<br/>
      <textarea readOnly value={env.output}/>
    </div>
  )
}