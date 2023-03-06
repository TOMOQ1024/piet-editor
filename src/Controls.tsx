import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  IconDefinition,
  faArrowPointer, faPen, faFillDrip, faEyeDropper,
  faFloppyDisk, faMaximize, faRotateLeft, faRotateRight, faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { ctrls, Env } from "./Utils";
import { UpdateURL } from "./Compressor";

interface ControlButton {
  icon: IconDefinition;
  type: React.HTMLInputTypeAttribute;
  onclick: Function;
};


function Control(
  {cbn, tag, selectedTag}: {
    cbn: ControlButton,
    tag: number,
    selectedTag: number,
  }) {
  return (
    <div style={{ display: "inline-block" }}>
      <input
        id={`ctrl-btn-${tag}`}
        className={`control-input control-${cbn.type}`}
        type={cbn.type}
        name="controls"
        value={tag}
        style={{ display: "none" }}
        defaultChecked={tag === selectedTag}
      />
      <label htmlFor={`ctrl-btn-${tag}`}>
        <FontAwesomeIcon
          id={`control_${tag}`}
          className="control"
          icon={cbn.icon}
          onClick={()=>cbn.onclick()}
        />
      </label>
    </div>
  )
}

export default function Controls(
  { env, setEnv }: {
    env: Env;
    setEnv: (f: (e: Env) => Env) => void;
  }
) {
  const buttons: ControlButton[] = [
    { icon: faArrowPointer, type: 'radio', onclick:()=>{
      setEnv(e=>({...e, ctrl: ctrls[0]}));
    } },
    { icon: faPen, type: 'radio', onclick:()=>{
      setEnv(e=>({...e, ctrl: ctrls[1]}));
    } },
    { icon: faEyeDropper, type: 'radio', onclick:()=>{
      setEnv(e=>({...e, ctrl: ctrls[2]}));
    } },
    { icon: faFillDrip, type: 'radio', onclick:()=>{
      setEnv(e=>({...e, ctrl: ctrls[3]}));
    } },
    { icon: faFloppyDisk, type: 'button', onclick:()=>{
      UpdateURL(env, false);
    } },
    { icon: faMaximize, type: 'button', onclick:()=>{
      const w = parseInt(prompt("新しい横幅") || '0');
      const h = parseInt(prompt("新しい縦幅") || '0');
      setEnv(e=>{
        let newCode: string[][] = [];

        for(let y=0; y<h; y++){
          newCode.push([]);
          for(let x=0; x<w; x++){
            if(x < e.size.w && y < e.size.h){
              newCode[y].push(e.code[y][x]);
            }
            else{
              newCode[y].push('#ffffff');
            }
          }
        }

        return {
          ...e,
          size: {w:w, h:h},
          code: newCode
        };
      })
    } },
    { icon: faRotateLeft, type: 'button', onclick:()=>{
      console.log('undo');
    } },
    { icon: faRotateRight, type: 'button', onclick:()=>{
      console.log('redo');
    } },
    { icon: faTrash, type: 'button', onclick:()=>{
      setEnv(e=>({...e,code: e.code.map(v=>v.map(e=>'#ffffff'))}));
    } },
  ];


  return (
    <div id='Controls'>{buttons.map((v, i) =>
      <Control
        key={i}
        cbn={v}
        tag={i}
        selectedTag={ctrls.indexOf(env.ctrl)}
      />
    )}</div>
  )
}
