import { useState } from 'react';
import './App.css';

const operations: string[][] = [
    ["*", "push", "pop"],
    ["add", "sub", "mul"],
    ["div", "mod", "not"],
    ["great", "point", "switch"],
    ["dup", "roll", "in(n)"],
    ["in(c)", "out(n)", "out(c)"],
    ["white","black"],
]

const colors: string[][] = [
    ["#ffc0c0", "#ff0000", "#c00000"],
    ["#ffffc0", "#ffff00", "#c0c000"],
    ["#c0ffc0", "#00ff00", "#00c000"],
    ["#c0ffff", "#00ffff", "#00c0c0"],
    ["#c0c0ff", "#0000ff", "#0000c0"],
    ["#ffc0ff", "#ff00ff", "#c000c0"],
    ["#ffffff", "#000000"],
]

export default function ColorPallet(
    props: {
        setSelectedColor: Function,
    }
) {
    function HandleRadioClick(r:number, c:number){
        props.setSelectedColor(colors[r][c]);
    }

    return (
    <div className="ColorPallet">
    <table>
        <tbody>
        {colors.map((l,r)=>(
            <tr key={r}>
            {l.map((bg,c)=>(
                <td key={c}>
                <input
                id={`pallet_${r*3+c}`}
                className="pallet-radio"
                type="radio"
                name="pallet"
                value={r*3+c}
                style={{display:"none"}}
                defaultChecked={r*3+c===0}
                />
                <label htmlFor={`pallet_${r*3+c}`}>
                <div
                className='operation-button'
                onClick={()=>HandleRadioClick(r,c)}
                style={{background: bg}}
                >
                {operations[r][c]}
                </div>
                </label>
                </td>
            ))}
            </tr>
        ))}
        </tbody>
    </table>
    </div>
    );
}
