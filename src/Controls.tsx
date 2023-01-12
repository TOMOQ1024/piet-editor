import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faArrowPointer, faPen, faFillDrip } from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/free-regular-svg-icons";

const controlIcons: IconDefinition[] = [
    faArrowPointer,
    faPen,
    faFillDrip,
]

function Control(props:{icon:IconDefinition,tag:number,selectedTag:number,onClick:Function}){
    let radio = (
        <input
        id={`control_${props.tag}`}
        className="control-radio"
        type="radio"
        name="controls"
        value={props.tag}
        style={{display:"none"}}
        defaultChecked={props.tag===0}
        />
    );
    return (
        <div style={{display:"inline-block"}}>
        {radio}
        <label htmlFor={`control_${props.tag}`}>
        <FontAwesomeIcon
        className="control"
        icon={props.icon}
        />
        </label>
        </div>
    )
}

export default function Controls(){
    const [selectedControl, SetSelectedControl] = useState(0);

    function OnControlClicked(tag:number){
        SetSelectedControl(tag)
    }

    return (
        <div>{controlIcons.map((v,i)=>
            <Control
            key={i}
            tag={i}
            icon={v}
            selectedTag={selectedControl}
            onClick={()=>OnControlClicked(i)}
            />
        )}</div>
    )
}
