// effect.ts
import type { ReadFn } from "./signal";
import { unmount, hasActiveMountSession } from "./lifecycle";
import { connector } from "./signal";

export function effect<T>(
  readFn: ReadFn<T>,
  fn: (value: T) => void | Promise<void>
): void {
  let initialized = false;

  const cb = (val: T) => {
    if (!initialized) {
      initialized = true;
      return;
    }

    try {
      const r = fn(val);
      if (r instanceof Promise) {
        r.catch((err) => {
          console.error("effect async callback failed", err);
        });
      }
    } catch (err) {
      console.error("effect callback failed", err);
    }
  };

  // subscribe (initial call is ignored)
  readFn(cb);

  // cleanup
  if (hasActiveMountSession()) {
    unmount(() => {
      const uuid = connector.getUuidByClbk(cb);
      connector.removeClbk(uuid, cb);
    });
  }
}
