// use-router.ts
import { signal } from "../core";

type Route = string;

const [route, setRoute] = signal<Route>("/");

window.addEventListener("popstate", (e: PopStateEvent) => {
  const r = e.state?.route;
  if (typeof r === "string") {
    setRoute(() => r);
  }
});

export function useRouter() {
  const navigate = (to: Route) => {
    if (to === route()) return;
    history.pushState({ route: to }, "");
    setRoute(() => to);
  };

  return {
    route,
    navigate,
  };
}
