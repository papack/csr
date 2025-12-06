import type { UnmountCallback } from "./mount";
import { registerUnmount } from "./mount";

export type { UnmountCallback } from "./mount";

/**
 * In Components aufrufen, um Cleanup für diese Component zu registrieren.
 * Die tatsächliche Verknüpfung mit dem Root-Element passiert
 * in endComponentMountSession().
 */
export function unmount(cb: UnmountCallback): void {
  registerUnmount(cb);
}
