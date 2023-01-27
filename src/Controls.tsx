import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faArrowPointer, faPen, faFillDrip } from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/free-regular-svg-icons";
import { ctrls, Env } from "./Utils";

const controlIcons: IconDefinition[] = [
  faArrowPointer,
  faPen,
  faFillDrip,
]

function Control(props: { icon: IconDefinition, tag: number, selectedTag: number }) {
  return (
    <div style={{ display: "inline-block" }}>
      <input
        id={`ctrl-rd-${props.tag}`}
        className="control-radio"
        type="radio"
        name="controls"
        value={props.tag}
        style={{ display: "none" }}
        defaultChecked={props.tag === props.selectedTag}
      />
      <label htmlFor={`ctrl-rd-${props.tag}`}>
        <FontAwesomeIcon
          id={`control_${props.tag}`}
          className="control"
          icon={props.icon}
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
  useEffect(()=>{
    controlIcons.forEach((v, i)=>{
      const c = document.getElementById(`control_${i}`);
      if(c !== null){
        c.addEventListener('click', OnControlClicked);
        return ()=>{
          c.removeEventListener('click', OnControlClicked);
        }
      }
    });
  }, []);

  function OnControlClicked(e:MouseEvent) {
    if (e.target === null) return;
    const i = Number((e.target as HTMLDivElement).id.replace(/[^\d]/g,''));
    setEnv(e=>({...e, ctrl: ctrls[i]}));
  }

  return (
    <div>{controlIcons.map((v, i) =>
      <Control
        key={i}
        tag={i}
        icon={v}
        selectedTag={ctrls.indexOf(env.ctrl)}
      />
    )}</div>
  )
}
