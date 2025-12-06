import { effect, jsx, render, Show, fragment } from "../core";
import { signal } from "../core/signal";

// Einstiegspunkt
render(<App />, { parent: document.body });

async function App() {
  return (
    <div style={{ padding: "10px", border: "2px solid black" }}>
      <h1>App</h1>
      <Layer1 />
    </div>
  );
}

async function Layer1() {
  const [count, setCount] = signal(0);
  const [show, setShow] = signal<boolean>(false);

  const [padding, setPadding] = signal("0px");
  effect(count, (n) => {
    if (n % 2 === 0) {
      setShow(() => true);
    } else {
      setShow(() => false);
    }
  });

  return (
    <>
      <div style={{ padding, border: "2px solid blue" }}>
        <h2>Layer 1</h2>

        <button
          onClick={() => {
            setCount((prev) => {
              prev = prev + 1;
              setPadding(() => `${prev}px`);
              return prev;
            });
          }}
        >
          {count}
          <Show when={show}> Hi!</Show>
        </button>
      </div>
    </>
  );
}
