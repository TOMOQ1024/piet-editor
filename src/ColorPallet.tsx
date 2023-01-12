import './App.css';

const operations: string[][] = [
    ["*", "push", "pop"],
    ["add", "sub", "mul"],
    ["div", "mod", "not"],
    ["great", "point", "switch"],
    ["dup", "roll", "in(n)"],
    ["in(c)", "out(n)", "out(c)"],
]

const colors: string[][] = [
    ["#ffc0c0", "#ff0000", "#c00000"],
    ["#ffffc0", "#ffff00", "#c0c000"],
    ["#c0ffc0", "#00ff00", "#00c000"],
    ["#c0ffff", "#00ffff", "#00c0c0"],
    ["#c0c0ff", "#0000ff", "#0000c0"],
    ["#ffc0ff", "#ff00ff", "#c000c0"],
]

export default function ColorPallet() {
  return (
    <div className="ColorPallet">
    <table>
        <tbody>
        {colors.map((l,r)=>(
            <tr key={r}>
            {l.map((bg,c)=>(
                <td key={c}>
                <button
                className='operation-button'
                style={{background: bg}}
                >
                {operations[r][c]}
                </button>
                </td>
            ))}
            </tr>
        ))}
        </tbody>
    </table>
    </div>
  );
}
