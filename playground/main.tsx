import { render, jsx, signal, Show, effect, mount, unmount } from "../core";
import { useRouter } from "../hooks";

await render(<App />, { parent: document.body });

function App() {
  const { route, navigate } = useRouter();

  const [isHome, setIsHome] = signal(false);
  const [isSettings, setIsSettings] = signal(false);
  const [value, setValue] = signal(0);

  // single routing effect
  effect(route, (r) => {
    setIsHome(() => r === "home");
    setIsSettings(() => r === "settings");
  });

  mount(() => {
    navigate("home");
  });

  return (
    <div>
      <button onClick={() => navigate("home")}>Home</button>
      <button onClick={() => navigate("settings")}>Settings</button>

      <Show when={isHome}>
        <Home />
      </Show>

      <Show when={isSettings}>
        <Settings value={value} setValue={setValue} />
      </Show>
    </div>
  );
}

function Home() {
  mount(() => {
    console.log("i mount");
  });

  unmount(() => {
    console.log("bye.");
  });

  return <div>Home</div>;
}

function Settings(p) {
  mount(() => {
    console.log("i mount set");
  });

  unmount(() => {
    console.log("bye. set");
  });

  return (
    <div>
      Settings{" "}
      <button
        onClick={() => {
          p.setValue((prev) => prev + 1);
        }}
      >
        {p.value}
      </button>
    </div>
  );
}
