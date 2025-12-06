export type MountCallback = (el: Element) => void | Promise<void>;
export type UnmountCallback = () => void | Promise<void>;

// Pro Component: gesammelte mount/unmount-Callbacks
const mountStack: MountCallback[][] = [];
const unmountStack: UnmountCallback[][] = [];

/**
 * Vom Renderer aufgerufen, bevor eine Component-Funktion ausgeführt wird.
 */
export function beginComponentMountSession(): void {
  mountStack.push([]);
  unmountStack.push([]);
}

/**
 * Vom Renderer aufgerufen, nachdem der DOM-Root der Component bekannt ist.
 * - führt alle mount-Callbacks aus
 * - hängt alle unmount-Callbacks am Root-Element an
 */
export function endComponentMountSession(el: Element): void {
  const mounts = mountStack.pop();
  const unmounts = unmountStack.pop();

  if (!mounts || !unmounts) return;

  // Mounts ausführen (fire & forget)
  for (const cb of mounts) {
    try {
      const r = cb(el);
      if (r instanceof Promise) {
        r.catch(console.error);
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Unmounts am Element speichern (DOM-first)
  if (unmounts.length > 0) {
    const store = (el as any).__unmountCbs as UnmountCallback[] | undefined;
    if (store && Array.isArray(store)) {
      store.push(...unmounts);
    } else {
      (el as any).__unmountCbs = [...unmounts];
    }
  }
}

/**
 * In Components aufrufen, um "onMount" zu registrieren.
 */
export function mount(cb: MountCallback): void {
  const queue = mountStack[mountStack.length - 1];
  if (!queue) {
    throw new Error("mount(cb) wurde außerhalb einer Component aufgerufen.");
  }
  queue.push(cb);
}

/**
 * Wird von unmount(cb) verwendet, um Cleanup in die aktuelle Session zu legen.
 */
export function registerUnmount(cb: UnmountCallback): void {
  const queue = unmountStack[unmountStack.length - 1];
  if (!queue) {
    throw new Error("unmount(cb) wurde außerhalb einer Component aufgerufen.");
  }
  queue.push(cb);
}

/**
 * Vom destroy()-Pfad verwendet:
 * führt alle am Element registrierten Unmount-Callbacks aus (LIFO).
 */
export async function runUnmountsForElement(el: Element): Promise<void> {
  const list = (el as any).__unmountCbs as UnmountCallback[] | undefined;
  if (!list || list.length === 0) return;

  for (let i = list.length - 1; i >= 0; i--) {
    const fn = list[i];
    if (!fn) continue;
    try {
      const r = fn();
      if (r instanceof Promise) {
        await r;
      }
    } catch (err) {
      console.error(err);
    }
  }

  (el as any).__unmountCbs = undefined;
}
