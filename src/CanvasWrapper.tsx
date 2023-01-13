import { useState } from 'react';
import './App.css';
import Canvas from './Canvas';

// メインのキャンバスの移動やサイズ制御を行う
export default function CanvasWrapper(
    props: {
        size: {width:number,height:number}
        code: string[][]
        SetCodel: Function
    }
){
    function HandleMouseMove(e:React.MouseEvent<HTMLDivElement, MouseEvent>){
        if(!(e.buttons & 0b1 || e.buttons & 0b10))return;
        const cvs = document.getElementById('canvas');
        const self = document.getElementById('CanvasWrapper');
        if(self === null)return;
        const x = e.clientX - self.getBoundingClientRect().x - 2;
        const y = e.clientY - self.getBoundingClientRect().y - 2;

        if(cvs === null){
            console.log("cvs is null");
            return;
        }
        cvs?.dispatchEvent(new CustomEvent('setcodel', {
            detail: {
                x: x - Number(cvs.style.left.replace(/[a-z]/g,"")),
                y: y - Number(cvs.style.top.replace(/[a-z]/g,"")),
            }
        }));
    }

    function HandleContextMenu(e:React.MouseEvent<HTMLDivElement, MouseEvent>){
        e.preventDefault();
    }

    return (
        <div
        id='CanvasWrapper'
        onMouseDown={e=>HandleMouseMove(e)}
        onMouseMove={e=>HandleMouseMove(e)}
        onContextMenu={e=>HandleContextMenu(e)}
        >
            <Canvas
            size={props.size}
            code={props.code}
            SetCodel={props.SetCodel}
            />
        </div>
    )
}