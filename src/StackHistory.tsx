import { Env, Point } from "./Utils";

export function PushHistory(p:Point, op: string, stack: number[]){
  let si = `${stack.map(v=>`<td>${v}</td>`).join('')}`;
  // let sc = `${env.stack.map(v=>`<td>${String.fromCodePoint(v)}</td>`).join('')}`;
  document.getElementById('tbody-stackhistory')!.innerHTML += `
    <tr>
      <td class='sh-pos'>(${p.x},${p.y})</td>
      <td class='sh-op'>${op}</td>
      ${si}
    </tr>
  `;
}

export function ClearHistory(){
  document.getElementById('tbody-stackhistory')!.innerHTML = '';
}

export function StackHistory(
  { env, setEnv }: {
    env: Env;
    setEnv: (f: (e: Env) => Env) => void;
  }
){
  return (
    <table id='StackHistory'>
      <tbody id='tbody-stackhistory'>
      </tbody>
    </table>
  )
}