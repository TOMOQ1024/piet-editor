import { useState } from "react";
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

function Control(props: { icon: IconDefinition, tag: number, selectedTag: number, onClick: Function }) {
  return (
    <div style={{ display: "inline-block" }}>
      <input
        id={`control_${props.tag}`}
        className="control-radio"
        type="radio"
        name="controls"
        value={props.tag}
        style={{ display: "none" }}
        defaultChecked={props.tag === props.selectedTag}
      />
      <label htmlFor={`control_${props.tag}`}>
        <FontAwesomeIcon
          className="control"
          icon={props.icon}
          onClick={()=>props.onClick()}
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
  function OnControlClicked(tag: number) {
    setEnv(e=>({...e, ctrl: ctrls[tag]}));
  }

  return (
    <div>{controlIcons.map((v, i) =>
      <Control
        key={i}
        tag={i}
        icon={v}
        selectedTag={ctrls.indexOf(env.ctrl)}
        onClick={() => OnControlClicked(i)}
      />
    )}</div>
  )
}
