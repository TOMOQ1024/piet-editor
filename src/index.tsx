import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Editor from './Editor';
import reportWebVitals from './reportWebVitals';
import { Colors } from './Utils';

let size = {
  w: 10,
  h: 10,
}

const w = Colors.indexOf("#ffffff");
let code: number[][] = [];
for(let y=0; y<size.h; y++){
  code.push([]);
  for(let x=0; x<size.w; x++){
    code[y].push(w);
  }
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Editor
    code={code}
    size={size}
    />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
