import { effect, jsx, render } from "../core";
import { mount } from "../core/mount";
import { unmount } from "../core/unmount";
import { Show } from "../core/show";
import { signal } from "../core/signal";

// Einstiegspunkt
render(<App />, { parent: document.body });

async function App() {
  console.log("App mount");

  return (
    <div style={{ padding: "10px", border: "2px solid black" }}>
      <h1>App</h1>

      <Show time={1_000}>
        <Layer1 />
      </Show>
    </div>
  );
}

const [count, setCount] = signal(0);
async function Layer1() {
  effect(count, async (v) => {
    console.log(v);
  });

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
