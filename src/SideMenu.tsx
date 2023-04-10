import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faFileArrowUp, faPenToSquare, faShareFromSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Display, displays } from "./Utils";

const icons = [
  faPenToSquare,
  faFileArrowUp,
  faShareFromSquare,
]

function MenuItem(
  {tag, selectedTag, icon, setDis}:{
    tag: number,
    selectedTag: number,
    icon: IconProp,
    setDis: (f: (e: Display) => Display) => void;
  }
) {
  return (
    <div>
      <input
        id={`tab-rd-${tag}`}
        className="tab-radio"
        name="tabs"
        type='radio'
        value={tag}
        style={{ display: "none" }}
        defaultChecked={tag === selectedTag}
      />
      <label htmlFor={`tab-rd-${tag}`}>
        <FontAwesomeIcon
          id={`tab_${tag}`}
          className="tab-btn"
          icon={icon}
          onClick={()=>setDis(_=>displays[tag])}
        />
      </label>
    </div>
  )
}

export default function SideMenu(
  { dis, setDis }: {
    dis: Display;
    setDis: (f: (e: Display) => Display) => void;
  }
) {
  return (
    <div id='SideMenu'>
      {icons.map((v,i)=>(
        <MenuItem
          key={i}
          tag={i}
          selectedTag={displays.indexOf(dis)}
          icon={v}
          setDis={setDis}
        />
      ))}
    </div>
  )
}