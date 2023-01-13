import './App.css';
import Controls from './Controls';
import ColorPallet from './ColorPallet';
import CanvasWrapper from './CanvasWrapper';
import { useEffect, useState } from 'react';

function CopyCode(c: string[][]){
  const rtnCode: string[][] = [];
  for(let y=0; y<c.length; y++){
    rtnCode.push([]);
    rtnCode[y] = c[y].slice(0);
  }
  return rtnCode;
}

export default function Editor() {
  const [size, setSize] = useState({
    width: 10,
    height: 10
  });
  const [selectedColor, setSelectedColor] = useState('#ffc0c0');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  let initCode: string[][] = [];
  for(let y=0; y<size.height; y++){
    initCode.push([]);
    for(let x=0; x<size.width; x++){
      initCode[y].push('#ffffff');
    }
  }
  const [code, setCode] = useState(initCode);
  const [crntPos, setCrntPos] = useState({x:0,y:0});
  const [nextPos, setNextPos] = useState({x:-1,y:-1});

  function SetCodel(x: number, y: number){
    if(x < 0 || y < 0 || size.width <= x || size.height <= y)return;
    setSelectedColor(c=>{
    if(code[y][x] !== c){
        const newCode = [...code];
        newCode[y][x] = c;
        setCode(newCode);
      }
      return c;
    });
  }

  return (
    <div className="Editor">
      <Controls/>
      <div className='wrapper-main'>
      <ColorPallet
      setSelectedColor={setSelectedColor}
      />
      <CanvasWrapper
      size={size}
      code={code}
      SetCodel={SetCodel}
      />
      </div>
      
    </div>
  );
}
