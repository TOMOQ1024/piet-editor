import './App.css';
import Controls from './Controls';
import ColorPallet from './ColorPallet';

export default function Editor() {
  return (
    <div className="Editor">
      <Controls/>
      <ColorPallet/>
    </div>
  );
}
