import { useEffect, useState } from 'react';
import './App.css';

const codelScale = 20;
let first = true;

export default function Canvas(
    props: {
        size: {width:number,height:number};
        code: string[][];
        SetCodel: Function
    }
){
    useEffect(()=>{
        RenderCanvas();
        if(first){
            const cvs = document.getElementById("canvas") as HTMLCanvasElement;
            if(cvs === null){
                console.log('canvas not found at useEffect');
                return;
            }
            cvs.addEventListener('setcodel', e=>{
                const cvs = document.getElementById("canvas") as HTMLCanvasElement;
                if(cvs === null)return;
                const ctx = cvs.getContext('2d') as CanvasRenderingContext2D;
                const x = Math.floor((e as CustomEvent).detail.x / codelScale);
                const y = Math.floor((e as CustomEvent).detail.y / codelScale);
                if(x < 0 || y < 0 || props.size.width <= x || props.size.height <= y)return;
                props.SetCodel(x, y);
                RenderCodel(ctx, {x:x,y:y});
                // console.log((e as CustomEvent).detail.x, (e as CustomEvent).detail.y)
            });
            // console.log('event listener added');
            first = false;
        }
        
    });
    function RenderCanvas(){
        const cvs = document.getElementById("canvas") as HTMLCanvasElement;
        if(cvs === null)return;
        const ctx = cvs.getContext('2d') as CanvasRenderingContext2D;
        ctx.imageSmoothingEnabled = false;
        ctx.fillStyle = "black";
        ctx.fillRect(
            0, 0,
            codelScale * props.size.width + 1,
            codelScale * props.size.height + 1
        );
        let pos = {x: 0, y: 0};
        for(let y=0; y<props.size.height; y++){
            for(let x=0; x<props.size.width; x++){
                pos.x = x;
                pos.y = y;
                ctx.fillStyle = props.code[y][x];
                ctx.fillRect(
                    x * codelScale + 1,
                    y * codelScale + 1,
                    codelScale - 1,
                    codelScale - 1,
                )
            }
        }
    }

    function RenderCodel(
        ctx: CanvasRenderingContext2D,
        pos: {x:number,y:number}
    ){
        ctx.fillStyle = props.code[pos.y][pos.x];
        ctx.fillRect(
        pos.x * codelScale + 1,
        pos.y * codelScale + 1,
        codelScale - 1,
        codelScale - 1,
        )
    }

    return (
        <canvas
        id="canvas"
        width={props.size.width*20+1}
        height={props.size.height*20+1}
        // onClick={e=>HandleClick(e)}
        />
    )
}