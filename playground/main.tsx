import { effect, jsx, render } from "../core";
import { signal } from "../core/signal";

// Einstiegspunkt
render(<App />, { parent: document.body });

async function App() {
  console.log("App mount");

  return (
    <div style={{ padding: "10px", border: "2px solid black" }}>
      <h1>App</h1>
      <Layer1 />
    </div>
  );
}

async function Layer1() {
  const [count, setCount] = signal(0);

  return (
    <div style={{ padding: "8px", border: "2px solid blue" }}>
      <h2>Layer 1</h2>

      <button
        onClick={() => {
          setCount((prev) => prev + 1);
        }}
      >
        {count}
      </button>
    </div>
  );
}
