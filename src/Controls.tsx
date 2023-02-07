import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faArrowPointer, faPen, faFillDrip, faUpload } from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/free-regular-svg-icons";
import { ctrls, Env } from "./Utils";

const controlIcons: IconDefinition[] = [
  faArrowPointer,
  faPen,
  faFillDrip,
]

function Control(
  {icon, type, tag, selectedTag}: {
    icon: IconDefinition,
    type: React.HTMLInputTypeAttribute,
    tag: number,
    selectedTag: number,
  }) {
  return (
    <div style={{ display: "inline-block" }}>
      <input
        id={`ctrl-rd-${tag}`}
        className="control-radio"
        type={type}
        name="controls"
        value={tag}
        style={{ display: "none" }}
        defaultChecked={tag === selectedTag}
      />
      <label htmlFor={`ctrl-rd-${tag}`}>
        <FontAwesomeIcon
          id={`control_${tag}`}
          className="control"
          icon={icon}
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
    switch(i) {
      case 0:
      case 1:
      case 2:
        setEnv(e=>({...e, ctrl: ctrls[i]}));
        break;
      case 3:
        // import
        console.log('import');
        break;
    }
  }

  return (
    <div>{controlIcons.map((v, i) =>
      <Control
        key={i}
        type={i<3 ? 'radio' : 'checkbox'}
        tag={i}
        icon={v}
        selectedTag={ctrls.indexOf(env.ctrl)}
      />
    )}</div>
  )
}
