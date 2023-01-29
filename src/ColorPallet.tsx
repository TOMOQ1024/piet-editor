import { useEffect, useState } from 'react';
import { Colors, Env, Operations } from './Utils';
import './App.css';

export default function ColorPallet(
  {env,setEnv}: {
    env: Env;
    setEnv: (f:(e:Env)=>Env)=>void;
  }
) {
  function HandleRadioLClick(i: number) {
    setEnv(e=>({...e, fillColor0:i}));
  }
  function HandleRadioRClick(i: number) {
    setEnv(e=>({...e, baseColor:i}))
  }

  return (
    <table id="ColorPallet">
      {(() => {
        const tr: JSX.Element[] = [];
        const b = env.baseColor;

        for (let r = 0; r < 7; r++) {
          const td: JSX.Element[] = [];
          for (let c = 0; c < 3; c++) {
            td.push(
              <td key={c}>
                <input
                  id={`pallet_${r * 3 + c}`}
                  className="pallet-radio"
                  type="radio"
                  name="pallet"
                  value={r * 3 + c}
                  style={{ display: "none" }}
                  defaultChecked={r * 3 + c === 0}
                />
                <label htmlFor={`pallet_${r * 3 + c}`}>
                  <div
                    className='operation-button'
                    onClick={() => HandleRadioLClick(r * 3 + c)}
                    onContextMenu={() => HandleRadioRClick(r * 3 + c)}
                    style={{ background: Colors[r * 3 + c] }}
                  >
                    {Operations[r===6 ? r*3+c : ((((r-Math.floor(b/3))%6+6)%6 * 3 + ((c-b)%3+3)%3) % 18 + 18)  % 18]}
                  </div>
                </label>
              </td>
            )
          }
          tr.push(<tr key={r}>{td}</tr>)
        }

        return <tbody>{tr}</tbody>;
      })()}
    </table>
  );
}
