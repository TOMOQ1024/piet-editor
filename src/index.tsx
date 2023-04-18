import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import App from './App';
import { LoadURL } from './Compressor';
import { CopyCode } from './Utils';

let e = LoadURL();

if(!e.size.w){
  const size = {w: 10, h: 10};
  let code: string[][] = [];
  for(let y=0; y<size.h; y++){
    code.push([]);
    for(let x=0; x<size.w; x++){
      code[y].push('#ffffff');
    }
  }
  e.size = size;
  e.code = code;
}

e.codeHistory = [CopyCode(e.code)];

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App
    env0={e}
    />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
