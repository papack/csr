// effect.ts
import type { ReadFn } from "./signal";
import { unmount } from "./unmount";
import { connector } from "./signal";
import { hasActiveMountSession } from "./mount";

export async function effect<T>(
  readFn: ReadFn<T>,
  fn: (value: T) => Promise<unknown> | unknown
): Promise<void> {
  // EIN stabiler Callback
  const cb = async (val: unknown) => {
    await fn(val as T);
  };

  // registriert GENAU diesen Callback
  await readFn(cb);

  // nur wenn wir Owner sind
  if (hasActiveMountSession()) {
    unmount(() => {
      const uuid = connector.getUuidByClbk(cb);
      connector.removeClbk(uuid, cb);
    });
  }
}
