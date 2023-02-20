import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  IconDefinition,
  faArrowPointer, faPen, faFillDrip, faEyeDropper,
  faRotateLeft, faRotateRight, faTrash
} from "@fortawesome/free-solid-svg-icons";
import { ctrls, Env } from "./Utils";

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
    { icon: faRotateLeft, type: 'button', onclick:()=>{
      console.log('undo');
    } },
    { icon: faRotateRight, type: 'button', onclick:()=>{
      console.log('redo');
    } },
    { icon: faTrash, type: 'button', onclick:()=>{
      console.log('clear');
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
