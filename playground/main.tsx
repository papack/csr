import { effect, jsx, render, signal } from "../core";
import { For } from "../core/for";

render(<App />, { parent: document.body });

function App() {
  const [value, setValue] = signal<string>("todo");
  const [items, setItems] = signal<Array<{ uuid: string; name: string }>>([]);

  return (
    <div style={{ padding: "10px", border: "2px solid black" }}>
      <h1>App {value}</h1>
      <ul>
        <For each={items}>
          {({ name, uuid }: any) => (
            <Item
              uuid={uuid}
              name={name}
              items={items}
              setItems={setItems}
            ></Item>
          )}
        </For>
      </ul>
      <input
        type="text"
        value={value}
        onInput={(e: any) => {
          setValue(() => e.target.value);
        }}
      />
      <button
        onClick={() => {
          setItems(async (prev) => {
            prev.push({ uuid: crypto.randomUUID(), name: await value() });
            setValue(() => "");
            return prev;
          });
        }}
      >
        ok
      </button>
    </div>
  );
}

function Item(p: any) {
  effect(p.items, (v) => {
    console.log(v);
  });

  function up() {
    p.setItems((prev: any[]) => {
      const i = prev.findIndex((x) => x.uuid === p.uuid);
      if (i <= 0) return prev;
      [prev[i - 1], prev[i]] = [prev[i], prev[i - 1]];
      return prev;
    });
  }

  function down() {
    p.setItems((prev: any[]) => {
      const i = prev.findIndex((x) => x.uuid === p.uuid);
      if (i === -1 || i === prev.length - 1) return prev;
      [prev[i], prev[i + 1]] = [prev[i + 1], prev[i]];
      return prev;
    });
  }

  return (
    <li>
      {p.name} <button onClick={up}>up</button>{" "}
    </li>
  );
}
