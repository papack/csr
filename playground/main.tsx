import { effect, jsx, render, signal, type PropsInterface } from "../core";
import { For } from "../core/for";

render(<App />, { parent: document.body, dummy: 42 });

function App(p: PropsInterface) {
  const [color, setColor] = signal("red");

  return (
    <div style={{ border: "1px dashed hotpink" }}>
      <svg width={200} height={200} viewBox="0 0 100 100">
        <circle
          cx={50}
          cy={50}
          r={18}
          fill={color}
          onMouseLeave={() => {
            setColor(() => "red");
          }}
          onMouseEnter={() => {
            setColor(() => "blue");
          }}
        />
      </svg>
    </div>
  );
}
