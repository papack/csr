import { jsx, render } from "../core";
import { mount } from "../core/mount";
import { unmount } from "../core/unmount";
import { Show } from "../core/show";

// Einstiegspunkt
render(<App />, { parent: document.body });

/* -------------------------------------------------------
 * Ebene 0 — Root
 * -----------------------------------------------------*/
async function App() {
  console.log("App mount");

  return (
    <div style={{ padding: "10px", border: "2px solid black" }}>
      <h1>App</h1>

      <Show time={10000}>
        <Layer1 />
      </Show>
    </div>
  );
}

/* -------------------------------------------------------
 * Ebene 1 — Layer1
 * -----------------------------------------------------*/
async function Layer1() {
  mount(() => console.log("Layer1 mount"));
  unmount(() => console.log("Layer1 unmount"));

  return (
    <div style={{ padding: "8px", border: "2px solid blue" }}>
      <h2>Layer 1</h2>

      <Show time={3000}>
        <Layer2 />
      </Show>

      <button onClick={() => console.log("click Layer1")}>click1</button>
    </div>
  );
}

/* -------------------------------------------------------
 * Ebene 2 — Layer2
 * -----------------------------------------------------*/
async function Layer2() {
  mount(() => console.log("Layer2 mount"));
  unmount(() => console.log("Layer2 unmount"));

  return (
    <div style={{ padding: "6px", border: "2px solid green" }}>
      <h3>Layer 2</h3>

      <Show time={2000}>
        <Layer3 />
      </Show>

      <button onClick={() => console.log("click Layer2")}>click2</button>
    </div>
  );
}

/* -------------------------------------------------------
 * Ebene 3 — Layer3
 * -----------------------------------------------------*/
async function Layer3() {
  mount(() => console.log("Layer3 mount"));
  unmount(() => console.log("Layer3 unmount"));

  return (
    <div style={{ padding: "4px", border: "2px solid orange" }}>
      <h4>Layer 3</h4>

      {/* Tief verschachtelter Show */}
      <Show time={100}>
        <Leaf />
      </Show>
    </div>
  );
}

/* -------------------------------------------------------
 * Ebene 4 — Leaf (tiefe Spitze)
 * -----------------------------------------------------*/
async function Leaf() {
  mount(() => console.log("Leaf mount"));
  unmount(() => console.log("Leaf unmount"));

  return (
    <div style={{ padding: "2px", border: "2px solid red" }}>
      <span>Leaf</span>
      <button onClick={() => console.log("click Leaf")}>leaf-btn</button>
    </div>
  );
}
