import type { UnmountCallback } from "./mount";
import { registerUnmount } from "./mount";

export type { UnmountCallback } from "./mount";

// Call this inside components to register cleanup logic for the component.
// The actual association with the component root DOM element
// happens in endComponentMountSession().
export function unmount(cb: UnmountCallback): void {
  registerUnmount(cb);
}
